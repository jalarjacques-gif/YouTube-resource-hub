import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import YoutubeIcon from './YoutubeIcon';

export default function Footer({ settings }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-900 bg-slate-950/90 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white font-bold shadow-lg shadow-rose-950/40">
              <YoutubeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{settings?.siteTitle || 'Creator Resource Hub'}</p>
              <p className="text-xs text-slate-500">Official companion downloads for {settings?.creatorName || 'our'} tutorials</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-xs">
            {settings?.socialLinks && settings.socialLinks.map((s, idx) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <span>{s.platform}</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            ))}
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {settings?.creatorName || 'Creator'}. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Crafted for creators & viewers</span>
            <Heart className="w-3 h-3 text-rose-500 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
}
