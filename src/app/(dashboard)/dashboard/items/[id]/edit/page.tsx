'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useCategories } from '@/modules/categories/hooks/useCategories';
import { useItem } from '@/modules/items/hooks/useItem';
import { updateItem } from '@/services/api/items';
import { ApiError } from '@/services/api/httpClient';

const conditions = [
  { label: 'Novo', value: 'NEW' },
  { label: 'Usado', value: 'USED' },
  { label: 'Bom estado', value: 'GOOD' },
  { label: 'Precisa de reparos', value: 'FAIR' },
];

export default function EditItemPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { categories } = useCategories();
  const { item, loading, error: loadError } = useItem(params.id);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    condition: 'NEW',
    lat: '',
    lng: '',
    images: '',
  });

  useEffect(() => {
    if (!item) {
      return;
    }

    setForm({
      title: item.title,
      description: item.description,
      categoryId: item.categoryId ?? '',
      condition: item.condition,
      lat: String(item.lat),
      lng: String(item.lng),
      images: item.images?.join(', ') ?? '',
    });
  }, [item]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setSaving(true);

    try {
      await updateItem(params.id, {
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

      router.push(`/dashboard/items/${params.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível atualizar o item');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-empty">
        <p>Carregando item...</p>
      </div>
    );
  }

  if (loadError) {
    return <Alert variant="danger">{loadError}</Alert>;
  }

  if (!item) {
    return <Alert variant="warning">Item não encontrado.</Alert>;
  }

  return (
    <div className="item-form-page">
      <header className="items-page__header">
        <div>
          <h2>Editar item</h2>
          <p>Atualize as informações do item para manter suas propostas de troca alinhadas.</p>
        </div>
      </header>

      {error ? (
        <Alert variant="danger" title="Erro ao salvar item">
          {error}
        </Alert>
      ) : null}

      <form className="item-form" onSubmit={handleSubmit}>
        <Input
          name="title"
          label="Título"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          required
        />
        <Textarea
          name="description"
          label="Descrição"
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
            value={form.lat}
            onChange={(event) => setForm((prev) => ({ ...prev, lat: event.target.value }))}
            required
          />
          <Input
            name="lng"
            label="Longitude"
            value={form.lng}
            onChange={(event) => setForm((prev) => ({ ...prev, lng: event.target.value }))}
            required
          />
        </div>
        <Textarea
          name="images"
          label="URLs das imagens"
          value={form.images}
          onChange={(event) => setForm((prev) => ({ ...prev, images: event.target.value }))}
        />
        <Button type="submit" loading={saving} size="lg">
          Atualizar item
        </Button>
      </form>
    </div>
  );
}
