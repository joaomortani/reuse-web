import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { getCurrentUser } from '@/lib/auth.server';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Buscar usuário de forma segura
  let user = null;
  try {
    user = await getCurrentUser();
  } catch {
    // Ignorar silenciosamente - getCurrentUser já trata todos os erros
    user = null;
  }

  if (!user) {
    redirect('/login');
  }

  return <DashboardShell>{children}</DashboardShell>;
}
