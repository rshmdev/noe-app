import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Link } from 'react-router';
import { getStatusBadge } from '~/utils';
import { Badge } from '../ui/badge';
import { Copy, Eye, Info, MessageSquare, QrCode } from 'lucide-react';
import { Button } from '../ui/button';

export function ContractCard({
  contrato,
  setDialogDetalhes,
  confirmarCodigo,
  copiarCodigo,
}: {
  contrato: any;
  setDialogDetalhes: (dialog: { aberto: boolean; contrato: any }) => void;
  confirmarCodigo: (tipo: 'retirada' | 'entrega', contract: number) => void;
  copiarCodigo: (codigo: string) => void;
}) {
  return (
    <Card key={contrato.id} className="">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={contrato.tutor.avatar || '/placeholder.svg'} />
              <AvatarFallback className=" ">
                {contrato.tutor.nome
                  .split(' ')
                  .map((n: any) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link
                to={`/perfil/${contrato.tutor.id}`}
                className="font-medium hover:underline"
              >
                {contrato.tutor.nome}
              </Link>
              <div className="flex items-center">
                <span className="text-yellow-400 text-xs">★</span>
                <span className=" text-xs ml-1">
                  {contrato.tutor.avaliacao}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(contrato.status)}
            <Badge variant="outline" className=" flex items-center gap-1">
              {contrato.animal.tipo} - {contrato.animal.porte}
            </Badge>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="detalhes" className="border-green-600">
            <AccordionTrigger className="hover:no-underline py-2">
              <span className="flex items-center gap-2">
                <Info className="h-4 w-4 text-green-900" />
                Detalhes do animal e endereços
              </span>
            </AccordionTrigger>
            <AccordionContent className="">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className=" font-medium mb-2">Detalhes do Animal</h4>
                  <div className="space-y-1">
                    <p>
                      <span className="text-green-900">Nome:</span>{' '}
                      {contrato.animal.nome}
                    </p>
                    <p>
                      <span className="text-green-900">Tipo:</span>{' '}
                      {contrato.animal.tipo}
                    </p>
                    <p>
                      <span className="text-green-900">Porte:</span>{' '}
                      {contrato.animal.porte}
                    </p>
                    <p>
                      <span className="text-green-900">Idade:</span>{' '}
                      {contrato.animal.idade}
                    </p>
                    <p>
                      <span className="text-green-900">Raça:</span>{' '}
                      {contrato.animal.raca}
                    </p>
                    {contrato.animal.observacoes && (
                      <p>
                        <span className="text-green-900">Observações:</span>{' '}
                        {contrato.animal.observacoes}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className=" font-medium mb-2">Endereços</h4>
                  <div className="space-y-1">
                    <p>
                      <span className="text-green-900">Retirada:</span>{' '}
                      {contrato.enderecoRetirada}
                    </p>
                    <p>
                      <span className="text-green-900">Entrega:</span>{' '}
                      {contrato.enderecoEntrega}
                    </p>
                  </div>
                  {contrato.observacoes && (
                    <div className="mt-2">
                      <h4 className=" font-medium mb-1">Observações</h4>
                      <p className="">{contrato.observacoes}</p>
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-green-50/50 shadow border p-3 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <h4 className=" font-medium">Código de Retirada</h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 "
                onClick={() => copiarCodigo(contrato.codigoRetirada)}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <code className="bg-green-700/30 px-2 py-1 rounded  font-mono">
                {contrato.codigoRetirada}
              </code>
              <Button
                size="sm"
                onClick={() => confirmarCodigo('retirada', contrato.id)}
              >
                <QrCode className="h-3.5 w-3.5 mr-1" />
                Confirmar
              </Button>
            </div>
          </div>

          <div className="bg-green-50/50 shadow border p-3 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <h4 className=" font-medium">Código de Entrega</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copiarCodigo(contrato.codigoEntrega)}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <code className="bg-green-700/30 px-2 py-1 rounded  font-mono">
                {contrato.codigoEntrega}
              </code>
              <Button size="sm" disabled>
                <QrCode className="h-3.5 w-3.5 mr-1" />
                Confirmar
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-green-500 ">
              R$ {contrato.valorPago.toFixed(2)}
            </Badge>
            <span className=" text-xs">
              Última atualização: {contrato.ultimaAtualizacao}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialogDetalhes({ aberto: true, contrato })}
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              Detalhes
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/chat/${contrato.tutor.id}`}>
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                Mensagem
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
