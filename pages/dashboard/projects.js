// frontend/pages/dashboard/projects.js - Redirection vers admin/projects
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DashboardProjects() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la nouvelle page admin/projects
    router.replace('/admin/projects');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers la gestion des projets...</p>
      </div>
    </div>
  );
}
