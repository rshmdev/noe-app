import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Button } from '../ui/button';
import { DollarSign } from 'lucide-react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProposal } from '~/services/proposal';
import { toast } from 'sonner';

export function CreateProposalDialog({
  routeId,
  userId,
  chatId,
}: {
  routeId: string;
  userId: string;
  chatId: string;
}) {
  const [proposalDialog, setProposalDialog] = useState(false);

  const [newProposal, setNewProposal] = useState({
    price: '',
    description: '',
  });

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () =>
      createProposal({
        price: Number(newProposal.price),
        routeId: routeId,
        userId: userId,
        message: newProposal.description,
        chatId: chatId,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(['chatMessages', chatId], (old: any[] = []) => {
        return [
          ...old,
          {
            id: data.id,
            text: null,
            createdAt: new Date().toISOString(),
            read: false,
            sender: data.transportador,
            proposal: {
              id: data.id,
              createdAt: data.createdAt,
              price: data.price,
              message: data.message,
              status: data.status,
            },
          },
        ];
      });
      setNewProposal({ price: '', description: '' });
    },
    onError: (error) => {
      toast.error(`Erro ao enviar proposta: ${error.message}`);
    },
  });

  const sendProposal = async () => {
    await mutateAsync();
    setProposalDialog(false);
  };

  return (
    <Dialog open={proposalDialog} onOpenChange={setProposalDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-[60px] w-14">
          <DollarSign className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Proposta</DialogTitle>
          <DialogDescription className="">
            Preencha os detalhes da proposta de transporte
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium " htmlFor="valor">
              Valor (R$)
            </Label>
            <Input
              id="valor"
              type="number"
              placeholder="0.00"
              value={newProposal.price}
              onChange={(e) =>
                setNewProposal({ ...newProposal, price: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium " htmlFor="origem">
              Origem
            </Label>
            <Textarea
              id="description"
              placeholder="Descrição da proposta"
              value={newProposal.description}
              onChange={(e) =>
                setNewProposal({ ...newProposal, description: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setProposalDialog(false)}>
            Cancelar
          </Button>
          <Button disabled={isPending} onClick={sendProposal}>
            {isPending && <span className="animate-spin">...</span>}
            {!isPending && <DollarSign className="h-4 w-4 mr-2" />}
            Enviar Proposta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
