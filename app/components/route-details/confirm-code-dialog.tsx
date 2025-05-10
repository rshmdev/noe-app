import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

export function ConfirmCodeDialog({
  dialogConfirmacao,
  setDialogConfirmacao,
  verificarCodigo,
  codigoInput,
  setCodigoInput,
}: {
  dialogConfirmacao: {
    aberto: boolean;
    tipo: 'retirada' | 'entrega';
    contratoId: number | null;
  };
  setDialogConfirmacao: (dialog: any) => void;
  verificarCodigo: () => void;
  codigoInput: string;
  setCodigoInput: (codigo: string) => void;
}) {
  return (
    <Dialog
      open={dialogConfirmacao.aberto}
      onOpenChange={(open) =>
        setDialogConfirmacao({ ...dialogConfirmacao, aberto: open })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Confirmar{' '}
            {dialogConfirmacao.tipo === 'retirada' ? 'Retirada' : 'Entrega'} do
            Animal
          </DialogTitle>
          <DialogDescription className="text-green-900">
            {dialogConfirmacao.tipo === 'retirada'
              ? 'Insira o código de retirada fornecido pelo tutor para confirmar a retirada do animal.'
              : 'Insira o código de entrega fornecido pelo tutor para confirmar a entrega do animal.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className=" text-sm">
              Código de{' '}
              {dialogConfirmacao.tipo === 'retirada' ? 'Retirada' : 'Entrega'}
            </Label>
            <Input
              value={codigoInput}
              onChange={(e) => setCodigoInput(e.target.value)}
              placeholder="Digite o código"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={() =>
              setDialogConfirmacao({
                aberto: false,
                tipo: 'retirada',
                contratoId: null,
              })
            }
          >
            Cancelar
          </Button>
          <Button onClick={verificarCodigo}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
