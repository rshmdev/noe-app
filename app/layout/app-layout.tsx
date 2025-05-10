'use client';

import { useState, useEffect } from 'react';

import { useLocation } from 'react-router';
import { DesktopSidebar } from '~/components/desktop-sidebar';
import { MobileNavigation } from '~/components/mobile-nav';
import useAuth from '~/hooks/use-auth';
import { useGlobalSocket } from '~/hooks/use-global-socket';
import { cn } from '~/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = useLocation().pathname;
  const isAuthRoute = pathname.startsWith('/auth');
  useGlobalSocket(undefined);

  // Detectar se é mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  if (isAuthRoute) {
    return (
      <main className='"flex h-screen overflow-y-auto bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700'>
        {children}
      </main>
    );
  }

  return (
    <div className="flex h-screen overflow-y-auto bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700">
      <DesktopSidebar userType={user?.role || 'NORMAL'} pathname={pathname} />

      <div className="flex flex-col flex-1 w-full overflow-y-auto">
        <main className={cn('flex-1 overflow-y-auto pb-32 md:pb-4 px-4 pt-4')}>
          {children}
        </main>

        {isMobile && (
          <MobileNavigation
            userType={user?.role || 'NORMAL'}
            pathname={pathname}
          />
        )}
      </div>
    </div>
  );
}
