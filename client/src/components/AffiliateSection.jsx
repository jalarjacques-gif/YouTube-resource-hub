import React from 'react';
import { Sparkles, ExternalLink, Tag, Shield, Cloud, Palette } from 'lucide-react';

export default function AffiliateSection({ affiliates = [] }) {
  if (!affiliates || affiliates.length === 0) return null;

  return (
    <section className="py-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Partner Recommendations & Discounts</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Exclusive Developer Deals & Recommended Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Special partner perks, free credits, and discounts negotiated for our tutorial community.
            </p>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            {affiliates.length} Verified Offers
          </span>
        </div>

        {/* Affiliate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {affiliates.map((aff) => (
            <div
              key={aff.id}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all duration-300 hover:shadow-xl hover:shadow-amber-950/10 hover:-translate-y-1"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {aff.badge || "SPECIAL OFFER"}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {aff.partner}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {aff.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {aff.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  {aff.category || "Official Partner"}
                </span>

                <a
                  href={aff.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs shadow-md shadow-amber-950 transition-all cursor-pointer"
                >
                  <span>Claim Deal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
