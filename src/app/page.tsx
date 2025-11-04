import { redirect } from 'next/navigation';

import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { getCurrentUser } from '@/lib/auth.server';
import PublicHomePage from './(public)/page';

export default async function Home() {
  // Verificar se o usuário está autenticado
  let user = null;
  try {
    user = await getCurrentUser();
  } catch {
    // Se houver erro, considerar como não autenticado
    user = null;
  }

  // Se estiver logado, redirecionar para o dashboard (página de explorar autenticada)
  if (user) {
    redirect('/dashboard');
  }

  // Se não estiver logado, mostrar a página de explorar público com layout público
  return (
    <div className="public-layout">
      <PublicHeader />
      <main>
        <PublicHomePage />
      </main>
      <PublicFooter />
    </div>
  );
}
