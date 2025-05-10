import type { Root } from '~/types/route';
import { Card, CardContent, CardFooter } from '~/components/ui/card';
import { Calendar, MapPin, PawPrintIcon, Ruler } from 'lucide-react';
import { Badge } from './ui/badge';
import { Link, useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export function RouteCard({ rota }: { rota: Root }) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden flex flex-col gap-3 border-2 py-4 border-green-50 hover:border-green-100 transition-all duration-200 shadow-sm hover:shadow-md">
      <CardContent className="p-0">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-700 flex-shrink-0" />
              <span className="font-medium text-green-900 text-sm md:text-base">
                {rota.origin} → {rota.destination}
              </span>
            </div>
            <Badge className=" ml-2 flex-shrink-0">
              {rota.availableSlots}{' '}
              {rota.availableSlots === 1 ? 'vaga' : 'vagas'}
            </Badge>
          </div>
        </div>

        <div className="h-px bg-emerald-900/20 mx-3"></div>

        <div className="p-3 space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-700 flex-shrink-0" />
            <span className="text-xs md:text-sm text-gray-700">
              {new Date(rota.originDate).toLocaleString('pt-BR')} -
              {new Date(rota.destinationDate).toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="flex gap-3 bg-green-50/50 shadow p-2 rounded-lg">
            <div className="flex items-start gap-1 flex-1">
              <Ruler className="h-4 w-4 text-green-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Porte</p>
                <p className="text-xs font-medium text-gray-800">
                  {rota.animalSizeAccepted}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-1 flex-1">
              <PawPrintIcon className="h-4 w-4 text-green-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Espécie</p>
                <p className="text-xs font-medium text-gray-800">
                  {rota.speciesAccepted}
                </p>
              </div>
            </div>
          </div>

          <Link
            to={`/perfil/${1}`}
            className="flex items-center gap-2 bg-green-50/50 shadow p-1.5 rounded-lg transition-colors"
          >
            <Avatar className="h-8 w-8 border border-green-100 flex-shrink-0">
              <AvatarImage src={'/placeholder.svg?height=32&width=32'} />
              <AvatarFallback className="bg-green-100 text-green-800 text-xs">
                {rota?.transportador?.name}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-800">
                {rota?.transportador?.name}
              </p>
              <div className="flex items-center">
                <span className="text-yellow-500 text-xs">★</span>
                <span className="text-xs ml-0.5 font-medium">5.0</span>
              </div>
            </div>
          </Link>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button
          onClick={() =>
            navigate(
              `/chat?transportador=${rota.transportador?.id}&route=${rota.id}`,
            )
          }
          className="w-full text-sm py-1.5"
        >
          Contatar Transportador
        </Button>
      </CardFooter>
    </Card>
  );
}
