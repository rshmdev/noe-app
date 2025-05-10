import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  MapPin,
  Truck,
  CheckCircle,
  MessageCircle,
  AlertTriangle,
  Copy,
  Phone,
  Clock,
  DollarSign,
  ArrowLeft,
  Shield,
  Info,
  Navigation,
} from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Link, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '~/services/orders';

// Tipos para os dados
interface User {
  id: string;
  role: string;
  name: string;
  email: string;
  selfieUrl?: string;
}

interface Transportador {
  id: string;
  role: string;
  name: string;
  email: string;
  vehicleType: string;
  vehiclePlate: string;
  selfieUrl?: string;
}

interface Proposal {
  id: string;
  user: User;
  transportador: Transportador;
  price: string;
  message: string;
  status: string;
  createdAt: string;
}

interface Order {
  id: string;
  proposal: Proposal;
  stripePaymentIntentId: string;
  status: string;
  pickupCode: string;
  deliveryCode: string;
  createdAt: string;
  confirmedAt: string | null;
}

interface TrackingUpdate {
  status: string;
  timestamp: string;
  description: string;
  location?: {
    lat: number;
    lng: number;
  };
}

// Dados de exemplo baseados no objeto fornecido
const pedidoExemplo: Order = {
  id: '0d1427b9-9234-4ae3-bab5-0480fa35474c',
  proposal: {
    id: 'c2710fab-0db1-4837-b221-9a5a8eb3faf7',
    user: {
      id: 'ae535979-8eec-451a-9fb5-58517fefa29c',
      role: 'NORMAL',
      name: 'Rian Moraes Tutor',
      email: 'riantutor@teste.com',
      selfieUrl: '/placeholder.svg?height=100&width=100',
    },
    transportador: {
      id: 'e4a0d24f-f866-4779-b8ac-cef0e8549209',
      role: 'TRANSPORTER',
      name: 'Joca Paçoca',
      email: 'joca@teste.com',
      vehicleType: 'van',
      vehiclePlate: 'ABS2313',
      selfieUrl: '/placeholder.svg?height=100&width=100',
    },
    price: '500.00',
    message:
      'Proposta para transporte de animal de estimação de São Paulo para Rio de Janeiro. Inclui cuidados especiais durante a viagem e paradas programadas.',
    status: 'accepted',
    createdAt: '2025-05-10T18:10:02.238Z',
  },
  stripePaymentIntentId:
    'cs_test_a15rbdBFXyJGONIMAvSoxriMPIReilLgBlStHiCxlabQryJpFJAr1PgGcu',
  status: 'in_transit', // Modificado para simular um pedido em trânsito
  pickupCode: 'F9C0C4B8',
  deliveryCode: '3E3C030E',
  createdAt: '2025-05-10T18:47:56.166Z',
  confirmedAt: null,
};

// Histórico de atualizações de rastreamento (simulado)
const trackingUpdatesExample: TrackingUpdate[] = [
  {
    status: 'payment_confirmed',
    timestamp: '2025-05-10T18:50:00.000Z',
    description: 'Pagamento confirmado',
  },
  {
    status: 'pickup_scheduled',
    timestamp: '2025-05-10T19:15:00.000Z',
    description: 'Coleta agendada para 12/05/2025 às 09:00',
  },
  {
    status: 'pickup_on_way',
    timestamp: '2025-05-12T08:30:00.000Z',
    description: 'Transportador a caminho para coleta',
    location: { lat: -23.561, lng: -46.655 },
  },
  {
    status: 'pickup_arrived',
    timestamp: '2025-05-12T08:55:00.000Z',
    description: 'Transportador chegou ao local de coleta',
    location: { lat: -23.55, lng: -46.633 },
  },
  {
    status: 'in_transit',
    timestamp: '2025-05-12T09:10:00.000Z',
    description: 'Animal coletado, em transporte',
    location: { lat: -23.55, lng: -46.633 },
  },
  // Atualizações de localização durante o transporte seriam adicionadas em tempo real
];

// Função para formatar a data
const formatarData = (dataString: string) => {
  const data = new Date(dataString);
  return format(data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

// Função para formatar a hora
const formatarHora = (dataString: string) => {
  const data = new Date(dataString);
  return format(data, 'HH:mm', { locale: ptBR });
};

// Componente para o código de verificação
const VerificationCode = ({
  code,
  type,
}: {
  code: string;
  type: 'pickup' | 'delivery';
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-primary/5 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-sm">
          {type === 'pickup' ? 'Código de Coleta' : 'Código de Entrega'}
        </h3>
        <Badge variant="outline" className="bg-primary/10">
          {type === 'pickup' ? 'Origem' : 'Destino'}
        </Badge>
      </div>
      <div className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-100">
        <div className="font-mono text-lg font-bold tracking-wider">{code}</div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={copyToClipboard}
        >
          {copied ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {type === 'pickup'
          ? 'Forneça este código ao transportador no momento da coleta do animal.'
          : 'O transportador fornecerá este código no momento da entrega do animal.'}
      </p>
    </div>
  );
};

export default function DetalhesPedido() {
  const { id } = useParams();

  console.log('ID do pedido:', id);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');
  const [currentLocation, setCurrentLocation] = useState({
    lat: -23.65,
    lng: -46.0,
  });
  const [eta, setEta] = useState('45 min');
  const [distance, setDistance] = useState('120 km');

  const [currentStatus, setCurrentStatus] = useState('in_transit');
  const [progress, setProgress] = useState(60);

  const { data: pedido } = useQuery({
    queryKey: ['pedido', id],
    queryFn: async () => getOrderById(id as string),
    enabled: !!id,
  });

  // Simular atualizações de localização em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular movimento do transportador
      setCurrentLocation((prev) => ({
        lat: prev.lat + 0.005,
        lng: prev.lng + 0.01,
      }));

      // Atualizar ETA e distância
      setEta((prev) => {
        const minutes = Number.parseInt(prev.split(' ')[0]);
        return minutes > 1 ? `${minutes - 1} min` : 'Chegando';
      });

      setDistance((prev) => {
        const km = Number.parseInt(prev.split(' ')[0]);
        return km > 5 ? `${km - 2} km` : `${km} km`;
      });

      // Atualizar progresso
      setProgress((prev) => (prev < 95 ? prev + 0.5 : prev));
    }, 3000);

    return () => clearInterval(interval);
  }, [distance, currentLocation]);

  // Determinar o status atual para exibição
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-blue-500 text-white font-normal flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Pagamento Confirmado
          </Badge>
        );
      case 'pickup_ready':
        return (
          <Badge className="bg-amber-500 text-white font-normal flex items-center gap-1">
            <Clock className="h-3 w-3" /> Coleta Agendada
          </Badge>
        );
      case 'in_transit':
        return (
          <Badge className="bg-purple-500 text-white font-normal flex items-center gap-1">
            <Truck className="h-3 w-3" /> Em Transporte
          </Badge>
        );
      case 'delivered':
        return (
          <Badge className="bg-green-500 text-white font-normal flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Entregue
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleConfirmDelivery = () => {
    if (confirmCode === pedido?.deliveryCode) {
      // Em um caso real, faríamos uma chamada à API para confirmar a entrega
      setCurrentStatus('delivered');

      setProgress(100);
      setConfirmDialogOpen(false);
    } else {
      alert('Código incorreto. Por favor, verifique e tente novamente.');
    }
  };

  if (!pedido) {
    return <div className="flex items-center justify-center h-full"></div>;
  }

  return (
    <div className="px-4 py-6 bg-green-50 rounded-l-2xl rounded-r-lg overflow-y-auto max-h-full">
      <div className="flex items-center mb-6">
        <Link to="/orders">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Rastreamento do Pedido</h1>
      </div>

      <div className="mb-6 relative">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Mapa (simulado) */}
          <div className="h-[300px] md:h-[400px] bg-gray-200 relative">
            {/* Em um caso real, aqui seria um mapa interativo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Truck className="h-12 w-12 text-primary mx-auto mb-2 animate-pulse" />
                <p className="text-lg font-medium">Transportador em trânsito</p>
                <p className="text-muted-foreground">
                  Rastreando em tempo real...
                </p>
              </div>
            </div>

            {/* Overlay com informações de ETA */}
            <div className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-primary/10">
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
                    <p className="font-medium">
                      {pedido.proposal.transportador.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {pedido.proposal.transportador.vehicleType} •{' '}
                      {pedido.proposal.transportador.vehiclePlate}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold">{eta}</p>
                  <p className="text-xs text-muted-foreground">
                    Tempo estimado
                  </p>
                </div>
              </div>

              {/* Barra de progresso estilo iFood */}
              <div className="mt-3 relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>São Paulo</span>
                <span>{distance} restantes</span>
                <span>Rio de Janeiro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de ação rápida */}
        <div className="flex gap-2 mt-4 justify-center">
          <Button variant="outline" className="flex-1 md:flex-none">
            <Phone className="h-4 w-4 mr-2" />
            Ligar
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none">
            <MessageCircle className="h-4 w-4 mr-2" />
            Mensagem
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    Pedido #{pedido.id.substring(0, 8)}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Criado em {formatarData(pedido.createdAt)} às{' '}
                    {formatarHora(pedido.createdAt)}
                  </p>
                </div>
                {getStatusBadge(currentStatus)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <VerificationCode code={pedido.pickupCode} type="pickup" />
                <VerificationCode code={pedido.deliveryCode} type="delivery" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h3 className="font-semibold mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                Detalhes do Pagamento
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Valor do serviço
                  </span>
                  <span className="font-medium">
                    R$ {Number.parseFloat(pedido.proposal.price).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {pedido.status === 'paid'
                      ? 'Pagamento Confirmado'
                      : 'Aguardando Pagamento'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral - Detalhes e ações */}
        <div className="space-y-6">
          {/* Informações de origem e destino */}
          <Card>
            <CardContent>
              <h3 className="font-semibold mb-4">Detalhes da Viagem</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Origem</p>
                    <p className="font-medium">São Paulo, SP</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Coleta: 12 de maio de 2025 às 09:00
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="h-10 w-0.5 bg-dashed bg-gray-300"></div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Destino</p>
                    <p className="font-medium">Rio de Janeiro, RJ</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Entrega prevista: 12 de maio de 2025 às 16:00
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Distância total
                    </p>
                    <p className="font-medium">430 km</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tempo estimado
                    </p>
                    <p className="font-medium">7 horas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do transportador */}
          <Card>
            <CardContent>
              <h3 className="font-semibold mb-4">Transportador</h3>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16 border-2 border-primary/10">
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
                  <p className="font-medium">
                    {pedido.proposal.transportador.name}
                  </p>
                  <div className="flex items-center text-amber-500 mt-1">
                    <span className="text-xs text-muted-foreground">
                      Transportador verificado
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Veículo</p>
                    <p className="font-medium capitalize">
                      {pedido.proposal.transportador.vehicleType} •{' '}
                      {pedido.proposal.transportador.vehiclePlate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Documentação
                    </p>
                    <p className="font-medium text-green-600">Verificada</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações do pedido */}
          <Card>
            <CardContent>
              <h3 className="font-semibold mb-4">Ações</h3>

              {currentStatus === 'in_transit' && (
                <Button
                  className="w-full mb-3 bg-primary"
                  onClick={() => setConfirmDialogOpen(true)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar Recebimento
                </Button>
              )}

              <Button variant="outline" className="w-full mb-3">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Reportar Problema
              </Button>

              <Button variant="ghost" className="w-full text-muted-foreground">
                <Info className="h-4 w-4 mr-2" />
                Ajuda e Suporte
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Recebimento</DialogTitle>
            <DialogDescription>
              Digite o código de entrega fornecido pelo transportador para
              confirmar o recebimento do seu animal.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              placeholder="Digite o código de entrega"
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
              className="font-mono text-center text-lg"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelivery}>
              Confirmar Recebimento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
