'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Map } from '@/components/ui/Map';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { useCategories } from '@/modules/categories/hooks/useCategories';
import { useItems } from '@/modules/items/hooks/useItems';
import type { Item } from '@/types/api';

const conditionLabel: Record<string, string> = {
  NEW: 'Novo',
  USED: 'Usado',
  DAMAGED: 'Danificado',
};

export default function DashboardHome() {
  const [filters, setFilters] = useState({ search: '', category: '' });
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { categories, loading: categoriesLoading } = useCategories();
  const { items, loading: itemsLoading, error } = useItems({ ...filters, limit: 50 });

  const categoryOptions = [
    { label: 'Todas categorias', value: '' },
    ...categories.map((category) => ({ label: category.name, value: category.id })),
  ];

  const itemsToShow = items.slice(0, 20); // Limitar itens no mapa para performance

  return (
    <div className="explore-page">
      <header className="explore-page__header">
        <div>
          <h1>Explorar Itens</h1>
          <p>Descubra itens próximos de você e encontre oportunidades de troca.</p>
        </div>
      </header>

      {/* Seção de Filtros */}
      <div className="explore-filters">
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
      </div>

      {/* Seção de Categorias */}
      {!categoriesLoading && categories.length > 0 && (
        <section className="explore-categories">
          <h2>Categorias</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="category-card"
                role="button"
                tabIndex={0}
                onClick={() => setFilters((prev) => ({ ...prev, category: category.id }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setFilters((prev) => ({ ...prev, category: category.id }));
                  }
                }}
              >
                <h3>{category.name}</h3>
                <span className="category-count">
                  {items.filter((item) => item.categoryId === category.id).length} itens
                </span>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Seção do Mapa */}
      <section className="explore-map">
        <header className="section-header">
          <div>
            <h2>Itens próximos</h2>
            <p>Visualize os itens disponíveis perto da sua localização no mapa.</p>
          </div>
        </header>
        {itemsLoading ? (
          <div className="dashboard-empty">
            <Spinner />
            <p>Carregando mapa...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : items.length === 0 ? (
          <div className="dashboard-empty">
            <p>Nenhum item encontrado com os filtros selecionados.</p>
          </div>
        ) : (
          <Card className="map-card">
            <Map items={itemsToShow} onItemClick={setSelectedItem} />
          </Card>
        )}
      </section>

      {/* Seção de Lista de Itens */}
      <section className="explore-items">
        <header className="section-header">
          <div>
            <h2>Todos os itens</h2>
            <p>Veja todos os itens disponíveis na plataforma.</p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/dashboard/items/new">Cadastrar item</Link>
          </Button>
        </header>

        {itemsLoading ? (
          <div className="dashboard-empty">
            <Spinner />
            <p>Carregando itens...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : items.length === 0 ? (
          <div className="dashboard-empty">
            <p>Nenhum item encontrado com os filtros selecionados.</p>
            <Button asChild>
              <Link href="/dashboard/items/new">Cadastrar primeiro item</Link>
            </Button>
          </div>
        ) : (
          <div className="grid-responsive grid-responsive--three">
            {items.map((item) => (
              <Card key={item.id} className="item-card">
                <div className="item-card__image" aria-hidden>
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.title} />
                  ) : (
                    <span>{item.title.slice(0, 1).toUpperCase()}</span>
                  )}
                </div>
                <div className="item-card__content">
                  <h3>{item.title}</h3>
                  <p>{item.description.slice(0, 100)}...</p>
                  <div className="item-card__meta">
                    <Badge variant="info">{conditionLabel[item.condition] ?? item.condition}</Badge>
                    {item.category && <Badge variant="default">{item.category.name}</Badge>}
                    <span>{item.owner?.name ?? 'Usuário'}</span>
                  </div>
                  <div className="item-card__actions">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/items/${item.id}`}>Ver detalhes</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
