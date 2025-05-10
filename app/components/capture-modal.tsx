// components/CaptureModal.tsx

'use client';

import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { X } from 'lucide-react';
import { detectFace } from '~/lib/compreface';
import { Button } from './ui/button';
import { cn } from '~/lib/utils';

interface CaptureModalProps {
  onCapture: (imageBase64: string) => void;
  onClose: () => void;
  type: 'selfie' | 'document'; // Tipo de captura
}

export default function CaptureModal({
  onCapture,
  onClose,
  type,
}: CaptureModalProps) {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function captureAndValidate() {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    setLoading(true);
    setError('');

    try {
      const result = await detectFace(imageSrc.split(',')[1]);

      if (result < 0.5) {
        throw new Error('Nenhum rosto detectado');
      }
      onCapture(imageSrc);
      onClose();
    } catch (e) {
      setError(
        'Nenhum rosto detectado. Ajuste a posição ou iluminação e tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-green-50 rounded-3xl border shadow-lg p-6 w-full max-w-md overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          <X className="h-6 w-6" />
        </button>

        <div
          className={cn(
            'relative w-full aspect-[3/4] overflow-hidden bg-black rounded-[80%]',
            type === 'selfie' ? 'rounded-[80%]' : 'rounded-lg',
          )}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
            videoConstraints={{ facingMode: 'user' }}
          />

          {/* Moldura */}
          <div
            className={`absolute top-0 left-0 w-full h-full pointer-events-none border-2 ${
              type === 'selfie'
                ? 'border-emerald-500 rounded-[80%]'
                : 'border-blue-500 rounded-lg'
            }`}
          ></div>
        </div>

        {error && (
          <p className="text-red-500 text-center mt-4 text-sm">{error}</p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={captureAndValidate} disabled={loading}>
            {loading ? 'Validando...' : 'Capturar foto'}
          </Button>
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
