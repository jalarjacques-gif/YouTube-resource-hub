import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, Link as LinkIcon, FileText, Check, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';
import { extractYouTubeId, getYouTubeThumbnail } from '../utils/youtube';
import ResourceBadge from './ResourceBadge';

export default function AdminVideoForm({ initialData, categories, onSave, onCancel, token }) {
  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    category: categories?.[0] || 'Web Development',
    tags: '',
    description: '',
    thumbnailUrl: '',
    isPublished: true,
    featured: false,
    resources: []
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [newLinkModal, setNewLinkModal] = useState(false);
  const [linkInput, setLinkInput] = useState({
    title: '',
    url: '',
    type: 'LINK',
    size: 'Cloud',
    note: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || ''),
        resources: initialData.resources || []
      });
    }
  }, [initialData]);

  // When YouTube URL changes, auto populate thumbnail and try to suggest title if empty
  const handleYoutubeUrlChange = (url) => {
    const ytId = extractYouTubeId(url);
    const updates = { youtubeUrl: url };
    if (ytId && (!formData.thumbnailUrl || formData.thumbnailUrl.includes('img.youtube.com'))) {
      updates.thumbnailUrl = getYouTubeThumbnail(ytId);
    }
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Upload file (PDF, ZIP, CODE, etc.)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    const bodyData = new FormData();
    bodyData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: bodyData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      // Append new resource
      const newResource = {
        id: `res-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''), // Clean title
        type: data.file.type,
        isExternal: false,
        url: data.file.url,
        size: data.file.size,
        note: `Direct download (${file.name})`,
        downloads: 0
      };

      setFormData((prev) => ({
        ...prev,
        resources: [...prev.resources, newResource]
      }));
    } catch (err) {
      setUploadError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Add external link resource
  const handleAddExternalLink = () => {
    if (!linkInput.title || !linkInput.url) return;

    const newResource = {
      id: `res-${Date.now()}`,
      title: linkInput.title,
      type: linkInput.type || 'LINK',
      isExternal: true,
      url: linkInput.url,
      size: linkInput.size || 'Direct Link',
      note: linkInput.note || '',
      downloads: 0
    };

    setFormData((prev) => ({
      ...prev,
      resources: [...prev.resources, newResource]
    }));

    setLinkInput({ title: '', url: '', type: 'LINK', size: 'Cloud', note: '' });
    setNewLinkModal(false);
  };

  const handleRemoveResource = (index) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.youtubeUrl) return;

    onSave({
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* YouTube URL & Thumbnail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              YouTube Video URL <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              value={formData.youtubeUrl}
              onChange={(e) => handleYoutubeUrlChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Paste standard watch link, youtu.be short link, or Shorts URL.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Video Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Python Automation Tutorial - 5 Practical Scripts"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-semibold"
            />
          </div>
        </div>

        {/* Thumbnail Preview */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Thumbnail Preview
          </label>
          <div className="aspect-video rounded-xl border border-slate-800 bg-slate-950 overflow-hidden relative flex items-center justify-center">
            {formData.thumbnailUrl ? (
              <img
                src={formData.thumbnailUrl}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-slate-600 text-center px-2">Paste YouTube URL to auto-load</span>
            )}
          </div>
        </div>
      </div>

      {/* Category & Tags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
          >
            {categories.filter((c) => c !== 'All').map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Tags (comma separated)
          </label>
          <input
            type="text"
            placeholder="React, Next.js, PDF, Source Code"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          Description & Notes for Viewers
        </label>
        <textarea
          rows={3}
          placeholder="Detailed notes, installation instructions, or overview of the resources..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
        />
      </div>

      {/* Attachments & Resources Section */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Attached Resources</span>
              <span className="text-xs text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded font-mono">
                {formData.resources.length}
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Upload local PDFs & ZIPs, or add Google Drive, Dropbox, & GitHub download links.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* File Upload Button */}
            <label className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>{uploading ? 'Uploading...' : 'Upload File (PDF/ZIP)'}</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.zip,.rar,.7z,.tar,.gz,.js,.py,.txt,.doc,.docx"
              />
            </label>

            {/* Cloud Link Button */}
            <button
              type="button"
              onClick={() => setNewLinkModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>Add External Link</span>
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Resource List */}
        {formData.resources.length > 0 ? (
          <div className="space-y-2.5">
            {formData.resources.map((res, idx) => (
              <div
                key={res.id || idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ResourceBadge type={res.type} size={res.size} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{res.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {res.isExternal ? `Link: ${res.url}` : `Uploaded: ${res.url}`}
                      {res.note ? ` • ${res.note}` : ''}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveResource(idx)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove resource"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
            No resources attached yet. Click above to upload a file or add a cloud link.
          </div>
        )}
      </div>

      {/* Visibility Options */}
      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-800">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="w-4 h-4 rounded text-rose-600 bg-slate-950 border-slate-700"
          />
          <span>Published (Visible to viewers)</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 rounded text-rose-600 bg-slate-950 border-slate-700"
          />
          <span>Featured Video (Star badge)</span>
        </label>
      </div>

      {/* Submit / Cancel Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
        >
          {initialData ? 'Update Video & Resources' : 'Publish Video & Resources'}
        </button>
      </div>

      {/* Add External Link Modal */}
      {newLinkModal && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-sky-400" />
              <span>Add Cloud / External Download Link</span>
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Resource Title</label>
              <input
                type="text"
                placeholder="e.g. Google Drive Full Project ZIP, GitHub Repo"
                value={linkInput.title}
                onChange={(e) => setLinkInput({ ...linkInput, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Target Download URL</label>
              <input
                type="url"
                placeholder="https://drive.google.com/... or https://github.com/..."
                value={linkInput.url}
                onChange={(e) => setLinkInput({ ...linkInput, url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Type</label>
                <select
                  value={linkInput.type}
                  onChange={(e) => setLinkInput({ ...linkInput, type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="LINK">LINK (Web / Cloud)</option>
                  <option value="PDF">PDF Document</option>
                  <option value="ZIP">ZIP Archive</option>
                  <option value="CODE">CODE Repository</option>
                  <option value="DOC">Document / Notes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Display Size / Info</label>
                <input
                  type="text"
                  placeholder="e.g. 15 MB, Cloud, Free"
                  value={linkInput.size}
                  onChange={(e) => setLinkInput({ ...linkInput, size: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Extra Note (Optional)</label>
              <input
                type="text"
                placeholder="e.g. No signup required, password: 123"
                value={linkInput.note}
                onChange={(e) => setLinkInput({ ...linkInput, note: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewLinkModal(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddExternalLink}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500"
              >
                Attach Link
              </button>
            </div>
          </div>
        </div>
      )}

    </form>
  );
}
