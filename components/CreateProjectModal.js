// frontend/components/CreateProjectModal.js
import { useState, useEffect } from 'react';
import { X, Upload, Calendar, DollarSign, FileText, User, Mail, Phone, Building } from 'lucide-react';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const PROJECT_TYPES = [
  { value: 'vitrine', label: 'Site Vitrine' },
  { value: 'ecommerce', label: 'Boutique E-commerce' },
  { value: 'webapp', label: 'Application Web' },
  { value: 'branding', label: 'Identité Visuelle' },
  { value: 'refonte', label: 'Refonte Site' },
  { value: 'maintenance', label: 'Maintenance Web' },
  { value: 'autre', label: 'Autre' }
];

const STATUSES = [
  { value: 'discovery', label: 'Découverte' },
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Développement' },
  { value: 'testing', label: 'Tests' },
  { value: 'launched', label: 'Lancé' },
  { value: 'completed', label: 'Terminé' }
];

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated, users = [] }) {
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
    email_message: ''
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users.slice(0, 5)); // Limiter l'affichage
    }
  }, [searchTerm, users]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB max
    );

    if (validFiles.length !== files.length) {
      toast.error('Certains fichiers sont invalides. Seules les images de moins de 5MB sont acceptées.');
    }

    setImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToCloudinary = async () => {
    if (images.length === 0) return [];

    setUploading(true);
    const uploadedImages = [];

    try {
      for (const image of images) {
        const formData = new FormData();
        formData.append('files', image);
        formData.append('folder', `projects/${formData.title || 'new-project'}`);

        const response = await fetch(`${API_URL}/files/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          uploadedImages.push(...result.files);
        }
      }
    } catch (error) {
      console.error('Erreur upload images:', error);
      toast.error('Erreur lors de l\'upload des images');
    } finally {
      setUploading(false);
    }

    return uploadedImages;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.user_id) {
      toast.error('Le titre et le client sont requis');
      return;
    }

    setLoading(true);

    try {
      // Upload des images d'abord
      const uploadedImages = await uploadImagesToCloudinary();

      // Création du projet
      const projectData = {
        ...formData,
        total_price: formData.total_price ? parseFloat(formData.total_price) : null,
        images: uploadedImages
      };

      const response = await fetch(`${API_URL}/admin/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Projet créé avec succès !');
        
        if (formData.send_email && formData.email_message) {
          toast.info('Email en cours d\'envoi au client...');
        }

        onProjectCreated && onProjectCreated(result.project);
        onClose();
        
        // Reset formulaire
        setFormData({
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
          email_message: ''
        });
        setImages([]);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de la création du projet');
      }
    } catch (error) {
      console.error('Erreur création projet:', error);
      toast.error('Erreur lors de la création du projet');
    } finally {
      setLoading(false);
    }
  };

  const selectedUser = users.find(u => u.id === formData.user_id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Créer un Nouveau Projet</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du projet *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Site Vitrine Entreprise X"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de projet *
              </label>
              <select
                name="project_type"
                value={formData.project_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {PROJECT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Description détaillée du projet..."
            />
          </div>

          {/* Sélection client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client *
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, user_id: user.id }));
                        setSearchTerm(`${user.firstname} ${user.lastname} - ${user.email}`);
                        setFilteredUsers([]);
                      }}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b"
                    >
                      <div className="font-medium">{user.firstname} {user.lastname}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.company_name && (
                        <div className="text-sm text-gray-400">{user.company_name}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {selectedUser && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-900">
                  <User className="w-4 h-4" />
                  <span className="font-medium">
                    {selectedUser.firstname} {selectedUser.lastname}
                  </span>
                </div>
                <div className="text-sm text-blue-700 mt-1">
                  <Mail className="w-3 h-3 inline mr-1" />
                  {selectedUser.email}
                  {selectedUser.company_name && (
                    <>
                      <Building className="w-3 h-3 inline ml-2 mr-1" />
                      {selectedUser.company_name}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Dates et prix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Livraison estimée
              </label>
              <input
                type="date"
                name="estimated_delivery"
                value={formData.estimated_delivery}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix total (€)
              </label>
              <input
                type="number"
                name="total_price"
                value={formData.total_price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Statut et paiements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {STATUSES.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="deposit_paid"
                  checked={formData.deposit_paid}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Acompte payé</span>
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="final_paid"
                  checked={formData.final_paid}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Solde payé</span>
              </label>
            </div>
          </div>

          {/* Upload images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images du projet
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center cursor-pointer hover:text-blue-600"
              >
                <Upload className="w-8 h-8 mb-2" />
                <span className="text-sm">Cliquez pour ajouter des images</span>
                <span className="text-xs text-gray-500">PNG, JPG, GIF (max 5MB)</span>
              </label>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Email au client */}
          <div>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                name="send_email"
                checked={formData.send_email}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Envoyer un email au client
              </span>
            </label>
            
            {formData.send_email && (
              <textarea
                name="email_message"
                value={formData.email_message}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Message personnalisé pour le client..."
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || uploading ? 'Création...' : 'Créer le projet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
