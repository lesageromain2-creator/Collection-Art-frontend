// frontend/pages/admin/project/[id].js - COMPLET AVEC DRAG & DROP
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ArrowLeft, Plus, Edit2, Trash2, Calendar, Download,
  Upload, Send, CheckCircle, Circle, FileText
} from 'lucide-react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminHeader from '../../../components/admin/AdminHeader';
import Modal from '../../../components/admin/Modal';
import FileUploadManager from '../../../components/admin/FileUploadManager';
import { 
  checkAuth,
  getAdminProject,
  updateAdminProject,
  deleteAdminProject,
  createProjectTask,
  updateProjectTask,
  deleteProjectTask,
  createProjectMilestone,
  updateProjectMilestone,
  deleteProjectMilestone,
  sendProjectUpdate
} from '../../../utils/api';
import { toast } from 'react-toastify';

// Étapes prédéfinies du projet
const PROJECT_STAGES = [
  { key: 'initial_meeting', title: 'RDV Initial & Devis', icon: '🤝' },
  { key: 'contract_signed', title: 'Signature du Contrat', icon: '📝' },
  { key: 'design_phase', title: 'Phase Design', icon: '🎨' },
  { key: 'design_validation', title: 'Validation Design', icon: '✅' },
  { key: 'development', title: 'Développement', icon: '💻' },
  { key: 'mid_project_review', title: 'RDV Mi-Projet', icon: '🔄' },
  { key: 'testing', title: 'Tests & QA', icon: '🧪' },
  { key: 'final_review', title: 'Revue Finale', icon: '👀' },
  { key: 'launch', title: 'Mise en Ligne', icon: '🚀' },
  { key: 'delivery', title: 'Livraison', icon: '🎉' }
];

export default function AdminProjectDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  
  // Editing states
  const [editingMilestone, setEditingMilestone] = useState(null);

  // Forms
  const [projectForm, setProjectForm] = useState({
    status: '',
    progress: 0,
    priority: 'normal'
  });

  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    target_date: '',
    milestone_type: ''
  });

  const [updateForm, setUpdateForm] = useState({
    title: '',
    message: '',
    update_type: 'info'
  });

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const authData = await checkAuth();
      if (!authData.authenticated || authData.user?.role !== 'admin') {
        router.push('/login?redirect=/admin/project/' + id);
        return;
      }
      setUser(authData.user);

      const projectData = await getAdminProject(id);
      setProject(projectData);
      setProjectForm({
        status: projectData.project?.status || '',
        progress: projectData.project?.progress || 0,
        priority: projectData.project?.priority || 'normal'
      });
    } catch (error) {
      console.error('Erreur chargement projet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (field, value) => {
    try {
      await updateAdminProject(id, { [field]: value });
      await loadProject();
    } catch (error) {
      console.error('Erreur mise à jour projet:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleCreateMilestoneFromStage = (stage) => {
    setEditingMilestone(null);
    setMilestoneForm({
      title: stage.title,
      description: '',
      target_date: '',
      milestone_type: stage.key
    });
    setShowMilestoneModal(true);
  };

  const handleSaveMilestone = async (e) => {
    e.preventDefault();
    try {
      if (editingMilestone) {
        await updateProjectMilestone(editingMilestone.id, milestoneForm);
      } else {
        await createProjectMilestone(id, milestoneForm);
      }
      setShowMilestoneModal(false);
      setMilestoneForm({ title: '', description: '', target_date: '', milestone_type: '' });
      await loadProject();
      alert('Jalon enregistré');
    } catch (error) {
      console.error('Erreur sauvegarde jalon:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleSendUpdate = async (e) => {
    e.preventDefault();
    try {
      await sendProjectUpdate(id, updateForm);
      setShowUpdateModal(false);
      setUpdateForm({ title: '', message: '', update_type: 'info' });
      await loadProject();
      alert('Mise à jour envoyée au client');
    } catch (error) {
      console.error('Erreur envoi update:', error);
      alert('Erreur lors de l\'envoi');
    }
  };

  const toggleMilestoneCompletion = async (milestoneId, currentStatus) => {
    try {
      await updateProjectMilestone(milestoneId, { is_completed: !currentStatus });
      await loadProject();
    } catch (error) {
      console.error('Erreur toggle milestone:', error);
    }
  };

  const getStageStatus = (stage) => {
    const milestone = project?.milestones?.find(m => m.milestone_type === stage.key);
    if (milestone?.is_completed) return 'completed';
    if (milestone) return 'in_progress';
    return 'pending';
  };

  if (loading || !project) {
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

  const proj = project.project || project;

  return (
    <>
      <Head>
        <title>{proj.title} - Gestion Projet</title>
      </Head>

      <div className="admin-layout">
        <AdminSidebar activeSection="projects" />
        <div className="admin-main">
          <AdminHeader user={user} />
          
          <main className="admin-content">
            <Link href="/admin/projects" className="back-link">
              <ArrowLeft size={20} />
              Retour aux projets
            </Link>

            {/* Project Header */}
            <div className="project-header">
              <div className="header-left">
                <h1>{proj.title}</h1>
                <p>{proj.description}</p>
                <div className="client-info">
                  Client: <strong>{proj.client_firstname} {proj.client_lastname}</strong> 
                  <span className="separator">·</span>
                  <a href={`mailto:${proj.client_email}`}>{proj.client_email}</a>
                </div>
              </div>
              <div className="header-right">
                <div className="form-group-inline">
                  <label>Statut</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => {
                      setProjectForm({ ...projectForm, status: e.target.value });
                      handleUpdateProject('status', e.target.value);
                    }}
                    className="status-select"
                  >
                    <option value="discovery">Découverte</option>
                    <option value="design">Design</option>
                    <option value="development">Développement</option>
                    <option value="testing">Tests</option>
                    <option value="launched">Lancé</option>
                    <option value="completed">Terminé</option>
                    <option value="on_hold">En pause</option>
                  </select>
                </div>
                <button 
                  className="btn-delete-project"
                  onClick={async () => {
                    if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer ce projet ?\n\nCette action supprimera également :\n- Toutes les tâches\n- Tous les fichiers\n- Tous les commentaires\n- Tous les jalons\n\nCette action est irréversible !')) {
                      try {
                        await deleteAdminProject(id);
                        toast.success('Projet supprimé avec succès');
                        router.push('/admin/projects');
                      } catch (error) {
                        console.error('Erreur suppression:', error);
                        toast.error('Erreur lors de la suppression du projet');
                      }
                    }
                  }}
                  title="Supprimer le projet"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Progress */}
            <div className="progress-card">
              <div className="progress-header">
                <h3>📊 Avancement Global</h3>
                <div className="progress-controls">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={projectForm.progress}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setProjectForm({ ...projectForm, progress: val });
                    }}
                    onMouseUp={() => handleUpdateProject('progress', projectForm.progress)}
                    className="progress-slider"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={projectForm.progress}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setProjectForm({ ...projectForm, progress: val });
                    }}
                    onBlur={() => handleUpdateProject('progress', projectForm.progress)}
                    className="progress-input"
                  />
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${projectForm.progress}%` }}></div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <button className="action-btn" onClick={() => setShowFileUploadModal(true)}>
                <Upload size={20} />
                Uploader des fichiers
              </button>
              <button className="action-btn" onClick={() => setShowUpdateModal(true)}>
                <Send size={20} />
                Envoyer une mise à jour
              </button>
              <button className="action-btn" onClick={() => handleCreateMilestoneFromStage({ key: '', title: 'Nouveau jalon' })}>
                <Plus size={20} />
                Ajouter un jalon
              </button>
            </div>

            {/* Timeline Stages */}
            <div className="stages-section">
              <h2>🗓️ Étapes du Projet</h2>
              <p className="section-desc">Gérez les étapes clés et validez leur progression</p>
              
              <div className="stages-grid">
                {PROJECT_STAGES.map((stage) => {
                  const status = getStageStatus(stage);
                  const milestone = project.milestones?.find(m => m.milestone_type === stage.key);

                  return (
                    <div key={stage.key} className={`stage-card ${status}`}>
                      <div className="stage-header">
                        <span className="stage-icon">{stage.icon}</span>
                        <h3>{stage.title}</h3>
                        <div className="stage-status">
                          {status === 'completed' ? (
                            <CheckCircle size={20} color="#10b981" />
                          ) : status === 'in_progress' ? (
                            <Circle size={20} color="#FFD700" />
                          ) : (
                            <Circle size={20} color="rgba(255, 255, 255, 0.3)" />
                          )}
                        </div>
                      </div>

                      {milestone && (
                        <div className="stage-details">
                          {milestone.target_date && (
                            <div className="stage-date">
                              <Calendar size={14} />
                              {new Date(milestone.target_date).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                          {milestone.description && (
                            <p className="stage-description">{milestone.description}</p>
                          )}
                        </div>
                      )}

                      <div className="stage-actions">
                        {milestone ? (
                          <>
                            <button 
                              className={`btn-toggle ${milestone.is_completed ? 'completed' : ''}`}
                              onClick={() => toggleMilestoneCompletion(milestone.id, milestone.is_completed)}
                            >
                              {milestone.is_completed ? 'Marquer non terminé' : 'Marquer terminé'}
                            </button>
                            <button 
                              className="btn-edit"
                              onClick={() => {
                                setEditingMilestone(milestone);
                                setMilestoneForm({
                                  title: milestone.title,
                                  description: milestone.description || '',
                                  target_date: milestone.target_date?.substring(0, 10) || '',
                                  milestone_type: milestone.milestone_type
                                });
                                setShowMilestoneModal(true);
                              }}
                            >
                              <Edit2 size={16} />
                            </button>
                          </>
                        ) : (
                          <button 
                            className="btn-create"
                            onClick={() => handleCreateMilestoneFromStage(stage)}
                          >
                            <Plus size={16} />
                            Créer cette étape
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Files Section */}
            <div className="files-section">
              <div className="section-header">
                <h2>📁 Fichiers du Projet</h2>
                <button className="btn-upload-main" onClick={() => setShowFileUploadModal(true)}>
                  <Upload size={20} />
                  Uploader des fichiers
                </button>
              </div>

              <div className="files-list">
                {project.files?.length === 0 ? (
                  <div className="empty-files">
                    <FileText size={60} />
                    <p>Aucun fichier uploadé pour le moment</p>
                    <button className="btn-upload-empty" onClick={() => setShowFileUploadModal(true)}>
                      <Upload size={18} />
                      Uploader le premier fichier
                    </button>
                  </div>
                ) : (
                  project.files?.map(file => (
                    <div key={file.id} className="file-item">
                      <FileText size={28} color="#00D9FF" />
                      <div className="file-info">
                        <h4>{file.file_name}</h4>
                        {file.description && <p>{file.description}</p>}
                        <span className="file-date">
                          {new Date(file.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="file-actions">
                        <button className="btn-icon" onClick={() => window.open(file.file_url, '_blank')}>
                          <Download size={16} />
                        </button>
                        <button className="btn-icon danger">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Updates History */}
            <div className="updates-section">
              <h2>📢 Historique des Mises à Jour</h2>
              <div className="updates-list">
                {project.updates?.slice(0, 10).map(update => (
                  <div key={update.id} className="update-item">
                    <div className="update-header">
                      <h4>{update.title}</h4>
                      <span>{new Date(update.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <p>{update.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      {showMilestoneModal && (
        <Modal onClose={() => setShowMilestoneModal(false)} title={editingMilestone ? 'Modifier l\'étape' : 'Nouvelle étape'}>
          <form onSubmit={handleSaveMilestone} className="form">
            <div className="form-group">
              <label>Titre *</label>
              <input
                type="text"
                required
                value={milestoneForm.title}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={3}
                value={milestoneForm.description}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Date cible</label>
              <input
                type="date"
                value={milestoneForm.target_date}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, target_date: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowMilestoneModal(false)}>Annuler</button>
              <button type="submit" className="btn-primary">Sauvegarder</button>
            </div>
          </form>
        </Modal>
      )}

      {showUpdateModal && (
        <Modal onClose={() => setShowUpdateModal(false)} title="Envoyer une mise à jour au client">
          <form onSubmit={handleSendUpdate} className="form">
            <div className="form-group">
              <label>Titre *</label>
              <input
                type="text"
                required
                value={updateForm.title}
                onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                placeholder="Ex: Validation de la maquette"
              />
            </div>
            <div className="form-group">
              <label>Message *</label>
              <textarea
                rows={6}
                required
                value={updateForm.message}
                onChange={(e) => setUpdateForm({ ...updateForm, message: e.target.value })}
                placeholder="Détaillez l'avancement ou les actions à venir..."
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                value={updateForm.update_type}
                onChange={(e) => setUpdateForm({ ...updateForm, update_type: e.target.value })}
              >
                <option value="info">Information</option>
                <option value="milestone">Jalon atteint</option>
                <option value="warning">Attention requise</option>
                <option value="success">Succès</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowUpdateModal(false)}>Annuler</button>
              <button type="submit" className="btn-primary">Envoyer au client</button>
            </div>
          </form>
        </Modal>
      )}

      {showFileUploadModal && (
        <Modal onClose={() => setShowFileUploadModal(false)} title="Uploader des fichiers" size="large">
          <div style={{ padding: '24px' }}>
            <FileUploadManager
              projectId={id}
              onFilesUploaded={() => {
                setShowFileUploadModal(false);
                loadProject();
                alert('Fichiers uploadés avec succès ! Le client a été notifié.');
              }}
              maxFiles={10}
              maxSize={50 * 1024 * 1024}
            />
          </div>
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

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #00D9FF;
          font-weight: 600;
          text-decoration: none;
          margin-bottom: 24px;
          transition: gap 0.3s;
        }

        .back-link:hover {
          gap: 12px;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 32px;
          padding: 36px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          margin-bottom: 24px;
        }

        .header-left {
          flex: 1;
        }

        .project-header h1 {
          color: white;
          font-size: 2.2em;
          font-weight: 900;
          margin-bottom: 12px;
        }

        .project-header p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .client-info {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        .client-info strong {
          color: #00D9FF;
          font-weight: 700;
        }

        .separator {
          margin: 0 8px;
        }

        .client-info a {
          color: #00D9FF;
          text-decoration: none;
        }

        .client-info a:hover {
          text-decoration: underline;
        }

        .form-group-inline {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group-inline label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-select {
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          min-width: 200px;
        }

        .header-right {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .btn-delete-project {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          color: #ef4444;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-delete-project:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
          transform: scale(1.05);
        }

        .progress-card {
          padding: 28px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          margin-bottom: 32px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .progress-header h3 {
          color: white;
          font-size: 1.3em;
          font-weight: 700;
        }

        .progress-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .progress-slider {
          width: 200px;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
          -webkit-appearance: none;
        }

        .progress-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 102, 255, 0.5);
        }

        .progress-input {
          width: 70px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          text-align: center;
          font-weight: 700;
          font-size: 16px;
        }

        .progress-bar {
          width: 100%;
          height: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0066FF, #00D9FF);
          transition: width 0.5s ease;
          box-shadow: 0 0 20px rgba(0, 102, 255, 0.5);
        }

        .quick-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.5);
        }

        .stages-section,
        .files-section,
        .updates-section {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
        }

        .stages-section h2,
        .files-section h2,
        .updates-section h2 {
          color: white;
          font-size: 1.8em;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .section-desc {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 32px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .btn-upload-main {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(0, 102, 255, 0.2);
          border: 1px solid rgba(0, 102, 255, 0.3);
          border-radius: 10px;
          color: #00D9FF;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-upload-main:hover {
          background: rgba(0, 102, 255, 0.3);
        }

        .stages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .stage-card {
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          transition: all 0.3s;
        }

        .stage-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .stage-card.completed {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .stage-card.in_progress {
          background: rgba(255, 215, 0, 0.08);
          border-color: rgba(255, 215, 0, 0.3);
        }

        .stage-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .stage-icon {
          font-size: 2em;
        }

        .stage-header h3 {
          flex: 1;
          color: white;
          font-size: 1.1em;
          font-weight: 700;
        }

        .stage-details {
          margin-bottom: 16px;
        }

        .stage-date {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(0, 102, 255, 0.15);
          color: #00D9FF;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .stage-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          line-height: 1.5;
        }

        .stage-actions {
          display: flex;
          gap: 8px;
        }

        .btn-toggle {
          flex: 1;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-toggle.completed {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.4);
          color: #10b981;
        }

        .btn-toggle:hover {
          background: rgba(0, 102, 255, 0.2);
          border-color: rgba(0, 102, 255, 0.4);
        }

        .btn-edit,
        .btn-create {
          padding: 10px 16px;
          background: rgba(0, 102, 255, 0.2);
          border: 1px solid rgba(0, 102, 255, 0.3);
          border-radius: 8px;
          color: #00D9FF;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-create {
          flex: 1;
        }

        .btn-edit:hover,
        .btn-create:hover {
          background: rgba(0, 102, 255, 0.3);
        }

        .files-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s;
        }

        .file-item:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(0, 102, 255, 0.3);
        }

        .file-info {
          flex: 1;
        }

        .file-info h4 {
          color: white;
          font-size: 1em;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .file-info p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          margin-bottom: 6px;
        }

        .file-date {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
        }

        .file-actions {
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
          background: rgba(0, 102, 255, 0.2);
          color: #00D9FF;
          border-color: rgba(0, 102, 255, 0.3);
        }

        .btn-icon.danger:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
        }

        .empty-files {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 40px;
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
        }

        .empty-files svg {
          stroke: rgba(255, 255, 255, 0.3);
          margin-bottom: 16px;
        }

        .btn-upload-empty {
          margin-top: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-upload-empty:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.5);
        }

        .updates-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .update-item {
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border-left: 3px solid #00D9FF;
          border-radius: 12px;
        }

        .update-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .update-header h4 {
          color: white;
          font-size: 1.1em;
          font-weight: 700;
        }

        .update-header span {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }

        .update-item p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
        }

        :global(.form) {
          padding: 0;
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

        :global(.btn-primary:hover) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 102, 255, 0.4);
        }

        :global(.btn-secondary) {
          background: rgba(255, 255, 255, 0.05);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        :global(.btn-secondary:hover) {
          background: rgba(255, 255, 255, 0.08);
        }

        @media (max-width: 1024px) {
          .admin-main {
            margin-left: 0;
          }

          .project-header {
            flex-direction: column;
          }

          .quick-actions {
            flex-direction: column;
          }

          .stages-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .stages-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
