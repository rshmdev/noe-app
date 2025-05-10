'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Truck,
  PawPrint,
} from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '~/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { myRoutes } from '~/services/route';

// Tipos para os dados
interface Transportador {
  id: string;
  name: string;
  email: string;
  vehicleInfo: string;
}

interface Rota {
  id: string;
  transportador: Transportador;
  origin: string;
  originDate: string;
  destination: string;
  destinationDate: string;
  availableSlots: number;
  speciesAccepted: string;
  animalSizeAccepted: string;
  vehicleObservations: string;
  priceDescription: string | null;
  status: string;
  stops: any[];
  createdAt: string;
}

// Dados de exemplo
const rotasExemplo: Rota[] = [
  {
    id: 'baea86bb-a1f7-433c-8225-a04091f8c420',
    transportador: {
      id: 'dd74ed7f-fda3-417a-ba5e-3f375bca67c3',
      name: 'Zézo',
      email: 'admin@transportador.com',
      vehicleInfo: '67062462515',
    } as Transportador,
    origin: 'Rio de Janeiro',
    originDate: '2025-04-26T21:19:57.783Z',
    destination: 'São Paulo',
    destinationDate: '2025-04-30T21:19:00.000Z',
    availableSlots: 10,
    speciesAccepted: 'gato, outro, cachorro, roedor',
    animalSizeAccepted: 'pequeno, medio, grande',
    vehicleObservations:
      'Veículo com ar condicionado e espaço adequado para transporte de animais',
    priceDescription: null,
    status: 'available',
    stops: [],
    createdAt: '2025-04-26T21:20:22.624Z',
  },
  {
    id: 'caea86bb-a1f7-433c-8225-a04091f8c421',
    transportador: {
      id: 'dd74ed7f-fda3-417a-ba5e-3f375bca67c3',
      name: 'Zézo',
      email: 'admin@transportador.com',
      vehicleInfo: '67062462515',
    } as Transportador,
    origin: 'São Paulo',
    originDate: '2025-05-10T10:00:00.000Z',
    destination: 'Curitiba',
    destinationDate: '2025-05-12T18:00:00.000Z',
    availableSlots: 5,
    speciesAccepted: 'cachorro, gato',
    animalSizeAccepted: 'pequeno, medio',
    vehicleObservations:
      'Transporte exclusivo para animais de pequeno e médio porte',
    priceDescription: 'R$ 150 por animal',
    status: 'in_progress',
    stops: [],
    createdAt: '2025-04-28T14:30:22.624Z',
  },
];

export default function RotasTransportador() {
  const [expandedRoutes, setExpandedRoutes] = useState<Record<string, boolean>>(
    {},
  );

  const { data } = useQuery({
    queryKey: ['my-routes'],
    queryFn: () => myRoutes(),
  });

  const toggleRouteExpand = (routeId: string) => {
    setExpandedRoutes((prev) => ({
      ...prev,
      [routeId]: !prev[routeId],
    }));
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return format(data, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Disponível</Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            Em andamento
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Concluída</Badge>
        );
      case 'cancelled':
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Minhas Rotas</h1>

      {data?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            Você ainda não possui rotas cadastradas.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {data?.map((rota) => (
            <Card
              key={rota.id}
              className="shadow-md overflow-hidden border-none"
            >
              <CardHeader className="pb-2 pt-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-primary/10 p-1.5 rounded-full">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-semibold text-lg">
                        {rota.origin} → {rota.destination}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground ml-9">
                      {getStatusBadge(rota.status)}
                      <span className="mx-2">•</span>
                      <span>ID: {rota.id.substring(0, 8)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="grid gap-3 text-sm">
                  <div className="flex items-start gap-3 bg-gray-50 shadow-lg border p-3 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div className="grid gap-2 flex-1">
                      <div>
                        <p className="text-xs text-muted-foreground">Saída</p>
                        <p className="font-medium">
                          {formatarData(rota.originDate)}
                        </p>
                      </div>
                      <div className="border-l border-gray-300 h-6 mx-2"></div>
                      <div>
                        <p className="text-xs text-muted-foreground">Chegada</p>
                        <p className="font-medium">
                          {formatarData(rota.destinationDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-1.5 rounded-full">
                        <PawPrint className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Vagas disponíveis
                        </p>
                        <p className="font-semibold text-lg">
                          {rota.availableSlots}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {rota.speciesAccepted
                        .split(', ')
                        .slice(0, 2)
                        .map((especie) => (
                          <Badge
                            key={especie}
                            variant="outline"
                            className="capitalize bg-primary/5"
                          >
                            {especie}
                          </Badge>
                        ))}
                      {rota.speciesAccepted.split(', ').length > 2 && (
                        <Badge variant="outline" className="bg-primary/5">
                          +{rota.speciesAccepted.split(', ').length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0 flex-col items-stretch">
                <Button
                  variant="ghost"
                  className="flex justify-between items-center w-full py-1 h-auto"
                  onClick={() => toggleRouteExpand(rota.id)}
                >
                  <span className="text-primary">
                    Ver {expandedRoutes[rota.id] ? 'menos' : 'mais'} detalhes
                  </span>
                  {expandedRoutes[rota.id] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {expandedRoutes[rota.id] && (
                  <div className="mt-3 text-sm space-y-4 bg-gray-50 shadow-lg border p-4 rounded-lg">
                    <div>
                      <p className="font-medium mb-2 text-xs text-muted-foreground">
                        ESPÉCIES ACEITAS
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {rota.speciesAccepted.split(', ').map((especie) => (
                          <Badge
                            key={especie}
                            variant="outline"
                            className="capitalize bg-primary/5"
                          >
                            {especie}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-medium mb-2 text-xs text-muted-foreground">
                        TAMANHOS ACEITOS
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {rota.animalSizeAccepted.split(', ').map((tamanho) => (
                          <Badge
                            key={tamanho}
                            variant="outline"
                            className="capitalize bg-primary/5"
                          >
                            {tamanho}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {rota.vehicleObservations && (
                      <div>
                        <p className="font-medium mb-2 text-xs text-muted-foreground">
                          OBSERVAÇÕES DO VEÍCULO
                        </p>
                        <p className="text-muted-foreground bg-white p-3 rounded-md border border-gray-100">
                          {rota.vehicleObservations}
                        </p>
                      </div>
                    )}

                    {rota.priceDescription && (
                      <div>
                        <p className="font-medium mb-2 text-xs text-muted-foreground">
                          PREÇO
                        </p>
                        <p className="text-primary font-semibold text-lg">
                          {rota.priceDescription}
                        </p>
                      </div>
                    )}

                    <div className="pt-2">
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <Truck className="mr-2 h-4 w-4" />
                        Gerenciar Rota
                      </Button>
                    </div>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
