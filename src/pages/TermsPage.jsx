import React, { useEffect } from 'react';
import { FileText, ArrowLeft, Shield, AlertTriangle, CheckCircle, Scale } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsPage({ settings, monetization, onNavigate }) {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Scale className="w-4 h-4" />
              <span>User Agreement</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Last updated: October 2026
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Agreement to Terms</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              These Terms of Service constitute a legally binding agreement between you and <strong>{siteTitle}</strong>. By accessing or using our website, companion tutorial videos, and downloadable resources (PDFs, ZIP starter files, cheatsheets, source code), you agree that you have read, understood, and agreed to be bound by all of these terms. If you do not agree with all of these terms, please discontinue use immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Educational Resource License & Usage</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Unless otherwise stated, all companion tutorial source code, starter kits, and cheatsheet PDFs provided on {siteTitle} are made available free of charge for educational, learning, and personal development purposes:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2">
              <li>
                <strong>Permitted Usage:</strong> You are granted a non-exclusive license to study, modify, and build upon the source code and templates for your own personal and commercial projects.
              </li>
              <li>
                <strong>Prohibited Usage:</strong> You may not repackage, re-sell, or re-distribute our original PDF guides or project ZIP archives for commercial sale on another marketplace without written authorization.
              </li>
              <li>
                <strong>No Attribution Required (Source Code):</strong> You do not need to provide attribution when using the code learned in our tutorials in your own personal applications.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Third-Party Advertisements & External Links</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Our website displays third-party advertisements served by networks such as Google AdSense and contains links to third-party services (such as GitHub, Google Drive, Figma, and developer sponsors). We do not control or endorse the content, policies, or practices of any third-party websites or services. You acknowledge that we shall not be responsible or liable, directly or indirectly, for any damage or loss caused by your interaction with third-party sites or advertisements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Disclaimer of Warranties</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              The website, tutorials, and all downloadable materials are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied. While we strive to provide accurate, up-to-date, and safe code and guides, we make no representations or warranties regarding accuracy, completeness, or fitness for a particular purpose.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Limitation of Liability</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              In no event shall {siteTitle}, its creators, or contributors be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of our website, code, or downloadable materials.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white">6. Contact Information</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              If you have any questions concerning these Terms of Service, please reach out to us through our <button onClick={() => onNavigate('/contact')} className="text-rose-400 underline font-semibold cursor-pointer">Contact Page</button>.
            </p>
          </section>

        </div>
      </main>

      <Footer settings={settings} onNavigate={onNavigate} />
    </div>
  );
}
