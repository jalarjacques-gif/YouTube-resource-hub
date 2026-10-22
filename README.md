# 🎥 Creator Resource Hub & Download Portal

A full-stack web application designed for YouTubers and content creators to post YouTube video tutorials and attach companion resources (PDFs, ZIP starter codes, cheatsheets, design files, or cloud links) for viewers to download.

---

## ✨ Features

- **Public Viewer Portal**:
  - **YouTube Video Gallery**: Displays video cards with high-res thumbnails, categories, tags, and attached download counts.
  - **Embedded Player**: Viewers can watch tutorials directly on your website or jump to YouTube with one click.
  - **Direct Download & Cloud Links**:
    - Direct server downloads (PDFs, ZIPs, code files).
    - External cloud links (Google Drive, Dropbox, GitHub, MediaFire, Figma).
  - **One-Click Share Links for YouTube Descriptions**:
    - Generates clean links like `https://yoursite.com/?v=full-stack-web-development-crash-course` that you can paste directly into your YouTube description or pinned comment.
    - When clicked by viewers, it instantly opens the video player and highlights the download links!
  - **Live Search & Category Filtering**: Instant filtering by category or keyword across video titles, descriptions, tags, and file names.
  - **Download Tracking**: Tracks download metrics so you can see which resources your audience downloads the most.

- **Creator Admin Portal**:
  - Secure PIN/Password authentication (Default password: `admin123`).
  - **Add Video in Seconds**:
    - Just paste any YouTube URL (standard, shortened `youtu.be`, or Shorts).
    - Automatically extracts video ID and fetches the high-definition thumbnail.
  - **Attach Multiple Resources per Video**:
    - Drag-and-drop file upload (up to 250 MB per file) directly to the server.
    - Add external download links (Google Drive, GitHub repo, etc.).
    - Add custom notes (e.g., *"Password for ZIP: 123"* or *"Includes Cheatsheet"*).
  - **Manage & Edit**: Edit videos, toggle draft/published visibility, or delete anytime.
  - **Branding & Socials**: Customize channel name, avatar, bio, banner announcements, and category tabs directly from the admin panel.
  - **Security**: Change admin password from the dashboard anytime.

---

## 🚀 Quick Start Guide

### 1. Start the Website

Open PowerShell or your terminal in this directory (`F:\yt-resource-hub`) and run:

```powershell
node server.js
```

Then open your browser and navigate to:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 🌐 Separate URLs: Public Viewers vs Admin

| Role | URL | What They See |
| :--- | :--- | :--- |
| **Viewers / Audience** | `http://localhost:5000/` | Clean public gallery to watch videos and download PDFs/ZIPs. **Zero admin buttons or login links are visible.** |
| **You (Creator/Admin)** | `http://localhost:5000/admin` | Private Admin Dashboard to post videos, upload files, check analytics, and manage branding. |

---

## 🔑 Admin Access

1. Open **[http://localhost:5000/admin](http://localhost:5000/admin)** in your browser.
2. Enter the admin password:
   - **Default Password:** `admin123`
3. You can change this password anytime under the **Change Password** tab in the dashboard.

---

## 📦 How to Post a New Video & Resources

1. Log in to the Admin Portal.
2. Click **"Add New Video"**:
   - Paste your **YouTube Video URL** (e.g. `https://www.youtube.com/watch?v=...`).
   - Enter your **Video Title**, **Category**, and **Description**.
3. Under **Attached Resources**:
   - Click **"Upload File (PDF/ZIP)"** to upload a PDF cheatsheet or project ZIP directly from your computer.
   - Click **"Add External Link"** to link to a Google Drive folder, GitHub repo, or Dropbox.
4. Click **"Publish Video & Resources"**.
5. Copy the generated link (`Copy Link for YouTube Description`) and paste it into your YouTube video description!

---

## 🗂️ Project Structure

```text
yt-resource-hub/
├── server.js              # Express backend (API, authentication, uploads, static hosting)
├── package.json           # Backend dependencies and run scripts
├── data/
│   └── db.json            # JSON database storing videos, resources, settings & analytics
├── uploads/               # Stored PDFs, ZIPs, and uploaded files
└── client/                # React + Tailwind CSS + Lucide frontend
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Hero.jsx
        │   ├── VideoCard.jsx
        │   ├── VideoModal.jsx
        │   ├── AdminModal.jsx
        │   ├── AdminVideoForm.jsx
        │   ├── ResourceBadge.jsx
        │   ├── YoutubeIcon.jsx
        │   └── Footer.jsx
        └── utils/
            └── youtube.js
```

---

## 🌐 Deploying to the Internet (Free Hosting Options)

When you're ready to put this website online so your YouTube viewers worldwide can access it:

## 🌐 Deploying to Vercel (Recommended & 100% Free)

This project is now pre-configured for **Vercel** with native serverless functions and global edge CDN:

1. Push this project to your GitHub account:
   ```powershell
   git add .
   git commit -m "Configure Vercel deployment"
   git push
   ```
2. Go to **[vercel.com](https://vercel.com)** and log in with your GitHub account.
3. Click **"Add New..." → "Project"**.
4. Select your `creator-hub` repository and click **Import**.
5. Leave all build settings as default (Vercel automatically detects `vercel.json`).
6. Click **Deploy**.

In under 60 seconds, your site is live with a free worldwide HTTPS domain:
- **Public Viewer URL:** `https://your-project.vercel.app/`
- **Private Admin Dashboard:** `https://your-project.vercel.app/admin`

> **Note on Vercel File Storage:** Because Vercel functions are serverless and stateless, store your downloadable files on **Google Drive, GitHub Releases, Dropbox, or Mega**, and link them using the **"Add External Link"** button in `/admin`. This gives you unlimited free bandwidth and storage for your viewers!

### Option B: VPS (DigitalOcean / Linode / Hetzner)
1. Run `npm install` and `npm --prefix client run build`.
2. Start the app with PM2: `pm2 start server.js --name yt-hub`.
3. Point your custom domain (e.g. `resources.yourchannel.com`) using Nginx with free SSL (Certbot).
