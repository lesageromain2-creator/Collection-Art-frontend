// frontend/components/admin/FileUploadManager.js
import { useState, useCallback } from 'react';
import { Upload, X, FileText, Image, File, CheckCircle, AlertCircle } from 'lucide-react';

export default function FileUploadManager({ 
  projectId, 
  onFilesUploaded,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024 // 50MB
}) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({});
  const [errors, setErrors] = useState({});

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    // Vérifier le nombre de fichiers
    if (files.length + newFiles.length > maxFiles) {
      alert(`Vous ne pouvez uploader que ${maxFiles} fichiers maximum`);
      return;
    }

    // Vérifier la taille des fichiers
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize) {
        alert(`${file.name} est trop volumineux (max ${(maxSize / 1024 / 1024).toFixed(0)}MB)`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles.map(file => ({
      file,
      id: Math.random().toString(36),
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }))]);
  };

  const removeFile = (id) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const token = localStorage.getItem('authToken');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    for (const fileObj of files) {
      try {
        setProgress(prev => ({ ...prev, [fileObj.id]: 0 }));

        const formData = new FormData();
        formData.append('files', fileObj.file);

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setProgress(prev => ({ ...prev, [fileObj.id]: percent }));
          }
        });

        await new Promise((resolve, reject) => {
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setProgress(prev => ({ ...prev, [fileObj.id]: 100 }));
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error('Upload failed'));
            }
          });

          xhr.addEventListener('error', () => reject(new Error('Network error')));

          xhr.open('POST', `${API_URL}/projects/${projectId}/files`);
          if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
          xhr.send(formData);
        });

        // Attendre un peu avant le prochain fichier
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        console.error(`Erreur upload ${fileObj.name}:`, error);
        setErrors(prev => ({ ...prev, [fileObj.id]: error.message }));
      }
    }

    setUploading(false);
    
    // Si tous les fichiers sont uploadés avec succès
    const allSuccess = files.every(f => progress[f.id] === 100 && !errors[f.id]);
    if (allSuccess) {
      onFilesUploaded?.();
      setFiles([]);
      setProgress({});
      setErrors({});
    }
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image size={24} />;
    if (type.includes('pdf')) return <FileText size={24} />;
    return <File size={24} />;
  };

  return (
    <div className="file-upload-manager">
      {/* Drop Zone */}
      <div
        className={`drop-zone ${dragActive ? 'active' : ''} ${uploading ? 'disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={uploading}
        />
        <Upload size={48} />
        <h3>{dragActive ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}</h3>
        <p>ou cliquez pour sélectionner</p>
        <span className="file-limit">Maximum {maxFiles} fichiers · {(maxSize / 1024 / 1024).toFixed(0)}MB par fichier</span>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="files-preview">
          <div className="preview-header">
            <h4>{files.length} fichier{files.length > 1 ? 's' : ''} prêt{files.length > 1 ? 's' : ''} à uploader</h4>
            {!uploading && (
              <button className="btn-clear" onClick={() => setFiles([])}>
                Tout effacer
              </button>
            )}
          </div>

          <div className="preview-list">
            {files.map((fileObj) => (
              <div key={fileObj.id} className="file-preview-item">
                <div className="file-preview-content">
                  {fileObj.preview ? (
                    <img src={fileObj.preview} alt={fileObj.name} className="file-thumbnail" />
                  ) : (
                    <div className="file-icon">
                      {getFileIcon(fileObj.type)}
                    </div>
                  )}
                  
                  <div className="file-details">
                    <h5>{fileObj.name}</h5>
                    <p>{formatBytes(fileObj.size)}</p>
                  </div>

                  {!uploading && !progress[fileObj.id] && (
                    <button className="btn-remove" onClick={() => removeFile(fileObj.id)}>
                      <X size={18} />
                    </button>
                  )}

                  {progress[fileObj.id] !== undefined && (
                    <div className="upload-status">
                      {progress[fileObj.id] === 100 ? (
                        <CheckCircle size={24} color="#10b981" />
                      ) : errors[fileObj.id] ? (
                        <AlertCircle size={24} color="#ef4444" />
                      ) : (
                        <div className="progress-circle">{progress[fileObj.id]}%</div>
                      )}
                    </div>
                  )}
                </div>

                {progress[fileObj.id] > 0 && progress[fileObj.id] < 100 && (
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress[fileObj.id]}%` }}></div>
                  </div>
                )}

                {errors[fileObj.id] && (
                  <div className="error-message">{errors[fileObj.id]}</div>
                )}
              </div>
            ))}
          </div>

          {!uploading && files.length > 0 && (
            <button className="btn-upload" onClick={uploadFiles}>
              <Upload size={20} />
              Uploader {files.length} fichier{files.length > 1 ? 's' : ''}
            </button>
          )}

          {uploading && (
            <div className="uploading-state">
              <div className="spinner"></div>
              <p>Upload en cours...</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .file-upload-manager {
          width: 100%;
        }

        .drop-zone {
          border: 3px dashed rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 60px 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.03);
        }

        .drop-zone:hover:not(.disabled) {
          border-color: rgba(0, 102, 255, 0.5);
          background: rgba(0, 102, 255, 0.05);
        }

        .drop-zone.active {
          border-color: #00D9FF;
          background: rgba(0, 217, 255, 0.1);
          transform: scale(1.02);
        }

        .drop-zone.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .drop-zone svg {
          margin: 0 auto 20px;
          color: rgba(255, 255, 255, 0.6);
        }

        .drop-zone h3 {
          color: white;
          font-size: 1.3em;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .drop-zone p {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 12px;
        }

        .file-limit {
          display: block;
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }

        .files-preview {
          margin-top: 24px;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .preview-header h4 {
          color: white;
          font-size: 16px;
          font-weight: 700;
        }

        .btn-clear {
          padding: 8px 16px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: #ef4444;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-clear:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        .preview-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .file-preview-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }

        .file-preview-content {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
        }

        .file-thumbnail {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .file-icon {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          background: rgba(0, 102, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00D9FF;
          flex-shrink: 0;
        }

        .file-details {
          flex: 1;
          min-width: 0;
        }

        .file-details h5 {
          color: white;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-details p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          margin: 0;
        }

        .btn-remove {
          width: 32px;
          height: 32px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          flex-shrink: 0;
        }

        .btn-remove:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        .upload-status {
          flex-shrink: 0;
        }

        .progress-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 102, 255, 0.2);
          color: #00D9FF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0066FF, #00D9FF);
          transition: width 0.3s ease;
        }

        .error-message {
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          font-size: 12px;
        }

        .btn-upload {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
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

        .btn-upload:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.5);
        }

        .uploading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px;
          color: rgba(255, 255, 255, 0.8);
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: #00D9FF;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .drop-zone {
            padding: 40px 20px;
          }

          .file-preview-content {
            gap: 12px;
            padding: 12px;
          }

          .file-thumbnail,
          .file-icon {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </div>
  );
}
