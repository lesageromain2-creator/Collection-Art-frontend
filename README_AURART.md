# 🎨 Collection Aur'art - Guide de Démarrage

## Installation et Lancement

### 1. Installer les dépendances
```bash
cd frontend
npm install
```

### 2. Configuration
Créez un fichier `.env.local` avec vos variables d'environnement :
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Lancer le serveur de développement
```bash
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

## 🎨 Structure du Site

### Pages Principales
- `/` - Page d'accueil
- `/about` - Notre équipe
- `/contact` - Contact
- `/rubriques` - Liste des rubriques
- `/rubriques/[slug]` - Page d'une rubrique spécifique
- `/articles` - Liste de tous les articles

### Rubriques Disponibles
1. **Histoire des arts** (`/rubriques/histoire-arts`)
2. **Au fil des œuvres** (`/rubriques/fil-oeuvres`)
3. **Tribunal des arts** (`/rubriques/tribunal-arts`)
4. **Marché de l'art** (`/rubriques/marche-art`)

## 📸 Ajouter du Contenu

### Photos de l'Équipe
Placez les photos dans `/public/team/` :
```
/public/team/
  ├── president.jpg
  ├── vice-president.jpg
  ├── redactrice.jpg
  ├── secretaire.jpg
  └── dev.jpg
```

Puis modifiez les données dans `/pages/about.js` :
```javascript
const teamMembers = [
  {
    name: 'Votre Nom',
    role: 'Président',
    description: 'Votre description...',
    image: '/team/president.jpg',
    email: 'president@collection.aurart.com',
  },
  // ...
];
```

### Logo de l'Association
Remplacez le logo par défaut :
- `/public/logo.png` - Logo principal (format PNG recommandé)

### Images pour les Articles
Placez vos images dans `/public/images/articles/`

## 🎨 Personnalisation

### Couleurs
Les couleurs sont définies dans `styles/globals.css` et `tailwind.config.js` :
- Rose Framboise : `#D63384`
- Violet Profond : `#6A2C70`
- Orange : `#E67E22`
- Blanc Crème : `#FAF8F3`

### Polices
Les polices Google Fonts sont importées dans `styles/globals.css` :
- **Titres** : Cormorant Garamond (serif)
- **Texte** : Montserrat (sans-serif)

Pour changer, modifiez l'import dans `globals.css` et la config Tailwind.

## 📝 Modifier le Contenu

### Texte de Présentation
Modifiez le texte dans `/pages/index.js` et `/pages/about.js`

### Informations de Contact
Modifiez les settings dans chaque page :
```javascript
const demoSettings = {
  site_name: 'Collection Aur\'art',
  email: 'collection.aurart@gmail.com',
};
```

### Liens Réseaux Sociaux
Modifiez les liens dans `/components/Footer.js` :
```javascript
<a href="https://www.tiktok.com/@collection.aurart">TikTok</a>
<a href="https://www.instagram.com/collection.aurart">Instagram</a>
<a href="https://www.linkedin.com/company/collection-aurart">LinkedIn</a>
```

## 🔌 Connexion au Backend

### API Endpoints
Le frontend est prêt à se connecter aux APIs backend existantes dans `/utils/api.js`

Pour afficher les vrais articles depuis la base de données, modifiez :

**Dans `/pages/articles.js`** :
```javascript
// Remplacez
const articles = [];

// Par
const [articles, setArticles] = useState([]);

useEffect(() => {
  const loadArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Erreur chargement articles:', error);
    }
  };
  loadArticles();
}, []);
```

## 📱 Pages Responsives

Tous les composants sont responsive et s'adaptent :
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

## 🎯 Checklist de Lancement

### Avant de Mettre en Production
- [ ] Remplacer toutes les photos placeholder
- [ ] Ajouter les vrais noms et descriptions de l'équipe
- [ ] Vérifier tous les liens email et réseaux sociaux
- [ ] Tester sur mobile, tablette et desktop
- [ ] Optimiser les images (compression, formats WebP)
- [ ] Vérifier l'accessibilité (contrastes, alt text)
- [ ] Configurer les vraies URLs d'API
- [ ] Tester le formulaire de contact
- [ ] Vérifier le SEO (meta descriptions, titres)
- [ ] Générer le sitemap.xml

### SEO et Métadonnées
Chaque page a déjà ses meta tags, mais vous pouvez les personnaliser :
```javascript
<Head>
  <title>Votre Titre - Collection Aur'art</title>
  <meta name="description" content="Votre description" />
</Head>
```

## 🐛 Dépannage

### Le site ne démarre pas
```bash
# Supprimer le cache
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

### Les styles ne s'appliquent pas
```bash
# Vérifier que Tailwind est bien configuré
npm run build
```

### Les images ne s'affichent pas
- Vérifiez que les images sont dans `/public/`
- Les chemins doivent commencer par `/` (ex: `/logo.png`)

## 🚀 Déploiement

### Sur Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Sur Netlify
1. Connectez votre repo GitHub
2. Build command : `npm run build`
3. Publish directory : `.next`

### Variables d'Environnement
N'oubliez pas de configurer :
- `NEXT_PUBLIC_API_URL`
- Toutes les clés API nécessaires

## 📚 Documentation

### Structure des Composants
```
components/
├── Header.js       # Navigation principale
├── Footer.js       # Pied de page avec réseaux sociaux
├── atoms/          # Composants atomiques (Button, Input, etc.)
├── molecules/      # Composants composés
└── organisms/      # Sections complètes
```

### Hooks Disponibles
- `useAuth()` - Gestion de l'authentification
- `useProjects()` - Gestion des projets
- `usePayment()` - Gestion des paiements

## 🎨 Design System

### Composants Réutilisables

**Bouton Principal** :
```jsx
<Link href="/url" className="bg-primary-gradient text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
  Texte du bouton
</Link>
```

**Card Moderne** :
```jsx
<div className="bg-white rounded-2xl p-8 shadow-sm border border-anthracite/5 hover:shadow-xl transition-all duration-300">
  {/* Contenu */}
</div>
```

**Section Standard** :
```jsx
<section className="py-20 md:py-32 px-6">
  <div className="max-w-6xl mx-auto">
    {/* Contenu */}
  </div>
</section>
```

## 📞 Support

Pour toute question :
- 📧 Email : collection.aurart@gmail.com
- 💬 Consultez `FRONTEND_TRANSFORMATION.md` pour les détails techniques

## 🎉 Félicitations !

Votre site Collection Aur'art est prêt ! Il ne reste plus qu'à :
1. Ajouter vos contenus (photos, articles)
2. Connecter au backend
3. Tester en profondeur
4. Déployer en production

**Bon courage pour votre association artistique !** 🎨
