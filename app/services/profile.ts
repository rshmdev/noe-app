import api from '~/lib/api';

export async function getProfile() {
  const response = await api.get('/profile');
  if (response.status !== 200) {
    throw new Error('Failed to fetch profile');
  }
  return response.data;
}
