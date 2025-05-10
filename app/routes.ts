import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),

  route('auth/login', 'routes/login.tsx'),

  route('auth/register', 'routes/register.tsx'),

  route('new-route', 'routes/new-route.tsx'),

  route('route-details/:id', 'routes/route-details.tsx'),

  route('chat', 'routes/chat.tsx'),

  route('my-routes', 'routes/transporter-routes.tsx'),

  route('profile', 'routes/profile.tsx'),

  route('payment-canceled', 'routes/payment-canceled.tsx'),

  route('payment-success', 'routes/payment-success.tsx'),

  route('orders', 'routes/orders.tsx'),

  route('order-details/:id', 'routes/order-details.tsx'),
] satisfies RouteConfig;
