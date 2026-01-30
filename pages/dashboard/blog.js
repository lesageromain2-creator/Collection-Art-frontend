// frontend/pages/dashboard/blog.js - Redirection vers admin/blog
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DashboardBlog() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la nouvelle page admin/blog
    router.replace('/admin/blog');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers la gestion du blog...</p>
      </div>
    </div>
  );
}
