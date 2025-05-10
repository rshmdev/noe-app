'use client';

import { Navigate } from 'react-router';
import useAuth from '~/hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('NORMAL' | 'TRANSPORTER')[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Pode mostrar um spinner, skeleton, ou só retornar null
    return null;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'NORMAL') return <Navigate to="/" replace />;
    if (user.role === 'TRANSPORTER')
      return <Navigate to="/my-routes" replace />;
  }

  return <>{children}</>;
}
