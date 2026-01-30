// frontend/pages/mes-projets/[id].js - COMPLET AVEC TIMELINE
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ArrowLeft, Download, FileText, MessageSquare,
  ExternalLink, AlertCircle, CheckCircle, Image as ImageIcon,
  File as FileIcon, Video
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProjectTimeline from '../../components/ProjectTimeline';
import { checkAuth, fetchSettings, getProjectFiles, getProjectFileDownload } from '../../utils/api';

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    if (id) {
      loadProjectData();
      // Polling toutes les 30s pour updates
      const interval = setInterval(loadProjectData, 30000);
      return () => clearInterval(interval);
    }
  }, [id]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      
      // Vérifier l'authentification
      const authData = await checkAuth();
      if (!authData.authenticated) {
        router.push('/login?redirect=/mes-projets/' + id);
        return;
      }
      setUser(authData.user);

      // Charger les données du projet
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/dashboard/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Projet non trouvé');
      }

      const data = await response.json();
      setProject(data.project || data);

      // Charger les fichiers
      try {
        const filesData = await getProjectFiles(id);
        const filesArray = filesData.files || filesData || [];
        // Trier par date (plus récents d'abord)
        const sortedFiles = filesArray.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setFiles(sortedFiles);
      } catch (err) {
        console.error('Erreur fichiers:', err);
      }

      const settingsData = await fetchSettings();
      setSettings(settingsData);

    } catch (error) {
      console.error('Erreur chargement projet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId) => {
    try {
      const url = await getProjectFileDownload(id, fileId);
      window.open(url, '_blank');
    } catch (error) {
      alert('Erreur lors du téléchargement');
    }
  };

  const getFileIcon = (file) => {
    const type = file.mime_type || file.file_type || '';
    if (type.startsWith('image/')) return <ImageIcon size={32} color="#00D9FF" />;
    if (type.includes('video/')) return <Video size={32} color="#FF6B35" />;
    if (type.includes('pdf')) return <FileText size={32} color="#FFD700" />;
    return <FileIcon size={32} color="#00D9FF" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getStatusColor = (status) => {
    const colors = {
      discovery: '#FFD700',
      design: '#00D9FF',
      development: '#0066FF',
      testing: '#FF8C42',
      launched: '#10b981',
      completed: '#6b7280',
      on_hold: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      discovery: 'Découverte',
      design: 'Design',
      development: 'Développement',
      testing: 'Tests',
      launched: 'Lancé',
      completed: 'Terminé',
      on_hold: 'En pause'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <>
        <Head><title>Chargement...</title></Head>
        <Header settings={settings} />
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Chargement de votre projet...</p>
        </div>
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            background: #0A0E27;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
          }
          .spinner {
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
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Head><title>Projet non trouvé</title></Head>
        <Header settings={settings} />
        <div className="error-screen">
          <AlertCircle size={80} />
          <h1>Projet non trouvé</h1>
          <p>Ce projet n'existe pas ou vous n'y avez pas accès.</p>
          <Link href="/dashboard" className="back-btn">
            ← Retour au dashboard
          </Link>
        </div>
        <style jsx>{`
          .error-screen {
            min-height: 100vh;
            background: #0A0E27;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
            padding: 40px 20px;
          }
          .error-screen svg {
            stroke: rgba(255, 255, 255, 0.3);
            margin-bottom: 24px;
          }
          .error-screen h1 {
            font-size: 2em;
            margin-bottom: 12px;
          }
          .error-screen p {
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 24px;
          }
          .back-btn {
            color: #00D9FF;
            font-weight: 600;
            text-decoration: none;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{project.title} - Mon Projet</title>
      </Head>

      <Header settings={settings} />

      <div className="project-page">
        <div className="container">
          <Link href="/dashboard" className="back-link">
            <ArrowLeft size={20} />
            Retour au dashboard
          </Link>

          {/* Project Hero */}
          <div className="project-hero">
            <div className="hero-content">
              <div className="hero-text">
                <h1>{project.title}</h1>
                <p>{project.description}</p>
              </div>
              <div 
                className="status-badge" 
                style={{ 
                  background: `${getStatusColor(project.status)}20`,
                  border: `2px solid ${getStatusColor(project.status)}`,
                  color: getStatusColor(project.status)
                }}
              >
                {getStatusLabel(project.status)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-container">
              <div className="progress-header">
                <span>Progression globale</span>
                <span className="progress-value">{project.progress || 0}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${project.progress || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="tabs-nav">
            <button 
              className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              📅 Chronologie
            </button>
            <button 
              className={`tab ${activeTab === 'files' ? 'active' : ''}`}
              onClick={() => setActiveTab('files')}
            >
              📁 Fichiers ({files.length})
            </button>
            <button 
              className={`tab ${activeTab === 'updates' ? 'active' : ''}`}
              onClick={() => setActiveTab('updates')}
            >
              📢 Mises à jour
            </button>
          </div>

          {/* Content */}
          <div className="content-area">
            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <ProjectTimeline 
                milestones={project.milestones || []}
                startDate={project.start_date}
                currentStatus={project.status}
                completedStages={project.completed_stages || []}
              />
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
              <div className="files-section">
                <div className="files-header">
                  <h2>📁 Vos Fichiers</h2>
                  <p>Tous les fichiers partagés par notre équipe</p>
                </div>

                {files.length === 0 ? (
                  <div className="empty-state">
                    <FileText size={80} />
                    <h3>Aucun fichier disponible</h3>
                    <p>Les fichiers partagés par notre équipe apparaîtront ici.</p>
                    <p className="tip">💡 Vous serez notifié dès qu'un nouveau fichier sera ajouté</p>
                  </div>
                ) : (
                  <div className="files-grid">
                    {files.map((file) => (
                      <div key={file.id} className="file-card">
                        <div className="file-icon-container">
                          {getFileIcon(file)}
                        </div>
                        
                        <div className="file-info">
                          <h4>{file.file_name}</h4>
                          {file.description && (
                            <p className="file-description">{file.description}</p>
                          )}
                          <div className="file-meta">
                            <span className="file-size">{formatFileSize(file.file_size)}</span>
                            <span className="file-date">
                              {new Date(file.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          {file.uploaded_by_firstname && (
                            <div className="uploaded-by">
                              Ajouté par {file.uploaded_by_firstname} {file.uploaded_by_lastname}
                            </div>
                          )}
                        </div>

                        <button 
                          className="download-btn"
                          onClick={() => handleDownload(file.id)}
                          title="Télécharger"
                        >
                          <Download size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Updates Tab */}
            {activeTab === 'updates' && (
              <div className="updates-section">
                <div className="updates-header">
                  <h2>📢 Mises à jour</h2>
                  <p>Suivez toutes les communications de notre équipe</p>
                </div>

                {!project.updates || project.updates.length === 0 ? (
                  <div className="empty-state">
                    <MessageSquare size={80} />
                    <h3>Aucune mise à jour</h3>
                    <p>Les communications de l'équipe apparaîtront ici.</p>
                  </div>
                ) : (
                  <div className="updates-timeline">
                    {project.updates.map((update) => (
                      <div key={update.id} className="update-card">
                        <div className="update-header">
                          <h3>{update.title}</h3>
                          <span className="update-date">
                            {new Date(update.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="update-content">
                          <p>{update.message}</p>
                        </div>
                        {update.firstname && (
                          <div className="update-author">
                            Par {update.firstname} {update.lastname}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Actions */}
          <div className="sidebar-actions">
            <div className="action-card">
              <h3>💬 Besoin d'aide ?</h3>
              <p>Contactez directement notre équipe</p>
              <Link href="/messages" className="action-btn primary">
                <MessageSquare size={20} />
                Ouvrir la messagerie
              </Link>
            </div>

            {project.staging_url && (
              <div className="action-card">
                <h3>🌐 Aperçu du projet</h3>
                <p>Voir la version de test</p>
                <a 
                  href={project.staging_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-btn secondary"
                >
                  <ExternalLink size={20} />
                  Ouvrir l'aperçu
                </a>
              </div>
            )}

            {project.production_url && (
              <div className="action-card highlight">
                <h3>🚀 Site en ligne</h3>
                <p>Votre projet est accessible</p>
                <a 
                  href={project.production_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-btn success"
                >
                  <CheckCircle size={20} />
                  Voir le site
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer settings={settings} />

      <style jsx>{`
        .project-page {
          min-height: 100vh;
          background: #0A0E27;
          padding: 120px 20px 80px;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 32px;
        }

        .back-link {
          grid-column: 1 / -1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #00D9FF;
          font-weight: 600;
          text-decoration: none;
          margin-bottom: 20px;
          transition: gap 0.3s;
          width: fit-content;
        }

        .back-link:hover {
          gap: 12px;
        }

        .project-hero {
          grid-column: 1 / -1;
          padding: 40px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          margin-bottom: 32px;
        }

        .hero-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 30px;
          margin-bottom: 32px;
        }

        .hero-text {
          flex: 1;
        }

        .project-hero h1 {
          color: white;
          font-size: 2.5em;
          font-weight: 900;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .project-hero p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.15em;
          line-height: 1.6;
        }

        .status-badge {
          padding: 14px 28px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .progress-container {
          padding: 24px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 16px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .progress-header span {
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
        }

        .progress-value {
          color: #00D9FF;
          font-size: 1.8em;
          font-weight: 900;
        }

        .progress-bar {
          width: 100%;
          height: 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0066FF, #00D9FF);
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 20px rgba(0, 102, 255, 0.5);
        }

        .tabs-nav {
          grid-column: 1 / -1;
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          overflow-x: auto;
        }

        .tab {
          padding: 14px 28px;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .tab:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .tab.active {
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          color: white;
        }

        .content-area {
          grid-column: 1;
        }

        .files-section,
        .updates-section {
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .files-header,
        .updates-header {
          margin-bottom: 32px;
        }

        .files-header h2,
        .updates-header h2 {
          color: white;
          font-size: 2em;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .files-header p,
        .updates-header p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.05em;
        }

        .files-grid {
          display: grid;
          gap: 16px;
        }

        .file-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          transition: all 0.3s;
          animation: slideIn 0.5s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .file-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(0, 102, 255, 0.5);
          transform: translateX(4px);
        }

        .file-icon-container {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 102, 255, 0.15);
          border-radius: 12px;
          flex-shrink: 0;
        }

        .file-info {
          flex: 1;
          min-width: 0;
        }

        .file-info h4 {
          color: white;
          font-size: 1.1em;
          font-weight: 700;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.95em;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .file-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .file-size,
        .file-date {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }

        .uploaded-by {
          margin-top: 8px;
          padding: 4px 10px;
          background: rgba(0, 217, 255, 0.15);
          color: #00D9FF;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
        }

        .download-btn {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          border: none;
          border-radius: 12px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          flex-shrink: 0;
        }

        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.6);
        }

        .updates-timeline {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .update-card {
          padding: 28px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-left: 4px solid #00D9FF;
          border-radius: 16px;
          animation: slideIn 0.5s ease;
        }

        .update-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 16px;
        }

        .update-header h3 {
          color: white;
          font-size: 1.3em;
          font-weight: 700;
        }

        .update-date {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          font-weight: 600;
        }

        .update-content p {
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.7;
          font-size: 1.05em;
        }

        .update-author {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: #00D9FF;
          font-size: 14px;
          font-weight: 600;
        }

        .sidebar-actions {
          grid-column: 2;
          grid-row: 4;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .action-card {
          padding: 24px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          transition: all 0.3s;
        }

        .action-card:hover {
          border-color: rgba(0, 102, 255, 0.3);
        }

        .action-card.highlight {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .action-card h3 {
          color: white;
          font-size: 1.2em;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .action-card p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin-bottom: 16px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          color: white;
        }

        .action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.5);
        }

        .action-btn.secondary {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .action-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(0, 102, 255, 0.5);
        }

        .action-btn.success {
          background: linear-gradient(135deg, #10b981, #34d399);
          color: white;
        }

        .action-btn.success:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.5);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          text-align: center;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          border: 2px dashed rgba(255, 255, 255, 0.1);
        }

        .empty-state svg {
          stroke: rgba(255, 255, 255, 0.3);
          margin-bottom: 24px;
        }

        .empty-state h3 {
          color: white;
          font-size: 1.6em;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .empty-state p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.05em;
          max-width: 400px;
        }

        .empty-state .tip {
          margin-top: 16px;
          color: #00D9FF;
          font-size: 0.95em;
        }

        @media (max-width: 1200px) {
          .container {
            grid-template-columns: 1fr;
          }

          .sidebar-actions {
            grid-column: 1;
            grid-row: auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .project-page {
            padding: 100px 15px 60px;
          }

          .project-hero {
            padding: 28px 24px;
          }

          .hero-content {
            flex-direction: column;
            gap: 20px;
          }

          .project-hero h1 {
            font-size: 1.8em;
          }

          .tabs-nav {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .sidebar-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
