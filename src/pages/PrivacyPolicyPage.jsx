import React, { useEffect } from 'react';
import { ShieldCheck, ArrowLeft, Lock, Eye, FileText, Globe, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicyPage({ settings, monetization, onNavigate }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const siteTitle = settings?.siteTitle || 'Creator Resource Hub';
  const creatorName = settings?.creatorName || 'Creator';
  const siteUrl = window.location.origin;

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
          
          {/* Header */}
          <div className="border-b border-slate-800 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Legal Document</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Last updated: October 2026 • Effective Date: October 2026
            </p>
          </div>

          {/* Section 1: Introduction */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-rose-400" />
              <span>1. Introduction & Overview</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Welcome to <strong>{siteTitle}</strong> ("we", "our", or "us"), accessible from {siteUrl}. We are committed to protecting the privacy and personal data of our visitors. This Privacy Policy details the types of information we collect, how it is used, and the steps we take to safeguard your information when you browse our website and download companion tutorial files, PDFs, source code, and assets.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              If you have any questions or require more information regarding our Privacy Policy, please contact us via our Contact Page or email us directly.
            </p>
          </section>

          {/* Section 2: Google AdSense & Third-Party Cookies (MANDATORY FOR ADSENSE) */}
          <section className="space-y-3 p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30">
            <h2 className="text-lg font-bold text-rose-300 flex items-center gap-2">
              <Eye className="w-5 h-5 text-rose-400" />
              <span>2. Google AdSense & Advertising Cookies Notice</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We use <strong>Google AdSense</strong> and other third-party advertising partners to display advertisements on our website. Please review the following information regarding how Google and third parties serve ads:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2">
              <li>
                <strong>Third-Party Vendors & Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites on the Internet.
              </li>
              <li>
                <strong>DoubleClick / DART Cookie:</strong> Google's use of advertising cookies enables it and its partners to serve relevant advertisements to our users based on their visit to our sites and/or other sites on the Internet.
              </li>
              <li>
                <strong>Opt-Out of Personalized Advertising:</strong> Users may opt out of personalized advertising by visiting Google's <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-rose-400 underline">Ads Settings</a>. Alternatively, users can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noreferrer" className="text-rose-400 underline">www.aboutads.info</a>.
              </li>
              <li>
                <strong>Third-Party Ad Networks:</strong> Third-party ad servers or ad networks use technology in their respective advertisements and links that appear on our site, which are sent directly to your browser. They automatically receive your IP address when this occurs. Other technologies (such as cookies, JavaScript, or Web Beacons) may also be used by our third-party ad networks to measure the effectiveness of their advertising campaigns and/or to personalize advertising content.
              </li>
            </ul>
            <p className="text-xs text-slate-400 italic">
              Note: {siteTitle} has no access to or control over these cookies that are used by third-party advertisers.
            </p>
          </section>

          {/* Section 3: Information We Collect */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-400" />
              <span>3. Information We Collect & Log Files</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Like most standard websites, {siteTitle} follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
              <li>Internet Protocol (IP) addresses</li>
              <li>Browser type and operating system</li>
              <li>Internet Service Provider (ISP)</li>
              <li>Date and time stamp of visits</li>
              <li>Referring and exit pages</li>
              <li>Number of resource downloads (aggregated and anonymous)</li>
            </ul>
            <p className="text-sm text-slate-300 leading-relaxed">
              This information is not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information to improve user experience.
            </p>
          </section>

          {/* Section 4: Resource Downloads & File Safety */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>4. Educational Downloads & Safety</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              All tutorial companion downloads (PDF guides, cheatsheets, project ZIP source code) are provided strictly for educational purposes. We scan and review files prior to upload to ensure they do not contain malware or deceptive software. We do not require registration or credit card details to access our free public educational materials.
            </p>
          </section>

          {/* Section 5: GDPR & CCPA Compliance */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-rose-400" />
              <span>5. GDPR Data Protection & CCPA Consumer Rights</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), every user is entitled to the following:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
              <li>The right to access – You have the right to request copies of your personal data.</li>
              <li>The right to rectification – You have the right to request that we correct any inaccurate information.</li>
              <li>The right to erasure – You have the right to request that we erase your personal data under certain conditions.</li>
              <li>The right to restrict or object to processing of personal data.</li>
              <li>The right not to be discriminated against for exercising privacy rights.</li>
            </ul>
          </section>

          {/* Section 6: Children's Privacy */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">6. Children's Information (COPPA)</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. {siteTitle} does not knowingly collect any Personal Identifiable Information from children under the age of 13.
            </p>
          </section>

          {/* Section 7: Consent & Contact */}
          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white">7. Consent & Inquiries</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              By using our website, you hereby consent to our Privacy Policy and agree to its terms. If you have questions regarding this policy or wish to exercise any rights, please visit our <button onClick={() => onNavigate('/contact')} className="text-rose-400 underline font-semibold cursor-pointer">Contact Page</button>.
            </p>
          </section>

        </div>
      </main>

      <Footer settings={settings} onNavigate={onNavigate} />
    </div>
  );
}
