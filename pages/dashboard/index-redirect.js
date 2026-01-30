// frontend/pages/dashboard/index-redirect.js
// NOTE: Ce fichier peut être utilisé si vous voulez rediriger /dashboard vers /admin
// Actuellement, /dashboard.js est la page principale du dashboard utilisateur
// Donc ce fichier n'est pas utilisé, mais gardé pour référence

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DashboardIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Si l'utilisateur est admin, rediriger vers /admin
    // Sinon, rediriger vers /dashboard (page utilisateur)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (user.role === 'admin') {
      router.replace('/admin');
    } else {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement de votre dashboard...</p>
      </div>
    </div>
  );
}
