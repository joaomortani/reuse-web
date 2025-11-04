'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/modules/auth/auth-context';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError('As senhas devem ser iguais.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signup({ name: form.name, email: form.email, password: form.password });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar sua conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container auth-card">
        <div className="auth-card__header">
          <h1>Crie sua conta</h1>
          <p>Compartilhe, doe e troque itens com uma comunidade engajada em consumo consciente.</p>
        </div>
        {error ? (
          <Alert variant="danger" title="Erro ao cadastrar">
            {error}
          </Alert>
        ) : null}
        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            name="name"
            label="Nome"
            placeholder="Seu nome completo"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <Input
            name="email"
            type="email"
            label="E-mail"
            placeholder="seuemail@email.com"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <Input
            name="password"
            type="password"
            label="Senha"
            placeholder="••••••••"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
            minLength={6}
            helperText="Mínimo de 6 caracteres"
          />
          <Input
            name="confirmPassword"
            type="password"
            label="Confirmar senha"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
            required
          />
          <Button type="submit" loading={loading} size="lg">
            Criar conta
          </Button>
        </form>
        <p className="auth-card__footer">
          Já tem uma conta? <Link href="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
}
