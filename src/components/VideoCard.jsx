import React from 'react';
import { Play, Download, Share2, Eye, Calendar, Check, Edit2 } from 'lucide-react';
import ResourceBadge from './ResourceBadge';

export default function VideoCard({ video, onSelect, onEdit, isAdmin }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/?v=${video.slug || video.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  const resourcesCount = video.resources?.length || 0;

  return (
    <div
      onClick={() => onSelect(video)}
      className="group relative flex flex-col bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-rose-950/20 hover:-translate-y-1 cursor-pointer"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-700">
            <Play className="w-12 h-12" />
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/20" />

        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
          <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-800">
            {video.category || 'Tutorial'}
          </span>

          <div className="flex items-center gap-1.5">
            {video.featured && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 uppercase tracking-wider">
                Featured
              </span>
            )}
            {video.isPublished === false && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-500/30">
                Draft
              </span>
            )}
          </div>
        </div>

        {/* Bottom Resource Count Pill on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/90 text-white text-[11px] font-bold shadow">
            <Download className="w-3.5 h-3.5" />
            <span>{resourcesCount} {resourcesCount === 1 ? 'Resource' : 'Resources'}</span>
          </div>

          <button
            onClick={handleCopyLink}
            title="Copy share link for YouTube description"
            className="p-1.5 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur border border-slate-700/60 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
            {video.title}
          </h2>
          <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {video.description || 'Watch the video and download companion source code, PDFs, and assets.'}
          </p>
        </div>

        {/* Resource Type Pills */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {video.resources && video.resources.length > 0 ? (
              video.resources.slice(0, 3).map((res) => (
                <ResourceBadge key={res.id} type={res.type} size={res.size} />
              ))
            ) : (
              <span className="text-[11px] text-slate-500 italic">No resources attached</span>
            )}
            {video.resources && video.resources.length > 3 && (
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                +{video.resources.length - 3} more
              </span>
            )}
          </div>

          {/* Footer Metadata & CTA */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(video);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Edit Video"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="text-rose-400 font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>View & Download</span>
                <span>&rarr;</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
