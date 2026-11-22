import React, { useEffect } from 'react';
import { AlertCircle, ArrowLeft, ShieldAlert, DollarSign } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import YoutubeIcon from '../components/YoutubeIcon';

export default function DisclaimerPage({ settings, monetization, onNavigate }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const siteTitle = settings?.siteTitle || 'jacquestech';

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white">
      <Navbar settings={settings} monetization={monetization} onNavigate={onNavigate} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          
          <div className="border-b border-slate-800 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldAlert className="w-4 h-4" />
              <span>Disclosures & Transparency</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Website Disclaimer & Disclosures
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Last updated: October 2026
            </p>
          </div>

          {/* Section 1: Affiliate & Advertising Disclosure */}
          <section className="space-y-3 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <span>1. Advertising & Affiliate Disclosure</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              In compliance with Federal Trade Commission (FTC) guidelines and Google Publisher policies, please assume that some links on <strong>{siteTitle}</strong> are affiliate links. If you click on an affiliate link and make a purchase or sign up for a service, we may receive a small commission at no additional cost to you.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              We only recommend developer tools, software platforms, cloud hosting, and services that we believe provide genuine educational or productivity value to our audience. Our editorial reviews and tutorial recommendations are never influenced by affiliate partnerships.
            </p>
          </section>

          {/* Section 2: Google AdSense */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Google AdSense Advertisements</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {siteTitle} displays third-party advertisements delivered by Google AdSense. Google AdSense uses cookies to serve ads based on users' prior visits to this and other websites. We do not personally control the specific advertisements displayed by Google's automated ad network. For more details on opting out, please review our <button onClick={() => onNavigate('/privacy-policy')} className="text-rose-400 underline font-semibold cursor-pointer">Privacy Policy</button>.
            </p>
          </section>

          {/* Section 3: YouTube Trademark Notice */}
          <section className="space-y-3 p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <YoutubeIcon className="w-5 h-5 text-rose-500" />
              <span>3. YouTube & Third-Party Trademark Disclaimer</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              YouTube and the YouTube logo are registered trademarks of Google LLC. {siteTitle} is an independent creator companion portal and is not endorsed by, directly affiliated with, maintained, authorized, or sponsored by Google LLC or YouTube.
            </p>
          </section>

          {/* Section 4: Educational Purpose & Code Disclaimer */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Educational Information & Code Safety</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              All tutorial code, scripts, configurations, and architectural guides on this website are published for educational and demonstration purposes only. While code is tested to run on standard developer environments, you are solely responsible for testing and auditing any code prior to deploying it to production or critical live systems.
            </p>
          </section>

        </div>
      </main>

      <Footer settings={settings} onNavigate={onNavigate} />
    </div>
  );
}
