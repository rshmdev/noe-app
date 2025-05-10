'use client';

import type React from 'react';

import { Home, Map, MessageCircle, Package, Truck, User } from 'lucide-react';
import type { UserType } from '~/lib/types';
import { Link } from 'react-router';
import { cn } from '~/lib/utils';

interface MobileNavigationProps {
  userType: UserType;
  pathname: string;
}

export function MobileNavigation({
  userType,
  pathname,
}: MobileNavigationProps) {
  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      {/* Barra de navegação com design elegante */}
      <div className="relative flex items-center justify-between px-4 py-3 bg-card backdrop-blur-md rounded-full shadow-lg border">
        {userType === 'NORMAL' ? (
          // Navegação para usuário normal
          <>
            <NavItem
              href="/"
              icon={<Home className="h-5 w-5" />}
              label="Home"
              isActive={isActive('/')}
            />
            <NavItem
              href="/orders"
              icon={<Package className="h-5 w-5" />}
              label="Pedidos"
              isActive={isActive('/pedidos')}
            />

            {/* Botão central com logo */}
            <div className="relative flex items-center justify-center px-6">
              <Link
                to="/"
                className="absolute -top-8 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 shadow-lg border-4 border-white dark:border-emerald-950"
              >
                <img
                  src="/Logo-noe.png"
                  alt="Noé Logo"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </Link>
            </div>

            <NavItem
              href="/chat"
              icon={<MessageCircle className="h-5 w-5" />}
              label="Chat"
              isActive={isActive('/chat')}
            />
            <NavItem
              href="/profile"
              icon={<User className="h-5 w-5" />}
              label="Perfil"
              isActive={isActive('/perfil')}
            />
          </>
        ) : (
          // Navegação para transportador
          <>
            <NavItem
              href="/my-routes"
              icon={<Truck className="h-5 w-5" />}
              label="Rotas"
              isActive={isActive('/transporter/routes')}
            />
            <NavItem
              href="/new-route"
              icon={<Map className="h-5 w-5" />}
              label="Nova"
              isActive={isActive('/new-route')}
            />

            {/* Botão central com logo */}
            <div className="relative flex items-center justify-center">
              <Link
                to="/my-routes"
                className="absolute -top-8 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 shadow-lg border-4 border-white dark:border-emerald-950"
              >
                <img
                  src="/Logo-noe.png"
                  alt="Noé Logo"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </Link>
            </div>

            <NavItem
              href="/chat"
              icon={<MessageCircle className="h-5 w-5" />}
              label="Chat"
              isActive={isActive('/chat')}
            />
            <NavItem
              href="/profile"
              icon={<User className="h-5 w-5" />}
              label="Perfil"
              isActive={isActive('/perfil')}
            />
          </>
        )}
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        'flex flex-col items-center justify-center py-1 px-2 text-[10px] transition-colors rounded-full',
        isActive
          ? 'text-emerald-700 dark:text-emerald-300'
          : 'text-emerald-700/70 dark:text-emerald-400/70 hover:text-emerald-800 dark:hover:text-emerald-200',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-full mb-1',
          isActive
            ? 'bg-emerald-100/80 dark:bg-emerald-800/30'
            : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
        )}
      >
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
}
