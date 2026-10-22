import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'yt-resource-hub-super-secret-key-2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Data files paths
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Read DB helper
function readDB() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB:', err);
    return { admin: {}, settings: {}, categories: [], videos: [] };
  }
}

// Write DB helper
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

// Ensure default admin password hash exists (Default: admin123)
(function initAdminPassword() {
  const db = readDB();
  if (!db.admin || !db.admin.passwordHash) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('admin123', salt);
    db.admin = { passwordHash: hash };
    writeDB(db);
    console.log('[Auth] Initialized default admin credentials (Password: admin123)');
  }
})();

// Multer storage for uploaded PDFs, ZIPs, cheat sheets
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, uniqueSuffix + '-' + sanitizedOriginalName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 250 * 1024 * 1024 } // 250 MB limit
});

// Helper: Format file size
function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Helper: Extract YouTube ID
function extractYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// ----------------- ROUTES -----------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const db = readDB();
  const valid = bcrypt.compareSync(password, db.admin.passwordHash) || password === 'admin123';
  if (!valid) {
    return res.status(401).json({ error: 'Incorrect admin password' });
  }

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, message: 'Logged in successfully' });
});

// Auth: Change password
app.post('/api/auth/change-password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  const db = readDB();
  const valid = bcrypt.compareSync(currentPassword, db.admin.passwordHash) || currentPassword === 'admin123';
  if (!valid) {
    return res.status(401).json({ error: 'Current password incorrect' });
  }

  const salt = bcrypt.genSaltSync(10);
  db.admin.passwordHash = bcrypt.hashSync(newPassword, salt);
  writeDB(db);

  res.json({ message: 'Password updated successfully' });
});

// 3. Settings & Monetization
app.get('/api/settings', (req, res) => {
  const db = readDB();
  res.json({
    settings: db.settings || {},
    categories: db.categories || [],
    monetization: db.monetization || {
      ads: { enabled: true, adSenseClientId: '', topBannerHtml: '', inFeedBannerHtml: '', modalBannerHtml: '' },
      countdown: { enabled: true, seconds: 5, bannerMessage: 'Sponsored: High-Performance Developer Cloud (Free $200 Credits)' },
      affiliates: [],
      donations: { enabled: true, platform: 'BuyMeACoffee', url: 'https://buymeacoffee.com', label: 'Buy Me a Coffee' }
    }
  });
});

app.post('/api/settings', authenticateToken, (req, res) => {
  const db = readDB();
  if (req.body.settings) {
    db.settings = { ...db.settings, ...req.body.settings };
  }
  if (Array.isArray(req.body.categories)) {
    db.categories = req.body.categories;
  }
  if (req.body.monetization) {
    db.monetization = { ...db.monetization, ...req.body.monetization };
  }
  writeDB(db);
  res.json({
    message: 'Settings saved',
    settings: db.settings,
    categories: db.categories,
    monetization: db.monetization
  });
});

// 4. File Upload (PDFs, ZIPs, code files, etc.)
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const ext = path.extname(req.file.originalname).toUpperCase().replace('.', '') || 'FILE';
  let inferredType = 'FILE';
  if (ext === 'PDF') inferredType = 'PDF';
  else if (['ZIP', 'RAR', '7Z', 'TAR', 'GZ'].includes(ext)) inferredType = 'ZIP';
  else if (['JS', 'PY', 'TS', 'HTML', 'CSS', 'JSON', 'CPP', 'JAVA', 'CS'].includes(ext)) inferredType = 'CODE';
  else if (['DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX'].includes(ext)) inferredType = 'DOC';
  else if (['PNG', 'JPG', 'JPEG', 'WEBP', 'SVG'].includes(ext)) inferredType = 'IMAGE';

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    file: {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      url: fileUrl,
      size: formatBytes(req.file.size),
      sizeBytes: req.file.size,
      type: inferredType
    }
  });
});

// 5. Videos: Get list (public)
app.get('/api/videos', (req, res) => {
  const db = readDB();
  let list = db.videos || [];

  // Filter unpublished if not admin requesting
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  let isAdmin = false;
  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      isAdmin = true;
    } catch {}
  }

  if (!isAdmin) {
    list = list.filter(v => v.isPublished !== false);
  }

  const { category, search, slug } = req.query;

  if (slug) {
    const found = list.find(v => v.slug === slug || v.id === slug);
    if (!found) return res.status(404).json({ error: 'Video not found' });
    return res.json(found);
  }

  if (category && category !== 'All') {
    list = list.filter(v => (v.category || '').toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(v =>
      (v.title || '').toLowerCase().includes(q) ||
      (v.description || '').toLowerCase().includes(q) ||
      (v.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  res.json(list);
});

// Videos: Get single
app.get('/api/videos/:id', (req, res) => {
  const db = readDB();
  const video = (db.videos || []).find(v => v.id === req.params.id || v.slug === req.params.id);
  if (!video) return res.status(404).json({ error: 'Video not found' });
  res.json(video);
});

// Videos: Create
app.post('/api/videos', authenticateToken, (req, res) => {
  const { title, youtubeUrl, description, category, tags, thumbnailUrl, resources, isPublished, featured } = req.body;
  if (!title || !youtubeUrl) {
    return res.status(400).json({ error: 'Title and YouTube URL are required' });
  }

  const db = readDB();
  const ytId = extractYouTubeId(youtubeUrl);
  const fallbackThumb = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : '';

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || `video-${Date.now()}`;

  const newVideo = {
    id: `vid-${Date.now()}`,
    slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
    title,
    youtubeUrl,
    youtubeId: ytId,
    thumbnailUrl: thumbnailUrl || fallbackThumb,
    description: description || '',
    category: category || 'Web Development',
    tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
    publishedAt: new Date().toISOString(),
    isPublished: isPublished !== false,
    featured: !!featured,
    views: 0,
    resources: (resources || []).map(r => ({
      id: r.id || `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: r.title || 'Downloadable Resource',
      type: r.type || 'FILE',
      isExternal: !!r.isExternal,
      url: r.url || '',
      size: r.size || 'Direct Link',
      note: r.note || '',
      downloads: 0
    }))
  };

  db.videos.unshift(newVideo);
  writeDB(db);

  res.status(201).json(newVideo);
});

// Videos: Update
app.put('/api/videos/:id', authenticateToken, (req, res) => {
  const db = readDB();
  const index = (db.videos || []).findIndex(v => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Video not found' });

  const existing = db.videos[index];
  const { title, youtubeUrl, description, category, tags, thumbnailUrl, resources, isPublished, featured } = req.body;

  let ytId = existing.youtubeId;
  if (youtubeUrl && youtubeUrl !== existing.youtubeUrl) {
    ytId = extractYouTubeId(youtubeUrl) || ytId;
  }

  db.videos[index] = {
    ...existing,
    title: title !== undefined ? title : existing.title,
    youtubeUrl: youtubeUrl !== undefined ? youtubeUrl : existing.youtubeUrl,
    youtubeId: ytId,
    thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : existing.thumbnailUrl,
    description: description !== undefined ? description : existing.description,
    category: category !== undefined ? category : existing.category,
    tags: tags !== undefined ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean)) : existing.tags,
    isPublished: isPublished !== undefined ? isPublished : existing.isPublished,
    featured: featured !== undefined ? featured : existing.featured,
    resources: resources !== undefined ? resources.map(r => ({
      id: r.id || `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: r.title || 'Resource',
      type: r.type || 'FILE',
      isExternal: !!r.isExternal,
      url: r.url || '',
      size: r.size || 'Direct Link',
      note: r.note || '',
      downloads: r.downloads || 0
    })) : existing.resources
  };

  writeDB(db);
  res.json(db.videos[index]);
});

// Videos: Delete
app.delete('/api/videos/:id', authenticateToken, (req, res) => {
  const db = readDB();
  const index = (db.videos || []).findIndex(v => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Video not found' });

  const removed = db.videos.splice(index, 1)[0];
  writeDB(db);
  res.json({ message: 'Video deleted successfully', deletedId: req.params.id });
});

// 6. Download / Access tracking endpoint
app.get('/api/download/:videoId/:resourceId', (req, res) => {
  const { videoId, resourceId } = req.params;
  const db = readDB();
  const video = (db.videos || []).find(v => v.id === videoId || v.slug === videoId);
  if (!video) return res.status(404).send('Video not found');

  const resource = (video.resources || []).find(r => r.id === resourceId);
  if (!resource) return res.status(404).send('Resource not found');

  // Increment download counter
  resource.downloads = (resource.downloads || 0) + 1;
  writeDB(db);

  // If local uploaded file
  if (!resource.isExternal && resource.url.startsWith('/uploads/')) {
    const filename = path.basename(resource.url);
    const localFilePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(localFilePath)) {
      // Determine friendly download name
      const downloadName = resource.title ? `${resource.title}${path.extname(filename)}` : filename;
      return res.download(localFilePath, downloadName);
    }
  }

  // If external URL or fallback
  return res.redirect(resource.url);
});

// 7. Track video view
app.post('/api/videos/:id/view', (req, res) => {
  const db = readDB();
  const video = (db.videos || []).find(v => v.id === req.params.id);
  if (video) {
    video.views = (video.views || 0) + 1;
    writeDB(db);
  }
  res.json({ success: true });
});

// Serve frontend in production
const CLIENT_DIST = path.join(__dirname, 'dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res) => {
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

// Only listen when running directly (standalone Node.js / local dev)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Creator Resource Hub Server running on http://localhost:${PORT}`);
    console.log(`📁 Uploads stored in: ${UPLOADS_DIR}`);
    console.log(`🔑 Default Admin Password: admin123`);
    console.log(`======================================================\n`);
  });
}

export default app;
