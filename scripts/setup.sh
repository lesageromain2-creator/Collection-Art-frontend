#!/bin/bash

# ============================================
# SCRIPT D'INSTALLATION FRONTEND
# ============================================

echo "🚀 Installation du Frontend - Le Sage Dev"
echo "=========================================="
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "Veuillez installer Node.js 18+ depuis https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ requise (version actuelle: $(node -v))"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"
echo ""

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo "✅ Dépendances installées"
echo ""

# Copier .env.local si n'existe pas
if [ ! -f .env.local ]; then
    echo "⚙️  Configuration de l'environnement..."
    if [ -f .env.local.example ]; then
        cp .env.local.example .env.local
        echo "✅ Fichier .env.local créé"
        echo "⚠️  N'oubliez pas de configurer vos clés API dans .env.local"
    else
        echo "⚠️  .env.local.example introuvable"
    fi
else
    echo "✅ .env.local existe déjà"
fi

echo ""
echo "=========================================="
echo "✅ Installation terminée !"
echo ""
echo "📝 Prochaines étapes:"
echo ""
echo "1. Configurer .env.local avec vos clés:"
echo "   - NEXT_PUBLIC_API_URL"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo ""
echo "2. Lancer le serveur de développement:"
echo "   npm run dev"
echo ""
echo "3. Ouvrir http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - Guide Frontend: docs/FRONTEND_GUIDE.md"
echo "   - Guide Migration: docs/MIGRATION_GUIDE.md"
echo "   - README: README.md"
echo ""
echo "🎉 Bon développement !"
