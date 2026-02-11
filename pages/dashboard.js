// frontend/pages/dashboard.js - Dashboard Association (Articles + Profil)
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  FileText,
  User,
  Users,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  X,
  Save,
  Loader2,
  ChevronUp,
  ChevronDown,
  Search,
  ExternalLink,
  Bold,
  Italic,
  AlignJustify,
  Type,
  CornerDownRight,
  Hash,
} from 'lucide-react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  checkAuth,
  logout,
  fetchSettings,
  getMyArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getRubriques,
  uploadArticleImages,
  uploadAvatar,
  updateUserProfile,
  getUserProfile,
  getTeamMembers,
  updateMyTeamProfile,
} from '../utils/api';

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const blockId = () => `b-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

function parseContentBlocks(content, outSources = {}) {
  if (!content || typeof content !== 'string') return [{ id: blockId(), type: 'text', content: '' }];
  const t = content.trim();
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.blocks) {
      if (parsed.sources && Array.isArray(parsed.sources)) outSources.sources = parsed.sources;
      return (parsed.blocks || []).map((b) => ({
        id: b.id || blockId(),
        type: b.type === 'image' ? 'image' : 'text',
        content: b.content ?? '',
        url: b.url ?? '',
        alt: b.alt ?? '',
      }));
    }
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((b) => ({
        id: b.id || blockId(),
        type: b.type === 'image' ? 'image' : 'text',
        content: b.content ?? '',
        url: b.url ?? '',
        alt: b.alt ?? '',
      }));
    }
  } catch (_) {}
  return [{ id: blockId(), type: 'text', content: content }];
}

function serializeContentBlocks(blocks, sources = []) {
  const blocksJson = (blocks || []).map((b) =>
    b.type === 'image'
      ? { type: 'image', url: b.url || '', alt: b.alt || '' }
      : { type: 'text', content: b.content || '' }
  );
  if (!blocksJson.length && !sources.length) return '';
  return JSON.stringify({ blocks: blocksJson, sources: sources.filter((s) => s.text?.trim()) });
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('articles');
  const [mounted, setMounted] = useState(false);

  // Articles
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    rubrique_id: '',
    status: 'draft',
    is_featured: false,
  });
  const [articleSubmitLoading, setArticleSubmitLoading] = useState(false);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [sources, setSources] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const fileInputRef = useRef(null);
  const blockImageInputRef = useRef(null);
  const [rubriques, setRubriques] = useState([]);
  const [deleteArticleId, setDeleteArticleId] = useState(null);

  // Profil
  const [profileForm, setProfileForm] = useState({ firstname: '', lastname: '', phone: '' });
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef(null);
  const [catalogueSearch, setCatalogueSearch] = useState('');
  const [catalogueRubrique, setCatalogueRubrique] = useState('');

  // Équipe associative
  const [teamForm, setTeamForm] = useState({
    team_position: '',
    bio: '',
    phone: '',
    is_team_member: false,
    team_order: '',
    social_linkedin: '',
    social_website: '',
  });
  const [teamSaving, setTeamSaving] = useState(false);
  const [teamEditing, setTeamEditing] = useState(false);

  useEffect(() => {
    loadUserData();
    setTimeout(() => setMounted(true), 50);
  }, []);

  useEffect(() => {
    if (activeTab === 'articles' && user?.is_team_member) {
      loadArticles();
      getRubriques().then(setRubriques);
    }
    if (activeTab === 'profile') {
      getRubriques().then(setRubriques);
    }
    if (activeTab === 'team' && user?.is_team_member) {
      setTeamForm({
        team_position: user.team_position || '',
        bio: user.bio || '',
        phone: user.phone || '',
        is_team_member: !!user.is_team_member,
        team_order: user.team_order != null ? String(user.team_order) : '',
        social_linkedin: user.social_linkedin || '',
        social_website: user.social_website || '',
      });
    }
  }, [activeTab, user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [authData, settingsData] = await Promise.all([
        checkAuth(),
        fetchSettings().catch(() => ({})),
      ]);
      if (!authData.authenticated || !authData.user) {
        router.push('/login?redirect=/dashboard');
        return;
      }
      setUser(authData.user);
      if (!authData.user?.is_team_member) {
        setActiveTab('profile');
      }
      setSettings(settingsData);
      setProfileForm({
        firstname: authData.user.firstname || '',
        lastname: authData.user.lastname || '',
        phone: authData.user.phone || '',
      });
    } catch (e) {
      console.error(e);
      router.push('/login?redirect=/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadArticles = async () => {
    setArticlesLoading(true);
    try {
      const list = await getMyArticles();
      setArticles(list);
    } catch (e) {
      console.error(e);
      setArticles([]);
    } finally {
      setArticlesLoading(false);
    }
  };

  const openNewArticle = () => {
    setEditingArticleId(null);
    setArticleForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image_url: '',
      rubrique_id: '',
      status: 'draft',
      is_featured: false,
    });
    setContentBlocks([{ id: blockId(), type: 'text', content: '' }]);
    setSources([]);
    setUploadedImages([]);
    setCoverImageUrl('');
    setShowArticleForm(true);
  };

  const openEditArticle = async (id) => {
    try {
      const article = await getArticleById(id);
      if (!article) return;
      setEditingArticleId(id);
      setArticleForm({
        title: article.title || '',
        slug: article.slug || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        featured_image_url: article.featured_image_url || '',
        rubrique_id: article.rubrique_id || '',
        status: article.status || 'draft',
        is_featured: article.is_featured || false,
      });
      const outSources = {};
      setContentBlocks(parseContentBlocks(article.content || '', outSources));
      setSources(outSources.sources || []);
      setCoverImageUrl(article.featured_image_url || '');
      setUploadedImages([]);
      setShowArticleForm(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleArticleFieldChange = (field, value) => {
    setArticleForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'title' && !editingArticleId) {
      setArticleForm((prev) => ({ ...prev, slug: slugify(value) }));
    }
  };

  const handleArticleImagesUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      const data = await uploadArticleImages(Array.from(files));
      const urls = data.map((img) => img.urls?.featured || img.urls?.original || img.url).filter(Boolean);
      setUploadedImages((prev) => [...prev, ...urls]);
      if (!coverImageUrl && urls[0]) setCoverImageUrl(urls[0]);
      if (!articleForm.featured_image_url && urls[0]) handleArticleFieldChange('featured_image_url', urls[0]);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erreur upload');
    }
    e.target.value = '';
  };

  const addTextBlock = () => {
    setContentBlocks((prev) => [...prev, { id: blockId(), type: 'text', content: '' }]);
  };

  const addSource = () => {
    const num = sources.length + 1;
    setSources((prev) => [...prev, { num, text: '' }]);
    return num;
  };

  const updateSource = (idx, text) => {
    setSources((prev) => prev.map((s, i) => (i === idx ? { ...s, text } : s)));
  };

  const removeSource = (idx) => {
    setSources((prev) => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, num: i + 1 })));
  };

  const insertRefInBlock = (blockIdRef, num) => {
    const refHtml = `<sup class="article-ref"><a href="#source-${num}" id="ref-${num}">[${num}]</a></sup>`;
    setContentBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockIdRef || b.type !== 'text') return b;
        return { ...b, content: (b.content || '') + refHtml };
      })
    );
  };

  const addImageBlock = (url, alt = '') => {
    setContentBlocks((prev) => [...prev, { id: blockId(), type: 'image', url: url || '', alt }]);
  };

  const updateBlock = (id, updates) => {
    setContentBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const removeBlock = (id) => {
    setContentBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const moveBlock = (id, dir) => {
    setContentBlocks((prev) => {
      const i = prev.findIndex((b) => b.id === id);
      if (i === -1 || (dir === -1 && i === 0) || (dir === 1 && i === prev.length - 1)) return prev;
      const next = [...prev];
      [next[i], next[i + dir]] = [next[i + dir], next[i]];
      return next;
    });
  };

  const handleBlockImageUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      const data = await uploadArticleImages(Array.from(files));
      const urls = data.map((img) => img.urls?.featured || img.urls?.original || img.url).filter(Boolean);
      urls.forEach((url) => addImageBlock(url));
      if (!coverImageUrl && urls[0]) setCoverImageUrl(urls[0]);
      if (!articleForm.featured_image_url && urls[0]) handleArticleFieldChange('featured_image_url', urls[0]);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erreur upload');
    }
    e.target.value = '';
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    setArticleSubmitLoading(true);
    try {
      const payload = {
        title: articleForm.title,
        slug: articleForm.slug || slugify(articleForm.title),
        excerpt: articleForm.excerpt,
        content: serializeContentBlocks(contentBlocks, sources),
        featured_image_url: coverImageUrl || articleForm.featured_image_url,
        rubrique_id: articleForm.rubrique_id || null,
        status: articleForm.status,
        is_featured: articleForm.is_featured,
      };
      if (editingArticleId) {
        await updateArticle(editingArticleId, payload);
        alert('Article mis à jour.');
      } else {
        await createArticle(payload);
        alert('Article créé.');
      }
      setShowArticleForm(false);
      loadArticles();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erreur enregistrement');
    } finally {
      setArticleSubmitLoading(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!confirm('Supprimer cet article ?')) return;
    setDeleteArticleId(id);
    try {
      await deleteArticle(id);
      loadArticles();
    } catch (e) {
      console.error(e);
      alert(e.message || 'Erreur suppression');
    } finally {
      setDeleteArticleId(null);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await updateUserProfile(profileForm);
      const authData = await checkAuth();
      if (authData.user) setUser(authData.user);
      setProfileEditing(false);
    } catch (e) {
      console.error(e);
      alert(e.message || 'Erreur sauvegarde');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      await uploadAvatar(file);
      const authData = await checkAuth();
      if (authData.user) setUser(authData.user);
    } catch (e) {
      console.error(e);
      alert(e.message || 'Erreur upload photo');
    } finally {
      setAvatarUploading(false);
    }
    e.target.value = '';
  };

  const handleTeamSave = async (e) => {
    e.preventDefault();
    setTeamSaving(true);
    try {
      await updateMyTeamProfile({
        team_position: teamForm.team_position || undefined,
        bio: teamForm.bio || undefined,
        phone: teamForm.phone || undefined,
        is_team_member: teamForm.is_team_member,
        team_order: teamForm.team_order === '' ? null : parseInt(teamForm.team_order, 10),
        social_linkedin: teamForm.social_linkedin || undefined,
        social_website: teamForm.social_website || undefined,
      });
      const authData = await checkAuth();
      if (authData.user) setUser(authData.user);
      setTeamEditing(false);
      alert('Profil équipe enregistré. Vos informations seront visibles sur la page À propos si vous avez coché « Apparaître sur la page équipe ».');
    } catch (e) {
      console.error(e);
      alert(e.message || 'Erreur sauvegarde');
    } finally {
      setTeamSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  const getInitials = (firstname, lastname) =>
    `${(firstname || '').charAt(0)}${(lastname || '').charAt(0)}`.toUpperCase() || '?';

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Chargement...</p>
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #212E50;
            color: #F8F8F0;
          }
          .spinner {
            width: 48px;
            height: 48px;
            border: 3px solid rgba(199,161,30,0.2);
            border-top-color: #C7A11E;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Espace membre - {settings.site_name || "Collection Aur'art"}</title>
      </Head>
      <Header settings={settings} />
      <div className={`dashboard-page ${mounted ? 'mounted' : ''}`}>
        <div className="dashboard-bg" aria-hidden="true" />
        <div className="dashboard-container">
          <aside className="sidebar">
            <div className="sidebar-header">
              <button
                className="avatar-wrap"
                onClick={() => avatarInputRef.current?.click()}
                title="Changer la photo"
              >
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" />
                ) : (
                  <span>{getInitials(user?.firstname, user?.lastname)}</span>
                )}
                {avatarUploading && (
                  <span className="avatar-loading">
                    <Loader2 size={20} className="spin" />
                  </span>
                )}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <h3>{user?.firstname} {user?.lastname}</h3>
              <p>{user?.email}</p>
              <span className="badge">{user?.role || 'member'}</span>
            </div>
            <nav className="sidebar-nav">
              {user?.is_team_member && (
                <button
                  className={`nav-btn ${activeTab === 'articles' ? 'active' : ''}`}
                  onClick={() => setActiveTab('articles')}
                >
                  <FileText size={20} />
                  <span>Mes articles</span>
                </button>
              )}
              <button
                className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={20} />
                <span>Mon profil</span>
              </button>
              {user?.is_team_member && (
                <button
                  className={`nav-btn ${activeTab === 'team' ? 'active' : ''}`}
                  onClick={() => setActiveTab('team')}
                >
                  <Users size={20} />
                  <span>Équipe associative</span>
                </button>
              )}
              <div className="nav-divider" />
              <button className="nav-btn logout" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Déconnexion</span>
              </button>
            </nav>
          </aside>

          <main className="main">
            {user?.is_team_member && activeTab === 'articles' && (
              <div className="section">
                <div className="section-head">
                  <h1>Mes articles</h1>
                  <button type="button" className="btn-primary" onClick={openNewArticle}>
                    <Plus size={20} />
                    Nouvel article
                  </button>
                </div>

                {articlesLoading ? (
                  <div className="loading-row">
                    <Loader2 size={32} className="spin" />
                    <span>Chargement...</span>
                  </div>
                ) : articles.length === 0 ? (
                  <div className="empty-state">
                    <FileText size={64} />
                    <p>Aucun article pour le moment.</p>
                    <button type="button" className="btn-primary" onClick={openNewArticle}>
                      <Plus size={20} />
                      Créer un article
                    </button>
                  </div>
                ) : (
                  <ul className="articles-list">
                    {articles.map((a) => (
                      <li key={a.id} className="article-card">
                        <div className="article-cover">
                          {a.featured_image_url ? (
                            <img src={a.featured_image_url} alt="" />
                          ) : (
                            <div className="no-cover"><FileText size={32} /></div>
                          )}
                        </div>
                        <div className="article-body">
                          <h3>{a.title}</h3>
                          <p className="meta">
                            {a.rubrique_name && <span>{a.rubrique_name}</span>}
                            <span>{a.status}</span>
                            <span>{new Date(a.created_at).toLocaleDateString('fr-FR')}</span>
                          </p>
                          {a.excerpt && <p className="excerpt">{a.excerpt.slice(0, 120)}…</p>}
                        </div>
                        <div className="article-actions">
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => openEditArticle(a.id)}
                            title="Modifier"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon danger"
                            onClick={() => handleDeleteArticle(a.id)}
                            disabled={deleteArticleId === a.id}
                            title="Supprimer"
                          >
                            {deleteArticleId === a.id ? (
                              <Loader2 size={18} className="spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {user?.is_team_member && activeTab === 'team' && (
              <div className="section">
                <h1>Équipe associative</h1>
                <p className="section-desc">
                  Renseignez votre rôle et votre description pour apparaître sur la page <Link href="/about" className="link-inline">À propos</Link>. Prénom, nom et photo de profil sont pris de votre compte.
                </p>
                {!teamEditing ? (
                  <div className="profile-view">
                    <div className="profile-field">
                      <label>Prénom / Nom</label>
                      <span>{user?.firstname} {user?.lastname}</span>
                    </div>
                    <div className="profile-field">
                      <label>Photo de profil</label>
                      <span>Utilisée automatiquement (modifiable dans Mon profil)</span>
                    </div>
                    <div className="profile-field">
                      <label>Rôle dans l&apos;association</label>
                      <span>{user?.team_position || '—'}</span>
                    </div>
                    <div className="profile-field">
                      <label>Description</label>
                      <span>{user?.bio ? user.bio.slice(0, 120) + (user.bio.length > 120 ? '…' : '') : '—'}</span>
                    </div>
                    <div className="profile-field">
                      <label>Contact (téléphone)</label>
                      <span>{user?.phone || '—'}</span>
                    </div>
                    <div className="profile-field">
                      <label>Apparaître sur la page équipe</label>
                      <span>{user?.is_team_member ? 'Oui' : 'Non'}</span>
                    </div>
                    <div className="profile-field">
                      <label>Ordre d&apos;apparition</label>
                      <span>{user?.team_order != null ? user.team_order : '—'}</span>
                    </div>
                    <button type="button" className="btn-secondary" onClick={() => setTeamEditing(true)}>
                      <Pencil size={18} />
                      Modifier mon profil équipe
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTeamSave} className="profile-form">
                    <div className="form-group">
                      <label>Rôle dans l&apos;association</label>
                      <input
                        value={teamForm.team_position}
                        onChange={(e) => setTeamForm((p) => ({ ...p, team_position: e.target.value }))}
                        placeholder="ex. Président, Secrétaire, Rédacteur…"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description (présentation publique)</label>
                      <textarea
                        value={teamForm.bio}
                        onChange={(e) => setTeamForm((p) => ({ ...p, bio: e.target.value }))}
                        placeholder="Quelques lignes pour vous présenter et décrire votre rôle."
                        rows={4}
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact (téléphone)</label>
                      <input
                        type="tel"
                        value={teamForm.phone}
                        onChange={(e) => setTeamForm((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="Optionnel"
                      />
                    </div>
                    <div className="form-group">
                      <label>LinkedIn (URL)</label>
                      <input
                        type="url"
                        value={teamForm.social_linkedin}
                        onChange={(e) => setTeamForm((p) => ({ ...p, social_linkedin: e.target.value }))}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Site web (URL)</label>
                      <input
                        type="url"
                        value={teamForm.social_website}
                        onChange={(e) => setTeamForm((p) => ({ ...p, social_website: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="form-group checkbox-wrap">
                      <label>
                        <input
                          type="checkbox"
                          checked={teamForm.is_team_member}
                          onChange={(e) => setTeamForm((p) => ({ ...p, is_team_member: e.target.checked }))}
                        />
                        <span>Apparaître sur la page équipe (À propos)</span>
                      </label>
                    </div>
                    <div className="form-group">
                      <label>Ordre d&apos;apparition (nombre, plus petit = plus haut)</label>
                      <input
                        type="number"
                        min="0"
                        value={teamForm.team_order}
                        onChange={(e) => setTeamForm((p) => ({ ...p, team_order: e.target.value }))}
                        placeholder="ex. 1, 2, 3…"
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-primary" disabled={teamSaving}>
                        {teamSaving ? <Loader2 size={20} className="spin" /> : <Save size={20} />}
                        Enregistrer
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setTeamEditing(false)}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {(activeTab === 'profile' || !user?.is_team_member) && (
              <div className="section">
                <h1>Mon profil</h1>

                {/* Photo de profil */}
                <div className="profile-photo-block">
                  <label className="profile-photo-label">Photo de profil</label>
                  <div className="profile-photo-row">
                    <button
                      type="button"
                      className="profile-photo-wrap"
                      onClick={() => avatarInputRef.current?.click()}
                      title="Changer la photo"
                      disabled={avatarUploading}
                    >
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt="Avatar" />
                      ) : (
                        <span className="profile-photo-initials">{getInitials(user?.firstname, user?.lastname)}</span>
                      )}
                      {avatarUploading && (
                        <span className="profile-photo-loading">
                          <Loader2 size={24} className="spin" />
                        </span>
                      )}
                    </button>
                    <div className="profile-photo-actions">
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={avatarUploading}
                      >
                        {user?.avatar_url ? 'Changer la photo' : 'Ajouter une photo'}
                      </button>
                      <p className="profile-photo-hint">JPG, PNG ou WebP. Utilisée sur la page équipe et dans vos articles.</p>
                    </div>
                  </div>
                </div>

                {!profileEditing ? (
                  <div className="profile-view">
                    <div className="profile-field">
                      <label>Prénom</label>
                      <span>{user?.firstname}</span>
                    </div>
                    <div className="profile-field">
                      <label>Nom</label>
                      <span>{user?.lastname}</span>
                    </div>
                    <div className="profile-field">
                      <label>Email</label>
                      <span>{user?.email}</span>
                    </div>
                    {user?.username && (
                      <div className="profile-field">
                        <label>Nom d&apos;utilisateur</label>
                        <span>{user.username}</span>
                      </div>
                    )}
                    <div className="profile-field">
                      <label>Téléphone</label>
                      <span>{user?.phone || '—'}</span>
                    </div>
                    <button type="button" className="btn-secondary" onClick={() => setProfileEditing(true)}>
                      <Pencil size={18} />
                      Modifier le profil
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleProfileSave} className="profile-form">
                    <div className="form-group">
                      <label>Prénom</label>
                      <input
                        value={profileForm.firstname}
                        onChange={(e) => setProfileForm((p) => ({ ...p, firstname: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Nom</label>
                      <input
                        value={profileForm.lastname}
                        onChange={(e) => setProfileForm((p) => ({ ...p, lastname: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Téléphone</label>
                      <input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-primary" disabled={profileSaving}>
                        {profileSaving ? <Loader2 size={20} className="spin" /> : <Save size={20} />}
                        Enregistrer
                      </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setProfileEditing(false)}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
                )}
                <div className="catalogue-search-wrap">
                  <h2 className="catalogue-search-title">Rechercher dans le catalogue d&apos;articles</h2>
                  <div className="catalogue-search-row">
                    <div className="catalogue-search-input-wrap">
                      <Search size={20} className="catalogue-search-icon" />
                      <input
                        type="search"
                        placeholder="Rechercher un article..."
                        value={catalogueSearch}
                        onChange={(e) => setCatalogueSearch(e.target.value)}
                        className="catalogue-search-input"
                      />
                    </div>
                    <select
                      value={catalogueRubrique}
                      onChange={(e) => setCatalogueRubrique(e.target.value)}
                      className="catalogue-rubrique-select"
                    >
                      <option value="">Toutes les rubriques</option>
                      {rubriques.map((r) => (
                        <option key={r.id} value={r.slug || r.name}>{r.name}</option>
                      ))}
                    </select>
                    <Link
                      href={{
                        pathname: '/articles',
                        query: {
                          ...(catalogueSearch && { search: catalogueSearch }),
                          ...(catalogueRubrique && { rubrique: catalogueRubrique }),
                        },
                      }}
                      className="btn-catalogue-link"
                    >
                      Voir le catalogue
                      <ExternalLink size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {showArticleForm && (
        <div className="modal-overlay" onClick={() => setShowArticleForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editingArticleId ? 'Modifier l\'article' : 'Nouvel article'}</h2>
              <button type="button" className="btn-icon" onClick={() => setShowArticleForm(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleArticleSubmit} className="article-form">
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Titre *</label>
                  <input
                    value={articleForm.title}
                    onChange={(e) => handleArticleFieldChange('title', e.target.value)}
                    required
                    placeholder="Titre de l'article"
                  />
                </div>
                <div className="form-group">
                  <label>Slug (URL)</label>
                  <input
                    value={articleForm.slug}
                    onChange={(e) => handleArticleFieldChange('slug', e.target.value)}
                    placeholder="titre-article"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Rubrique</label>
                <select
                  value={articleForm.rubrique_id}
                  onChange={(e) => handleArticleFieldChange('rubrique_id', e.target.value)}
                >
                  <option value="">— Choisir —</option>
                  {rubriques.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Résumé (court)</label>
                <textarea
                  value={articleForm.excerpt}
                  onChange={(e) => handleArticleFieldChange('excerpt', e.target.value)}
                  rows={2}
                  placeholder="Résumé affiché dans les listes"
                />
              </div>
              <div className="form-group">
                <label>Image de couverture</label>
                <div className="cover-zone">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleArticleImagesUpload}
                  />
                  <button
                    type="button"
                    className="btn-upload"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon size={24} />
                    Ajouter des photos pour la couverture
                  </button>
                  {coverImageUrl && (
                    <div className="cover-preview">
                      <img src={coverImageUrl} alt="Couverture" />
                      <span>Image de couverture</span>
                    </div>
                  )}
                  {uploadedImages.length > 0 && (
                    <div className="uploaded-list">
                      {uploadedImages.map((url, i) => (
                        <div key={i} className="thumb-wrap">
                          <img src={url} alt="" />
                          <button
                            type="button"
                            className="set-cover"
                            onClick={() => {
                              setCoverImageUrl(url);
                              handleArticleFieldChange('featured_image_url', url);
                            }}
                          >
                            {url === coverImageUrl ? 'Couverture' : 'Définir couverture'}
                          </button>
                          <button
                            type="button"
                            className="insert-in-content"
                            onClick={() => addImageBlock(url)}
                          >
                            Ajouter dans l&apos;article
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Contenu — blocs texte et images</label>
                <div className="blocks-toolbar">
                  <button type="button" className="btn-block-add" onClick={addTextBlock}>
                    <FileText size={18} />
                    Ajouter un paragraphe
                  </button>
                  <input
                    ref={blockImageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleBlockImageUpload}
                  />
                  <button
                    type="button"
                    className="btn-block-add"
                    onClick={() => blockImageInputRef.current?.click()}
                  >
                    <ImageIcon size={18} />
                    Ajouter une image
                  </button>
                </div>
                <div className="content-blocks">
                  {contentBlocks.map((block, index) => (
                    <div key={block.id} className="content-block">
                      <div className="block-actions">
                        <button
                          type="button"
                          className="btn-icon small"
                          onClick={() => moveBlock(block.id, -1)}
                          disabled={index === 0}
                          title="Monter"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon small"
                          onClick={() => moveBlock(block.id, 1)}
                          disabled={index === contentBlocks.length - 1}
                          title="Descendre"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon small danger"
                          onClick={() => removeBlock(block.id)}
                          title="Supprimer le bloc"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {block.type === 'text' ? (
                        <textarea
                          className="block-text"
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          placeholder="Paragraphe de texte…"
                          rows={4}
                        />
                      ) : (
                        <div className="block-image-wrap">
                          {block.url ? (
                            <>
                              <img src={block.url} alt={block.alt || ''} className="block-image-preview" />
                              <input
                                type="text"
                                className="block-image-alt"
                                placeholder="Légende (optionnel)"
                                value={block.alt || ''}
                                onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                              />
                            </>
                          ) : (
                            <span className="block-image-placeholder">Image</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {contentBlocks.length === 0 && (
                  <p className="blocks-hint">Cliquez sur « Ajouter un paragraphe » ou « Ajouter une image » pour construire l&apos;article.</p>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Statut</label>
                  <select
                    value={articleForm.status}
                    onChange={(e) => handleArticleFieldChange('status', e.target.value)}
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>
                <div className="form-group checkbox-wrap">
                  <label>
                    <input
                      type="checkbox"
                      checked={articleForm.is_featured}
                      onChange={(e) => handleArticleFieldChange('is_featured', e.target.checked)}
                    />
                    <span>À la une</span>
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={articleSubmitLoading}>
                  {articleSubmitLoading ? <Loader2 size={20} className="spin" /> : <Save size={20} />}
                  {editingArticleId ? 'Enregistrer' : 'Créer l\'article'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowArticleForm(false)}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer settings={settings} />

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background: #212E50;
          padding-top: 80px;
          position: relative;
        }
        .dashboard-bg {
          position: fixed;
          inset: 0;
          background: url('/images/Histoire des arts.png') center/cover no-repeat;
          opacity: 0.06;
          pointer-events: none;
          z-index: 0;
        }
        .dashboard-container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 20px;
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 32px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .dashboard-page.mounted .dashboard-container {
          opacity: 1;
          transform: translateY(0);
        }
        .sidebar {
          background: rgba(33,46,80,0.9);
          border: 1px solid rgba(199,161,30,0.2);
          border-radius: 20px;
          padding: 24px;
          height: fit-content;
          position: sticky;
          top: 100px;
        }
        .sidebar-header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(199,161,30,0.2);
        }
        .avatar-wrap {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #7C2A3C, #C7A11E);
          color: #F8F8F0;
          font-size: 1.5rem;
          font-weight: 700;
          border: 2px solid rgba(199,161,30,0.3);
          cursor: pointer;
          overflow: hidden;
          position: relative;
        }
        .avatar-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatar-loading {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        .hidden { display: none; }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .sidebar-header h3 {
          color: #F8F8F0;
          font-size: 1.1rem;
          margin-bottom: 4px;
        }
        .sidebar-header p {
          color: rgba(248,248,240,0.7);
          font-size: 0.9rem;
          margin-bottom: 8px;
        }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(124,42,60,0.4);
          color: #F1B2C8;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 16px;
        }
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: rgba(248,248,240,0.8);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          text-align: left;
        }
        .nav-btn:hover {
          background: rgba(108,129,87,0.15);
          color: #F8F8F0;
        }
        .nav-btn.active {
          background: rgba(124,42,60,0.3);
          color: #F1B2C8;
        }
        .nav-btn.logout {
          color: #F1B2C8;
          margin-top: 8px;
        }
        .nav-btn.logout:hover {
          background: rgba(124,42,60,0.2);
        }
        .nav-divider {
          height: 1px;
          background: rgba(199,161,30,0.2);
          margin: 8px 0;
        }
        .main {
          min-height: 60vh;
        }
        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }
        .section h1 {
          color: #F8F8F0;
          font-size: 1.75rem;
          margin-bottom: 24px;
        }
        .section-desc {
          color: rgba(248,248,240,0.85);
          font-size: 0.95rem;
          margin-bottom: 24px;
          max-width: 560px;
        }
        .link-inline {
          color: #C7A11E;
          text-decoration: underline;
        }
        .link-inline:hover {
          color: #F8F8F0;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #7C2A3C, #C7A11E);
          color: #F8F8F0;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(124,42,60,0.4);
        }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: rgba(248,248,240,0.1);
          color: #F8F8F0;
          border: 1px solid rgba(199,161,30,0.3);
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-secondary:hover {
          background: rgba(108,129,87,0.2);
        }
        .btn-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(248,248,240,0.08);
          border: 1px solid rgba(199,161,30,0.2);
          border-radius: 10px;
          color: #F8F8F0;
          cursor: pointer;
        }
        .btn-icon:hover { background: rgba(108,129,87,0.2); }
        .btn-icon.danger { color: #F1B2C8; border-color: rgba(241,178,200,0.3); }
        .btn-icon.danger:hover { background: rgba(124,42,60,0.3); }
        .loading-row {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(248,248,240,0.8);
          padding: 40px;
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: rgba(248,248,240,0.7);
        }
        .empty-state svg { margin-bottom: 16px; opacity: 0.5; }
        .empty-state p { margin-bottom: 20px; }
        .articles-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .article-card {
          display: grid;
          grid-template-columns: 120px 1fr auto;
          gap: 20px;
          align-items: center;
          background: rgba(248,248,240,0.05);
          border: 1px solid rgba(199,161,30,0.2);
          border-radius: 16px;
          padding: 16px;
          transition: all 0.2s;
        }
        .article-card:hover {
          border-color: rgba(199,161,30,0.35);
        }
        .article-cover {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 80px;
          border-radius: 10px;
          overflow: hidden;
          background: rgba(0,0,0,0.2);
        }
        .article-cover img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .no-cover {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(248,248,240,0.3);
        }
        .article-body h3 {
          color: #F8F8F0;
          font-size: 1.1rem;
          margin-bottom: 6px;
        }
        .meta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          font-size: 0.8rem;
          color: rgba(248,248,240,0.6);
          margin-bottom: 4px;
        }
        .excerpt {
          font-size: 0.9rem;
          color: rgba(248,248,240,0.7);
          margin: 0;
        }
        .article-actions {
          display: flex;
          gap: 8px;
        }
        .profile-view, .profile-form {
          max-width: 480px;
        }
        .profile-photo-block {
          margin-bottom: 28px;
          max-width: 480px;
        }
        .profile-photo-label {
          display: block;
          color: rgba(248,248,240,0.7);
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .profile-photo-row {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .profile-photo-wrap {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          overflow: hidden;
          background: rgba(199,161,30,0.2);
          border: 2px solid rgba(199,161,30,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: border-color 0.2s, transform 0.15s;
          flex-shrink: 0;
        }
        .profile-photo-wrap:hover:not(:disabled) {
          border-color: rgba(199,161,30,0.7);
          transform: scale(1.02);
        }
        .profile-photo-wrap:disabled {
          cursor: not-allowed;
          opacity: 0.8;
        }
        .profile-photo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .profile-photo-initials {
          font-size: 1.75rem;
          font-weight: 700;
          color: rgba(248,248,240,0.9);
        }
        .profile-photo-loading {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.5);
          color: #F8F8F0;
        }
        .profile-photo-actions {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .profile-photo-hint {
          font-size: 0.8rem;
          color: rgba(248,248,240,0.5);
          margin: 0;
        }
        .btn-sm {
          padding: 8px 16px;
          font-size: 0.9rem;
          align-self: flex-start;
        }
        .catalogue-search-wrap {
          margin-top: 40px;
          padding-top: 32px;
          border-top: 1px solid rgba(199,161,30,0.25);
          max-width: 640px;
        }
        .catalogue-search-title {
          color: #F8F8F0;
          font-size: 1.15rem;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .catalogue-search-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }
        .catalogue-search-input-wrap {
          flex: 1;
          min-width: 200px;
          position: relative;
        }
        .catalogue-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6C8157;
          pointer-events: none;
        }
        .catalogue-search-input {
          width: 100%;
          padding: 10px 14px 10px 40px;
          background: rgba(248,248,240,0.08);
          border: 1px solid rgba(199,161,30,0.3);
          border-radius: 10px;
          color: #F8F8F0;
          font-size: 0.95rem;
          outline: none;
        }
        .catalogue-search-input::placeholder {
          color: rgba(248,248,240,0.5);
        }
        .catalogue-rubrique-select {
          padding: 10px 14px;
          background: rgba(248,248,240,0.08);
          border: 1px solid rgba(199,161,30,0.3);
          border-radius: 10px;
          color: #F8F8F0;
          font-size: 0.95rem;
          min-width: 180px;
          cursor: pointer;
        }
        .btn-catalogue-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(108,129,87,0.4);
          border: 1px solid rgba(108,129,87,0.5);
          border-radius: 10px;
          color: #F8F8F0;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-catalogue-link:hover {
          background: rgba(108,129,87,0.55);
          border-color: rgba(108,129,87,0.7);
        }
        .profile-field {
          margin-bottom: 16px;
        }
        .profile-field label {
          display: block;
          color: rgba(248,248,240,0.7);
          font-size: 0.85rem;
          margin-bottom: 4px;
        }
        .profile-field span {
          color: #F8F8F0;
          font-weight: 500;
        }
        .profile-form .form-group {
          margin-bottom: 16px;
        }
        .profile-form label {
          display: block;
          color: rgba(248,248,240,0.9);
          font-size: 0.9rem;
          margin-bottom: 6px;
        }
        .profile-form input {
          width: 100%;
          padding: 10px 14px;
          background: rgba(248,248,240,0.08);
          border: 1px solid rgba(199,161,30,0.25);
          border-radius: 10px;
          color: #F8F8F0;
          font-size: 1rem;
        }
        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 20px 20px;
          z-index: 1000;
          overflow-y: auto;
        }
        .modal {
          background: #212E50;
          border: 1px solid rgba(199,161,30,0.25);
          border-radius: 20px;
          padding: 24px;
          width: 100%;
          max-width: 720px;
          margin-bottom: 40px;
        }
        .modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .modal-head h2 {
          color: #F8F8F0;
          font-size: 1.35rem;
        }
        .article-form .form-group {
          margin-bottom: 16px;
        }
        .article-form label {
          display: block;
          color: rgba(248,248,240,0.9);
          font-size: 0.9rem;
          margin-bottom: 6px;
        }
        .article-form input,
        .article-form select,
        .article-form textarea {
          width: 100%;
          padding: 10px 14px;
          background: rgba(248,248,240,0.08);
          border: 1px solid rgba(199,161,30,0.25);
          border-radius: 10px;
          color: #F8F8F0;
          font-size: 1rem;
        }
        .article-form textarea { min-height: 120px; resize: vertical; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-row .flex-2 { grid-column: span 1; }
        .cover-zone { margin-top: 8px; }
        .btn-upload {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(108,129,87,0.2);
          border: 1px dashed rgba(199,161,30,0.4);
          border-radius: 10px;
          color: #F8F8F0;
          cursor: pointer;
          margin-bottom: 12px;
        }
        .btn-upload:hover { background: rgba(108,129,87,0.3); }
        .cover-preview {
          margin-bottom: 12px;
        }
        .cover-preview img {
          max-width: 100%;
          max-height: 280px;
          border-radius: 10px;
          object-fit: contain;
        }
        .cover-preview span {
          display: block;
          font-size: 0.85rem;
          color: rgba(248,248,240,0.6);
          margin-top: 4px;
        }
        .uploaded-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .thumb-wrap {
          width: 100px;
          text-align: center;
        }
        .thumb-wrap img {
          width: 100%;
          height: 90px;
          object-fit: contain;
          border-radius: 8px;
          background: rgba(0,0,0,0.2);
        }
        .set-cover, .insert-in-content {
          display: block;
          width: 100%;
          margin-top: 6px;
          padding: 4px 8px;
          font-size: 0.75rem;
          background: rgba(124,42,60,0.3);
          border: none;
          border-radius: 6px;
          color: #F1B2C8;
          cursor: pointer;
        }
        .insert-in-content {
          background: rgba(108,129,87,0.3);
          color: #C7A11E;
        }
        .blocks-toolbar {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .btn-block-add {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(108,129,87,0.25);
          border: 1px solid rgba(108,129,87,0.4);
          border-radius: 10px;
          color: #F8F8F0;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-block-add:hover {
          background: rgba(108,129,87,0.4);
        }
        .content-blocks {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .content-block {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 12px;
          background: rgba(33,46,80,0.5);
          border: 1px solid rgba(199,161,30,0.2);
          border-radius: 12px;
        }
        .block-actions {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex-shrink: 0;
        }
        .block-actions .btn-icon.small {
          padding: 6px;
        }
        .block-text {
          flex: 1;
          min-height: 80px;
          padding: 12px;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(199,161,30,0.2);
          border-radius: 8px;
          color: #F8F8F0;
          font-size: 0.95rem;
          resize: vertical;
        }
        .block-text::placeholder {
          color: rgba(248,248,240,0.5);
        }
        .block-image-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .block-image-preview {
          max-width: 100%;
          max-height: 200px;
          object-fit: contain;
          border-radius: 8px;
        }
        .block-image-alt {
          padding: 8px 12px;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(199,161,30,0.2);
          border-radius: 6px;
          color: #F8F8F0;
          font-size: 0.9rem;
        }
        .block-image-placeholder {
          color: rgba(248,248,240,0.5);
          font-size: 0.9rem;
        }
        .blocks-hint {
          color: rgba(248,248,240,0.6);
          font-size: 0.9rem;
          margin-top: 8px;
        }
        .checkbox-wrap label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .checkbox-wrap input[type="checkbox"] {
          width: auto;
          margin: 0;
        }
        @media (max-width: 900px) {
          .dashboard-container { grid-template-columns: 1fr; }
          .sidebar { position: relative; top: 0; }
          .article-card { grid-template-columns: 80px 1fr; }
          .article-actions { grid-column: 2; }
        }
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr; }
          .article-card { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
