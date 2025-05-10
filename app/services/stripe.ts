import { loadStripe } from '@stripe/stripe-js';
import api from '~/lib/api';

const stripePromise = loadStripe(
  'pk_test_51OoEkyLZpQHeI3zgsDWjC1bbKTRilqS5xMGK7e1vQ7qkmD1LYLIziEpx9wEUnzDAEJOmPPo2egl0fioQFE2aM6b700UPeig3s1',
);

async function createPayment(proposalId: string) {
  const response = await api.post('/payments/create', { proposalId });
  return response.data;
}

export function handlePayment(proposalId: string) {
  createPayment(proposalId)
    .then(async (data) => {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe não foi carregado');

      // Redireciona para o Checkout do Stripe
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        console.error('Erro ao redirecionar para o Stripe:', error.message);
      }
    })
    .catch((err) => console.error('Erro ao criar pagamento:', err));
}
