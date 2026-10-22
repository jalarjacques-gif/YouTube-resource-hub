import React, { useEffect, useRef } from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

export default function AdBanner({ 
  type = "banner", // "banner", "inFeed", "modal"
  customHtml = "",
  fallbackMessage = "⚡ Partner with us! Advertise your tool or service to thousands of developers.",
  fallbackLink = "",
  className = ""
}) {
  const containerRef = useRef(null);

  // If custom HTML script is provided (e.g. Google AdSense script)
  useEffect(() => {
    if (customHtml && containerRef.current) {
      containerRef.current.innerHTML = customHtml;
      // Execute any inline script tags that innerHTML does not execute automatically
      const scripts = containerRef.current.querySelectorAll("script");
      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }
  }, [customHtml]);

  // If user pasted real AdSense/Ad Network HTML
  if (customHtml) {
    return (
      <div className={`w-full overflow-hidden my-4 text-center ${className}`}>
        <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1">
          Advertisement
        </div>
        <div ref={containerRef} className="flex justify-center" />
      </div>
    );
  }

  // Fallback Sponsor / Promotion Banner
  return (
    <div className={`w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900 border border-rose-500/20 p-4 sm:p-5 my-6 text-center ${className}`}>
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider mb-2">
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span>Sponsored Recommendation</span>
      </div>

      <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-xl mx-auto">
        {fallbackMessage}
      </p>

      {fallbackLink && (
        <a
          href={fallbackLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950 transition-all"
        >
          <span>Claim Offer</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      )}
    </div>
  );
}
