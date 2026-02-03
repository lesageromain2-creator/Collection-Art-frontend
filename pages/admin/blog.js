// frontend/pages/admin/blog.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Plus, Edit2, Trash2, Eye, Search, Calendar } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Modal from '../../components/admin/Modal';
import { 
  checkAuth,
  getAdminBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogStats
} from '../../utils/api';

export default function AdminBlogPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: '',
    tags: '',
    status: 'draft'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const authData = await checkAuth();
      if (!authData.authenticated || authData.user?.role !== 'admin') {
        router.push('/login?redirect=/admin/blog');
        return;
      }
      setUser(authData.user);

      const [postsData, statsData] = await Promise.all([
        getAdminBlogPosts(),
        getBlogStats().catch(() => ({}))
      ]);

      setPosts(postsData.posts || postsData || []);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur chargement blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      category: '',
      tags: '',
      status: 'draft'
    });
    setShowModal(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      featured_image: post.featured_image || '',
      category: post.category || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
      status: post.status || 'draft'
    });
    setShowModal(true);
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    
    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingPost) {
        await updateBlogPost(editingPost.id, postData);
      } else {
        await createBlogPost(postData);
      }

      setShowModal(false);
      await loadData();
      alert('Article enregistré avec succès');
    } catch (error) {
      console.error('Erreur sauvegarde article:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDeletePost = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      await deleteBlogPost(id);
      await loadData();
      alert('Article supprimé');
    } catch (error) {
      console.error('Erreur suppression article:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #0A0E27;
            color: white;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top-color: #0066FF;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Gestion du Blog - Admin</title>
      </Head>

      <div className="admin-layout">
        <AdminSidebar activeSection="blog" />
        <div className="admin-main">
          <AdminHeader user={user} />
          
          <main className="admin-content">
            <div className="content-header">
              <div>
                <h1>Gestion du Blog</h1>
                <p>{filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''}</p>
              </div>
              <button className="btn-create" onClick={handleCreatePost}>
                <Plus size={20} />
                Nouvel Article
              </button>
            </div>

            {/* Stats */}
            {stats.total > 0 && (
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>{stats.total || 0}</h3>
                  <p>Total</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.published || 0}</h3>
                  <p>Publiés</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.draft || 0}</h3>
                  <p>Brouillons</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.views || 0}</h3>
                  <p>Vues totales</p>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Posts Table */}
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Catégorie</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '60px 20px' }}>
                        Aucun article trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => (
                      <tr key={post.id}>
                        <td>
                          <div className="post-cell">
                            {post.featured_image && (
                              <img src={post.featured_image} alt={post.title} className="post-thumbnail" />
                            )}
                            <div>
                              <strong>{post.title}</strong>
                              {post.excerpt && <p className="excerpt">{post.excerpt.substring(0, 80)}...</p>}
                            </div>
                          </div>
                        </td>
                        <td><span className="category-badge">{post.category || '-'}</span></td>
                        <td>
                          <span className={`status-badge status-${post.status}`}>
                            {post.status === 'published' ? 'Publié' : 'Brouillon'}
                          </span>
                        </td>
                        <td>
                          <div className="date-cell">
                            <Calendar size={14} />
                            {new Date(post.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td>
                          <div className="actions">
                            <button className="btn-icon" onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
                              <Eye size={18} />
                            </button>
                            <button className="btn-icon" onClick={() => handleEditPost(post)}>
                              <Edit2 size={18} />
                            </button>
                            <button className="btn-icon danger" onClick={() => handleDeletePost(post.id)}>
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} title={editingPost ? 'Modifier l\'article' : 'Nouvel article'}>
          <form onSubmit={handleSavePost} className="post-form">
            <div className="form-group">
              <label>Titre *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="url-de-l-article"
              />
            </div>

            <div className="form-group">
              <label>Extrait</label>
              <textarea
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Contenu *</label>
              <textarea
                rows={10}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Catégorie</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Statut</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Tags (séparés par des virgules)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="react, nextjs, web"
              />
            </div>

            <div className="form-group">
              <label>Image de couverture (URL)</label>
              <input
                type="url"
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                Annuler
              </button>
              <button type="submit" className="btn-primary">
                {editingPost ? 'Mettre à jour' : 'Créer l\'article'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <style jsx>{`
        .admin-layout {
          min-height: 100vh;
          background: #0A0E27;
          display: flex;
        }

        .admin-main {
          flex: 1;
          margin-left: 280px;
          display: flex;
          flex-direction: column;
        }

        .admin-content {
          margin-top: 80px;
          padding: 40px;
          flex: 1;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .content-header h1 {
          color: white;
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .content-header p {
          color: rgba(255, 255, 255, 0.6);
        }

        .btn-create {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 24px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-create:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.5);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          padding: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
        }

        .stat-card h3 {
          color: white;
          font-size: 2em;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .stat-card p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          margin-bottom: 24px;
          color: rgba(255, 255, 255, 0.6);
        }

        .search-bar input {
          flex: 1;
          background: none;
          border: none;
          color: white;
          font-size: 15px;
          outline: none;
        }

        .table-container {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table thead th {
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          font-weight: 600;
          text-align: left;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .data-table tbody td {
          padding: 16px 20px;
          color: white;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .data-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .post-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .post-thumbnail {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: contain;
          background: rgba(0,0,0,0.2);
        }

        .post-cell strong {
          display: block;
          margin-bottom: 4px;
        }

        .excerpt {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        .category-badge {
          padding: 6px 12px;
          background: rgba(0, 217, 255, 0.15);
          color: #00D9FF;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-published {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .status-draft {
          background: rgba(255, 165, 0, 0.15);
          color: #FFA500;
        }

        .date-cell {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .btn-icon {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-icon:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .btn-icon.danger:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
        }

        :global(.post-form) {
          padding: 24px;
        }

        :global(.form-group) {
          margin-bottom: 20px;
        }

        :global(.form-group label) {
          display: block;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        :global(.form-group input),
        :global(.form-group textarea),
        :global(.form-group select) {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          font-size: 15px;
          outline: none;
          transition: all 0.3s;
        }

        :global(.form-group input:focus),
        :global(.form-group textarea:focus),
        :global(.form-group select:focus) {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(0, 102, 255, 0.5);
        }

        :global(.form-row) {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        :global(.form-actions) {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        :global(.btn-primary),
        :global(.btn-secondary) {
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        :global(.btn-primary) {
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          color: white;
          border: none;
        }

        :global(.btn-secondary) {
          background: rgba(255, 255, 255, 0.05);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 1024px) {
          .admin-main {
            margin-left: 0;
          }

          :global(.form-row) {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
