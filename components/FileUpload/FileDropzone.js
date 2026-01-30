// components/FileUpload/FileDropzone.js
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import ProgressBar from '../UI/ProgressBar';
import FileIcon from '../UI/FileIcon';

const formatBytes = (n) => {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / (1024 * 1024)).toFixed(1) + ' MB';
};

const getType = (file) => {
  const t = (file.type || '').toLowerCase();
  if (t.startsWith('image/')) return 'image';
  if (t.includes('pdf')) return 'pdf';
  if (t.includes('word') || t.includes('document')) return 'doc';
  if (t.includes('sheet') || t.includes('excel')) return 'xls';
  if (t.startsWith('video/')) return 'video';
  return 'default';
};

export default function FileDropzone({
  onFilesSelected,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx'],
  multiple = true,
  disabled = false,
  uploading = false,
  progress = 0,
  filesInProgress = [],
  uploadError = null,
}) {
  const [rejections, setRejections] = useState([]);

  const onDrop = useCallback(
    (accepted, rejected) => {
      setRejections(rejected);
      if (accepted.length) onFilesSelected(accepted);
    },
    [onFilesSelected]
  );

  const acceptMap = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: multiple ? maxFiles : 1,
    maxSize,
    accept: acceptMap,
    multiple,
    disabled: disabled || uploading,
  });
  const maxSizeStr = formatBytes(maxSize);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-white/20 hover:border-white/40 hover:bg-white/5'}
          ${disabled || uploading ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-3 text-white/60" size={40} />
        <p className="text-white font-medium mb-1">
          {isDragActive ? 'Déposez les fichiers ici' : 'Glissez vos fichiers ici'}
        </p>
        <p className="text-white/60 text-sm mb-2">ou cliquez pour sélectionner</p>
        <p className="text-white/50 text-xs">
          Max {maxFiles} fichiers · {maxSizeStr} par fichier
        </p>
      </div>

      {uploadError && (
        <div className="rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm p-3">
          {uploadError}
        </div>
      )}

      {rejections.length > 0 && (
        <div className="rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-200 text-sm p-3">
          {rejections[0].errors?.[0]?.message || 'Fichier refusé (taille ou type)'}
        </div>
      )}

      {uploading && (
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
          <p className="text-white/80 text-sm font-medium">Upload en cours…</p>
          <ProgressBar value={progress} max={100} color="primary" showLabel animated />
        </div>
      )}

      {filesInProgress.length > 0 && !uploading && (
        <div className="rounded-xl bg-white/5 border border-white/10 divide-y divide-white/10">
          {filesInProgress.map((f, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <FileIcon fileType={getType(f)} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{f.name}</p>
                <p className="text-white/50 text-xs">{formatBytes(f.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
