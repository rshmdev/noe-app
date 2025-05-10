'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  MapPin,
  Calendar,
  PawPrint,
  Clock,
  DollarSign,
  MessageCircle,
  X,
  CheckCircle,
  Truck,
  AlertCircle,
  Search,
  Filter,
  Star,
} from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '~/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '~/services/orders';
import { useNavigate } from 'react-router';

export default function MeusPedidos() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('recent');

  const { data } = useQuery({
    queryKey: ['pedidos'],
    queryFn: async () => getOrders(),
  });

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return format(data, "dd 'de' MMM 'de' yyyy", { locale: ptBR });
  };

  const formatarHora = (dataString: string) => {
    const data = new Date(dataString);
    return format(data, 'HH:mm', { locale: ptBR });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-normal flex items-center gap-1">
            <Clock className="h-3 w-3" /> Pendente
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-normal flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Confirmado
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600 text-white font-normal flex items-center gap-1">
            <Truck className="h-3 w-3" /> Em Transporte
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white font-normal flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Concluído
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white font-normal flex items-center gap-1">
            <X className="h-3 w-3" /> Cancelado
          </Badge>
        );
      case 'paid':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-normal flex items-center gap-1">
            <DollarSign className="h-3 w-3" /> Pago
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'from-amber-400 to-amber-600';
      case 'confirmed':
        return 'from-blue-400 to-blue-600';
      case 'in_progress':
        return 'from-purple-400 to-purple-600';
      case 'completed':
        return 'from-green-400 to-green-600';
      case 'cancelled':
        return 'from-red-400 to-red-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  // Filtrar pedidos com base na aba ativa e termo de busca
  const filteredOrders =
    data
      ?.filter((order) => {
        // Filtrar por status
        if (activeTab !== 'all' && order.status !== activeTab) {
          return false;
        }

        // Filtrar por termo de busca
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            order.proposal.route.origin.toLowerCase().includes(searchLower) ||
            order.proposal.route.destination
              .toLowerCase()
              .includes(searchLower) ||
            order.proposal.transportador.name
              .toLowerCase()
              .includes(searchLower)
          );
        }

        return true;
      })
      .sort((a, b) => {
        // Ordenar por data
        if (sortOrder === 'recent') {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
      }) || [];

  return (
    <div className="mx-auto overflow-y-auto flex flex-col max-h-full">
      <h1 className="text-2xl font-bold mb-6 text-white text-center md:text-left">
        Meus Pedidos
      </h1>

      {/* Filtros e Busca */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por destino, transportador..."
              className="pl-9 bg-green-50 text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px] bg-green-50 text-muted-foreground">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais recentes</SelectItem>
                <SelectItem value="oldest">Mais antigos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="md:hidden">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs para filtrar por status */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex items-center justify-start flex-wrap h-auto w-full">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmados</TabsTrigger>
            <TabsTrigger value="in_progress" className="hidden md:flex">
              Em Transporte
            </TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Lista de Pedidos */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Nenhum pedido encontrado</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Não encontramos nenhum pedido com os filtros selecionados. Tente
            ajustar seus filtros ou faça um novo pedido.
          </p>
          <Button>Solicitar Transporte</Button>
        </div>
      ) : (
        <div className="flex gap-4 flex-wrap overflow-y-auto flex-1 max-h-full px-4">
          {filteredOrders.map((pedido) => (
            <Card
              key={pedido.id}
              className="shadow-sm overflow-hidden min-w-[400px] flex-1"
            >
              <div
                className={`h-2 w-full bg-gradient-to-r ${getStatusColor(
                  pedido.status,
                )}`}
              ></div>

              <CardHeader className="pb-2 pt-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-primary/10 p-1.5 rounded-full">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-semibold">
                        {pedido.proposal.route.origin} →{' '}
                        {pedido.proposal.route.destination}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground ml-9">
                      {getStatusBadge(pedido.status)}
                      <span className="mx-2">•</span>
                      <span>Pedido #{pedido.id.substring(4)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-3 pt-2">
                <div className="grid gap-3 text-sm">
                  <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Data Agendada
                      </p>
                      <p className="font-medium">
                        {formatarData(pedido.proposal.route.originDate)} às{' '}
                        {formatarHora(pedido.proposal.route.destinationDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-1.5 rounded-full">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Valor</p>
                        <p className="font-semibold">
                          R$ {pedido.proposal.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          pedido.proposal.transportador.selfieUrl ||
                          '/placeholder.svg'
                        }
                        alt={pedido.proposal.transportador.name}
                      />
                      <AvatarFallback>
                        {pedido.proposal.transportador.name
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Transportador
                      </p>
                      <p className="font-medium">
                        {pedido.proposal.transportador.name}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0 flex-col items-stretch">
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <Button variant="outline">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contatar
                  </Button>
                  {pedido.status === 'pending' && (
                    <Button variant="destructive">
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  )}
                  {pedido.status === 'confirmed' && (
                    <Button
                      onClick={() => navigate(`/order-details/${pedido.id}`)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Truck className="mr-2 h-4 w-4" />
                      Acompanhar
                    </Button>
                  )}
                  {pedido.status === 'in_progress' && (
                    <Button
                      onClick={() => navigate(`/order-details/${pedido.id}`)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Truck className="mr-2 h-4 w-4" />
                      Acompanhar
                    </Button>
                  )}
                  {pedido.status === 'paid' && (
                    <Button
                      onClick={() => navigate(`/order-details/${pedido.id}`)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Truck className="mr-2 h-4 w-4" />
                      Acompanhar
                    </Button>
                  )}

                  {pedido.status === 'completed' && (
                    <Button className="bg-amber-500 hover:bg-amber-600">
                      <Star className="mr-2 h-4 w-4" />
                      Avaliar
                    </Button>
                  )}
                  {pedido.status === 'cancelled' && (
                    <Button className="bg-primary hover:bg-primary/90">
                      <PawPrint className="mr-2 h-4 w-4" />
                      Refazer
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
