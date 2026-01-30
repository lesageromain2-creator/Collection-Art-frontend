// components/Modals/DeleteConfirmModal.js
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Supprimer le fichier ?',
  message = "Cette action est irréversible.",
  itemName,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div
        className="relative w-full max-w-md rounded-xl bg-[#0f1424] border border-white/10 shadow-xl p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="text-red-400" size={24} />
          </div>
          <div>
            <h2 id="delete-modal-title" className="text-lg font-semibold text-white mb-1">
              {title}
            </h2>
            <p className="text-white/70 text-sm mb-2">{message}</p>
            {itemName && (
              <p className="text-white/90 text-sm font-medium truncate max-w-full" title={itemName}>
                {itemName}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-lg bg-white/10 text-white hover:bg-white/15 transition font-medium"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition font-medium disabled:opacity-50"
          >
            {loading ? 'Suppression…' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
}
