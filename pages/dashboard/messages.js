// frontend/pages/dashboard/messages.js - Redirection vers admin/messages
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DashboardMessages() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la nouvelle page admin/messages
    router.replace('/admin/messages');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers la gestion des messages...</p>
      </div>
    </div>
  );
}
