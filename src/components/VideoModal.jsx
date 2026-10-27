import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Share2, Check, Download, AlertCircle, Coffee } from 'lucide-react';
import YoutubeIcon from './YoutubeIcon';
import { getYouTubeEmbedUrl } from '../utils/youtube';
import ResourceBadge from './ResourceBadge';
import AdBanner from './AdBanner';

export default function VideoModal({ video, monetization, onClose, onStartDownload }) {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);

  // Scroll to top of modal whenever a video is selected so the player is always at the top of the screen
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [video]);

  if (!video) return null;

  const embedUrl = video.youtubeId ? getYouTubeEmbedUrl(video.youtubeId) : '';
  const shareableUrl = `${window.location.origin}/?v=${video.slug || video.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex justify-center items-start p-2 sm:p-4 md:p-6"
      onClick={onClose}
    >
      
      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-rose-950/40 my-2 sm:my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button with high contrast & always in view */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 sm:p-2.5 rounded-full bg-slate-950/85 text-slate-300 hover:text-white hover:bg-rose-600 backdrop-blur border border-slate-700/60 shadow-lg transition-all cursor-pointer"
          title="Close Video"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player Section - 100% visible in standard 16:9 ratio */}
        <div className="relative aspect-video w-full bg-black shadow-inner">
          {video.youtubeId ? (
            <iframe
              src={embedUrl}
              title={video.title}
              className="w-full h-full border-0 block"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              Video Player Unavailable
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 sm:p-7 md:p-8 space-y-6">

          {/* Title & Metadata Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {video.category || 'Tutorial'}
              </span>
              {video.publishedAt && (
                <span className="text-xs text-slate-400">
                  {new Date(video.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {video.title}
            </h1>

            {/* Quick action bar */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-4 border-t border-slate-800/80">
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-900/30 transition-all cursor-pointer"
              >
                <YoutubeIcon className="w-4 h-4 text-white" />
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied Link!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-400" />
                    <span>Copy Link for YouTube Description</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description */}
          {video.description && (
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Video Overview & Notes</h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {video.description}
              </p>

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-800/50">
                  {video.tags.map((tag) => (
                    <span key={tag} className="text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* IN-MODAL AD / SPONSOR BANNER */}
          {monetization?.ads?.enabled && (
            <AdBanner
              type="modal"
              customHtml={monetization.ads.modalBannerHtml}
              fallbackMessage="⚡ Sponsored: Deploy high-performance databases & backends with $200 free credit."
              fallbackLink="https://digitalocean.com"
            />
          )}

          {/* Downloadable Resources Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-rose-500" />
                  <span>Downloadable Resources & Files</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any resource below to download or access instantly.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg">
                {video.resources?.length || 0} Available
              </span>
            </div>

            {video.resources && video.resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {video.resources.map((res) => {
                  return (
                    <div
                      key={res.id}
                      className="group flex flex-col justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800/90 hover:border-rose-500/40 hover:bg-slate-950/90 transition-all duration-200"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <ResourceBadge type={res.type} size={res.size} />
                          {res.downloads !== undefined && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              {res.downloads} downloads
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                          {res.title}
                        </h4>

                        {res.note && (
                          <p className="text-xs text-slate-400 mt-1.5 flex items-start gap-1.5">
                            <span className="text-rose-400 shrink-0 font-bold">•</span>
                            <span>{res.note}</span>
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-mono">
                          {res.isExternal ? 'Cloud Link' : 'Direct Server File'}
                        </span>

                        <button
                          onClick={() => onStartDownload(res, video)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-rose-950/50 transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Now</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 px-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-slate-500 text-sm">
                No files or resources attached to this tutorial yet.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
