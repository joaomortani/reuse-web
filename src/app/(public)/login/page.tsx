'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/modules/auth/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(form);
      // Redirecionar para a página original ou para o dashboard
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container auth-card">
        <div className="auth-card__header">
          <h1>Bem-vindo de volta</h1>
          <p>Entre com sua conta para acessar seus itens e propostas de troca.</p>
        </div>
        {error ? (
          <Alert variant="danger" title="Não foi possível entrar">
            {error}
          </Alert>
        ) : null}
        <form className="auth-form" onSubmit={handleSubmit}>
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
          />
          <Button type="submit" loading={loading} size="lg">
            Entrar na plataforma
          </Button>
        </form>
        <p className="auth-card__footer">
          Ainda não tem conta? <Link href="/signup">Crie sua conta agora</Link>
        </p>
      </div>
    </div>
  );
}
