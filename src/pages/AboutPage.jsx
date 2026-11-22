import React, { useEffect } from 'react';
import { ArrowLeft, Sparkles, BookOpen, Code2, Users, Heart, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import YoutubeIcon from '../components/YoutubeIcon';

export default function AboutPage({ settings, monetization, onNavigate }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const creatorName = settings?.creatorName || 'Jacques';
  const channelName = settings?.channelName || '@jacquestech';
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

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-10">
          
          {/* Header & Bio */}
          <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-slate-800">
            {settings?.avatarUrl ? (
              <img
                src={settings.avatarUrl}
                alt={creatorName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-rose-500/20 shadow-2xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-3xl font-extrabold text-white">
                {creatorName.charAt(0)}
              </div>
            )}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>About The Creator & Mission</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Hi, I'm {creatorName}
              </h1>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {settings?.bio || "I create step-by-step programming and tech tutorials on YouTube to help developers, students, and creators build real-world software without confusion."}
              </p>
              {settings?.channelUrl && (
                <div className="mt-4">
                  <a
                    href={settings.channelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-colors"
                  >
                    <YoutubeIcon className="w-4 h-4 text-white" />
                    <span>Subscribe to {channelName} on YouTube</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Pillars of our resource hub */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Practical Source Code</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every line of tutorial code is packaged into ready-to-run ZIP starter templates and finished projects.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Visual PDF Cheatsheets</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-resolution reference summaries, syntax guides, and architecture roadmaps you can keep and review anytime.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">100% Free Access</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No paywalls, subscriptions, or gated logins. All companion materials are freely accessible to every learner.
              </p>
            </div>
          </div>

          {/* Detailed Editorial Story */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white">Why This Resource Hub Was Created</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              When watching educational YouTube tutorials, one of the most frustrating experiences is trying to manually copy code from a video player or finding that download links in the video description are expired, broken, or locked behind aggressive paywalls.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong>{siteTitle}</strong> was built to solve that problem once and for all. It serves as the official, permanent home for companion educational materials. Whenever a new video tutorial is published, the exact starter kit, cheatsheet PDF, design assets, and finished code repository are uploaded here for instant, permanent access.
            </p>
          </section>

          {/* Quality Standards */}
          <section className="space-y-3 p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <h3 className="text-sm font-bold text-white">Our Quality & Safety Standards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We take safety and user experience seriously. Every downloadable resource is compiled and tested across standard environments (Node.js, Python, modern web browsers). We do not include bundled bloatware, toolbars, or deceptive software in any of our downloads.
            </p>
          </section>

          {/* Connect CTA */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Have a question, tutorial suggestion, or business inquiry?
            </p>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Get in Touch with Us &rarr;
            </button>
          </div>

        </div>
      </main>

      <Footer settings={settings} onNavigate={onNavigate} />
    </div>
  );
}
