// ============================================
// COMPOSANT MOLECULE: REGISTER FORM
// ============================================

import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Phone } from 'lucide-react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { useAuth } from '@/hooks/useAuth';
import type { RegisterData } from '@/types';
import Link from 'next/link';

const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData & { password_confirm: string }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData & { password_confirm: string }) => {
    try {
      const { password_confirm, ...registerData } = data;
      await registerUser(registerData);
    } catch (error) {
      // L'erreur est déjà gérée dans le hook useAuth
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Prénom"
          placeholder="Jean"
          leftIcon={<User className="w-5 h-5" />}
          error={errors.first_name?.message}
          fullWidth
          {...register('first_name', {
            required: 'Le prénom est requis',
            minLength: {
              value: 2,
              message: 'Minimum 2 caractères',
            },
          })}
        />

        <Input
          label="Nom"
          placeholder="Dupont"
          leftIcon={<User className="w-5 h-5" />}
          error={errors.last_name?.message}
          fullWidth
          {...register('last_name', {
            required: 'Le nom est requis',
            minLength: {
              value: 2,
              message: 'Minimum 2 caractères',
            },
          })}
        />
      </div>

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
        label="Téléphone (optionnel)"
        type="tel"
        placeholder="06 12 34 56 78"
        leftIcon={<Phone className="w-5 h-5" />}
        error={errors.phone?.message}
        fullWidth
        {...register('phone')}
      />

      <Input
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        leftIcon={<Lock className="w-5 h-5" />}
        error={errors.password?.message}
        fullWidth
        helperText="Minimum 6 caractères"
        {...register('password', {
          required: 'Le mot de passe est requis',
          minLength: {
            value: 6,
            message: 'Minimum 6 caractères',
          },
        })}
      />

      <Input
        label="Confirmer le mot de passe"
        type="password"
        placeholder="••••••••"
        leftIcon={<Lock className="w-5 h-5" />}
        error={errors.password_confirm?.message}
        fullWidth
        {...register('password_confirm', {
          required: 'Veuillez confirmer le mot de passe',
          validate: (value) =>
            value === password || 'Les mots de passe ne correspondent pas',
        })}
      />

      <div className="flex items-start">
        <input
          type="checkbox"
          className="w-4 h-4 mt-1 text-primary border-gray-300 rounded focus:ring-primary"
          required
        />
        <label className="ml-2 text-sm text-gray-600">
          J'accepte les{' '}
          <Link href="/terms" className="text-primary hover:text-blue-700">
            conditions d'utilisation
          </Link>{' '}
          et la{' '}
          <Link href="/privacy" className="text-primary hover:text-blue-700">
            politique de confidentialité
          </Link>
        </label>
      </div>

      <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
        S'inscrire
      </Button>

      <div className="text-center text-sm text-gray-600">
        Déjà un compte ?{' '}
        <Link
          href="/login"
          className="text-primary hover:text-blue-700 font-medium transition-colors"
        >
          Se connecter
        </Link>
      </div>
    </form>
  );
};

RegisterForm.displayName = 'RegisterForm';

export default RegisterForm;
