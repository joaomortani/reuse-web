'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { useCategories } from '@/modules/categories/hooks/useCategories';
import { useItems } from '@/modules/items/hooks/useItems';

const conditionLabel: Record<string, string> = {
  NEW: 'Novo',
  USED: 'Usado',
  GOOD: 'Bom estado',
  FAIR: 'Reparo necessário',
};

export default function ItemsPage() {
  const [filters, setFilters] = useState({ search: '', category: '' });
  const { categories } = useCategories();
  const { items, loading, error, reload } = useItems({ ...filters, limit: 20 });

  const categoryOptions = useMemo(
    () => [{ label: 'Todas categorias', value: '' }, ...categories.map((category) => ({ label: category.name, value: category.id }))],
    [categories],
  );

  return (
    <div className="items-page">
      <header className="items-page__header">
        <div>
          <h2>Meus itens</h2>
          <p>Gerencie seus itens cadastrados, edite informações e acompanhe o status das trocas.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/items/new">Cadastrar item</Link>
        </Button>
      </header>

      <div className="items-filter">
        <Input
          label="Buscar"
          placeholder="Buscar por nome ou descrição"
          value={filters.search}
          onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
        />
        <Select
          label="Categoria"
          value={filters.category}
          onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
          options={categoryOptions}
        />
        <Button variant="ghost" onClick={() => reload()}>
          Atualizar
        </Button>
      </div>

      {loading ? (
        <div className="dashboard-empty">
          <Spinner />
          <p>Carregando itens...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : items.length === 0 ? (
        <div className="dashboard-empty">
          <p>Nenhum item encontrado com os filtros selecionados.</p>
        </div>
      ) : (
        <div className="grid-responsive grid-responsive--three">
          {items.map((item) => (
            <Card key={item.id} className="item-card">
              <div className="item-card__image" aria-hidden>
                <span>{item.title.slice(0, 1).toUpperCase()}</span>
              </div>
              <div className="item-card__content">
                <h3>{item.title}</h3>
                <p>{item.description.slice(0, 100)}...</p>
                <div className="item-card__meta">
                  <Badge variant="info">{conditionLabel[item.condition] ?? item.condition}</Badge>
                  <Link href={`/dashboard/items/${item.id}`}>Detalhes</Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
