'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useItem } from '@/modules/items/hooks/useItem';

const conditionLabel: Record<string, string> = {
  NEW: 'Novo',
  USED: 'Usado',
  GOOD: 'Bom estado',
  FAIR: 'Precisa de reparos',
};

export default function ItemDetailsPage() {
  const params = useParams<{ id: string }>();
  const { item, loading, error } = useItem(params?.id ?? null);

  if (loading) {
    return (
      <div className="dashboard-empty">
        <Spinner />
        <p>Carregando item...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!item) {
    return <Alert variant="warning">Item não encontrado.</Alert>;
  }

  return (
    <div className="item-detail">
      <header className="items-page__header">
        <div>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </div>
        <Button asChild variant="ghost">
          <Link href={`/dashboard/items/${item.id}/edit`}>Editar item</Link>
        </Button>
      </header>

      <div className="item-detail__grid">
        <Card>
          <h3>Informações</h3>
          <dl className="item-detail__list">
            <div>
              <dt>Condição</dt>
              <dd>
                <Badge variant="info">{conditionLabel[item.condition] ?? item.condition}</Badge>
              </dd>
            </div>
            <div>
              <dt>Localização</dt>
              <dd>
                Lat: {item.lat.toFixed(4)} / Lng: {item.lng.toFixed(4)}
              </dd>
            </div>
            <div>
              <dt>Categoria</dt>
              <dd>{item.category?.name ?? 'Não informada'}</dd>
            </div>
            <div>
              <dt>Proprietário</dt>
              <dd>{item.owner?.name ?? 'Usuário'}</dd>
            </div>
          </dl>
        </Card>
        <Card>
          <h3>Imagens</h3>
          {item.images?.length ? (
            <ul className="item-detail__images">
              {item.images.map((image) => (
                <li key={image}>
                  <a href={image} target="_blank" rel="noreferrer">
                    {image}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="item-detail__empty">Nenhuma imagem cadastrada.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
