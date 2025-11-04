'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/modules/auth/auth-context';

export const PublicHeader = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  return (
    <header className="public-header">
      <div className="container public-header__content">
        <Link href="/" className="public-header__brand" aria-label="ReUse">
          <span className="public-header__logo" aria-hidden>
            ♻
          </span>
          <span className="public-header__title">ReUse</span>
        </Link>
        <nav className="public-header__nav">
          <Link href="#proposito" className="public-header__link">
            Propósito
          </Link>
          <Link href="#destaques" className="public-header__link">
            Itens
          </Link>
          <Link href="#como-funciona" className="public-header__link">
            Como funciona
          </Link>
        </nav>
        <div className="public-header__actions">
          {user ? (
            <Button asChild variant="secondary">
              <Link href="/dashboard">Acessar plataforma</Link>
            </Button>
          ) : isAuthPage ? null : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Criar conta</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
