import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '../ui/button';
import {
  Copy,
  Info,
  MapPin,
  MessageSquare,
  PawPrint,
  QrCode,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Link } from 'react-router';
import { getStatusBadge } from '~/utils';

export function ContractDetailsDialog({
  dialogDetalhes,
  setDialogDetalhes,
  copiarCodigo,
}: {
  dialogDetalhes: {
    aberto: boolean;
    contrato: any | null;
  };
  setDialogDetalhes: (dialog: any) => void;
  copiarCodigo: (codigo: string) => void;
}) {
  return (
    <Dialog
      open={dialogDetalhes.aberto}
      onOpenChange={(open) =>
        setDialogDetalhes({ ...dialogDetalhes, aberto: open })
      }
    >
      <DialogContent className="w-full min-w-4xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Contrato</DialogTitle>
          <DialogDescription className="text-green-900">
            Informações completas sobre o contrato de transporte.
          </DialogDescription>
        </DialogHeader>

        {dialogDetalhes.contrato && (
          <div className="space-y-6 max-h-[80dvh] overflow-y-auto px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className=" font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 " />
                    Informações do Tutor
                  </h3>
                  <div className="bg-green-50/50 shadow border p-4 rounded-md space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            dialogDetalhes.contrato.tutor.avatar ||
                            '/placeholder.svg'
                          }
                        />
                        <AvatarFallback className="">
                          {dialogDetalhes.contrato.tutor.nome
                            .split(' ')
                            .map((n: any) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          to={`/perfil/${dialogDetalhes.contrato.tutor.id}`}
                          className=" font-medium hover:underline"
                        >
                          {dialogDetalhes.contrato.tutor.nome}
                        </Link>
                        <div className="flex items-center">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="text-green-900 text-xs ml-1">
                            {dialogDetalhes.contrato.tutor.avaliacao}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p>
                      <span className="text-green-900">Telefone:</span>{' '}
                      {dialogDetalhes.contrato.tutor.telefone}
                    </p>
                    <p>
                      <span className="text-green-900">
                        Data de confirmação:
                      </span>{' '}
                      {dialogDetalhes.contrato.dataConfirmacao}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className=" font-medium mb-2 flex items-center gap-2">
                    <PawPrint className="h-4 w-4 text-green-400" />
                    Informações do Animal
                  </h3>
                  <div className="bg-green-50/50 shadow border p-4 rounded-md space-y-2">
                    <p>
                      <span className="text-green-900">Nome:</span>{' '}
                      {dialogDetalhes.contrato.animal.nome}
                    </p>
                    <p>
                      <span className="text-green-900">Tipo:</span>{' '}
                      {dialogDetalhes.contrato.animal.tipo}
                    </p>
                    <p>
                      <span className="text-green-900">Porte:</span>{' '}
                      {dialogDetalhes.contrato.animal.porte}
                    </p>
                    <p>
                      <span className="text-green-900">Idade:</span>{' '}
                      {dialogDetalhes.contrato.animal.idade}
                    </p>
                    <p>
                      <span className="text-green-900">Raça:</span>{' '}
                      {dialogDetalhes.contrato.animal.raca}
                    </p>
                    {dialogDetalhes.contrato.animal.observacoes && (
                      <p>
                        <span className="text-green-900">Observações:</span>{' '}
                        {dialogDetalhes.contrato.animal.observacoes}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className=" font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-400" />
                    Endereços
                  </h3>
                  <div className="bg-green-50/50 shadow border p-4 rounded-md space-y-2">
                    <p>
                      <span className="text-green-900">Retirada:</span>{' '}
                      {dialogDetalhes.contrato.enderecoRetirada}
                    </p>
                    <p>
                      <span className="text-green-900">Entrega:</span>{' '}
                      {dialogDetalhes.contrato.enderecoEntrega}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className=" font-medium mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-green-400" />
                    Informações do Contrato
                  </h3>
                  <div className="bg-green-50/50 shadow border p-4 rounded-md space-y-2">
                    <p>
                      <span className="text-green-900">Status:</span>{' '}
                      {getStatusBadge(dialogDetalhes.contrato.status)}
                    </p>
                    <p>
                      <span className="text-green-900">Valor pago:</span> R${' '}
                      {dialogDetalhes.contrato.valorPago.toFixed(2)}
                    </p>
                    <p>
                      <span className="text-green-900">
                        Última atualização:
                      </span>{' '}
                      {dialogDetalhes.contrato.ultimaAtualizacao}
                    </p>
                    {dialogDetalhes.contrato.observacoes && (
                      <p>
                        <span className="text-green-900">Observações:</span>{' '}
                        {dialogDetalhes.contrato.observacoes}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className=" font-medium mb-2 flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-green-400" />
                    Códigos
                  </h3>
                  <div className="bg-green-50/50 shadow border p-4 rounded-md space-y-3">
                    <div>
                      <p className="text-green-900 mb-1">Código de Retirada:</p>
                      <div className="flex items-center gap-2">
                        <code className="bg-green-700/30 px-2 py-1 rounded  font-mono">
                          {dialogDetalhes.contrato.codigoRetirada}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-green-900 hover: "
                          onClick={() =>
                            copiarCodigo(
                              dialogDetalhes?.contrato?.codigoRetirada || '',
                            )
                          }
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-green-900 mb-1">Código de Entrega:</p>
                      <div className="flex items-center gap-2">
                        <code className="bg-green-700/30 px-2 py-1 rounded  font-mono">
                          {dialogDetalhes.contrato.codigoEntrega}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 "
                          onClick={() =>
                            copiarCodigo(
                              dialogDetalhes?.contrato?.codigoEntrega || '',
                            )
                          }
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  setDialogDetalhes({ aberto: false, contrato: null })
                }
              >
                Fechar
              </Button>
              <Button asChild>
                <Link to={`/chat/${dialogDetalhes.contrato.tutor.id}`}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </Link>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
