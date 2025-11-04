'use client';

import { useState } from 'react';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/modules/auth/auth-context';
import { updateProfile } from '@/services/api/profile';
import { ApiError } from '@/services/api/httpClient';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? '',
    bio: user?.bio ?? '',
    avatarUrl: user?.avatarUrl ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateProfile({
        name: form.name,
        bio: form.bio,
        avatarUrl: form.avatarUrl,
      });
      await refreshUser();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível atualizar o perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <header className="items-page__header">
        <div>
          <h2>Meu perfil</h2>
          <p>Atualize suas informações para que outros usuários conheçam você melhor.</p>
        </div>
      </header>

      {error ? (
        <Alert variant="danger" title="Erro ao atualizar perfil">
          {error}
        </Alert>
      ) : null}

      {success ? <Alert variant="success">Perfil atualizado com sucesso!</Alert> : null}

      <form className="item-form" onSubmit={handleSubmit}>
        <Input
          name="name"
          label="Nome"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
        <Textarea
          name="bio"
          label="Biografia"
          placeholder="Conte um pouco sobre você e o que busca no ReUse"
          value={form.bio ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
        />
        <Input
          name="avatarUrl"
          label="Foto de perfil (URL)"
          placeholder="https://..."
          value={form.avatarUrl ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, avatarUrl: event.target.value }))}
        />
        <Button type="submit" loading={loading} size="lg">
          Salvar alterações
        </Button>
      </form>
    </div>
  );
}
