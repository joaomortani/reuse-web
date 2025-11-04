import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { ACCESS_TOKEN_COOKIE } from '@/lib/auth.server';

// Rotas que requerem autenticação
const protectedRoutes = ['/dashboard'];

// Rotas que não devem ser acessadas quando autenticado
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  // Verificar se a rota é protegida
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  
  // Verificar se a rota é de autenticação
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Se tentar acessar rota protegida sem token, redirecionar para login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se estiver autenticado e tentar acessar login/signup, redirecionar para dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configurar quais rotas o middleware deve executar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

