/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
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
  // Redirections : pages agence (site de vente) -> association
  async redirects() {
    return [
      { source: '/reservation', destination: '/', permanent: false },
      { source: '/offres', destination: '/', permanent: false },
      // /dashboard = nouveau dashboard (articles + profil), pas de redirection
      { source: '/admin/projects', destination: '/admin', permanent: false },
      { source: '/admin/reservations', destination: '/admin', permanent: false },
      { source: '/admin/clients', destination: '/admin', permanent: false },
      { source: '/admin/chat', destination: '/admin', permanent: false },
      { source: '/dashboard/projects', destination: '/admin', permanent: false },
      { source: '/dashboard/reservations', destination: '/admin', permanent: false },
      { source: '/dashboard/clients', destination: '/admin', permanent: false },
      { source: '/dashboard/messages', destination: '/admin/messages', permanent: false },
      { source: '/dashboard/blog', destination: '/admin/blog', permanent: false },
    ];
  },
}

module.exports = nextConfig
