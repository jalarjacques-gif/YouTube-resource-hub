import React, { useState, useEffect } from 'react';
import { X, Download, Check, Sparkles, ExternalLink, Coffee, Heart, Clock } from 'lucide-react';
import ResourceBadge from './ResourceBadge';

export default function DownloadCountdownModal({
  isOpen,
  onClose,
  resource,
  video,
  countdownSettings,
  donationSettings,
  onDownloadTriggered
}) {
  const initialSeconds = countdownSettings?.seconds || 5;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(initialSeconds);
      setIsCompleted(false);
      return;
    }

    // If countdown disabled, trigger immediately
    if (countdownSettings?.enabled === false) {
      setIsCompleted(true);
      triggerDownload();
      return;
    }

    setTimeLeft(initialSeconds);
    setIsCompleted(false);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCompleted(true);
          triggerDownload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const triggerDownload = () => {
    if (!resource || !video) return;

    if (onDownloadTriggered) {
      onDownloadTriggered(video.id, resource.id);
    }

    const downloadEndpoint = `/api/download/${video.id}/${resource.id}`;

    if (resource.isExternal) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    } else {
      const link = document.createElement('a');
      link.href = downloadEndpoint;
      link.setAttribute('download', resource.title || 'download');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen || !resource) return null;

  const progressPercent = Math.round(((initialSeconds - timeLeft) / initialSeconds) * 100);

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800 backdrop-blur border border-slate-700/50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header / Resource Info */}
        <div className="p-6 bg-slate-950/60 border-b border-slate-800 text-center">
          <div className="flex justify-center mb-2">
            <ResourceBadge type={resource.type} size={resource.size} />
          </div>
          <h3 className="text-base font-bold text-white max-w-md mx-auto truncate">
            {resource.title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Companion file for: <span className="text-slate-300 font-semibold">{video.title}</span>
          </p>
        </div>

        {/* Main Countdown & Status */}
        <div className="p-6 text-center space-y-6">
          {!isCompleted ? (
            <div className="space-y-4">
              {/* Circular Timer Ring */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="stroke-rose-500 transition-all duration-1000 ease-linear"
                    strokeWidth="8"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * progressPercent) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-white font-mono">{timeLeft}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">seconds</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>Preparing your secure download...</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Your free download will start automatically in a moment.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">Your download has started!</h4>
              <p className="text-xs text-slate-400">
                Check your browser's download folder.
              </p>
              <button
                onClick={triggerDownload}
                className="mt-2 text-xs text-rose-400 hover:text-rose-300 font-semibold underline cursor-pointer"
              >
                Click here if the download didn't start automatically
              </button>
            </div>
          )}

          {/* SPONSORED BANNER AD (Monetization Slot) */}
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-rose-950/20 border border-slate-800 text-left relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
                Sponsored Partner Deal
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Special Creator Offer</span>
            </div>

            <p className="text-xs font-semibold text-slate-200">
              {countdownSettings?.bannerMessage || "🚀 Deploy your apps & databases with $200 free cloud credits on DigitalOcean!"}
            </p>

            {countdownSettings?.bannerLink && (
              <a
                href={countdownSettings.bannerLink}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold shadow-md transition-colors"
              >
                <span>Check Out Offer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* OPTIONAL SUPPORT CREATOR BUTTON */}
          {donationSettings?.enabled && donationSettings?.url && (
            <div className="pt-2 border-t border-slate-800/80">
              <p className="text-[11px] text-slate-400 mb-2">
                {donationSettings.message || "All tutorial resources are free. Support future videos:"}
              </p>
              <a
                href={donationSettings.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors cursor-pointer"
              >
                <Coffee className="w-4 h-4 text-amber-400" />
                <span>{donationSettings.label || "Buy Me a Coffee ☕"}</span>
              </a>
            </div>
          )}

        </div>

        {/* Footer Close */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
