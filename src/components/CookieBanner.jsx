import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';

export default function CookieBanner({ onNavigate }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent_given');
    if (!consent) {
      // Small delay for smooth appearance
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent_given', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-md text-slate-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Privacy & Cookies</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              We use cookies and partner services (such as Google AdSense) to deliver personalized ads, analyze site traffic, and support free downloads.
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-800">
              <button
                onClick={handleAccept}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Accept All
              </button>
              <button
                onClick={() => {
                  onNavigate('/privacy-policy');
                  setVisible(false);
                }}
                className="text-xs text-slate-400 hover:text-white underline transition-colors cursor-pointer px-2 py-1"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setVisible(false)}
                className="ml-auto text-slate-500 hover:text-slate-300 p-1"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
