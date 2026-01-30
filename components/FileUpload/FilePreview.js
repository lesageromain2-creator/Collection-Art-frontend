// components/FileUpload/FilePreview.js
import { useState } from 'react';
import { Download, Trash2, X } from 'lucide-react';
import FileIcon from '../UI/FileIcon';

const formatBytes = (n) => {
  if (!n) return '—';
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / (1024 * 1024)).toFixed(1) + ' MB';
};

const formatRelative = (d) => {
  if (!d) return '—';
  const t = new Date(d).getTime();
  const n = Date.now();
  const s = Math.floor((n - t) / 1000);
  if (s < 60) return "À l'instant";
  if (s < 3600) return `Il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `Il y a ${Math.floor(s / 3600)} h`;
  if (s < 604800) return `Il y a ${Math.floor(s / 86400)} j`;
  return new Date(d).toLocaleDateString('fr-FR');
};

const getType = (f) => (f.file_type || f.fileType || (f.file_name || f.fileName || '').split('.').pop() || 'default');

export default function FilePreview({
  file,
  onDownload,
  onDelete,
  showActions = true,
}) {
  const [lightbox, setLightbox] = useState(false);
  const isImage = (file.file_type || file.fileType || '').toLowerCase().includes('image') ||
    /\.(jpe?g|png|gif|webp)$/i.test(file.file_name || file.fileName || '');
  const thumb = file.thumbnail_url || file.thumbnailUrl || (isImage ? file.file_url || file.fileUrl : null);
  const name = file.file_name || file.fileName || 'Fichier';
  const size = file.file_size ?? file.fileSize;
  const uploadedBy = file.uploaded_by_firstname && file.uploaded_by_lastname
    ? `${file.uploaded_by_firstname} ${file.uploaded_by_lastname}`
    : file.uploadedByName || null;

  return (
    <>
      <div className="group rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 hover:shadow-lg transition-all duration-300">
        <div
          className="relative aspect-square flex items-center justify-center bg-white/5 cursor-pointer"
          onClick={() => (isImage && (file.file_url || file.fileUrl) ? setLightbox(true) : onDownload?.(file.id))}
        >
          {thumb ? (
            <img src={thumb} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="p-6">
              <FileIcon fileType={getType(file)} size="lg" />
            </div>
          )}
          {isImage && (file.file_url || file.fileUrl) && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
              <span className="text-white text-sm font-medium">Aperçu</span>
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="text-white text-sm font-medium truncate" title={name}>{name}</p>
          <p className="text-white/50 text-xs mt-0.5">
            {formatBytes(size)} · {getType(file).toUpperCase()}
          </p>
          <p className="text-white/40 text-xs mt-0.5">{formatRelative(file.created_at || file.createdAt)}</p>
          {uploadedBy && (
            <p className="text-white/40 text-xs">Par {uploadedBy}</p>
          )}
          {showActions && (onDownload || onDelete) && (
            <div className="flex gap-2 mt-3">
              {onDownload && (
                <button
                  type="button"
                  onClick={() => onDownload(file.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 text-xs font-medium transition"
                >
                  <Download size={14} />
                  Télécharger
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(file.id)}
                  className="p-1.5 rounded-lg text-white/50 hover:bg-red-500/20 hover:text-red-400 transition"
                  aria-label="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {lightbox && isImage && (file.file_url || file.fileUrl) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
          <img
            src={file.file_url || file.fileUrl}
            alt={name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
