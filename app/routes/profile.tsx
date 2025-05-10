'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  User,
  MapPin,
  Truck,
  Star,
  FileText,
  Edit,
  LogOut,
  Shield,
  Route,
  PawPrint,
  Calendar,
  CheckCircle,
  XCircle,
  Mail,
  CreditCard,
  Clock,
} from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Progress } from '~/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '~/services/profile';

const formatarData = (dataString: string) => {
  const data = new Date(dataString);
  return format(data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default function PerfilUsuario() {
  const [activeTab, setActiveTab] = useState('info');

  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => getProfile(),
  });

  const isTransporter = data?.role === 'TRANSPORTER';

  const mediaAvaliacoes =
    data?.reviews.length > 0
      ? data?.reviews.reduce((acc, review) => acc + review.rating, 0) /
        data?.reviews.length
      : 0;

  // Contagem de avaliações por estrela
  const avaliacoesPorEstrela =
    data?.reviews.length > 0
      ? [1, 2, 3, 4, 5].map(
          (stars) =>
            data?.reviews!.filter((review) => review.rating === stars).length,
        )
      : [0, 0, 0, 0, 0];

  return (
    <div className="mx-auto px-4 py-6 bg-card rounded-3xl shadow-2xl border ">
      {/* Cabeçalho do perfil - responsivo para desktop e mobile */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex flex-col items-center md:flex-row md:items-center md:gap-6">
            <Avatar className="h-24 w-24 mb-4 md:mb-0 border-4 border-white shadow-md">
              <AvatarImage
                src={data?.selfieUrl || '/placeholder.svg?height=150&width=150'}
                alt={data?.name}
              />
              <AvatarFallback>
                {data?.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{data?.name}</h1>

              <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                <Badge
                  className={`${
                    isTransporter ? 'bg-primary' : 'bg-blue-500'
                  } text-white`}
                >
                  {isTransporter ? 'Transportador' : 'Usuário'}
                </Badge>

                {data?.isVerified ? (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" /> Verificado
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
                  >
                    <XCircle className="h-3 w-3" /> Não verificado
                  </Badge>
                )}
              </div>

              {isTransporter && (
                <div className="flex items-center mt-2 text-amber-500 justify-center md:justify-start">
                  <span className="font-bold mr-1">
                    {mediaAvaliacoes.toFixed(1)}
                  </span>
                  <RatingStars rating={Math.round(mediaAvaliacoes)} />
                  <span className="text-gray-500 text-sm ml-1">
                    ({data?.reviews?.length || 0} avaliações)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Estatísticas rápidas para desktop */}
          {isTransporter && (
            <div className="hidden md:flex ml-auto gap-6">
              <div className="text-center">
                <div className="bg-primary/10 p-3 rounded-full inline-flex">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <p className="font-bold text-xl mt-1">{data?.totalTrips}</p>
                <p className="text-xs text-muted-foreground">Viagens</p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 p-3 rounded-full inline-flex">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <p className="font-bold text-xl mt-1">{data?.totalKm}</p>
                <p className="text-xs text-muted-foreground">Km</p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 p-3 rounded-full inline-flex">
                  <PawPrint className="h-6 w-6 text-primary" />
                </div>
                <p className="font-bold text-xl mt-1">
                  {data?.animalsTransported}
                </p>
                <p className="text-xs text-muted-foreground">Animais</p>
              </div>
            </div>
          )}

          {/* Botões de ação para desktop */}
          <div className="hidden md:flex md:ml-6 gap-2">
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs para navegação - responsivo */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex items-center justify-start flex-wrap h-auto w-full">
          <TabsTrigger value="info">Informações</TabsTrigger>
          {isTransporter && (
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          )}
          {isTransporter && (
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          )}
          {!isTransporter && <TabsTrigger value="pets">Meus Pets</TabsTrigger>}
          {!isTransporter && <TabsTrigger value="trips">Viagens</TabsTrigger>}
        </TabsList>

        {/* Tab de Informações - layout responsivo */}
        <TabsContent value="info" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{data?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {data?.cpf ? 'CPF' : 'CNPJ'}
                    </p>
                    <p className="font-medium">{data?.cpf || data?.cnpj}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Membro desde
                    </p>
                    <p className="font-medium">
                      {/* {formatarData(
                        new Date(data?.createdAt).toISOString() || '',
                      )} */}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isTransporter && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-primary" />
                    Informações do Veículo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tipo de Veículo
                      </p>
                      <p className="font-medium">{data?.vehicleType}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Placa</p>
                      <p className="font-medium">{data?.vehiclePlate}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Descrição</p>
                    <p className="font-medium">{data?.vehicleInfo}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">CNH</p>
                    <p className="font-medium">{data?.cnh}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botões de ação para mobile */}
            <div className="flex gap-2 mt-2 md:hidden">
              <Button className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
              <Button variant="outline" className="flex-1">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Tab de Estatísticas - layout responsivo */}
        {isTransporter && (
          <TabsContent value="stats" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Route className="h-5 w-5 mr-2 text-primary" />
                    Estatísticas de Viagens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Estatísticas para mobile */}
                  <div className="grid grid-cols-3 gap-4 text-center md:hidden">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Truck className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="font-bold text-xl">{data?.totalTrips}</p>
                      <p className="text-xs text-muted-foreground">Viagens</p>
                    </div>

                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MapPin className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="font-bold text-xl">{data?.totalKm}</p>
                      <p className="text-xs text-muted-foreground">Km</p>
                    </div>

                    <div className="bg-primary/10 p-3 rounded-lg">
                      <PawPrint className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="font-bold text-xl">
                        {data?.animalsTransported}
                      </p>
                      <p className="text-xs text-muted-foreground">Animais</p>
                    </div>
                  </div>

                  {/* Estatísticas detalhadas para desktop */}
                  <div className="hidden md:block space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">Total de Viagens</p>
                          <p className="font-bold">{data?.totalTrips}</p>
                        </div>
                        <Progress value={70} className="h-2 mt-1" />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">Quilômetros Percorridos</p>
                          <p className="font-bold">{data?.totalKm} km</p>
                        </div>
                        <Progress value={60} className="h-2 mt-1" />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <PawPrint className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">Animais Transportados</p>
                          <p className="font-bold">
                            {data?.animalsTransported}
                          </p>
                        </div>
                        <Progress value={80} className="h-2 mt-1" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium">
                        Nível de Experiência
                      </p>
                      <Badge variant="outline" className="bg-primary/10">
                        Intermediário
                      </Badge>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Documentação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="font-medium">CNH</p>
                        <p className="text-xs text-muted-foreground">
                          Carteira Nacional de Habilitação
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      Verificado
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Documento do Veículo</p>
                        <p className="text-xs text-muted-foreground">CRLV</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      Verificado
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Documento Pessoal</p>
                        <p className="text-xs text-muted-foreground">RG/CPF</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      Verificado
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Tab de Avaliações - layout responsivo */}
        {isTransporter && (
          <TabsContent value="reviews" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Star className="h-5 w-5 mr-2 text-primary" />
                    Resumo das Avaliações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-amber-500">
                        {mediaAvaliacoes.toFixed(1)}
                      </p>
                      <RatingStars rating={Math.round(mediaAvaliacoes)} />
                      <p className="text-xs text-muted-foreground mt-1">
                        {data?.reviews?.length || 0} avaliações
                      </p>
                    </div>

                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((stars, index) => (
                        <div key={stars} className="flex items-center gap-2">
                          <div className="text-xs w-2">{stars}</div>
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          <Progress
                            value={
                              data?.reviews?.length
                                ? (avaliacoesPorEstrela[5 - stars] /
                                    data?.reviews.length) *
                                  100
                                : 0
                            }
                            className="h-2 flex-1"
                          />
                          <div className="text-xs w-5">
                            {avaliacoesPorEstrela[5 - stars]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="md:row-span-2">
                <h3 className="font-medium text-lg mb-3">
                  Comentários dos Clientes
                </h3>

                <div className="space-y-3 md:h-[calc(100%-2rem)] md:overflow-auto md:pr-2">
                  {data?.reviews?.map((review) => (
                    <Card key={review.id} className="overflow-hidden">
                      <div className="border-l-4 border-primary h-full"></div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{review.authorName}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatarData(review.createdAt)}
                            </p>
                          </div>
                          <RatingStars rating={review.rating} />
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Botão para responder avaliações - apenas desktop */}
              <div className="hidden md:block">
                <Button className="w-full">
                  <Star className="h-4 w-4 mr-2" />
                  Responder Avaliações
                </Button>
              </div>
            </div>
          </TabsContent>
        )}

        {/* Tab de Pets - layout responsivo */}
        {!isTransporter && (
          <TabsContent value="pets" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-8 text-center">
                  <PawPrint className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    Nenhum pet cadastrado
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Você ainda não cadastrou nenhum animal de estimação.
                  </p>
                  <Button>
                    <PawPrint className="h-4 w-4 mr-2" />
                    Adicionar Pet
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Tab de Viagens - layout responsivo */}
        {!isTransporter && (
          <TabsContent value="trips" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    Nenhuma viagem encontrada
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Você ainda não realizou nenhuma viagem.
                  </p>
                  <Button>
                    <MapPin className="h-4 w-4 mr-2" />
                    Buscar Transportadores
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
