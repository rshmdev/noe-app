import { type MetaArgs } from 'react-router';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { getRoutes } from '~/services/route';
import { RouteCard } from '~/components/route-card';
import useAuth from '~/hooks/use-auth';
import ProtectedRoute from '~/components/protected-route';

export function meta({}: MetaArgs) {
  return [
    { title: 'Noé - Feed' },
    {
      name: 'description',
      content:
        'Encontre rotas disponíveis para transporte de animais de estimação com segurança e conforto.',
    },
  ];
}

export default function Dashboard() {
  const [filtro, setFiltro] = useState({
    origem: '',
    destino: '',
    data: '',
    especie: '',
  });

  const { data } = useQuery({
    queryKey: ['rotas'],
    queryFn: () => getRoutes(),
  });

  const { data: filtredData } = useQuery({
    queryKey: ['rotas', filtro],
    queryFn: () => getRoutes(filtro),
  });

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltro({
      ...filtro,
      [campo]: valor,
    });
  };

  return (
    <ProtectedRoute allowedRoles={['NORMAL']}>
      <main className="container mx-auto py-6 px-4">
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="flex items-center justify-start flex-wrap h-auto space-y-1">
            <TabsTrigger value="feed">Feed de Rotas</TabsTrigger>
            <TabsTrigger value="busca">Buscar Rotas</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Rotas Disponíveis
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.map((rota) => (
                <RouteCard key={rota.id} rota={rota} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="busca" className="mt-0">
            <div className="rounded-lg p-6 mb-6 bg-card">
              <h2 className="text-xl font-bold mb-4">Buscar Rotas</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label className=" text-sm">Origem</label>
                  <Input
                    placeholder="De onde?"
                    value={filtro.origem}
                    onChange={(e) =>
                      handleFiltroChange('origem', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className=" text-sm">Destino</label>
                  <Input
                    placeholder="Para onde?"
                    value={filtro.destino}
                    onChange={(e) =>
                      handleFiltroChange('destino', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className=" text-sm">Data</label>
                  <Input
                    type="date"
                    value={filtro.data}
                    onChange={(e) => handleFiltroChange('data', e.target.value)}
                  />
                </div>

                <div className="space-y-2 w-full">
                  <label className=" text-sm">Espécie do animal</label>
                  <Select
                    value={filtro.especie}
                    onValueChange={(value) =>
                      handleFiltroChange('especie', value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cachorro">Cachorro</SelectItem>
                      <SelectItem value="gato">Gato</SelectItem>
                      <SelectItem value="ave">Ave</SelectItem>
                      <SelectItem value="roedor">Roedor</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Buscar Rotas
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtredData?.map((rota) => (
                <RouteCard key={rota.id} rota={rota} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </ProtectedRoute>
  );
}
