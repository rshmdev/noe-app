import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import type { Rota } from '~/routes/route-details';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Link } from 'react-router';
import { Badge } from '../ui/badge';
import {
  CheckCircle,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  Info,
  MessageSquare,
  QrCode,
  Truck,
} from 'lucide-react';
import { Button } from '../ui/button';
import { getStatusBadge } from '~/utils';
import { ContractCard } from './contract-card';

export function RouteContracts({
  rota,
  copiarCodigo,
  confirmarCodigo,
  setDialogDetalhes,
}: {
  rota: Rota;
  copiarCodigo: (codigo: string) => void;
  confirmarCodigo: (tipo: 'retirada' | 'entrega', contratoId: number) => void;
  setDialogDetalhes: (detalhes: { aberto: boolean; contrato: any }) => void;
}) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className=" text-lg">Contratos da Rota</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="flex items-center justify-start flex-wrap h-auto space-y-1">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            <TabsTrigger value="retirados">Retirados</TabsTrigger>
            <TabsTrigger value="transito">Em Trânsito</TabsTrigger>
            <TabsTrigger value="entregues">Entregues</TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="mt-0 space-y-4">
            {rota.contratos.map((contrato) => (
              <ContractCard
                key={contrato.id}
                contrato={contrato}
                setDialogDetalhes={setDialogDetalhes}
                confirmarCodigo={confirmarCodigo}
                copiarCodigo={copiarCodigo}
              />
            ))}
          </TabsContent>

          <TabsContent value="pendentes" className="mt-0 space-y-4">
            {rota.contratos.filter((c) => c.status === 'pendente').length >
            0 ? (
              rota.contratos
                .filter((c) => c.status === 'pendente')
                .map((contrato) => (
                  <ContractCard
                    key={contrato.id}
                    contrato={contrato}
                    setDialogDetalhes={setDialogDetalhes}
                    confirmarCodigo={confirmarCodigo}
                    copiarCodigo={copiarCodigo}
                  />
                ))
            ) : (
              <div className=" border ' rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-600 rounded-full p-3">
                    <Clock className="h-6 w-6 text-green-300" />
                  </div>
                </div>
                <h3 className="text-white text-lg font-medium mb-2">
                  Nenhum contrato pendente
                </h3>
                <p className="text-green-900 mb-6">
                  Não há contratos pendentes para retirada nesta rota no
                  momento.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="retirados" className="mt-0 space-y-4">
            {rota.contratos.filter((c) => c.status === 'retirado').length >
            0 ? (
              rota.contratos
                .filter((c) => c.status === 'retirado')
                .map((contrato) => (
                  <ContractCard
                    key={contrato.id}
                    contrato={contrato}
                    setDialogDetalhes={setDialogDetalhes}
                    confirmarCodigo={confirmarCodigo}
                    copiarCodigo={copiarCodigo}
                  />
                ))
            ) : (
              <div className=" border border-green-600 rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-600 rounded-full p-3">
                    <Truck className="h-6 w-6 text-green-300" />
                  </div>
                </div>
                <h3 className="text-white text-lg font-medium mb-2">
                  Nenhum animal retirado
                </h3>
                <p className="text-green-900 mb-6">
                  Não há animais que foram retirados e aguardam entrega nesta
                  rota.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="transito" className="mt-0 space-y-4">
            {rota.contratos.filter((c) => c.status === 'em_transito').length >
            0 ? (
              rota.contratos
                .filter((c) => c.status === 'em_transito')
                .map((contrato) => (
                  <Card key={contrato.id} className=" border-green-600">
                    <CardContent className="p-4">
                      {/* Conteúdo similar ao anterior, adaptado para status "em_transito" */}
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-900"
                        >
                          R$ {contrato.valorPago.toFixed(2)}
                        </Badge>
                        <span className="text-green-300 text-xs">
                          Última atualização: {contrato.ultimaAtualizacao}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className=" border rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-600 rounded-full p-3">
                    <Truck className="h-6 w-6 text-green-300" />
                  </div>
                </div>
                <h3 className=" text-lg font-medium mb-2">
                  Nenhum animal em trânsito
                </h3>
                <p className="text-green-900 mb-6">
                  Não há animais em trânsito nesta rota no momento.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="entregues" className="mt-0 space-y-4">
            {rota.contratos.filter((c) => c.status === 'entregue').length >
            0 ? (
              rota.contratos
                .filter((c) => c.status === 'entregue')
                .map((contrato) => (
                  <Card key={contrato.id} className="">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-900"
                        >
                          R$ {contrato.valorPago.toFixed(2)}
                        </Badge>
                        <span className="text-green-300 text-xs">
                          Última atualização: {contrato.ultimaAtualizacao}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className=" border rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-600 rounded-full p-3">
                    <CheckCircle2 className="h-6 w-6 text-green-300" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Nenhum animal entregue
                </h3>
                <p className="text-green-900 mb-6">
                  Não há animais que foram entregues nesta rota.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
