import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VideoCard from './components/VideoCard';
import VideoModal from './components/VideoModal';
import DownloadCountdownModal from './components/DownloadCountdownModal';
import AffiliateSection from './components/AffiliateSection';
import AdBanner from './components/AdBanner';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';
import { Video, Search } from 'lucide-react';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(
    () => window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin')
  );

  const [videos, setVideos] = useState([]);
  const [settings, setSettings] = useState(null);
  const [monetization, setMonetization] = useState(null);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Download countdown state
  const [countdownData, setCountdownData] = useState({
    isOpen: false,
    resource: null,
    video: null
  });

  // Dynamically load Google AdSense script when Client ID is configured
  useEffect(() => {
    const clientId = monetization?.ads?.adSenseClientId?.trim();
    if (monetization?.ads?.enabled && clientId) {
      const existing = document.getElementById('google-adsense-script');
      if (!existing) {
        const script = document.createElement('script');
        script.id = 'google-adsense-script';
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    }
  }, [monetization]);

  // Listen to popstate (browser back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      setIsAdminRoute(window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch public data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [videosRes, settingsRes] = await Promise.all([
        fetch('/api/videos'),
        fetch('/api/settings')
      ]);

      const videosData = await videosRes.json();
      const settingsData = await settingsRes.json();

      setVideos(Array.isArray(videosData) ? videosData : []);
      setSettings(settingsData.settings || {});
      setMonetization(settingsData.monetization || null);
      setCategories(settingsData.categories || ['All']);

      // Check if URL has ?v= param to deep-link directly to a video
      const urlParams = new URLSearchParams(window.location.search);
      const videoQuery = urlParams.get('v');
      if (videoQuery && Array.isArray(videosData)) {
        const found = videosData.find((v) => v.id === videoQuery || v.slug === videoQuery);
        if (found) setSelectedVideo(found);
      }
    } catch (err) {
      console.error('Failed to load portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdminRoute) {
      fetchData();
    }
  }, [isAdminRoute]);

  // If on /admin route: render dedicated Admin Dashboard page
  if (isAdminRoute) {
    return <AdminPage />;
  }

  // Handle opening download countdown modal
  const handleStartDownload = (resource, video) => {
    setCountdownData({
      isOpen: true,
      resource,
      video
    });
  };

  // Public Viewer Portal
  const filteredVideos = videos.filter((vid) => {
    const matchesCategory = selectedCategory === 'All' || vid.category?.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      vid.title?.toLowerCase().includes(q) ||
      vid.description?.toLowerCase().includes(q) ||
      (vid.tags || []).some((t) => t.toLowerCase().includes(q)) ||
      (vid.resources || []).some((r) => r.title?.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const totalResources = videos.reduce((acc, v) => acc + (v.resources?.length || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white">
      
      {/* Navigation (100% Public - Features Buy Me a Coffee if enabled) */}
      <Navbar
        settings={settings}
        monetization={monetization}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Banner with Categories & Channel Intro */}
      <Hero
        settings={settings}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalVideos={videos.length}
        totalResources={totalResources}
      />

      {/* Main Content: Video & Downloads Gallery */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TOP AD / SPONSOR BANNER SLOT */}
        {monetization?.ads?.enabled && (
          <AdBanner
            type="banner"
            customHtml={monetization.ads.topBannerHtml}
            fallbackMessage="⚡ Sponsored: Fast Cloud Servers & Free Backends — Get $200 free credit to launch your project."
            fallbackLink="https://digitalocean.com"
          />
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between pb-6 pt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Video className="w-5 h-5 text-rose-500" />
              <span>
                {selectedCategory === 'All' ? 'All Tutorial Resources' : `${selectedCategory} Tutorials`}
              </span>
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {filteredVideos.length}
            </span>
          </div>

          {searchQuery && (
            <p className="text-xs text-slate-400">
              Showing results for <span className="text-white font-semibold">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl bg-slate-900 border border-slate-800 aspect-video animate-pulse" />
            ))}
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onSelect={(v) => setSelectedVideo(v)}
                isAdmin={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 border border-dashed border-slate-800 rounded-3xl bg-slate-900/40">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No resources found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              No videos or downloadable files match your current category or search criteria.
            </p>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* AFFILIATE RECOMMENDATIONS SECTION */}
        <AffiliateSection affiliates={monetization?.affiliates} />

      </main>

      {/* Video Modal (Viewer Experience for Watching & Accessing Downloads) */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          monetization={monetization}
          onClose={() => {
            setSelectedVideo(null);
            const url = new URL(window.location);
            url.searchParams.delete('v');
            window.history.replaceState({}, '', url);
          }}
          onStartDownload={handleStartDownload}
        />
      )}

      {/* Download Countdown & Interstitial Ad Modal */}
      <DownloadCountdownModal
        isOpen={countdownData.isOpen}
        onClose={() => setCountdownData({ isOpen: false, resource: null, video: null })}
        resource={countdownData.resource}
        video={countdownData.video}
        countdownSettings={monetization?.countdown}
        donationSettings={monetization?.donations}
        onDownloadTriggered={() => {
          fetchData(); // updates counters
        }}
      />

      {/* Public Footer */}
      <Footer settings={settings} />

    </div>
  );
}
