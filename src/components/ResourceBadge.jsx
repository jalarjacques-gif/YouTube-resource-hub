import React from 'react';
import { FileText, Archive, Code2, ExternalLink, File, FileCode, HardDrive } from 'lucide-react';

export default function ResourceBadge({ type, size, isExternal, className = '' }) {
  const t = (type || 'FILE').toUpperCase();

  let bg = 'bg-slate-800 text-slate-300 border-slate-700';
  let Icon = File;

  if (t === 'PDF') {
    bg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    Icon = FileText;
  } else if (t === 'ZIP' || t === 'RAR' || t === '7Z') {
    bg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    Icon = Archive;
  } else if (t === 'CODE') {
    bg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    Icon = Code2;
  } else if (t === 'LINK') {
    bg = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    Icon = ExternalLink;
  } else if (t === 'DOC') {
    bg = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    Icon = FileCode;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${bg} ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{t}</span>
      {size && <span className="opacity-75 font-mono text-[10px]">({size})</span>}
    </span>
  );
}
