'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Visão geral' },
  { href: '/dashboard/items', label: 'Meus itens' },
  { href: '/dashboard/items/new', label: 'Cadastrar item' },
  { href: '/dashboard/trades', label: 'Trocas' },
  { href: '/dashboard/profile', label: 'Meu perfil' },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar__brand">
        <span aria-hidden>♻</span>
        <strong>ReUse</strong>
      </div>
      <nav className="dashboard-sidebar__nav">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href} className={isActive ? 'dashboard-link dashboard-link--active' : 'dashboard-link'}>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
