import { CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';
import { Badge } from '~/components/ui/badge';

export const getStatusBadge = (status: any) => {
  switch (status) {
    case 'pendente':
      return (
        <Badge className="bg-blue-600 hover:bg-blue-600 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pendente
        </Badge>
      );
    case 'retirado':
      return (
        <Badge className="bg-yellow-600 hover:bg-yellow-600 flex items-center gap-1">
          <Truck className="h-3 w-3" />
          Retirado
        </Badge>
      );
    case 'em_transito':
      return (
        <Badge className="bg-orange-600 hover:bg-orange-600 flex items-center gap-1">
          <Truck className="h-3 w-3" />
          Em Trânsito
        </Badge>
      );
    case 'entregue':
      return (
        <Badge className="bg-green-600 hover:bg-green-600 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Entregue
        </Badge>
      );
    case 'cancelado':
      return (
        <Badge className="bg-red-600 hover:bg-red-600 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Cancelado
        </Badge>
      );
  }
};

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1]; // Só o base64 puro
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}

export function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] ?? 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
