# 📋 GUIDE DE MIGRATION VERS TYPESCRIPT

## 🎯 Objectif

Migrer progressivement le frontend existant de JavaScript vers TypeScript tout en conservant les fonctionnalités actuelles.

---

## 📊 État Actuel vs État Cible

### ✅ Déjà fait

- [x] Configuration TypeScript (tsconfig.json)
- [x] Types complets (/types)
- [x] Hooks TypeScript (/hooks)
- [x] Composants Atomic Design (/components/atoms, /molecules, /organisms)
- [x] Layouts TypeScript (/components/layouts)
- [x] Pages TypeScript de base (index, login, register, dashboard)
- [x] Configuration Stripe et Supabase
- [x] Utilitaires TypeScript

### 🔄 À migrer

#### Pages existantes (.js → .tsx)

- [ ] `pages/about.js`
- [ ] `pages/contact.js`
- [ ] `pages/services.js`
- [ ] `pages/temoignages.js`
- [ ] `pages/forgot-password.js`
- [ ] `pages/reset-password.js`
- [ ] `pages/reservation.js`
- [ ] `pages/mes-messages.js`
- [ ] `pages/menu/[id].js`
- [ ] `pages/menus.js`
- [ ] `pages/categories.js`
- [ ] `pages/favorites.js`
- [ ] `pages/mes-projets/[id].js`
- [ ] `pages/portfolio/[slug].js`
- [ ] `pages/portfolio/index.js`
- [ ] `pages/blog/[slug].js`
- [ ] Pages admin

#### Composants existants

- [ ] `components/Header.js` → Utiliser `/components/organisms/Header.tsx`
- [ ] `components/Footer.js` → Utiliser `/components/organisms/Footer.tsx`
- [ ] `components/admin/*` → Migrer vers TypeScript
- [ ] `components/CreateProjectModal.js`
- [ ] `components/ProjectTimeline.js`
- [ ] `components/FileUpload/*`

---

## 🚀 Plan de Migration

### Phase 1: Pages Essentielles ✅ FAIT

1. ✅ Page d'accueil (`index.tsx`)
2. ✅ Login/Register (`login.tsx`, `register.tsx`)
3. ✅ Dashboard (`dashboard.tsx`)
4. ✅ Layouts principaux

### Phase 2: Pages de Contenu (En cours)

#### 1. Page Services

```bash
# Fichier: pages/services.tsx
```

**Migration:**
- Créer une interface `Service` dans types
- Utiliser les composants Atoms/Molecules
- Implémenter le Hero component

#### 2. Page Contact

```bash
# Fichier: pages/contact.tsx
```

**Migration:**
- Utiliser react-hook-form pour le formulaire
- Types pour ContactMessageCreateData
- Intégrer le hook useContactForm

#### 3. Pages Portfolio

```bash
# Fichiers: 
# - pages/portfolio/index.tsx
# - pages/portfolio/[slug].tsx
```

**Migration:**
- Créer PortfolioCard component
- Utiliser types PortfolioProject
- Intégration images Cloudinary

#### 4. Pages Blog

```bash
# Fichiers:
# - pages/blog/index.tsx ✅ FAIT
# - pages/blog/[slug].tsx
```

**Migration:**
- Utiliser BlogCard component ✅ FAIT
- Markdown rendering pour le contenu
- SEO meta tags

### Phase 3: Pages Utilisateur

#### 1. Réservations

```bash
# Fichier: pages/reservation.tsx
```

**Migration:**
- Formulaire avec react-hook-form
- Utiliser useReservations hook
- Validation avec zod

#### 2. Mes Projets

```bash
# Fichier: pages/mes-projets/[id].tsx
```

**Migration:**
- Utiliser useProject hook
- ProjectCard component
- Timeline component

#### 3. Messages

```bash
# Fichier: pages/mes-messages.tsx
```

**Migration:**
- Liste des messages
- Formulaire de réponse
- Temps réel avec Supabase subscriptions

### Phase 4: Pages Admin

#### Migration des pages admin vers TypeScript

```bash
# Fichiers:
# - pages/admin/index.tsx
# - pages/admin/blog.tsx
# - pages/admin/projects.tsx
# - pages/admin/clients.tsx
# - pages/admin/reservations.tsx
# - pages/admin/messages.tsx
```

---

## 📝 Template de Migration

### Pour une page simple

```tsx
// ============================================
// PAGE: NOM DE LA PAGE
// ============================================

import React from 'react';
import { MainLayout } from '@/components/layouts';
import { Hero } from '@/components/organisms';

const PageName: React.FC = () => {
  return (
    <MainLayout
      title="Titre - Le Sage Dev"
      description="Description SEO"
    >
      <Hero
        title="Titre Principal"
        subtitle="Sous-titre"
        variant="centered"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contenu de la page */}
      </div>
    </MainLayout>
  );
};

export default PageName;
```

### Pour une page avec formulaire

```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { MainLayout } from '@/components/layouts';
import { Card, CardContent, Button, Input } from '@/components/atoms';
import type { MonType } from '@/types';

const FormPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MonType>();

  const onSubmit = async (data: MonType) => {
    // Logique de soumission
  };

  return (
    <MainLayout title="Formulaire">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Champ"
              error={errors.field?.message}
              {...register('field', { required: 'Requis' })}
            />
            <Button type="submit" isLoading={isSubmitting}>
              Envoyer
            </Button>
          </form>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default FormPage;
```

### Pour une page avec liste de données

```tsx
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layouts';
import { Spinner } from '@/components/atoms';
import { MonCard } from '@/components/features';
import axiosInstance from '@/lib/axios';
import type { MonType, PaginatedResponse } from '@/types';

const ListPage: React.FC = () => {
  const [items, setItems] = useState<MonType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<PaginatedResponse<MonType>>('/endpoint');
      setItems(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <MonCard key={item.id} item={item} />
        ))}
      </div>
    </MainLayout>
  );
};

export default ListPage;
```

---

## ✅ Checklist de Migration

Pour chaque fichier migré :

- [ ] Renommer `.js` → `.tsx`
- [ ] Importer les types depuis `@/types`
- [ ] Typer toutes les props avec interfaces
- [ ] Typer tous les states
- [ ] Typer les fonctions et paramètres
- [ ] Remplacer les composants custom par Atoms/Molecules
- [ ] Utiliser les hooks TypeScript
- [ ] Tester la compilation TypeScript
- [ ] Vérifier l'affichage
- [ ] Tester les fonctionnalités

---

## 🛠️ Commandes Utiles

```bash
# Vérifier les erreurs TypeScript
npm run type-check

# Build pour vérifier
npm run build

# Développement
npm run dev

# Linter
npm run lint
```

---

## 🐛 Problèmes Courants

### 1. Erreur: Cannot find module

**Solution:** Vérifier les alias dans `tsconfig.json` :

```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```

### 2. Type 'any' implicitly

**Solution:** Toujours typer explicitement :

```tsx
// ❌ Mauvais
const handleClick = (e) => {}

// ✅ Bon
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {}
```

### 3. Props not typed

**Solution:** Créer une interface pour les props :

```tsx
interface MyComponentProps {
  title: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onClick, children }) => {
  // ...
}
```

---

## 📚 Ressources

- Types déjà créés : `/frontend/types/`
- Composants existants : `/frontend/components/`
- Hooks : `/frontend/hooks/`
- Guide Frontend : `/frontend/docs/FRONTEND_GUIDE.md`

---

**Date:** Janvier 2026  
**Version:** 1.0  
**Statut:** En cours de migration
