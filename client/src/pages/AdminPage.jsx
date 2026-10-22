import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, LogOut, Video, Plus, Settings, Key, Trash2, 
  Edit, Eye, Download, Check, AlertCircle, ArrowLeft, ExternalLink,
  Layers, HardDrive, BarChart3, DollarSign, Sparkles, Coffee, Clock, Tag
} from 'lucide-react';
import AdminVideoForm from '../components/AdminVideoForm';

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem('yt_hub_token') || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('videos'); // 'videos', 'add', 'monetization', 'settings', 'security'
  const [videos, setVideos] = useState([]);
  const [settings, setSettings] = useState({});
  const [monetization, setMonetization] = useState({
    ads: { enabled: true, adSenseClientId: '', topBannerHtml: '', inFeedBannerHtml: '', modalBannerHtml: '' },
    countdown: { enabled: true, seconds: 5, bannerMessage: '', bannerLink: '' },
    affiliates: [],
    donations: { enabled: true, platform: 'BuyMeACoffee', url: '', label: 'Buy Me a Coffee ☕', message: '' }
  });
  const [categories, setCategories] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({});
  const [categoriesInput, setCategoriesInput] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Monetization form state
  const [monetizationForm, setMonetizationForm] = useState(monetization);
  const [monetizationSuccess, setMonetizationSuccess] = useState(false);

  // New affiliate modal state
  const [newAffModal, setNewAffModal] = useState(false);
  const [newAffInput, setNewAffInput] = useState({
    title: '',
    partner: '',
    badge: 'SPECIAL OFFER',
    description: '',
    link: '',
    category: 'Developer Tools'
  });

  // Change password state
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdMsg, setPwdMsg] = useState({ text: '', type: '' });

  const loadData = async (authToken = token) => {
    if (!authToken) return;
    try {
      setLoading(true);
      const [vRes, sRes] = await Promise.all([
        fetch('/api/videos', { headers: { 'Authorization': `Bearer ${authToken}` } }),
        fetch('/api/settings')
      ]);
      const vData = await vRes.json();
      const sData = await sRes.json();

      setVideos(Array.isArray(vData) ? vData : []);
      setSettings(sData.settings || {});
      setSettingsForm(sData.settings || {});
      if (sData.monetization) {
        setMonetization(sData.monetization);
        setMonetizationForm(sData.monetization);
      }
      setCategories(sData.categories || []);
      setCategoriesInput((sData.categories || []).join(', '));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData(token);
    }
  }, [token]);

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('yt_hub_token', data.token);
      setToken(data.token);
      setPasswordInput('');
      loadData(data.token);
    } catch (err) {
      setLoginError(err.message || 'Incorrect password');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('yt_hub_token');
    setToken('');
    setEditingVideo(null);
  };

  // Save / Update Video
  const handleSaveVideo = async (formData, videoId) => {
    try {
      const url = videoId ? `/api/videos/${videoId}` : '/api/videos';
      const method = videoId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save video');
      setEditingVideo(null);
      setActiveTab('videos');
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Video
  const handleDeleteVideo = async (videoId) => {
    try {
      const res = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete video');
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Save Settings
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    const newCats = categoriesInput.split(',').map((c) => c.trim()).filter(Boolean);
    if (!newCats.includes('All')) newCats.unshift('All');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ settings: settingsForm, categories: newCats })
      });

      if (!res.ok) throw new Error('Failed to save settings');
      const data = await res.json();
      setSettings(data.settings);
      setCategories(data.categories);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 2500);
    } catch (err) {
      alert(err.message);
    }
  };

  // Save Monetization
  const handleMonetizationSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ monetization: monetizationForm })
      });

      if (!res.ok) throw new Error('Failed to save monetization settings');
      const data = await res.json();
      setMonetization(data.monetization);
      setMonetizationSuccess(true);
      setTimeout(() => setMonetizationSuccess(false), 2500);
    } catch (err) {
      alert(err.message);
    }
  };

  // Add Affiliate Deal
  const handleAddAffiliate = () => {
    if (!newAffInput.title || !newAffInput.link) return;
    const newAff = {
      ...newAffInput,
      id: `aff-${Date.now()}`
    };
    const updated = {
      ...monetizationForm,
      affiliates: [...(monetizationForm.affiliates || []), newAff]
    };
    setMonetizationForm(updated);
    setNewAffInput({ title: '', partner: '', badge: 'SPECIAL OFFER', description: '', link: '', category: 'Developer Tools' });
    setNewAffModal(false);
  };

  const handleRemoveAffiliate = (id) => {
    const updated = {
      ...monetizationForm,
      affiliates: (monetizationForm.affiliates || []).filter((a) => a.id !== id)
    };
    setMonetizationForm(updated);
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg({ text: '', type: '' });

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword: pwdCurrent, newPassword: pwdNew })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Password update failed');

      setPwdMsg({ text: 'Password successfully updated!', type: 'success' });
      setPwdCurrent('');
      setPwdNew('');
    } catch (err) {
      setPwdMsg({ text: err.message, type: 'error' });
    }
  };

  // Stats calculation
  const totalVideos = videos.length;
  const totalResources = videos.reduce((acc, v) => acc + (v.resources?.length || 0), 0);
  const totalDownloads = videos.reduce((acc, v) => {
    return acc + (v.resources || []).reduce((rAcc, r) => rAcc + (r.downloads || 0), 0);
  }, 0);

  // 1. If not logged in: Show Admin Login Screen
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-rose-950/20 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-600/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Creator Admin Login</h1>
            <p className="text-xs text-slate-400 mt-1">
              Private portal to manage videos, upload downloads & configure monetization.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              />
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Default: <span className="text-amber-400 font-bold">admin123</span>
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
            >
              {loginLoading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800">
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. Logged In: Full Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white text-sm">Creator Admin Dashboard</h1>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  Authenticated
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">URL: /admin</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Quick Analytics Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Total Tutorials</p>
              <h3 className="text-2xl font-extrabold text-white mt-1">{totalVideos}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Attached Resources</p>
              <h3 className="text-2xl font-extrabold text-amber-400 mt-1">{totalResources}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Viewer Downloads</p>
              <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{totalDownloads}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Monetization</p>
              <h3 className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>4 Streams Active</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => { setActiveTab('videos'); setEditingVideo(null); }}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'videos' && !editingVideo
                  ? 'border-rose-500 text-rose-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Tutorial Videos ({totalVideos})</span>
            </button>

            <button
              onClick={() => { setActiveTab('add'); setEditingVideo(null); }}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'add' || editingVideo
                  ? 'border-rose-500 text-rose-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{editingVideo ? 'Edit Tutorial' : 'Add New Tutorial & Files'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('monetization'); setEditingVideo(null); }}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'monetization'
                  ? 'border-rose-500 text-rose-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Monetization & Ads</span>
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setEditingVideo(null); }}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-rose-500 text-rose-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Branding & Settings</span>
            </button>

            <button
              onClick={() => { setActiveTab('security'); setEditingVideo(null); }}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'security'
                  ? 'border-rose-500 text-rose-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Change Password</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            
            {/* TAB 1: ALL VIDEOS */}
            {activeTab === 'videos' && !editingVideo && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-base font-bold text-white">All Tutorial Posts</h3>
                    <p className="text-xs text-slate-400">Click Edit to modify links, upload new files, or copy description links.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-rose-950 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Video</span>
                  </button>
                </div>

                {videos.length > 0 ? (
                  <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden">
                    {videos.map((vid) => {
                      const downloadsForVid = (vid.resources || []).reduce((acc, r) => acc + (r.downloads || 0), 0);
                      const shareLink = `${window.location.origin}/?v=${vid.slug || vid.id}`;
                      return (
                        <div key={vid.id} className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors">
                          <div className="flex items-center gap-4 min-w-0">
                            <img
                              src={vid.thumbnailUrl}
                              alt={vid.title}
                              className="w-24 aspect-video rounded-lg object-cover shrink-0 border border-slate-800"
                            />
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-white truncate max-w-lg">{vid.title}</h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                                <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 text-[11px]">
                                  {vid.category}
                                </span>
                                <span>•</span>
                                <span className="font-mono text-rose-400 text-[11px]">
                                  {vid.resources?.length || 0} Files
                                </span>
                                <span>•</span>
                                <span className="font-mono text-emerald-400 text-[11px]">
                                  {downloadsForVid} downloads
                                </span>
                              </div>
                              <div className="mt-1.5 text-[11px] text-slate-500 font-mono truncate max-w-md">
                                Viewer link: <span className="text-slate-400">{shareLink}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(shareLink);
                                alert('Copied YouTube Description Link:\n' + shareLink);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 cursor-pointer"
                            >
                              Copy Link
                            </button>
                            <button
                              onClick={() => {
                                setEditingVideo(vid);
                                setActiveTab('add');
                              }}
                              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${vid.title}"?`)) {
                                  handleDeleteVideo(vid.id);
                                }
                              }}
                              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-slate-800 rounded-2xl bg-slate-950 text-slate-500 text-xs">
                    No videos published yet.
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ADD / EDIT VIDEO */}
            {(activeTab === 'add' || editingVideo) && (
              <div>
                <div className="mb-6 pb-3 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {editingVideo ? `Editing: ${editingVideo.title}` : 'Add New Tutorial Video & Upload Files'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Paste the YouTube link, upload PDFs/ZIPs, and publish for your viewers.
                    </p>
                  </div>
                  {editingVideo && (
                    <button
                      onClick={() => setEditingVideo(null)}
                      className="text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      Cancel Edit & Add New
                    </button>
                  )}
                </div>

                <AdminVideoForm
                  initialData={editingVideo}
                  categories={categories}
                  token={token}
                  onSave={(data) => handleSaveVideo(data, editingVideo?.id)}
                  onCancel={() => {
                    setEditingVideo(null);
                    setActiveTab('videos');
                  }}
                />
              </div>
            )}

            {/* TAB 3: MONETIZATION & ADS (ALL 4 WAYS) */}
            {activeTab === 'monetization' && (
              <form onSubmit={handleMonetizationSubmit} className="space-y-8 max-w-3xl">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <span>Monetization & Ad Manager</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Control display ads, the download countdown timer, affiliate partner recommendations, and channel donations.
                  </p>
                </div>

                {/* 1. DISPLAY ADS & ADSENSE */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>1. Display Banner Ads (Google AdSense / Custom Ads)</span>
                      </h4>
                      <p className="text-xs text-slate-400">Shows ad banners on the header and inside video resource modals.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={monetizationForm.ads?.enabled}
                        onChange={(e) => setMonetizationForm({
                          ...monetizationForm,
                          ads: { ...monetizationForm.ads, enabled: e.target.checked }
                        })}
                        className="w-4 h-4 rounded text-rose-600 bg-slate-900 border-slate-700"
                      />
                      <span className="text-xs font-semibold text-slate-300">Enable Ads</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Top Header Banner (HTML or AdSense Script)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Paste your <ins class='adsbygoogle'...></ins> or custom banner HTML snippet here. Leave empty to show default sponsor banner."
                      value={monetizationForm.ads?.topBannerHtml || ''}
                      onChange={(e) => setMonetizationForm({
                        ...monetizationForm,
                        ads: { ...monetizationForm.ads, topBannerHtml: e.target.value }
                      })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 font-mono text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* 2. DOWNLOAD COUNTDOWN AD INTERSTITIAL */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>2. High-Converting Download Countdown Timer</span>
                      </h4>
                      <p className="text-xs text-slate-400">Shows a countdown timer with sponsor deal when a viewer clicks "Download Now".</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={monetizationForm.countdown?.enabled}
                        onChange={(e) => setMonetizationForm({
                          ...monetizationForm,
                          countdown: { ...monetizationForm.countdown, enabled: e.target.checked }
                        })}
                        className="w-4 h-4 rounded text-rose-600 bg-slate-900 border-slate-700"
                      />
                      <span className="text-xs font-semibold text-slate-300">Enable Countdown</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                        Countdown Seconds
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="15"
                        value={monetizationForm.countdown?.seconds || 5}
                        onChange={(e) => setMonetizationForm({
                          ...monetizationForm,
                          countdown: { ...monetizationForm.countdown, seconds: parseInt(e.target.value) || 5 }
                        })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                        Sponsor Message / Promo Text
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sponsored Deal: High-Performance Developer VPS (Free $200 Credit)"
                        value={monetizationForm.countdown?.bannerMessage || ''}
                        onChange={(e) => setMonetizationForm({
                          ...monetizationForm,
                          countdown: { ...monetizationForm.countdown, bannerMessage: e.target.value }
                        })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Sponsor Target URL (Affiliate link or sponsor link)
                    </label>
                    <input
                      type="url"
                      placeholder="https://your-sponsor-or-affiliate-link.com"
                      value={monetizationForm.countdown?.bannerLink || ''}
                      onChange={(e) => setMonetizationForm({
                        ...monetizationForm,
                        countdown: { ...monetizationForm.countdown, bannerLink: e.target.value }
                      })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                {/* 3. AFFILIATE DEALS MANAGER */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-emerald-400" />
                        <span>3. Affiliate Recommendations & Deals Section</span>
                      </h4>
                      <p className="text-xs text-slate-400">Featured developer tools and discounts that earn you referral commission.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewAffModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Deal</span>
                    </button>
                  </div>

                  {monetizationForm.affiliates && monetizationForm.affiliates.length > 0 ? (
                    <div className="space-y-2">
                      {monetizationForm.affiliates.map((aff) => (
                        <div key={aff.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                                {aff.badge}
                              </span>
                              <span className="text-xs font-bold text-white truncate">{aff.title}</span>
                              <span className="text-xs text-slate-500">({aff.partner})</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{aff.link}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAffiliate(aff.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                      No affiliate cards added. Click "Add Deal" to feature tools like hosting, VPN, or software.
                    </div>
                  )}
                </div>

                {/* 4. DONATIONS & BUY ME A COFFEE */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Coffee className="w-4 h-4 text-amber-400" />
                        <span>4. Channel Support & Donations (Buy Me a Coffee / Patreon / PayPal)</span>
                      </h4>
                      <p className="text-xs text-slate-400">Let viewers support your channel directly when downloading free files.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={monetizationForm.donations?.enabled}
                        onChange={(e) => setMonetizationForm({
                          ...monetizationForm,
                          donations: { ...monetizationForm.donations, enabled: e.target.checked }
                        })}
                        className="w-4 h-4 rounded text-rose-600 bg-slate-900 border-slate-700"
                      />
                      <span className="text-xs font-semibold text-slate-300">Enable Support Button</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                        Donation URL (BuyMeACoffee, Patreon, or PayPal)
                      </label>
                      <input
                        type="url"
                        placeholder="https://buymeacoffee.com/yourname"
                        value={monetizationForm.donations?.url || ''}
                        onChange={(e) => setMonetizationForm({
                          ...monetizationForm,
                          donations: { ...monetizationForm.donations, url: e.target.value }
                        })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                        Button Label
                      </label>
                      <input
                        type="text"
                        placeholder="Buy Me a Coffee ☕"
                        value={monetizationForm.donations?.label || ''}
                        onChange={(e) => setMonetizationForm({
                          ...monetizationForm,
                          donations: { ...monetizationForm.donations, label: e.target.value }
                        })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                      />
                    </div>
                  </div>
                </div>

                {monetizationSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Monetization settings successfully updated & live!</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950 cursor-pointer"
                  >
                    Save Monetization Settings
                  </button>
                </div>
              </form>
            )}

            {/* TAB 4: SETTINGS */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSettingsSubmit} className="space-y-5 max-w-2xl">
                <div>
                  <h3 className="text-base font-bold text-white">Channel & Website Branding</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Customize what viewers see on the homepage.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Site Title</label>
                  <input
                    type="text"
                    value={settingsForm.siteTitle || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Creator Name</label>
                    <input
                      type="text"
                      value={settingsForm.creatorName || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, creatorName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Channel Handle</label>
                    <input
                      type="text"
                      value={settingsForm.channelName || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, channelName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">YouTube Channel URL</label>
                  <input
                    type="url"
                    value={settingsForm.channelUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, channelUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Avatar / Profile Image URL</label>
                  <input
                    type="url"
                    value={settingsForm.avatarUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, avatarUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Bio / Channel Description</label>
                  <textarea
                    rows={2}
                    value={settingsForm.bio || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Banner Announcement Message</label>
                  <input
                    type="text"
                    value={settingsForm.bannerAnnouncement || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bannerAnnouncement: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Categories (comma separated)</label>
                  <input
                    type="text"
                    value={categoriesInput}
                    onChange={(e) => setCategoriesInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {settingsSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Settings successfully saved!</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* TAB 5: SECURITY */}
            {activeTab === 'security' && (
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <h3 className="text-base font-bold text-white">Change Admin Password</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Keep your admin dashboard secure.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={pwdCurrent}
                    onChange={(e) => setPwdCurrent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">New Password (min 6 chars)</label>
                  <input
                    type="password"
                    required
                    value={pwdNew}
                    onChange={(e) => setPwdNew(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {pwdMsg.text && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    pwdMsg.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                  }`}>
                    {pwdMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{pwdMsg.text}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>

      {/* MODAL: ADD AFFILIATE DEAL */}
      {newAffModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Add Affiliate Deal / Recommended Tool</span>
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Deal Title</label>
              <input
                type="text"
                placeholder="e.g. Cloud Hosting & Free $200 Credits"
                value={newAffInput.title}
                onChange={(e) => setNewAffInput({ ...newAffInput, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Partner / Brand</label>
                <input
                  type="text"
                  placeholder="e.g. DigitalOcean, NordVPN"
                  value={newAffInput.partner}
                  onChange={(e) => setNewAffInput({ ...newAffInput, partner: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Badge Text</label>
                <input
                  type="text"
                  placeholder="e.g. 70% OFF, FREE CREDIT"
                  value={newAffInput.badge}
                  onChange={(e) => setNewAffInput({ ...newAffInput, badge: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Affiliate Referral URL</label>
              <input
                type="url"
                placeholder="https://your-affiliate-link.com"
                value={newAffInput.link}
                onChange={(e) => setNewAffInput({ ...newAffInput, link: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Brief Description</label>
              <textarea
                rows={2}
                placeholder="What makes this tool great for your tutorial viewers?"
                value={newAffInput.description}
                onChange={(e) => setNewAffInput({ ...newAffInput, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewAffModal(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddAffiliate}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
              >
                Add Deal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
