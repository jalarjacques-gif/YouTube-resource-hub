import React from 'react';
import { ExternalLink, Search, Coffee } from 'lucide-react';
import YoutubeIcon from './YoutubeIcon';

export default function Navbar({ settings, monetization, searchQuery, setSearchQuery }) {
  const donation = monetization?.donations;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center shadow-lg shadow-rose-900/20 group-hover:scale-105 transition-transform">
              <YoutubeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-white tracking-tight flex items-center gap-1.5 leading-none">
                {settings?.siteTitle || 'Creator Hub'}
                <span className="text-[10px] font-mono uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.5 rounded">Free Downloads</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">{settings?.channelName || '@Creator'}</p>
            </div>
          </a>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tutorial downloads, PDFs, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Actions: Buy Me a Coffee & YouTube */}
        <div className="flex items-center gap-2 sm:gap-3">
          {donation?.enabled && donation?.url && (
            <a
              href={donation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-colors shadow-sm"
              title="Support the Creator"
            >
              <Coffee className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{donation.label || 'Buy Me a Coffee'}</span>
            </a>
          )}

          {settings?.channelUrl && (
            <a
              href={settings.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-rose-600/10 text-rose-400 hover:bg-rose-600/20 border border-rose-500/20 transition-colors"
            >
              <YoutubeIcon className="w-4 h-4 text-rose-500" />
              <span className="hidden sm:inline">Subscribe</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          )}
        </div>

      </div>
    </header>
  );
}
