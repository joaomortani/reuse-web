'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/modules/auth/auth-context';

export const DashboardHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="dashboard-header">
      <div className="dashboard-header__content">
        <div>
          <h1>Olá, {user?.name ?? 'usuário'}</h1>
          <p>Gerencie seus itens, acompanhe trocas e mantenha seu perfil atualizado.</p>
        </div>
        <div className="dashboard-header__actions">
          <Link href="/dashboard/profile" className="dashboard-profile">
            <span className="dashboard-profile__avatar" aria-hidden>
              {user?.name?.slice(0, 1).toUpperCase() ?? 'U'}
            </span>
            <div>
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
          </Link>
          <Button variant="ghost" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};
