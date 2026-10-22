import React, { useState } from 'react';
import { X, Lock, ShieldCheck, LogOut, Video, Plus, Settings, Key, Trash2, Edit, Eye, Download, Check, AlertCircle } from 'lucide-react';
import AdminVideoForm from './AdminVideoForm';

export default function AdminModal({
  isOpen,
  onClose,
  token,
  onLogin,
  onLogout,
  videos,
  categories,
  settings,
  onSaveVideo,
  onDeleteVideo,
  onSaveSettings,
  editingVideo,
  setEditingVideo
}) {
  const [activeTab, setActiveTab] = useState(editingVideo ? 'form' : 'videos');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Settings tab state
  const [settingsForm, setSettingsForm] = useState(settings || {});
  const [categoriesInput, setCategoriesInput] = useState(categories ? categories.join(', ') : '');
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Change password state
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdMsg, setPwdMsg] = useState({ text: '', type: '' });

  if (!isOpen) return null;

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

      onLogin(data.token);
      setPasswordInput('');
    } catch (err) {
      setLoginError(err.message || 'Incorrect password');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Settings Save
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    const newCats = categoriesInput.split(',').map((c) => c.trim()).filter(Boolean);
    if (!newCats.includes('All')) newCats.unshift('All');

    await onSaveSettings(settingsForm, newCats);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2500);
  };

  // Handle Password Change
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-none">Creator Admin Portal</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Manage YouTube links, downloads & portal branding</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In - Login Form */}
        {!token ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-600/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Admin Authentication</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your password to manage videos and uploaded downloads.
              </p>
              <div className="mt-2 inline-block px-3 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
                Default password: <span className="text-amber-400 font-bold">admin123</span>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter admin password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                />
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
                {loginLoading ? 'Verifying...' : 'Unlock Admin Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          /* Logged In - Dashboard Tabs */
          <div>
            {/* Tabs Bar */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => { setActiveTab('videos'); setEditingVideo(null); }}
                className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'videos' && !editingVideo
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>All Videos ({videos?.length || 0})</span>
              </button>

              <button
                onClick={() => { setActiveTab('form'); setEditingVideo(null); }}
                className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'form'
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{editingVideo ? 'Edit Video' : 'Add New Video'}</span>
              </button>

              <button
                onClick={() => { setActiveTab('settings'); setEditingVideo(null); }}
                className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Site & Profile Settings</span>
              </button>

              <button
                onClick={() => { setActiveTab('security'); setEditingVideo(null); }}
                className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>Change Password</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
              
              {/* 1. All Videos List */}
              {activeTab === 'videos' && !editingVideo && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2">
                    <h3 className="text-sm font-bold text-white">Existing Videos & Uploaded Packages</h3>
                    <button
                      onClick={() => setActiveTab('form')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Video</span>
                    </button>
                  </div>

                  {videos && videos.length > 0 ? (
                    <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden">
                      {videos.map((vid) => {
                        const totalDownloads = (vid.resources || []).reduce((acc, r) => acc + (r.downloads || 0), 0);
                        return (
                          <div key={vid.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors">
                            <div className="flex items-center gap-3.5 min-w-0">
                              <img
                                src={vid.thumbnailUrl}
                                alt={vid.title}
                                className="w-20 aspect-video rounded-lg object-cover shrink-0 border border-slate-800"
                              />
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-white truncate max-w-md">{vid.title}</h4>
                                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                                  <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                                    {vid.category}
                                  </span>
                                  <span>•</span>
                                  <span className="font-mono text-[11px] text-rose-400">
                                    {vid.resources?.length || 0} Files
                                  </span>
                                  <span>•</span>
                                  <span className="font-mono text-[11px] text-amber-400">
                                    {totalDownloads} total downloads
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                              <button
                                onClick={() => {
                                  setEditingVideo(vid);
                                  setActiveTab('form');
                                }}
                                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete "${vid.title}"?`)) {
                                    onDeleteVideo(vid.id);
                                  }
                                }}
                                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
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
                      No videos found. Click "New Video" to create your first tutorial download post!
                    </div>
                  )}
                </div>
              )}

              {/* 2. Add / Edit Video Form */}
              {(activeTab === 'form' || editingVideo) && (
                <div>
                  <div className="mb-4 pb-2 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      {editingVideo ? `Editing: ${editingVideo.title}` : 'Add New Video & Attach Downloadable Files'}
                    </h3>
                    {editingVideo && (
                      <button
                        onClick={() => setEditingVideo(null)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Switch to Add New
                      </button>
                    )}
                  </div>

                  <AdminVideoForm
                    initialData={editingVideo}
                    categories={categories}
                    token={token}
                    onSave={(data) => {
                      onSaveVideo(data, editingVideo?.id);
                      setEditingVideo(null);
                      setActiveTab('videos');
                    }}
                    onCancel={() => {
                      setEditingVideo(null);
                      setActiveTab('videos');
                    }}
                  />
                </div>
              )}

              {/* 3. Settings Tab */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSettingsSubmit} className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Site Title</label>
                    <input
                      type="text"
                      value={settingsForm.siteTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Creator Name</label>
                      <input
                        type="text"
                        value={settingsForm.creatorName || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, creatorName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">YouTube Channel Handle</label>
                      <input
                        type="text"
                        value={settingsForm.channelName || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, channelName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">YouTube Channel URL</label>
                    <input
                      type="url"
                      value={settingsForm.channelUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, channelUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Avatar / Profile Picture URL</label>
                    <input
                      type="url"
                      value={settingsForm.avatarUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, avatarUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Bio / Intro</label>
                    <textarea
                      rows={2}
                      value={settingsForm.bio || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Announcement Banner Message</label>
                    <input
                      type="text"
                      value={settingsForm.bannerAnnouncement || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bannerAnnouncement: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Categories (comma separated)</label>
                    <input
                      type="text"
                      value={categoriesInput}
                      onChange={(e) => setCategoriesInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
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
                      Save Settings
                    </button>
                  </div>
                </form>
              )}

              {/* 4. Security Tab */}
              {activeTab === 'security' && (
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={pwdCurrent}
                      onChange={(e) => setPwdCurrent(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">New Password (min 6 chars)</label>
                    <input
                      type="password"
                      required
                      value={pwdNew}
                      onChange={(e) => setPwdNew(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
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
        )}

      </div>
    </div>
  );
}
