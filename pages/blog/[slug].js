// frontend/pages/blog/[slug].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Calendar, User, Tag, ArrowLeft, Clock, Share2 } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getArticleBySlug, fetchSettings } from '../../utils/api';

function parseArticleContent(content, outSources = {}) {
  if (!content || typeof content !== 'string') return null;
  const t = content.trim();
  if (!t.startsWith('[') && !t.startsWith('{')) return null;
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.blocks) {
      outSources.sources = parsed.sources || [];
      return parsed.blocks;
    }
    return Array.isArray(parsed) ? parsed : null;
  } catch (_) {
    return null;
  }
}

/** Convertit **gras** *italique* et [1] [2] en HTML pour l'affichage */
function simpleMarkdownToHtml(text, sourcesCount = 10) {
  if (!text || typeof text !== 'string') return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  if (!html.includes('href="#source-')) {
    for (let n = 1; n <= sourcesCount; n++) {
      html = html.replace(new RegExp(`\\[${n}\\]`, 'g'), `<sup><a href="#source-${n}" class="article-ref">[${n}]</a></sup>`);
    }
  }
  return html;
}

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const [article, settingsData] = await Promise.all([
        getArticleBySlug(slug),
        fetchSettings()
      ]);
      setPost(article || null);
      setSettings(settingsData);
    } catch (error) {
      console.error('Erreur chargement article:', error);
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

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      });
    }
  };

  if (loading) {
    return (
      <>
        <Head><title>Chargement... - Blog</title></Head>
        <Header settings={settings} />
        <div style={{ minHeight: '100vh', background: '#0A0E27', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner"></div>
        </div>
        <style jsx>{`
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top-color: #0066FF;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Head><title>Article non trouvé - Blog</title></Head>
        <Header settings={settings} />
        <div style={{ minHeight: '100vh', background: '#0A0E27', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white' }}>
          <h1>Article non trouvé</h1>
          <Link href="/articles" style={{ color: '#00D9FF', marginTop: '20px' }}>← Retour aux articles</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title} - Blog - {settings.site_name || "Collection Aur'art"}</title>
        <meta name="description" content={post.excerpt || post.content?.substring(0, 160)} />
      </Head>

      <Header settings={settings} />

      <div className="post-page">
        <div className="post-container">
          <Link href="/articles" className="back-link">
            <ArrowLeft size={20} />
            Retour aux articles
          </Link>

          {(post.featured_image_url || post.featured_image) && (
            <div className="post-hero-image">
              <img src={post.featured_image_url || post.featured_image} alt={post.title} />
            </div>
          )}

          <article className="post-article">
            <header className="post-header">
              {post.category && (
                <span className="category-badge">{post.category}</span>
              )}
              
              <h1>{post.title}</h1>
              
              {post.excerpt && (
                <p className="post-lead">{post.excerpt}</p>
              )}

              <div className="post-meta">
                <span className="meta-item">
                  <Calendar size={16} />
                  {formatDate(post.published_at || post.created_at)}
                </span>
                <span className="meta-item">
                  <User size={16} />
                  {post.author_name || 'Admin'}
                </span>
                <span className="meta-item">
                  <Clock size={16} />
                  {post.read_time || 5} min de lecture
                </span>
                <button onClick={sharePost} className="share-btn">
                  <Share2 size={16} />
                  Partager
                </button>
              </div>
            </header>

            <div className="post-body">
              {(() => {
                const articleSources = {};
                const blocks = parseArticleContent(post.content, articleSources);
                const sourcesList = articleSources.sources || [];
                if (blocks && blocks.length > 0) {
                  return (
                    <>
                      {blocks.map((block, i) => {
                        if (block.type === 'text') {
                          const raw = (block.content || '').trim();
                          if (!raw) return null;
                          const html = simpleMarkdownToHtml(raw, Math.max(sourcesList.length, 20));
                          return (
                            <div
                              key={i}
                              className="post-block-text"
                              dangerouslySetInnerHTML={{ __html: html }}
                            />
                          );
                        }
                        if (block.type === 'image' && block.url) {
                          return (
                            <figure key={i} className="post-block-figure">
                              <img src={block.url} alt={block.alt || ''} />
                              {block.alt && <figcaption>{block.alt}</figcaption>}
                            </figure>
                          );
                        }
                        return null;
                      })}
                      {sourcesList.length > 0 && (
                        <section className="post-sources">
                          <h3>Sources</h3>
                          <ol>
                            {sourcesList.map((s, idx) => (
                              <li key={idx} id={`source-${s.num || idx + 1}`}>
                                {s.text || s}
                              </li>
                            ))}
                          </ol>
                        </section>
                      )}
                    </>
                  );
                }
                return <div className="post-block-text" dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(post.content || '', 20) }} />;
              })()}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                <strong>Tags:</strong>
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="tag">
                    <Tag size={14} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        </div>
      </div>

      <Footer settings={settings} />

      <style jsx>{`
        .post-page {
          min-height: 100vh;
          background: #F9F6F0;
          padding: 120px 20px 80px;
        }

        .post-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #7C2A3C;
          font-weight: 600;
          text-decoration: none;
          margin-bottom: 30px;
          transition: gap 0.3s, color 0.2s;
        }

        .back-link:hover {
          gap: 12px;
          color: #212E50;
        }

        .post-hero-image {
          width: 100%;
          min-height: 280px;
          max-height: 70vh;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 40px;
          border: 3px solid #212E50;
          box-shadow: 0 8px 32px rgba(33, 46, 80, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f3ee;
        }

        .post-hero-image img {
          max-width: 100%;
          max-height: 70vh;
          width: auto;
          height: auto;
          object-fit: contain;
        }

        .post-article {
          background: #fff;
          border: 2px solid #212E50;
          border-radius: 12px;
          padding: 50px;
          box-shadow: 0 4px 24px rgba(33, 46, 80, 0.08);
          position: relative;
        }
        .post-article::before {
          content: '';
          position: absolute;
          top: 8px;
          left: 8px;
          right: 8px;
          bottom: 8px;
          border: 1px solid rgba(199, 161, 30, 0.4);
          border-radius: 8px;
          pointer-events: none;
        }

        .post-header {
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 2px solid rgba(33, 46, 80, 0.12);
        }

        .category-badge {
          display: inline-block;
          padding: 8px 16px;
          background: #7C2A3C;
          color: #F8F8F0;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
        }

        .post-header h1 {
          color: #212E50;
          font-size: 2.5em;
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 20px;
        }

        .post-lead {
          color: #212E50;
          opacity: 0.85;
          font-size: 1.2em;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .post-meta {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          align-items: center;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6C8157;
          font-size: 14px;
        }

        .share-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(108, 129, 87, 0.15);
          border: 1px solid rgba(108, 129, 87, 0.4);
          border-radius: 8px;
          color: #6C8157;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .share-btn:hover {
          background: rgba(108, 129, 87, 0.25);
        }

        .post-body {
          color: #212E50;
          font-size: 1.1em;
          line-height: 1.8;
          text-align: justify;
        }

        .post-body :global(h2) {
          color: #212E50;
          font-size: 1.8em;
          font-weight: 700;
          margin: 40px 0 20px;
        }

        .post-body :global(h3) {
          color: #212E50;
          font-size: 1.4em;
          font-weight: 600;
          margin: 32px 0 16px;
        }

        .post-body :global(p) {
          margin-bottom: 20px;
        }

        .post-body :global(a) {
          color: #7C2A3C;
          text-decoration: underline;
        }

        .post-body :global(a):hover {
          color: #212E50;
        }

        .post-body :global(code) {
          background: rgba(199, 161, 30, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          color: #212E50;
        }

        .post-body :global(pre) {
          background: rgba(33, 46, 80, 0.06);
          border: 1px solid rgba(33, 46, 80, 0.12);
          padding: 20px;
          border-radius: 12px;
          overflow-x: auto;
          margin: 20px 0;
        }

        .post-body :global(img) {
          max-width: 100%;
          width: auto;
          height: auto;
          max-height: 70vh;
          object-fit: contain;
          border-radius: 12px;
          margin: 30px 0;
          border: 1px solid rgba(33, 46, 80, 0.1);
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        .post-block-text {
          margin-bottom: 20px;
          text-align: justify;
        }
        .post-block-text :global(.article-ref) {
          font-size: 0.75em;
          vertical-align: super;
          line-height: 0;
        }
        .post-block-text :global(.article-ref a),
        .post-block-text :global(a.article-ref) {
          color: #7C2A3C;
          text-decoration: none;
          font-weight: 600;
        }
        .post-block-text :global(.article-ref a:hover) {
          text-decoration: underline;
        }
        .post-sources {
          margin-top: 48px;
          padding-top: 32px;
          border-top: 2px solid rgba(33, 46, 80, 0.12);
        }
        .post-sources h3 {
          font-size: 1.4em;
          color: #212E50;
          margin-bottom: 20px;
        }
        .post-sources ol {
          list-style: none;
          counter-reset: sources;
          padding: 0;
        }
        .post-sources li {
          counter-increment: sources;
          margin-bottom: 12px;
          padding-left: 2em;
          position: relative;
          font-size: 0.95em;
          color: #212E50;
          line-height: 1.6;
        }
        .post-sources li::before {
          content: counter(sources) '.';
          position: absolute;
          left: 0;
          font-weight: 700;
          color: #7C2A3C;
        }

        .post-block-figure {
          margin: 24px 0;
          text-align: center;
        }
        .post-block-figure img {
          max-width: 100%;
          width: auto;
          height: auto;
          max-height: 70vh;
          object-fit: contain;
          border-radius: 12px;
          display: block;
          margin: 0 auto;
          border: 1px solid rgba(33, 46, 80, 0.1);
        }
        .post-block-figure figcaption {
          margin-top: 8px;
          font-size: 0.95em;
          color: #6C8157;
          font-style: italic;
        }

        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 2px solid rgba(33, 46, 80, 0.12);
        }

        .post-tags strong {
          color: #212E50;
          font-size: 16px;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(199, 161, 30, 0.2);
          color: #212E50;
          border: 1px solid rgba(199, 161, 30, 0.4);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .post-page {
            padding: 100px 15px 60px;
          }

          .post-article {
            padding: 30px 20px;
          }

          .post-header h1 {
            font-size: 1.8em;
          }

          .post-hero-image {
            min-height: 200px;
          }

          .post-body {
            font-size: 1em;
          }
        }
      `}</style>
    </>
  );
}
