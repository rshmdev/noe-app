import type React from 'react';

import { useState } from 'react';
import { toast } from 'sonner';

import { PawPrintIcon as Paw } from 'lucide-react';
import { Link, useNavigate, type MetaArgs } from 'react-router';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '~/components/ui/card';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { login } from '~/services/auth';

export function meta({}: MetaArgs) {
  return [
    { title: 'Noé - Login' },
    {
      name: 'description',
      content:
        'Entre na sua conta para acessar todas as funcionalidades do App NOÉ.',
    },
  ];
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  let navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await login(data);

      return res;
    },
    onSuccess: (data) => {
      toast('Login realizado com sucesso!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      navigate('/', { replace: true });
    },
    onError: () => {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validação básica
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      setIsLoading(false);
      return;
    }

    try {
      // Simulação de login
      await mutateAsync(formData);
    } catch (err) {
      console.error(err);
      setError('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <Paw className="h-8 w-8 text-green-400" />
        <h1 className="text-2xl font-bold text-white">App NOÉ</h1>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>Acesse sua conta para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="/recovery-password">Esqueceu a senha?</Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p>
            Não tem uma conta?{' '}
            <Link to="/auth/register" className="hover:underline">
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
