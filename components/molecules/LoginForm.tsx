// ============================================
// COMPOSANT MOLECULE: LOGIN FORM
// ============================================

import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { useAuth } from '@/hooks/useAuth';
import type { LoginCredentials } from '@/types';
import Link from 'next/link';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
    } catch (error) {
      // L'erreur est déjà gérée dans le hook useAuth
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Email"
        type="email"
        placeholder="votre@email.com"
        leftIcon={<Mail className="w-5 h-5" />}
        error={errors.email?.message}
        fullWidth
        {...register('email', {
          required: 'L\'email est requis',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email invalide',
          },
        })}
      />

      <Input
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        leftIcon={<Lock className="w-5 h-5" />}
        error={errors.password?.message}
        fullWidth
        {...register('password', {
          required: 'Le mot de passe est requis',
          minLength: {
            value: 6,
            message: 'Minimum 6 caractères',
          },
        })}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
        </label>

        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:text-blue-700 transition-colors"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
        Se connecter
      </Button>

      <div className="text-center text-sm text-gray-600">
        Pas encore de compte ?{' '}
        <Link
          href="/register"
          className="text-primary hover:text-blue-700 font-medium transition-colors"
        >
          S'inscrire
        </Link>
      </div>
    </form>
  );
};

LoginForm.displayName = 'LoginForm';

export default LoginForm;
