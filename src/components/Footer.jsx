import React from 'react';
import { Heart, ExternalLink, ShieldCheck, FileText, HelpCircle, Mail, AlertTriangle, BookOpen } from 'lucide-react';
import YoutubeIcon from './YoutubeIcon';

export default function Footer({ settings, onNavigate }) {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.pathname = path;
    }
  };

  return (
    <footer className="border-t border-slate-900 bg-slate-950/95 text-slate-400 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-900">
          
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white font-bold shadow-lg shadow-rose-950/40">
                <YoutubeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-base leading-none">{settings?.siteTitle || 'Creator Resource Hub'}</p>
                <p className="text-xs text-slate-500 mt-1">Official companion downloads for YouTube tutorials</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Providing free, high-quality companion project source code, syntax cheat sheets, and starter kits to help you learn programming faster.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2 text-xs">
              {settings?.socialLinks && settings.socialLinks.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <span>{s.platform}</span>
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Navigation</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNavClick('/')}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  All Tutorial Resources
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/about')}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  About the Creator
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/contact')}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
              {settings?.channelUrl && (
                <li>
                  <a
                    href={settings.channelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-rose-400 transition-colors inline-flex items-center gap-1"
                  >
                    <span>YouTube Channel</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Legal & Trust (CRITICAL FOR GOOGLE ADSENSE) */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Legal & Privacy</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNavClick('/privacy-policy')}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/terms-of-service')}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/disclaimer')}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Affiliate & Ad Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    localStorage.removeItem('cookie_consent_given');
                    window.location.reload();
                  }}
                  className="text-slate-500 hover:text-slate-400 transition-colors cursor-pointer"
                >
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {settings?.siteTitle || 'Creator Resource Hub'}. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Empowering developers & learners</span>
            <Heart className="w-3 h-3 text-rose-500 fill-current" />
          </p>
        </div>

      </div>
    </footer>
  );
}
