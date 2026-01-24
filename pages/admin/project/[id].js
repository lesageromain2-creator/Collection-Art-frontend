// frontend/pages/admin/project/[id].js - Détails Projet
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminHeader from '../../../components/admin/AdminHeader';
import Modal from '../../../components/admin/Modal';
import { 
  ArrowLeft, 
  Edit, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Plus,
  FileText,
  MessageSquare,
  Calendar
} from 'lucide-react';
import {
  checkAuth,
  getAdminProject,
  updateAdminProject,
  createProjectTask,
  updateProjectTask,
  deleteProjectTask,
  createProjectMilestone,
  updateProjectMilestone,
  addProjectComment
} from '../../../utils/api';

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newComment, setNewComment] = useState('');

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
        router.push('/login?redirect=/admin/projects');
        return;
      }

      setUser(authData.user);
      const data = await getAdminProject(id);
      setProject(data.project || data);
    } catch (error) {
      console.error('Erreur chargement projet:', error);
      router.push('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      await createProjectTask(id, taskData);
      await loadProject();
      setShowTaskModal(false);
    } catch (error) {
      console.error('Erreur création tâche:', error);
      alert('Erreur lors de la création de la tâche');
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await updateProjectTask(taskId, taskData);
      await loadProject();
      setEditingTask(null);
    } catch (error) {
      console.error('Erreur mise à jour tâche:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Supprimer cette tâche ?')) return;
    
    try {
      await deleteProjectTask(taskId);
      await loadProject();
    } catch (error) {
      console.error('Erreur suppression tâche:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addProjectComment(id, newComment, false);
      setNewComment('');
      await loadProject();
    } catch (error) {
      console.error('Erreur ajout commentaire:', error);
    }
  };

  const getStatusInfo = (status) => {
    const statuses = {
      planning: { label: 'Planification', icon: Clock, color: '#f59e0b' },
      in_progress: { label: 'En cours', icon: Clock, color: '#0066FF' },
      on_hold: { label: 'En attente', icon: AlertCircle, color: '#f59e0b' },
      review: { label: 'En révision', icon: Clock, color: '#764ba2' },
      completed: { label: 'Terminé', icon: CheckCircle, color: '#10b981' },
      cancelled: { label: 'Annulé', icon: AlertCircle, color: '#ef4444' },
    };
    return statuses[status] || statuses.planning;
  };

  if (loading || !project) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Chargement du projet...</p>
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

  const statusInfo = getStatusInfo(project.status);
  const StatusIcon = statusInfo.icon;
  const completedTasks = project.tasks?.filter(t => t.completed).length || 0;
  const totalTasks = project.tasks?.length || 0;

  return (
    <>
      <Head>
        <title>{project.title} - Admin LE SAGE DEV</title>
      </Head>

      <div className="admin-layout">
        <AdminSidebar activeSection="projects" />
        <div className="admin-main">
          <AdminHeader user={user} />
          
          <main className="admin-content">
            <div className="content-header">
              <button className="back-btn" onClick={() => router.push('/admin/projects')}>
                <ArrowLeft size={20} />
                Retour
              </button>
              <div className="header-main">
                <div>
                  <h1>{project.title}</h1>
                  <p>{project.client_name || `${project.firstname} ${project.lastname}`}</p>
                </div>
                <div className="status-badge" style={{ background: `rgba(${statusInfo.color}, 0.15)`, color: statusInfo.color }}>
                  <StatusIcon size={18} />
                  <span>{statusInfo.label}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-section">
              <div className="progress-header">
                <span>Progression globale</span>
                <span className="progress-value">{project.progress || 0}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Aperçu
              </button>
              <button
                className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
                onClick={() => setActiveTab('tasks')}
              >
                Tâches ({completedTasks}/{totalTasks})
              </button>
              <button
                className={`tab ${activeTab === 'milestones' ? 'active' : ''}`}
                onClick={() => setActiveTab('milestones')}
              >
                Jalons
              </button>
              <button
                className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                Commentaires
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="info-grid">
                    <div className="info-card">
                      <h3>Description</h3>
                      <p>{project.description || 'Aucune description'}</p>
                    </div>
                    <div className="info-card">
                      <h3>Priorité</h3>
                      <span className="priority-badge">{project.priority || 'medium'}</span>
                    </div>
                    <div className="info-card">
                      <h3>Date de livraison</h3>
                      <p>
                        {project.estimated_delivery 
                          ? new Date(project.estimated_delivery).toLocaleDateString('fr-FR')
                          : 'Non définie'}
                      </p>
                    </div>
                    <div className="info-card">
                      <h3>Date de création</h3>
                      <p>{new Date(project.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="tasks-tab">
                  <div className="section-header">
                    <h2>Tâches</h2>
                    <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
                      <Plus size={18} />
                      Ajouter une tâche
                    </button>
                  </div>
                  <div className="tasks-list">
                    {project.tasks && project.tasks.length > 0 ? (
                      project.tasks.map((task) => (
                        <div key={task.id} className="task-item">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => handleUpdateTask(task.id, { completed: e.target.checked })}
                          />
                          <div className="task-content">
                            <strong>{task.title}</strong>
                            {task.description && <p>{task.description}</p>}
                          </div>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <AlertCircle size={16} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="empty-message">Aucune tâche</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'milestones' && (
                <div className="milestones-tab">
                  <div className="section-header">
                    <h2>Jalons</h2>
                    <button className="btn-primary" onClick={() => setShowMilestoneModal(true)}>
                      <Plus size={18} />
                      Ajouter un jalon
                    </button>
                  </div>
                  <div className="milestones-list">
                    {project.milestones && project.milestones.length > 0 ? (
                      project.milestones.map((milestone) => (
                        <div key={milestone.id} className="milestone-item">
                          <div className="milestone-content">
                            <strong>{milestone.title}</strong>
                            {milestone.description && <p>{milestone.description}</p>}
                            {milestone.due_date && (
                              <span className="milestone-date">
                                <Calendar size={14} />
                                {new Date(milestone.due_date).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                          {milestone.completed && (
                            <CheckCircle size={20} color="#10b981" />
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="empty-message">Aucun jalon</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="comments-tab">
                  <div className="section-header">
                    <h2>Commentaires</h2>
                  </div>
                  <div className="comments-list">
                    {project.comments && project.comments.length > 0 ? (
                      project.comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                          <div className="comment-header">
                            <strong>Admin</strong>
                            <span>{new Date(comment.created_at).toLocaleString('fr-FR')}</span>
                          </div>
                          <p>{comment.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="empty-message">Aucun commentaire</p>
                    )}
                  </div>
                  <div className="add-comment">
                    <textarea
                      placeholder="Ajouter un commentaire..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={4}
                    />
                    <button className="btn-primary" onClick={handleAddComment}>
                      <MessageSquare size={18} />
                      Ajouter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal Ajout Tâche */}
      {showTaskModal && (
        <TaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          onSave={handleAddTask}
        />
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
          margin-bottom: 32px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          cursor: pointer;
          margin-bottom: 16px;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .header-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .header-main h1 {
          color: white;
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .header-main p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 16px;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
        }

        .progress-section {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }

        .progress-value {
          color: white;
          font-weight: 700;
        }

        .progress-bar {
          height: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0066FF, #00D9FF);
          border-radius: 6px;
          transition: width 0.3s ease;
        }

        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tab {
          padding: 12px 24px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab:hover {
          color: white;
        }

        .tab.active {
          color: #00D9FF;
          border-bottom-color: #00D9FF;
        }

        .tab-content {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .info-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-card h3 {
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-card p {
          color: white;
          font-size: 14px;
        }

        .priority-badge {
          padding: 6px 12px;
          background: rgba(255, 107, 53, 0.15);
          color: #FF6B35;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: capitalize;
          display: inline-block;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h2 {
          color: white;
          font-size: 20px;
          font-weight: 700;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.4);
        }

        .tasks-list,
        .milestones-list,
        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .task-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
        }

        .task-item input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .task-content {
          flex: 1;
        }

        .task-content strong {
          color: white;
          font-size: 14px;
          display: block;
          margin-bottom: 4px;
        }

        .task-content p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          margin: 0;
        }

        .delete-btn {
          padding: 8px;
          background: rgba(239, 68, 68, 0.15);
          border: none;
          border-radius: 8px;
          color: #ef4444;
          cursor: pointer;
          transition: all 0.2s;
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        .milestone-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
        }

        .milestone-content {
          flex: 1;
        }

        .milestone-content strong {
          color: white;
          font-size: 14px;
          display: block;
          margin-bottom: 4px;
        }

        .milestone-content p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          margin: 4px 0;
        }

        .milestone-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
        }

        .comment-item {
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          margin-bottom: 12px;
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .comment-header strong {
          color: white;
          font-size: 14px;
        }

        .comment-header span {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
        }

        .comment-item p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          margin: 0;
        }

        .add-comment {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .add-comment textarea {
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 14px;
          font-family: inherit;
          margin-bottom: 12px;
          resize: vertical;
        }

        .add-comment textarea:focus {
          outline: none;
          border-color: #0066FF;
        }

        .add-comment textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .empty-message {
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          padding: 40px;
        }

        @media (max-width: 1024px) {
          .admin-main {
            margin-left: 0;
          }

          .admin-content {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}

// Composant Modal pour ajouter une tâche
function TaskModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouvelle tâche" size="small">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Titre *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la tâche"
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnelle)"
            rows={4}
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="btn-primary">
            Créer
          </button>
        </div>
      </form>

      <style jsx>{`
        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          font-size: 14px;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #0066FF;
        }

        .form-group textarea {
          resize: vertical;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }

        .btn-secondary {
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-primary {
          padding: 12px 24px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </Modal>
  );
}
