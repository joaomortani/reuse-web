'use client';

import Link from 'next/link';

import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useMyItems } from '@/modules/items/hooks/useMyItems';

export default function DashboardHome() {
  const { items, loading, error } = useMyItems();

  return (
    <div className="dashboard-grid">
      <Card className="dashboard-highlight">
        <div>
          <span className="dashboard-highlight__label">Itens cadastrados</span>
          <strong className="dashboard-highlight__value">{items.length}</strong>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/items/new">Cadastrar novo item</Link>
        </Button>
      </Card>

      <Card className="dashboard-highlight">
        <div>
          <span className="dashboard-highlight__label">Trocas</span>
          <strong className="dashboard-highlight__value">Em breve</strong>
        </div>
        <Badge variant="warning">Funcionalidade em desenvolvimento</Badge>
      </Card>

      <Card className="dashboard-card-wide">
        <header className="dashboard-card__header">
          <div>
            <h2>Meus itens</h2>
            <p>Gerencie seus itens publicados e acompanhe o status.</p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/dashboard/items">Ver todos</Link>
          </Button>
        </header>
        {loading ? (
          <div className="dashboard-empty">
            <Spinner />
            <p>Carregando itens...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : items.length === 0 ? (
          <div className="dashboard-empty">
            <p>Você ainda não cadastrou nenhum item.</p>
            <Button asChild>
              <Link href="/dashboard/items/new">Cadastrar primeiro item</Link>
            </Button>
          </div>
        ) : (
          <ul className="dashboard-item-list">
            {items.slice(0, 4).map((item) => (
              <li key={item.id} className="dashboard-item-list__item">
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.description.slice(0, 80)}...</span>
                </div>
                <Badge variant="info">{item.condition}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
