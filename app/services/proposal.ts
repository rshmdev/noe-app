import api from '~/lib/api';

export async function createProposal(data: {
  price: number;
  routeId: string;
  userId: string;
  message: string;
  chatId: string;
}) {
  const res = await api.post('/proposals', data);

  if (res.status !== 201) {
    throw new Error('Error creating proposal');
  }

  return res.data;
}

export async function acceptProposal(proposalId: string) {
  const res = await api.post(`/proposals/${proposalId}/accept`);

  if (res.status !== 201) {
    throw new Error('Error accepting proposal');
  }

  return res.data;
}

export async function rejectProposal(proposalId: string) {
  const res = await api.post(`/proposals/${proposalId}/reject`);

  if (res.status !== 201) {
    throw new Error('Error rejecting proposal');
  }

  return res.data;
}
