# 📘 GUIDE FRONTEND - LE SAGE DEV

## 🎯 Vue d'ensemble

Frontend moderne construit avec Next.js 16, TypeScript, Tailwind CSS, Stripe et Supabase.

**Architecture:** Atomic Design  
**État:** TypeScript configuré, composants de base créés  
**Date:** Janvier 2026

---

## 🏗️ Architecture

### Structure des dossiers

```
frontend/
├── components/
│   ├── atoms/           # Composants atomiques (Button, Input, Badge, Card, Spinner)
│   ├── molecules/       # Composants composites (Modal, Forms, StripePaymentForm)
│   ├── organisms/       # Sections complexes (Header, Footer)
│   ├── providers/       # Context providers (Auth, Stripe)
│   ├── admin/          # Composants admin existants
│   └── UI/             # Composants UI existants
├── hooks/              # Hooks personnalisés
│   ├── useAuth.ts
│   ├── useProjects.ts
│   ├── usePayment.ts
│   └── useReservations.ts
├── lib/                # Configurations
│   ├── axios.ts
│   ├── stripe.ts
│   └── supabase.ts
├── pages/              # Pages Next.js
├── styles/             # Styles globaux
├── types/              # Types TypeScript
│   ├── auth.ts
│   ├── user.ts
│   ├── project.ts
│   ├── payment.ts
│   ├── blog.ts
│   ├── portfolio.ts
│   ├── offer.ts
│   ├── testimonial.ts
│   ├── contact.ts
│   ├── newsletter.ts
│   ├── admin.ts
│   └── common.ts
└── utils/              # Utilitaires
    ├── api.js (existant)
    ├── cn.ts
    └── format.ts
```

---

## 📦 Installation

### 1. Installer les dépendances

```bash
cd frontend
npm install
```

### 2. Configurer les variables d'environnement

Créer `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera disponible sur http://localhost:3000

---

## 🎨 Système de Design

### Couleurs (Tailwind Config)

```javascript
colors: {
  primary: '#0066FF',    // Bleu principal
  secondary: '#00D9FF',  // Cyan
  dark: '#0A0E27',       // Noir profond
  light: '#F8F9FA',      // Gris clair
  accent: '#FF6B35',     // Orange accent
}
```

### Composants Atoms

#### Button

```tsx
import { Button } from '@/components/atoms';

<Button variant="primary" size="md" isLoading={false}>
  Cliquez-moi
</Button>

// Variants: primary, secondary, outline, ghost, danger
// Sizes: sm, md, lg
```

#### Input

```tsx
import { Input } from '@/components/atoms';
import { Mail } from 'lucide-react';

<Input
  label="Email"
  type="email"
  leftIcon={<Mail className="w-5 h-5" />}
  error="Email invalide"
  fullWidth
/>
```

#### Badge

```tsx
import { Badge } from '@/components/atoms';

<Badge variant="success" dot>
  En ligne
</Badge>

// Variants: default, success, warning, danger, info, primary
```

#### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/atoms';

<Card hover bordered>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
  </CardHeader>
  <CardContent>
    Contenu de la carte
  </CardContent>
  <CardFooter>
    Pied de page
  </CardFooter>
</Card>
```

---

## 🔐 Authentification

### Utilisation du hook useAuth

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout, register } = useAuth();

  const handleLogin = async () => {
    await login({ email: 'user@example.com', password: 'password' });
  };

  if (!isAuthenticated) {
    return <div>Non connecté</div>;
  }

  return (
    <div>
      <p>Bonjour {user?.first_name}</p>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

### Formulaires d'authentification

```tsx
import { LoginForm, RegisterForm } from '@/components/molecules';

// Page login
<LoginForm />

// Page register
<RegisterForm />
```

---

## 💳 Intégration Stripe

### 1. Créer un Payment Intent

```tsx
import { usePayment } from '@/hooks/usePayment';

function CheckoutPage() {
  const { createPaymentIntent } = usePayment();

  const handleCreatePayment = async () => {
    const intent = await createPaymentIntent({
      amount: 5000, // 50.00 EUR (en centimes)
      currency: 'EUR',
      description: 'Achat de service',
      metadata: { project_id: '123' }
    });

    if (intent) {
      // Utiliser intent.client_secret pour Elements
    }
  };
}
```

### 2. Formulaire de paiement avec Stripe Elements

```tsx
import { useState, useEffect } from 'react';
import { StripeProvider } from '@/components/providers';
import { StripePaymentForm } from '@/components/molecules';
import axiosInstance from '@/lib/axios';

function PaymentPage() {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Créer un Payment Intent au chargement
    const createIntent = async () => {
      const response = await axiosInstance.post('/payments/create-intent', {
        amount: 5000,
        currency: 'EUR'
      });
      setClientSecret(response.data.data.client_secret);
    };
    createIntent();
  }, []);

  if (!clientSecret) {
    return <div>Chargement...</div>;
  }

  return (
    <StripeProvider clientSecret={clientSecret}>
      <StripePaymentForm
        amount={5000}
        currency="EUR"
        onSuccess={() => console.log('Paiement réussi')}
        returnUrl="/payment/success"
      />
    </StripeProvider>
  );
}
```

### 3. Redirection Checkout (alternative)

```tsx
import { useCheckoutRedirect } from '@/hooks/usePayment';

function BuyNowButton() {
  const { isRedirecting, redirectToCheckout } = useCheckoutRedirect();

  const handleBuy = async () => {
    await redirectToCheckout({
      amount: 5000,
      currency: 'EUR',
      description: 'Achat de service',
    });
  };

  return (
    <Button onClick={handleBuy} isLoading={isRedirecting}>
      Acheter maintenant
    </Button>
  );
}
```

---

## 📋 Gestion des Projets

```tsx
import { useProjects, useProject } from '@/hooks/useProjects';

function ProjectsList() {
  const {
    projects,
    isLoading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  } = useProjects();

  const handleCreate = async () => {
    await createProject({
      title: 'Nouveau projet',
      description: 'Description',
      tags: ['web', 'design']
    });
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      {projects.map(project => (
        <Card key={project.id}>
          <h3>{project.title}</h3>
          <Badge variant={project.status === 'completed' ? 'success' : 'warning'}>
            {project.status}
          </Badge>
        </Card>
      ))}
    </div>
  );
}

// Pour un seul projet
function ProjectDetail({ projectId }) {
  const { project, isLoading, refetch } = useProject(projectId);

  if (isLoading) return <Spinner />;

  return <div>{project?.title}</div>;
}
```

---

## 🗓️ Réservations

```tsx
import { useReservations } from '@/hooks/useReservations';

function ReservationForm() {
  const { createReservation } = useReservations(false);

  const handleSubmit = async (data) => {
    await createReservation({
      guest_name: 'Jean Dupont',
      guest_email: 'jean@example.com',
      guest_phone: '0612345678',
      reservation_date: '2026-02-15',
      reservation_time: '19:00',
      party_size: 4,
      special_requests: 'Fenêtre si possible'
    });
  };
}
```

---

## 🎨 Utilitaires

### Formatage

```tsx
import { formatCurrency, formatDate, formatFileSize, slugify } from '@/utils/format';

formatCurrency(5000, 'EUR'); // "50,00 €"
formatDate(new Date()); // "29 janvier 2026"
formatFileSize(1024000); // "1 Mo"
slugify('Mon Super Titre'); // "mon-super-titre"
```

### Classes CSS conditionnelles

```tsx
import { cn } from '@/utils/cn';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  hasError && 'error-class'
)} />
```

---

## 🔒 Protection de routes

```tsx
// HOC pour protéger les pages
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function withAuth(Component: React.ComponentType) {
  return function ProtectedRoute(props: any) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login');
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) return <Spinner />;
    if (!isAuthenticated) return null;

    return <Component {...props} />;
  };
}

// Utilisation
export default withAuth(DashboardPage);
```

---

## 📱 Responsive Design

Tous les composants sont responsive par défaut avec Tailwind CSS :

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Contenu responsive */}
</div>
```

---

## ♿ Accessibilité

- Tous les composants incluent les attributs ARIA appropriés
- Support du clavier (Tab, Enter, Escape)
- Focus visible
- Labels associés aux inputs
- Contraste des couleurs conforme WCAG 2.1

---

## 🚀 Prochaines étapes

1. **Migrer les composants existants vers TypeScript**
   - Convertir les fichiers .js en .tsx
   - Ajouter les types appropriés

2. **Créer les pages manquantes**
   - Blog avec liste et détail
   - Portfolio
   - Offres de services
   - Témoignages

3. **Ajouter les organisms**
   - Header TypeScript
   - Footer TypeScript
   - Sections de page réutilisables

4. **Tests**
   - Jest + React Testing Library
   - Tests unitaires des composants
   - Tests d'intégration

---

## 📚 Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Hook Form](https://react-hook-form.com/)

---

**Auteur:** Frontend Developer Agent  
**Date:** Janvier 2026  
**Version:** 2.0.0
