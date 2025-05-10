import api from '~/lib/api';
import type { Root } from '~/types/route';

export async function getRoutes(filtro?: {
  origem?: string;
  destino?: string;
  data?: string;
  especie?: string;
  porte?: string;
}) {
  const params = new URLSearchParams();

  if (filtro?.origem) params.append('origin', filtro.origem);
  if (filtro?.destino) params.append('destination', filtro.destino);
  if (filtro?.data) params.append('date', filtro.data);
  if (filtro?.especie) params.append('species', filtro.especie);
  if (filtro?.porte) params.append('size', filtro.porte);

  const res = await api.get(`/routes?${params.toString()}`);

  if (res.status !== 200) {
    throw new Error('Erro ao buscar rotas');
  }

  return res.data as Root[];
}

export async function getRouteById(id: string) {
  const res = await api.get(`/routes/${id}`);
  if (res.status !== 200) {
    throw new Error('Error fetching route');
  }

  return res.data as Root;
}


export async function myRoutes() {
  const res = await api.get('/routes/mine');

  if (res.status !== 200) {
    throw new Error('Error fetching my routes');
  }

  return res.data as Root[];
}

export async function createRoute(data: any) {
  const res = await api.post('/routes', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (res.status !== 201) {
    throw new Error('Error creating route');
  }

  return res.data as Root;
}

export async function updateRoute(id: string, data: any) {
  const res = await api.put(`/routes/${id}`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (res.status !== 201) {
    throw new Error('Error updating route');
  }

  return res.data as Root;
}
