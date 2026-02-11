// frontend/pages/admin/projects/new.js - Création d'un nouveau projet
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminHeader from '../../../components/admin/AdminHeader';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Calendar, 
  DollarSign,
  FileText,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { checkAuth, createAdminProject, getAdminClients } from '../../../utils/api';
import { toast } from 'react-toastify';

const PROJECT_TYPES = [
  { value: 'vitrine', label: 'Site Vitrine' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'webapp', label: 'Application Web' },
  { value: 'mobile', label: 'Application Mobile' },
  { value: 'branding', label: 'Branding / Identité' },
  { value: 'refonte', label: 'Refonte de site' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'autre', label: 'Autre' },
];

const PROJECT_STATUSES = [
  { value: 'discovery', label: 'Découverte', color: '#6366f1' },
  { value: 'planning', label: 'Planification', color: '#8b5cf6' },
  { value: 'design', label: 'Design', color: '#ec4899' },
  { value: 'development', label: 'Développement', color: '#f59e0b' },
  { value: 'testing', label: 'Tests', color: '#10b981' },
  { value: 'review', label: 'Révision', color: '#06b6d4' },
  { value: 'completed', label: 'Terminé', color: '#22c55e' },
  { value: 'on_hold', label: 'En pause', color: '#6b7280' },
];

export default function NewProject() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_type: 'vitrine',
    status: 'discovery',
    user_id: '',
    start_date: '',
    estimated_delivery: '',
    total_price: '',
    deposit_paid: false,
    final_paid: false,
    send_email: true,
    email_message: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    initPage();
  }, []);

  const initPage = async () => {
    try {
      const authData = await checkAuth();
      if (!authData.authenticated || authData.user?.role !== 'admin') {
        router.push('/login?redirect=/admin/projects/new');
        return;
      }
      setUser(authData.user);
      
      // Charger les clients
      await loadClients();
    } catch (error) {
      console.error('Erreur initialisation:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      setLoadingClients(true);
      const data = await getAdminClients();
      setClients(data.clients || data.users || []);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
      toast.error('Impossible de charger la liste des clients');
    } finally {
      setLoadingClients(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (!formData.user_id) {
      newErrors.user_id = 'Veuillez sélectionner un client';
    }
    
    if (!formData.project_type) {
      newErrors.project_type = 'Le type de projet est requis';
    }
    
    if (formData.total_price && isNaN(parseFloat(formData.total_price))) {
      newErrors.total_price = 'Le prix doit être un nombre valide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const projectData = {
        ...formData,
        total_price: formData.total_price ? parseFloat(formData.total_price) : null,
        start_date: formData.start_date || null,
        estimated_delivery: formData.estimated_delivery || null,
      };
      
      const result = await createAdminProject(projectData);
      
      toast.success('Projet créé avec succès !');
      
      // Rediriger vers la page du projet
      router.push(`/admin/project/${result.project.id}`);
    } catch (error) {
      console.error('Erreur création projet:', error);
      toast.error(error.message || 'Erreur lors de la création du projet');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar activeSection="projects" />
        <div className="admin-main">
          <div className="loading-container">
            <Loader2 className="animate-spin" size={48} />
            <p>Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Nouveau Projet - Admin Collection Aur'art</title>
      </Head>

      <div className="admin-layout">
        <AdminSidebar activeSection="projects" />
        <div className="admin-main">
          <AdminHeader user={user} />
          
          <main className="admin-content">
            {/* Header */}
            <div className="content-header">
              <button 
                className="btn-back"
                onClick={() => router.push('/admin/projects')}
              >
                <ArrowLeft size={20} />
                Retour aux projets
              </button>
              <h1>Créer un nouveau projet</h1>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-grid">
                {/* Section Client */}
                <div className="form-section">
                  <h2><User size={20} /> Client</h2>
                  
                  <div className="form-group">
                    <label htmlFor="user_id">Sélectionner un client *</label>
                    {loadingClients ? (
                      <div className="loading-inline">
                        <Loader2 className="animate-spin" size={16} />
                        <span>Chargement des clients...</span>
                      </div>
                    ) : (
                      <select
                        id="user_id"
                        name="user_id"
                        value={formData.user_id}
                        onChange={handleChange}
                        className={errors.user_id ? 'error' : ''}
                      >
                        <option value="">-- Sélectionner un client --</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>
                            {client.firstname} {client.lastname} ({client.email})
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.user_id && (
                      <span className="error-message">
                        <AlertCircle size={14} />
                        {errors.user_id}
                      </span>
                    )}
                  </div>
                </div>

                {/* Section Projet */}
                <div className="form-section">
                  <h2><FileText size={20} /> Informations du projet</h2>
                  
                  <div className="form-group">
                    <label htmlFor="title">Titre du projet *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Ex: Site vitrine pour Restaurant XYZ"
                      className={errors.title ? 'error' : ''}
                    />
                    {errors.title && (
                      <span className="error-message">
                        <AlertCircle size={14} />
                        {errors.title}
                      </span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="project_type">Type de projet *</label>
                      <select
                        id="project_type"
                        name="project_type"
                        value={formData.project_type}
                        onChange={handleChange}
                      >
                        {PROJECT_TYPES.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="status">Statut initial</label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        {PROJECT_STATUSES.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Décrivez le projet, ses objectifs, les fonctionnalités prévues..."
                    />
                  </div>
                </div>

                {/* Section Dates */}
                <div className="form-section">
                  <h2><Calendar size={20} /> Planning</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="start_date">Date de début</label>
                      <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="estimated_delivery">Livraison estimée</label>
                      <input
                        type="date"
                        id="estimated_delivery"
                        name="estimated_delivery"
                        value={formData.estimated_delivery}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Section Financier */}
                <div className="form-section">
                  <h2><DollarSign size={20} /> Budget & Paiements</h2>
                  
                  <div className="form-group">
                    <label htmlFor="total_price">Prix total (€)</label>
                    <input
                      type="number"
                      id="total_price"
                      name="total_price"
                      value={formData.total_price}
                      onChange={handleChange}
                      placeholder="Ex: 5000"
                      min="0"
                      step="0.01"
                      className={errors.total_price ? 'error' : ''}
                    />
                    {errors.total_price && (
                      <span className="error-message">
                        <AlertCircle size={14} />
                        {errors.total_price}
                      </span>
                    )}
                  </div>

                  <div className="form-row checkboxes">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="deposit_paid"
                        checked={formData.deposit_paid}
                        onChange={handleChange}
                      />
                      <span>Acompte reçu</span>
                    </label>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="final_paid"
                        checked={formData.final_paid}
                        onChange={handleChange}
                      />
                      <span>Paiement final reçu</span>
                    </label>
                  </div>
                </div>

                {/* Section Email */}
                <div className="form-section">
                  <h2><Send size={20} /> Notification client</h2>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="send_email"
                      checked={formData.send_email}
                      onChange={handleChange}
                    />
                    <span>Envoyer un email au client pour l'informer de la création du projet</span>
                  </label>

                  {formData.send_email && (
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label htmlFor="email_message">Message personnalisé (optionnel)</label>
                      <textarea
                        id="email_message"
                        name="email_message"
                        value={formData.email_message}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Ajoutez un message personnalisé pour le client..."
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => router.push('/admin/projects')}
                  disabled={submitting}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Créer le projet
                    </>
                  )}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #0a0a0f;
        }

        .admin-main {
          flex: 1;
          margin-left: 260px;
        }

        .admin-content {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          color: #9ca3af;
        }

        .loading-container p {
          margin-top: 1rem;
        }

        .content-header {
          margin-bottom: 2rem;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid #374151;
          color: #9ca3af;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 1rem;
          transition: all 0.2s;
        }

        .btn-back:hover {
          background: #1f2937;
          color: #fff;
        }

        .content-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
        }

        .project-form {
          background: #111827;
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid #1f2937;
        }

        .form-grid {
          display: grid;
          gap: 2rem;
        }

        .form-section {
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #1f2937;
        }

        .form-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .form-section h2 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 1.25rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #9ca3af;
          margin-bottom: 0.5rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 8px;
          color: #fff;
          font-size: 0.9375rem;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-group input.error,
        .form-group select.error {
          border-color: #ef4444;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ef4444;
          font-size: 0.8125rem;
          margin-top: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .form-row.checkboxes {
          display: flex;
          gap: 2rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          color: #d1d5db;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #6366f1;
        }

        .loading-inline {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #1f2937;
          border-radius: 8px;
          color: #9ca3af;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #1f2937;
        }

        .btn-primary,
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #fff;
          border: none;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: transparent;
          color: #9ca3af;
          border: 1px solid #374151;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #1f2937;
          color: #fff;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .admin-main {
            margin-left: 0;
          }

          .admin-content {
            padding: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-row.checkboxes {
            flex-direction: column;
            gap: 1rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
