'use client';

import type React from 'react';

import { Home, Map, MessageCircle, Package, Truck, User } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '~/lib/utils';
import type { UserType } from '~/lib/types';

interface DesktopSidebarProps {
  userType: UserType;
  pathname: string;
}

export function DesktopSidebar({ userType, pathname }: DesktopSidebarProps) {
  const isActive = (path: string) => pathname === path;

  return (
    <div className="hidden m-4 rounded-3xl shadow-2xl md:flex md:flex-col md:w-64 md:bg-card backdrop-blur-sm">
      <div className="flex items-center justify-center h-16 border-b border-emerald-900/50">
        <img
          src="/Logo-noe.png"
          alt="Logo"
          className="w-14 h-14 rounded-full"
        />

        <h1 className="ml-2 text-2xl font-bold text-primary">NOE</h1>
      </div>

      <div className="flex flex-col flex-1 py-6 space-y-1 px-3">
        {userType === 'NORMAL' ? (
          <>
            <SidebarItem
              href="/"
              icon={<Home className="h-5 w-5" />}
              label="Home"
              isActive={isActive('/')}
            />
            <SidebarItem
              href="/orders"
              icon={<Package className="h-5 w-5" />}
              label="Meus Pedidos"
              isActive={isActive('/pedidos')}
            />
            <SidebarItem
              href="/chat"
              icon={<MessageCircle className="h-5 w-5" />}
              label="Mensagens"
              isActive={isActive('/chat')}
            />
          </>
        ) : (
          // Navegação para transportador
          <>
            <SidebarItem
              href="/my-routes"
              icon={<Truck className="h-5 w-5" />}
              label="Minhas Rotas"
              isActive={isActive('/transportador/rotas')}
            />
            <SidebarItem
              href="/new-route"
              icon={<Map className="h-5 w-5" />}
              label="Cadastrar Rota"
              isActive={isActive('/transportador/cadastro-rota')}
            />
            <SidebarItem
              href="/chat"
              icon={<MessageCircle className="h-5 w-5" />}
              label="Mensagens"
              isActive={isActive('/chat')}
            />
          </>
        )}
      </div>

      <div className="px-3 py-4 border-t  border-emerald-900/50">
        <SidebarItem
          href="/profile"
          icon={<User className="h-5 w-5" />}
          label="Meu Perfil"
          isActive={isActive('/perfil')}
        />
      </div>
    </div>
  );
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function SidebarItem({ href, icon, label, isActive }: SidebarItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
    </Link>
  );
}
