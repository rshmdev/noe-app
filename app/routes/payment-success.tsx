import { Check, ArrowRight, SailboatIcon as Boat } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '~/components/ui/card';

export default function PaymentSuccess() {
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="mx-auto text-center">
        <CardHeader className="pb-2">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-600">
            Pagamento Confirmado!
          </h1>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Boat className="h-5 w-5 text-blue-600" />
            <p className="text-lg font-medium text-blue-600">NOÉ</p>
          </div>
        </CardHeader>
        <CardContent className="pb-6 pt-4">
          <p className="mb-6 text-gray-600">
            Seu lugar na arca está garantido! Seu pet embarcará com segurança em
            sua viagem.
          </p>
          <div className="rounded-lg bg-blue-50 border shadow p-4">
            <p className="text-sm text-gray-600">
              "Assim como Noé salvou os animais das águas, nós garantimos que
              seu pet chegará em segurança ao seu destino."
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link to="/">
              Ver detalhes da viagem
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="text-xs text-gray-500">
            Um comprovante foi enviado para seu e-mail cadastrado.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
