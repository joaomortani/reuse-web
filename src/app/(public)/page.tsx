import Link from 'next/link';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getBackendBaseUrl } from '@/lib/env';
import type { Item } from '@/types/api';

interface BackendResponse<T> {
  success: boolean;
  data: T;
  error: { code: string | null; message: string | null };
}

async function getHighlightedItems(): Promise<Item[]> {
  const baseUrl = getBackendBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/items/top?limit=6`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as BackendResponse<Item[]>;
    return payload.success ? payload.data : [];
  } catch (error) {
    console.error('Failed to load highlighted items', error);
    return [];
  }
}

const formatCondition = (condition: string) => {
  const map: Record<string, string> = {
    NEW: 'Novo',
    GOOD: 'Bom estado',
    USED: 'Usado',
    FAIR: 'Precisa de reparos',
  };

  return map[condition] ?? condition;
};

export default async function HomePage() {
  const highlightedItems = await getHighlightedItems();

  return (
    <>
      <section className="hero" id="proposito">
        <div className="container hero__content">
          <div className="hero__text">
            <Badge variant="info">Economia circular</Badge>
            <h1>Troque, doe e dê um novo destino aos itens que você não usa mais.</h1>
            <p>
              O ReUse conecta pessoas dispostas a compartilhar recursos e diminuir o desperdício. Descubra itens perto de você,
              proponha trocas e acompanhe tudo em um painel simples.
            </p>
            <div className="hero__actions">
              <Button asChild size="lg">
                <Link href="/signup">Começar agora</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
          </div>
          <div className="hero__visual" aria-hidden>
            <div className="hero__card">
              <span className="hero__card-title">+3.000</span>
              <span className="hero__card-subtitle">trocas concluídas</span>
            </div>
            <div className="hero__card hero__card--secondary">
              <span className="hero__card-title">+850</span>
              <span className="hero__card-subtitle">itens disponíveis</span>
            </div>
          </div>
        </div>
      </section>

      <section className="reuse-section reuse-section--muted" id="destaques">
        <div className="container">
          <header className="section-header">
            <div>
              <h2>Itens em destaque</h2>
              <p>Selecionamos ofertas recentes para você encontrar algo especial perto de casa.</p>
            </div>
            <Button asChild variant="ghost">
              <Link href="/dashboard/items">Ver todos</Link>
            </Button>
          </header>
          <div className="grid-responsive grid-responsive--three">
            {highlightedItems.length === 0 ? (
              <Card className="highlight-empty">
                <h3>Ainda não temos itens cadastrados.</h3>
                <p>Cadastre o primeiro item na plataforma e inspire outras pessoas a desapegar.</p>
              </Card>
            ) : (
              highlightedItems.map((item) => (
                <Card key={item.id} className="item-card">
                  <div className="item-card__image" aria-hidden>
                    <span>{item.title.slice(0, 1).toUpperCase()}</span>
                  </div>
                  <div className="item-card__content">
                    <h3>{item.title}</h3>
                    <p>{item.description.slice(0, 120)}...</p>
                    <div className="item-card__meta">
                      <Badge variant="info">{formatCondition(item.condition)}</Badge>
                      <span>{item.owner?.name ?? 'Usuário anônimo'}</span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="reuse-section" id="como-funciona">
        <div className="container">
          <h2>Como funciona?</h2>
          <div className="grid-responsive grid-responsive--three steps-grid">
            <Card>
              <h3>1. Crie sua conta</h3>
              <p>Cadastre-se rapidamente com seu e-mail e preencha seu perfil para receber recomendações perto de você.</p>
            </Card>
            <Card>
              <h3>2. Publique ou encontre itens</h3>
              <p>Inclua fotos, categoria e estado de conservação. Busque por itens disponíveis usando filtros inteligentes.</p>
            </Card>
            <Card>
              <h3>3. Combine a troca</h3>
              <p>Envie propostas, converse com outros usuários e finalize a troca registrando o status no painel.</p>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
