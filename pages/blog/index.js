// frontend/pages/blog/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Calendar, User, Tag, Search, Filter, Clock } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getAllBlogPosts, getBlogCategories, getBlogTags, fetchSettings } from '../../utils/api';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedTag, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [postsData, categoriesData, tagsData, settingsData] = await Promise.all([
        getAllBlogPosts({ 
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          tag: selectedTag !== 'all' ? selectedTag : undefined,
          search: searchQuery || undefined
        }),
        getBlogCategories(),
        getBlogTags(),
        fetchSettings()
      ]);

      setPosts(postsData.posts || postsData || []);
      setCategories(categoriesData.categories || categoriesData || []);
      setTags(tagsData.tags || tagsData || []);
      setSettings(settingsData);
    } catch (error) {
      console.error('Erreur chargement blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <Head>
        <title>Blog - {settings.site_name || "Collection Aur'art"}</title>
        <meta name="description" content="Découvrez nos articles sur le développement web, les technologies et les tendances." />
      </Head>

      <Header settings={settings} />

      <div className="blog-page">
        {/* Hero Section */}
        <section className="blog-hero">
          <div className="hero-content">
            <h1>📰 Notre Blog</h1>
            <p>Actualités, tutoriels et conseils en développement web</p>
          </div>
        </section>

        <div className="container">
          {/* Filters Bar */}
          <div className="filters-bar">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <Filter size={18} />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="all">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat} value={cat.name || cat}>
                    {cat.name || cat}
                  </option>
                ))}
              </select>

              <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                <option value="all">Tous les tags</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Blog Posts Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Chargement des articles...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <h3>Aucun article trouvé</h3>
              <p>Essayez de modifier vos filtres ou revenez plus tard.</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <article key={post.id} className="post-card">
                  {post.featured_image && (
                    <div className="post-image">
                      <img src={post.featured_image} alt={post.title} />
                      {post.category && (
                        <span className="category-badge">{post.category}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="post-content">
                    <div className="post-meta">
                      <span className="meta-item">
                        <Calendar size={14} />
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                      <span className="meta-item">
                        <Clock size={14} />
                        {post.read_time || 5} min
                      </span>
                    </div>

                    <h2>
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="post-excerpt">{post.excerpt || post.content?.substring(0, 150) + '...'}</p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="post-tags">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="tag">
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link href={`/blog/${post.slug}`} className="read-more">
                      Lire l'article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer settings={settings} />

      <style jsx>{`
        .blog-page {
          min-height: 100vh;
          background: #0A0E27;
          padding-top: 80px;
        }

        .blog-hero {
          padding: 80px 20px;
          text-align: center;
          background: linear-gradient(135deg, rgba(0, 102, 255, 0.1), rgba(0, 217, 255, 0.1));
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hero-content h1 {
          font-size: 3em;
          color: white;
          margin-bottom: 16px;
          font-weight: 900;
        }

        .hero-content p {
          font-size: 1.2em;
          color: rgba(255, 255, 255, 0.7);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .filters-bar {
          display: flex;
          gap: 20px;
          margin-bottom: 40px;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-box {
          flex: 1;
          min-width: 280px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .search-box input {
          flex: 1;
          background: none;
          border: none;
          color: white;
          font-size: 15px;
          outline: none;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .filter-group select {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .filter-group select:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(0, 102, 255, 0.5);
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 30px;
        }

        .post-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s;
        }

        .post-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border-color: rgba(0, 102, 255, 0.5);
        }

        .post-image {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
        }

        .post-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }

        .post-card:hover .post-image img {
          transform: scale(1.05);
        }

        .category-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 6px 14px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          color: white;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .post-content {
          padding: 24px;
        }

        .post-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }

        .post-content h2 {
          margin-bottom: 12px;
        }

        .post-content h2 a {
          color: white;
          font-size: 1.4em;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.3s;
        }

        .post-content h2 a:hover {
          color: #00D9FF;
        }

        .post-excerpt {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: rgba(0, 102, 255, 0.15);
          color: #00D9FF;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .read-more {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #00D9FF;
          font-weight: 600;
          text-decoration: none;
          transition: gap 0.3s;
        }

        .read-more:hover {
          gap: 12px;
        }

        .loading-container,
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: rgba(255, 255, 255, 0.6);
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top-color: #0066FF;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state h3 {
          color: white;
          font-size: 1.8em;
          margin-bottom: 12px;
        }

        @media (max-width: 768px) {
          .blog-hero {
            padding: 60px 20px;
          }

          .hero-content h1 {
            font-size: 2em;
          }

          .posts-grid {
            grid-template-columns: 1fr;
          }

          .filters-bar {
            flex-direction: column;
          }

          .search-box {
            width: 100%;
          }

          .filter-group {
            width: 100%;
            flex-wrap: wrap;
          }

          .filter-group select {
            flex: 1;
            min-width: 140px;
          }
        }
      `}</style>
    </>
  );
}
