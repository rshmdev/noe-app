'use client';

import { useState } from 'react';
import {
  PawPrintIcon as Paw,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';

import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { RouteContracts } from '~/components/route-details/route-contracts';
import { ConfirmCodeDialog } from '~/components/route-details/confirm-code-dialog';
import { ContractDetailsDialog } from '~/components/route-details/contract-details-dialog';

// Tipos
interface Animal {
  tipo: string;
  porte: string;
  nome?: string;
  idade?: string;
  raca?: string;
  observacoes?: string;
}

interface Tutor {
  id: string;
  nome: string;
  avatar: string;
  telefone: string;
  avaliacao: number;
}

interface Contrato {
  id: number;
  tutor: Tutor;
  animal: Animal;
  status: 'pendente' | 'retirado' | 'em_transito' | 'entregue' | 'cancelado';
  codigoRetirada: string;
  codigoEntrega: string;
  valorPago: number;
  dataConfirmacao: string;
  enderecoRetirada: string;
  enderecoEntrega: string;
  observacoes?: string;
  ultimaAtualizacao: string;
}

export interface Rota {
  id: number;
  origem: string;
  destino: string;
  dataPartida: string;
  dataChegada: string;
  status: 'agendada' | 'em andamento' | 'concluída' | 'cancelada';
  vagasTotal: number;
  vagasDisponiveis: number;
  animaisAceitos: {
    tipo: string;
    porte: string;
  }[];
  valorBase?: number;
  valorNegociavel: boolean;
  observacoes?: string;
  paradas?: {
    local: string;
    data: string;
  }[];
  contratos: Contrato[];
  criada: string;
}

export default function DetalhesRota() {
  const params = useParams();
  const router = useNavigate();
  const rotaId = params.id as string;

  const [codigoInput, setCodigoInput] = useState('');
  const [dialogConfirmacao, setDialogConfirmacao] = useState<{
    aberto: boolean;
    tipo: 'retirada' | 'entrega';
    contratoId: number | null;
  }>({
    aberto: false,
    tipo: 'retirada',
    contratoId: null,
  });
  const [dialogDetalhes, setDialogDetalhes] = useState<{
    aberto: boolean;
    contrato: Contrato | null;
  }>({
    aberto: false,
    contrato: null,
  });

  // Dados simulados da rota
  const [rota, setRota] = useState<Rota>({
    id: 1,
    origem: 'São Paulo, SP',
    destino: 'Rio de Janeiro, RJ',
    dataPartida: '15/05/2024',
    dataChegada: '16/05/2024',
    status: 'em andamento',
    vagasTotal: 5,
    vagasDisponiveis: 2,
    animaisAceitos: [
      { tipo: 'Cachorro', porte: 'Pequeno' },
      { tipo: 'Cachorro', porte: 'Médio' },
      { tipo: 'Gato', porte: 'Pequeno' },
    ],
    valorBase: 350,
    valorNegociavel: false,
    observacoes: 'Veículo com ar-condicionado e monitoramento em tempo real.',
    paradas: [
      {
        local: 'Resende, RJ',
        data: '15/05/2024 14:00',
      },
    ],
    contratos: [
      {
        id: 101,
        tutor: {
          id: 'usuario-1',
          nome: 'Maria Santos',
          avatar: '/placeholder.svg?height=40&width=40',
          telefone: '(11) 98765-4321',
          avaliacao: 4.9,
        },
        animal: {
          tipo: 'Cachorro',
          porte: 'Médio',
          nome: 'Max',
          idade: '3 anos',
          raca: 'Golden Retriever',
          observacoes: 'Amigável, mas fica ansioso em viagens longas.',
        },
        status: 'retirado',
        codigoRetirada: 'RT-12345',
        codigoEntrega: 'ET-67890',
        valorPago: 350,
        dataConfirmacao: '10/05/2024',
        enderecoRetirada: 'Av. Paulista, 1000, São Paulo, SP',
        enderecoEntrega: 'Av. Atlântica, 500, Rio de Janeiro, RJ',
        observacoes: 'Levar a caixa de transporte própria do animal.',
        ultimaAtualizacao: '15/05/2024 08:15',
      },
      {
        id: 102,
        tutor: {
          id: 'usuario-2',
          nome: 'João Oliveira',
          avatar: '/placeholder.svg?height=40&width=40',
          telefone: '(11) 91234-5678',
          avaliacao: 4.7,
        },
        animal: {
          tipo: 'Gato',
          porte: 'Pequeno',
          nome: 'Luna',
          idade: '2 anos',
          raca: 'Siamês',
          observacoes: 'Tímida, prefere ficar na caixa de transporte.',
        },
        status: 'pendente',
        codigoRetirada: 'RT-23456',
        codigoEntrega: 'ET-78901',
        valorPago: 300,
        dataConfirmacao: '12/05/2024',
        enderecoRetirada: 'Rua Augusta, 200, São Paulo, SP',
        enderecoEntrega: 'Rua Barata Ribeiro, 300, Rio de Janeiro, RJ',
        ultimaAtualizacao: '12/05/2024 14:30',
      },
      {
        id: 103,
        tutor: {
          id: 'usuario-3',
          nome: 'Ana Costa',
          avatar: '/placeholder.svg?height=40&width=40',
          telefone: '(11) 98888-7777',
          avaliacao: 5.0,
        },
        animal: {
          tipo: 'Cachorro',
          porte: 'Pequeno',
          nome: 'Thor',
          idade: '1 ano',
          raca: 'Yorkshire',
          observacoes: 'Precisa de paradas frequentes para necessidades.',
        },
        status: 'pendente',
        codigoRetirada: 'RT-34567',
        codigoEntrega: 'ET-89012',
        valorPago: 350,
        dataConfirmacao: '11/05/2024',
        enderecoRetirada: 'Rua Consolação, 500, São Paulo, SP',
        enderecoEntrega: 'Rua Visconde de Pirajá, 200, Rio de Janeiro, RJ',
        observacoes:
          'Animal com medicação. Instruções serão fornecidas na retirada.',
        ultimaAtualizacao: '11/05/2024 10:45',
      },
    ],
    criada: '01/05/2024',
  });

  // Estatísticas dos contratos
  const estatisticas = {
    total: rota.contratos.length,
    pendentes: rota.contratos.filter((c) => c.status === 'pendente').length,
    retirados: rota.contratos.filter((c) => c.status === 'retirado').length,
    emTransito: rota.contratos.filter((c) => c.status === 'em_transito').length,
    entregues: rota.contratos.filter((c) => c.status === 'entregue').length,
    cancelados: rota.contratos.filter((c) => c.status === 'cancelado').length,
    valorTotal: rota.contratos.reduce(
      (total, contrato) => total + contrato.valorPago,
      0,
    ),
  };

  // Progresso da rota
  const calcularProgressoRota = () => {
    if (rota.status === 'concluída') return 100;
    if (rota.status === 'cancelada') return 0;
    if (rota.status === 'agendada') return 10;

    // Para rotas em andamento, calcular baseado nos contratos
    const totalContratos = rota.contratos.length;
    if (totalContratos === 0) return 25;

    // Pesos para cada status
    const pesos = {
      pendente: 0,
      retirado: 1,
      em_transito: 2,
      entregue: 3,
    };

    // Calcular progresso baseado no status dos contratos
    const progressoMaximoPossivel = totalContratos * 3; // 3 é o peso máximo (entregue)
    const progressoAtual = rota.contratos.reduce(
      (total, contrato) =>
        total + (pesos[contrato.status as keyof typeof pesos] || 0),
      0,
    );

    return Math.round((progressoAtual / progressoMaximoPossivel) * 90) + 10; // +10 para nunca começar do zero
  };

  const confirmarCodigo = (
    tipo: 'retirada' | 'entrega',
    contratoId: number,
  ) => {
    setDialogConfirmacao({
      aberto: true,
      tipo,
      contratoId,
    });
    setCodigoInput('');
  };

  const verificarCodigo = () => {
    const { tipo, contratoId } = dialogConfirmacao;
    if (!contratoId) return;

    const contrato = rota.contratos.find((c) => c.id === contratoId);
    if (!contrato) return;

    const codigoCorreto =
      tipo === 'retirada' ? contrato.codigoRetirada : contrato.codigoEntrega;

    if (codigoInput === codigoCorreto) {
      // Atualizar status do contrato
      const novosContratos = rota.contratos.map((c) => {
        if (c.id === contratoId) {
          const novoStatus = tipo === 'retirada' ? 'retirado' : 'entregue';
          return {
            ...c,
            status: novoStatus,
            ultimaAtualizacao: new Date().toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        }
        return c;
      });

      setRota({
        ...rota,
        contratos: novosContratos as any,
      });

      const message =
        tipo === 'retirada' ? 'Retirada confirmada!' : 'Entrega confirmada!';

      toast(message);

      setDialogConfirmacao({
        aberto: false,
        tipo: 'retirada',
        contratoId: null,
      });
    } else {
      toast('O código informado não é válido. Verifique e tente novamente.');
    }
  };

  const getRotaStatusBadge = (status: Rota['status']) => {
    switch (status) {
      case 'agendada':
        return (
          <Badge className="bg-blue-600 hover:bg-blue-600 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Agendada
          </Badge>
        );
      case 'em andamento':
        return (
          <Badge className="bg-yellow-600 hover:bg-yellow-600 flex items-center gap-1">
            <Truck className="h-3 w-3" />
            Em andamento
          </Badge>
        );
      case 'concluída':
        return (
          <Badge className="bg-green-600 hover:bg-green-600 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Concluída
          </Badge>
        );
      case 'cancelada':
        return (
          <Badge className="bg-red-600 hover:bg-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Cancelada
          </Badge>
        );
    }
  };

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    toast('Código copiado para a área de transferência!');
  };

  return (
    <>
      <main className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Detalhes da Rota</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-5 w-5 text-green-300" />
              <span className="text-white">
                {rota.origem} → {rota.destino}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getRotaStatusBadge(rota.status)}
            <Badge
              variant="outline"
              className=" flex items-center gap-1 text-white"
            >
              <Calendar className="h-3 w-3" />
              {rota.dataPartida}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col flex-wrap gap-8">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className=" text-lg">Progresso da Rota</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="">Origem: {rota.origem}</span>
                  <span className="">Destino: {rota.destino}</span>
                </div>
                <Progress
                  value={calcularProgressoRota()}
                  className="h-2 bg-green-50/50 shadow border"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-green-50/50 shadow border p-3 rounded-md">
                    <p className=" text-xs">Data de Partida</p>
                    <p className="">{rota.dataPartida}</p>
                  </div>
                  <div className="bg-green-50/50 shadow border p-3 rounded-md">
                    <p className=" text-xs">Data de Chegada</p>
                    <p className="">{rota.dataChegada}</p>
                  </div>
                  <div className="bg-green-50/50 shadow border p-3 rounded-md">
                    <p className=" text-xs">Vagas</p>
                    <p className="">
                      {rota.vagasDisponiveis} disponíveis de {rota.vagasTotal}
                    </p>
                  </div>
                  <div className="bg-green-50/50 shadow border p-3 rounded-md">
                    <p className=" text-xs">Valor Base</p>
                    <p className="">
                      {rota.valorBase
                        ? `R$ ${rota.valorBase.toFixed(2)}`
                        : 'A negociar'}
                    </p>
                  </div>
                </div>

                {rota.paradas && rota.paradas.length > 0 && (
                  <div className="mt-4">
                    <h3 className=" font-medium mb-2">Paradas Programadas</h3>
                    <div className="space-y-2">
                      {rota.paradas.map((parada, index) => (
                        <div
                          key={index}
                          className="bg-green-50/50 shadow p-3 rounded-md flex justify-between"
                        >
                          <span className="">{parada.local}</span>
                          <span className="">{parada.data}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className=" ">
            <CardHeader className="pb-2">
              <CardTitle className=" text-lg">Resumo dos Contratos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-50/50 shadow border p-3 rounded-md text-center">
                    <p className=" text-xs">Total de Contratos</p>
                    <p className=" text-xl font-bold">{estatisticas.total}</p>
                  </div>
                  <div className="bg-green-50/50 border shadow p-3 rounded-md text-center">
                    <p className=" text-xs">Valor Total</p>
                    <p className=" text-xl font-bold">
                      R$ {estatisticas.valorTotal.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className=" text-sm">Pendentes</span>
                    <span className="text-blue-400">
                      {estatisticas.pendentes}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className=" text-sm">Retirados</span>
                    <span className="text-yellow-400">
                      {estatisticas.retirados}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className=" text-sm">Em Trânsito</span>
                    <span className="text-orange-400">
                      {estatisticas.emTransito}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className=" text-sm">Entregues</span>
                    <span className="">{estatisticas.entregues}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className=" text-sm">Cancelados</span>
                    <span className="text-red-400">
                      {estatisticas.cancelados}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <RouteContracts
            rota={rota}
            setDialogDetalhes={setDialogDetalhes}
            confirmarCodigo={confirmarCodigo}
            copiarCodigo={copiarCodigo}
          />
        </div>
      </main>

      {/* Dialog para confirmar código */}
      <ConfirmCodeDialog
        dialogConfirmacao={dialogConfirmacao}
        setDialogConfirmacao={setDialogConfirmacao}
        verificarCodigo={verificarCodigo}
        codigoInput={codigoInput}
        setCodigoInput={setCodigoInput}
      />

      {/* Dialog para detalhes do contrato */}
      <ContractDetailsDialog
        dialogDetalhes={dialogDetalhes}
        setDialogDetalhes={setDialogDetalhes}
        copiarCodigo={copiarCodigo}
      />
    </>
  );
}
