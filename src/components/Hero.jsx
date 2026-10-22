import React from 'react';
import { Sparkles, Download, Layers, PlayCircle, ExternalLink, Search } from 'lucide-react';

export default function Hero({ settings, categories, selectedCategory, onSelectCategory, searchQuery, setSearchQuery, totalVideos, totalResources }) {
  return (
    <div className="relative border-b border-slate-900 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950 pt-8 pb-8">
      {/* Background glow decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-48 bg-rose-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner Announcement */}
        {settings?.bannerAnnouncement && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-sm backdrop-blur">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{settings.bannerAnnouncement}</span>
            </div>
          </div>
        )}

        {/* Creator Intro */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            {settings?.avatarUrl ? (
              <img
                src={settings.avatarUrl}
                alt={settings.creatorName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-rose-500/30 shadow-xl shadow-rose-950/40"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center font-bold text-2xl text-white">
                {settings?.creatorName?.charAt(0) || 'C'}
              </div>
            )}
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {settings?.creatorName || 'Alex Rivera'}
                </h1>
                {settings?.channelUrl && (
                  <a
                    href={settings.channelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-rose-400 hover:text-rose-300 font-mono bg-rose-500/10 px-2 py-0.5 rounded-md inline-flex items-center gap-1 border border-rose-500/20"
                  >
                    <span>{settings.channelName || '@Channel'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-slate-400 text-sm max-w-xl mt-1.5">
                {settings?.bio || 'Grab all project files, PDFs, source codes, and companion cheat sheets for my YouTube tutorials.'}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 px-5 backdrop-blur-sm shadow-inner">
            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1.5 text-rose-400 font-bold text-lg">
                <PlayCircle className="w-4 h-4" />
                <span>{totalVideos}</span>
              </div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Videos</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-lg">
                <Download className="w-4 h-4" />
                <span>{totalResources}</span>
              </div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Downloads</div>
            </div>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="block md:hidden mb-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tutorial downloads, PDFs, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500"
            />
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Layers className="w-3.5 h-3.5" />
            Filter:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
