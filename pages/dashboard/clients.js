// frontend/pages/dashboard/clients.js - Redirection vers admin/clients
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DashboardClients() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la nouvelle page admin/clients
    router.replace('/admin/clients');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers la gestion des clients...</p>
      </div>
    </div>
  );
}
