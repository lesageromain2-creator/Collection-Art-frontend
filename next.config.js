/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'], // Pour Cloudinary
    formats: ['image/avif', 'image/webp'],
  },
  // Support pour TypeScript et JavaScript coexistant
  typescript: {
    // Permet la build même avec des erreurs TS (utile pendant la migration)
    ignoreBuildErrors: false,
  },
  // Variables d'environnement publiques
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  // Redirections pour la migration dashboard -> admin
  async redirects() {
    return [
      // Redirection permanente de /dashboard/* vers /admin/*
      // Note: Les pages de redirection en JavaScript sont déjà créées
      // Ces redirections server-side sont une couche de sécurité supplémentaire
      {
        source: '/dashboard/projects',
        destination: '/admin/projects',
        permanent: false, // 307 redirect (temporaire pour pouvoir changer)
      },
      {
        source: '/dashboard/reservations',
        destination: '/admin/reservations',
        permanent: false,
      },
      {
        source: '/dashboard/clients',
        destination: '/admin/clients',
        permanent: false,
      },
      {
        source: '/dashboard/messages',
        destination: '/admin/messages',
        permanent: false,
      },
      {
        source: '/dashboard/blog',
        destination: '/admin/blog',
        permanent: false,
      },
    ];
  },
}

module.exports = nextConfig
