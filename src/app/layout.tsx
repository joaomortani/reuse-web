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
  const user = await getCurrentUser();

  return (
    <html lang="pt-BR">
      <body className={`${inter.variable}`}>
        <AuthProvider initialUser={user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
