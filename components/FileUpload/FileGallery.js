// components/FileUpload/FileGallery.js
import { useState, useMemo } from 'react';
import { Search, Filter, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import FilePreview from './FilePreview';
import DeleteConfirmModal from '../Modals/DeleteConfirmModal';

const typeFilters = [
  { key: 'all', label: 'Tous' },
  { key: 'image', label: 'Images' },
  { key: 'pdf', label: 'PDF' },
  { key: 'doc', label: 'Documents' },
  { key: 'other', label: 'Autres' },
];

const getTypeCategory = (f) => {
  const t = (f.file_type || f.fileType || '').toLowerCase();
  const n = (f.file_name || f.fileName || '').toLowerCase();
  if (t.includes('image') || /\.(jpe?g|png|gif|webp)$/.test(n)) return 'image';
  if (t.includes('pdf') || n.endsWith('.pdf')) return 'pdf';
  if (/\.(docx?|xlsx?)$/.test(n) || t.includes('word') || t.includes('sheet')) return 'doc';
  return 'other';
};

export default function FileGallery({
  files = [],
  onDownload,
  onDelete,
  onBulkDelete,
  loading = false,
  error = null,
}) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selected, setSelected] = useState(new Set());
  const [deleteModal, setDeleteModal] = useState({ open: false, file: null });
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    let list = [...files];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((f) => (f.file_name || f.fileName || '').toLowerCase().includes(q));
    }
    if (typeFilter !== 'all') {
      list = list.filter((f) => getTypeCategory(f) === typeFilter);
    }
    return list;
  }, [files, search, typeFilter]);

  const toggleSelect = (id) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((f) => f.id)));
  };

  const handleDeleteClick = (fileId) => {
    const file = filtered.find((f) => f.id === fileId);
    setDeleteModal({ open: true, file: file || { id: fileId, file_name: '', fileName: '' } });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.file) return;
    setDeleting(true);
    try {
      await onDelete(deleteModal.file.id);
      setDeleteModal({ open: false, file: null });
      toast.success('Fichier supprimé');
    } catch (e) {
      console.error(e);
      toast.error(e?.message || 'Échec de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!onBulkDelete || selected.size === 0) return;
    setDeleting(true);
    try {
      await onBulkDelete([...selected]);
      setSelected(new Set());
      toast.success('Fichiers supprimés');
    } catch (e) {
      console.error(e);
      toast.error(e?.message || 'Échec de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-white/60">
        <div className="w-10 h-10 border-2 border-primary/50 border-t-primary rounded-full animate-spin mb-4" />
        <p>Chargement des fichiers…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="search"
            placeholder="Rechercher par nom…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={18} className="text-white/50" />
          {typeFilters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTypeFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                typeFilter === key
                  ? 'bg-primary/30 text-primary'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 && (
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-white/80 text-sm">
            <input
              type="checkbox"
              checked={selected.size === filtered.length && filtered.length > 0}
              onChange={toggleSelectAll}
              className="rounded border-white/30"
            />
            Tout sélectionner
          </label>
          {selected.size > 0 && onBulkDelete && (
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-medium transition disabled:opacity-50"
            >
              <Trash2 size={16} />
              Supprimer ({selected.size})
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center py-16 text-white/60">
          <p className="text-lg font-medium text-white/80 mb-1">Aucun fichier</p>
          <p className="text-sm">Les fichiers partagés apparaîtront ici.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((file) => (
            <div key={file.id} className="relative">
              {onBulkDelete && (
                <label className="absolute top-2 left-2 z-10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.has(file.id)}
                    onChange={() => toggleSelect(file.id)}
                    className="rounded border-white/30 bg-black/50"
                  />
                </label>
              )}
              <FilePreview
                file={file}
                onDownload={onDownload}
                onDelete={onDelete ? handleDeleteClick : undefined}
                showActions
              />
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, file: null })}
        onConfirm={handleConfirmDelete}
        title="Supprimer le fichier ?"
        message="Cette action est irréversible."
        itemName={deleteModal.file?.file_name || deleteModal.file?.fileName}
        loading={deleting}
      />
    </div>
  );
}
