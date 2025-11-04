'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useCategories } from '@/modules/categories/hooks/useCategories';
import { createItem } from '@/services/api/items';
import { ApiError } from '@/services/api/httpClient';

const conditions = [
  { label: 'Novo', value: 'NEW' },
  { label: 'Usado', value: 'USED' },
  { label: 'Bom estado', value: 'GOOD' },
  { label: 'Precisa de reparos', value: 'FAIR' },
];

export default function NewItemPage() {
  const router = useRouter();
  const { categories } = useCategories();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    condition: 'NEW',
    lat: '',
    lng: '',
    images: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await createItem({
        title: form.title,
        description: form.description,
        condition: form.condition as 'NEW' | 'USED' | 'GOOD' | 'FAIR',
        categoryId: form.categoryId || undefined,
        lat: Number(form.lat),
        lng: Number(form.lng),
        images: form.images
          .split(',')
          .map((value) => value.trim())
          .filter((value) => value.length > 0),
      });

      router.push('/dashboard/items');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível criar o item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="item-form-page">
      <header className="items-page__header">
        <div>
          <h2>Novo item</h2>
          <p>Cadastre um item com informações completas para facilitar as trocas e doações.</p>
        </div>
      </header>

      {error ? (
        <Alert variant="danger" title="Erro ao cadastrar item">
          {error}
        </Alert>
      ) : null}

      <form className="item-form" onSubmit={handleSubmit}>
        <Input
          name="title"
          label="Título"
          placeholder="Ex: Bicicleta aro 26"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          required
        />
        <Textarea
          name="description"
          label="Descrição"
          placeholder="Descreva o estado de conservação e detalhes importantes"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          required
        />
        <div className="item-form__grid">
          <Select
            name="categoryId"
            label="Categoria"
            value={form.categoryId}
            onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
            options={[{ label: 'Selecione', value: '' }, ...categories.map((category) => ({ label: category.name, value: category.id }))]}
          />
          <Select
            name="condition"
            label="Condição"
            value={form.condition}
            onChange={(event) => setForm((prev) => ({ ...prev, condition: event.target.value }))}
            options={conditions}
            required
          />
        </div>
        <div className="item-form__grid">
          <Input
            name="lat"
            label="Latitude"
            placeholder="-23.5505"
            value={form.lat}
            onChange={(event) => setForm((prev) => ({ ...prev, lat: event.target.value }))}
            required
          />
          <Input
            name="lng"
            label="Longitude"
            placeholder="-46.6333"
            value={form.lng}
            onChange={(event) => setForm((prev) => ({ ...prev, lng: event.target.value }))}
            required
          />
        </div>
        <Textarea
          name="images"
          label="URLs das imagens"
          placeholder="Separe múltiplos links por vírgula"
          value={form.images}
          onChange={(event) => setForm((prev) => ({ ...prev, images: event.target.value }))}
        />
        <Button type="submit" loading={loading} size="lg">
          Salvar item
        </Button>
      </form>
    </div>
  );
}
