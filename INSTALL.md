# 🚀 GUIDE D'INSTALLATION RAPIDE

## Prérequis

- ✅ Node.js 18+ installé ([Télécharger](https://nodejs.org/))
- ✅ npm ou yarn
- ✅ Backend démarré sur http://localhost:5000

---

## Installation en 3 étapes

### 1️⃣ Installer les dépendances

```bash
cd frontend
npm install
```

**Temps estimé:** 2-3 minutes

---

### 2️⃣ Configurer l'environnement

Créer le fichier `.env.local` à partir du template :

**Windows (PowerShell) :**
```powershell
Copy-Item .env.local.example .env.local
```

**Mac/Linux :**
```bash
cp .env.local.example .env.local
```

Puis **éditer** `.env.local` avec vos clés :

```env
# API Backend (modifier si nécessaire)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Supabase (obtenir sur https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Stripe (obtenir sur https://stripe.com/dashboard/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

---

### 3️⃣ Démarrer le serveur

```bash
npm run dev
```

Le frontend sera accessible sur **http://localhost:3000** 🎉

---

## ⚡ Scripts Disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Vérifier les erreurs TypeScript
npm run type-check

# Linter
npm run lint
```

---

## 📁 Structure Créée

```
frontend/
├── components/       ✅ Composants React TypeScript (Atomic Design)
├── hooks/           ✅ Hooks personnalisés (Auth, Projects, Payment, etc.)
├── lib/             ✅ Configuration (Axios, Stripe, Supabase)
├── pages/           ✅ Pages Next.js (mix .js et .tsx)
├── types/           ✅ Types TypeScript (50+ interfaces)
├── utils/           ✅ Utilitaires (format, cn)
├── docs/            ✅ Documentation complète
└── styles/          ✅ CSS Tailwind
```

---

## 📚 Documentation

### Guides Disponibles

1. **[README.md](./README.md)** - Vue d'ensemble complète
2. **[docs/FRONTEND_GUIDE.md](./docs/FRONTEND_GUIDE.md)** - Guide d'utilisation détaillé
3. **[docs/MIGRATION_GUIDE.md](./docs/MIGRATION_GUIDE.md)** - Migration JS → TypeScript

### Résumé Global

4. **[../FRONTEND_TYPESCRIPT_SUMMARY.md](../FRONTEND_TYPESCRIPT_SUMMARY.md)** - Récapitulatif complet de tout ce qui a été créé

---

## ✅ Vérification de l'Installation

Une fois le serveur lancé, vérifiez :

1. ✅ http://localhost:3000 - Page d'accueil s'affiche
2. ✅ http://localhost:3000/login - Page de connexion
3. ✅ http://localhost:3000/register - Page d'inscription
4. ✅ http://localhost:3000/blog - Liste des articles
5. ✅ http://localhost:3000/offres - Liste des offres

Si toutes les pages s'affichent correctement, l'installation est réussie ! 🎉

---

## 🐛 Problèmes Courants

### ❌ Erreur: `Cannot find module '@/...'`

**Solution:** Redémarrer le serveur dev

```bash
# Ctrl+C pour arrêter
npm run dev
```

### ❌ Erreur: `Module not found: Can't resolve 'react-toastify/dist/ReactToastify.css'`

**Solution:** Réinstaller les dépendances

```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Port 3000 déjà utilisé

**Solution:** Utiliser un autre port

```bash
PORT=3001 npm run dev
```

Ou trouver et tuer le processus sur le port 3000 :

**Windows :**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux :**
```bash
lsof -ti:3000 | xargs kill
```

### ❌ Erreurs TypeScript

**Solution:** Vérifier et corriger

```bash
npm run type-check
```

---

## 🔑 Obtenir les Clés API

### Supabase

1. Aller sur https://supabase.com
2. Créer un projet (ou utiliser existant)
3. Aller dans **Settings** > **API**
4. Copier:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Stripe

1. Aller sur https://stripe.com/dashboard
2. Se connecter (ou créer un compte)
3. Activer le **Mode Test**
4. Aller dans **Developers** > **API keys**
5. Copier la **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

---

## 🎯 Prochaines Étapes

Après l'installation :

1. 📖 Lire [docs/FRONTEND_GUIDE.md](./docs/FRONTEND_GUIDE.md)
2. 🔍 Explorer les composants dans `/components`
3. 📝 Consulter les types dans `/types`
4. 🚀 Commencer à développer !

---

## 💡 Tips

- Utiliser les **alias de chemin** : `@/` pointe vers `/frontend`
- Tous les composants sont **typés** avec TypeScript
- Les **hooks** encapsulent la logique réutilisable
- Les **layouts** assurent une structure cohérente

---

## 📞 Aide

- **Documentation locale :** `/frontend/docs/`
- **README :** `/frontend/README.md`
- **Résumé complet :** `/FRONTEND_TYPESCRIPT_SUMMARY.md`

---

**Bon développement ! 🚀**

**Version:** 2.0.0  
**Date:** Janvier 2026
