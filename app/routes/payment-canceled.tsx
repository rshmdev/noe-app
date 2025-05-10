import { X, RefreshCw, SailboatIcon as Boat } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '~/components/ui/card';

export default function PaymentCanceled() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100 p-4">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader className="pb-2">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <X className="h-10 w-10 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-amber-600">
            Pagamento Cancelado
          </h1>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Boat className="h-5 w-5 text-blue-600" />
            <p className="text-lg font-medium text-blue-600">NOÉ</p>
          </div>
        </CardHeader>
        <CardContent className="pb-6 pt-4">
          <p className="mb-6 text-gray-600">
            Você cancelou seu pagamento. Seu pet ainda não está confirmado para
            embarcar na arca.
          </p>
          <div className="rounded-lg bg-amber-50 p-4">
            <p className="text-sm text-gray-600">
              "A arca está esperando! Quando estiver pronto, podemos garantir
              uma viagem segura para seu pet."
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link to="/payment">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/">Voltar ao início</Link>
          </Button>
          <p className="text-xs text-gray-500">Código: NOE-PAY-CANCELED</p>
        </CardFooter>
      </Card>
    </div>
  );
}
