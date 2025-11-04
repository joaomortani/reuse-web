import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { getCurrentUser } from '@/lib/auth.server';
import { AuthProvider } from '@/modules/auth/auth-context';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ReUse',
  description: 'Plataforma de trocas e doações conscientes',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Buscar usuário de forma segura, sem lançar erros
  // Se houver qualquer problema (rede, autenticação, etc), apenas retornar null
  let user = null;
  try {
    user = await getCurrentUser();
  } catch {
    // Ignorar silenciosamente - getCurrentUser já trata todos os erros
    // mas garantimos que nenhum erro seja propagado
    user = null;
  }

  return (
    <html lang="pt-BR">
      <body className={`${inter.variable}`}>
        <AuthProvider initialUser={user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
