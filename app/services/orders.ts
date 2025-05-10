import api from '~/lib/api';
import type { Order } from '~/types/order';

export async function getOrders() {
  const res = await api.get('/payments');

  if (res.status !== 200) {
    throw new Error('Error fetching orders');
  }

  return res.data as Order[];
}

export async function getOrderById(id: string) {
  const res = await api.get(`/payments/${id}`);

  if (res.status !== 200) {
    throw new Error('Error fetching order');
  }

  return res.data as Order;
}
