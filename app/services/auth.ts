import api from '~/lib/api';
import type { Root } from '~/types/auth';

export interface FormDataRegister {
  email: string;
  password: string;
  name: string;
  cpf?: string;
  cnpj?: string;
  cnh?: string;
  role?: string;
  vehicleInfo?: string;
}

export async function register(data: FormDataRegister) {
  const res = await api.post('/auth/register', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (res.status !== 201) {
    throw new Error('Error registering user');
  }
  return res.data as Root;
}

interface CompleteRegistrationPayload {
  data: FormData;
}

export async function completeRegistration({
  data,
}: CompleteRegistrationPayload) {
  const res = await api.post('/auth/complete-registration', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}

interface LoginPayload {
  email: string;
  password: string;
}

export async function login(data: LoginPayload) {
  const res = await api.post('/auth/login', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (res.status !== 201) {
    throw new Error('Error logging in user');
  }

  return res.data;
}
