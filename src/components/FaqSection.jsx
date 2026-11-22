import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, ShieldCheck, Download, Code, Sparkles } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Are all tutorial companion files and PDF downloads 100% free?",
      a: "Yes, absolutely! Every single cheatsheet PDF, code repository starter kit, and asset pack hosted on this platform is completely free to download. We believe high-quality programming and tech education should be accessible to everyone without paywalls, hidden fees, or compulsory email subscriptions."
    },
    {
      q: "Can I use the source code from the tutorials in my own commercial or client projects?",
      a: "Yes. All source code and architectural templates provided in our tutorials are licensed for both personal and commercial use. You are free to modify, expand, and incorporate the code into client websites, startup applications, or portfolio projects without needing to ask for individual permission."
    },
    {
      q: "How do I extract and run the project ZIP starter files on my computer?",
      a: "After downloading the ZIP file, right-click and select 'Extract All' (on Windows) or double-click to unzip (on macOS). Open the extracted directory in your code editor (such as VS Code), open the built-in terminal, and run 'npm install' for JavaScript/Node.js projects or 'pip install -r requirements.txt' for Python scripts to install the required dependencies."
    },
    {
      q: "Are the download files scanned for viruses, malware, and safety?",
      a: "Yes. Safety and trust are paramount to our community. All companion PDF documents, source code archives, and design assets are compiled in isolated, clean developer environments and scanned prior to publishing to guarantee they are 100% free of malware, spyware, or unwanted software."
    },
    {
      q: "How often are new tutorials and downloadable resources published?",
      a: "We publish new video tutorials and companion resources weekly. Whenever a new video goes live on our official YouTube channel, the corresponding starter code, cheat sheet summary, and finished project repository are instantly published right here on the portal."
    },
    {
      q: "Can I request a tutorial topic or companion guide for a specific technology?",
      a: "Definitely! We love hearing what technologies, frameworks, and programming patterns our community wants to master next. You can leave a comment on any of our YouTube videos or submit a direct tutorial suggestion using our Contact page."
    }
  ];

  return (
    <section className="py-12 border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Learning Resources & FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions & Resource Guide
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need to know about using our free companion tutorial materials, licensing, and code templates.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3.5">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/80 border border-slate-800/80 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900 transition-colors"
                >
                  <span className="text-sm font-bold text-white leading-snug">
                    {item.q}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-rose-400" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/50">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Informative Content Box for AdSense Quality Standards */}
        <div className="mt-10 p-6 rounded-3xl bg-slate-900/40 border border-slate-800 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-600/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Comprehensive Learning Companion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every tutorial card on this platform connects to an in-depth, hands-on programming lesson. Follow along on YouTube, grab the reference PDF for syntax recall, and use the project source code as a solid springboard for your next software build.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
