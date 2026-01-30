// components/UI/FileIcon.js
import { FileText, Image, FileSpreadsheet, Video, Folder, File } from 'lucide-react';

const TYPE_MAP = {
  pdf: { Icon: FileText, color: '#ef4444' },
  image: { Icon: Image, color: '#8b5cf6' },
  img: { Icon: Image, color: '#8b5cf6' },
  doc: { Icon: FileText, color: '#3b82f6' },
  docx: { Icon: FileText, color: '#3b82f6' },
  xls: { Icon: FileSpreadsheet, color: '#10b981' },
  xlsx: { Icon: FileSpreadsheet, color: '#10b981' },
  video: { Icon: Video, color: '#f59e0b' },
  mp4: { Icon: Video, color: '#f59e0b' },
  default: { Icon: File, color: '#6b7280' },
};

export default function FileIcon({ fileType, size = 'md', color }) {
  const t = (fileType || '').toLowerCase().replace('.', '');
  const { Icon, color: typeColor } = TYPE_MAP[t] || TYPE_MAP.default;
  const s = size === 'lg' ? 32 : size === 'sm' ? 16 : 24;
  const c = color || typeColor;

  return <Icon size={s} style={{ color: c, flexShrink: 0 }} />;
}
