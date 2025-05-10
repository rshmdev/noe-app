import { CompreFace } from '@exadel/compreface-js-sdk';

const compreface = new CompreFace('http://localhost', 8000);
const faceVerificationService = compreface.initFaceVerificationService(
  '9fc0db8d-5aa1-4b11-aabf-3b52eacaf81f',
);

const faceDetectionService = compreface.initFaceDetectionService(
  '60e46056-8193-4a31-937f-26b6e8989275',
);

let options = {
  limit: 0,
  status: true,
};

export async function verifyFaces(
  documentImageBase64: string,
  selfieImageBase64: string,
) {
  await faceVerificationService
    .verify(documentImageBase64, selfieImageBase64, options)
    .then((response: any) => {
      console.log('Response:', response);
      return response?.result[0]?.face_matches[0]?.similarity;
    })
    .catch((error) => {
      console.error('Error:', error);
      return error;
    });
}

export async function detectFace(imageBase64: string) {
  const result: any = await faceDetectionService.detect(imageBase64);

  console.log('Detecção:', result);

  if (result.result.length === 0) {
    throw new Error('Nenhum rosto detectado na imagem.');
  }

  if (result.result.length > 1) {
    throw new Error('Múltiplos rostos detectados. Envie uma foto apenas sua.');
  }

  return result?.result[0]?.box?.probability;
}
