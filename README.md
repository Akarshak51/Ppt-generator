# AdForge — Full-Stack Animated Ad Generator

> Generate cinematic, full-screen animated advertisements for any brand.
> **No AI. No cloud. No accounts. All data stored locally on your machine.**

---

## Table of Contents

1. [What Is AdForge?](#1-what-is-adforge)
2. [Features](#2-features)
3. [Project Structure](#3-project-structure)
4. [Tech Stack](#4-tech-stack)
5. [Prerequisites](#5-prerequisites)
6. [Installation](#6-installation)
7. [Running the App](#7-running-the-app)
8. [How Generation Works](#8-how-generation-works)
9. [Pages & UI Guide](#9-pages--ui-guide)
10. [REST API Reference](#10-rest-api-reference)
11. [Animation System](#11-animation-system)
12. [Visual Presets](#12-visual-presets)
13. [Data Storage](#13-data-storage)
14. [Configuration](#14-configuration)
15. [Customisation Guide](#15-customisation-guide)
16. [Troubleshooting](#16-troubleshooting)
17. [File-by-File Reference](#17-file-by-file-reference)

---

## 1. What Is AdForge?

AdForge is a full-stack web application that turns a few sentences about your company into a polished, full-screen animated advertisement — rendered entirely in the browser using CSS keyframe animations and React.

You provide:
- Company name, tagline, description
- Target audience and brand keywords
- Primary & secondary brand colours
- A visual style preset (Minimal / Bold / Futuristic / Playful / Corporate / Luxury)

The **Express backend** analyses your text, infers your brand's tone, and returns a complete ad configuration: unique copywriting, a derived colour palette, a Google Font pairing, and 4 animated scenes. Everything is saved as a plain JSON file on your laptop.

---

## 2. Features

### Core Generation
- **Rule-based copy generation** — headline, subheadline, 3 benefit cards, CTA copy all inferred from your keywords
- **Tone detection** — luxury, tech, eco, health, playful, finance, fashion tones each produce unique copy pools
- **6 unique visual presets** — each with distinct typography, geometry, animations, and colour defaults
- **4-scene animated ad** — Intro → Headline → Benefits → CTA

### Ad Player
- Auto-plays through all 4 scenes with configurable speed
- Arrow key navigation (`←` / `→`) + Spacebar play/pause
- Dot indicator navigation + scene counter overlay
- Cross-fade transition between scenes
- Speed selector: Slow / Normal / Fast

### Scene Editor
- Edit every text field in every scene inline
- Live colour pickers for Primary / Accent / Neutral palette
- Change animation speed without regenerating
- Save changes to disk with one click

### Library
- Responsive grid of all saved ads with animated thumbnail previews
- Filter by preset (All / Minimal / Bold / Futuristic / Playful / Corporate / Luxury)
- Search by company name
- Delete individual ads or clear all

### Export
- **Ad Config JSON** — palette, fonts, scenes (for integration or re-use)
- **Full Record JSON** — complete database record including original form inputs
- **HTML Snippet** — embed config in a `<script>` tag for external use
- Copy to clipboard

### Stats Dashboard
- Total ads saved counter
- Animated bar chart of ads by preset
- Recent ads list
- Exact local file paths, backup instructions, migration guide

---

## 3. Project Structure

```
adforge/
│
├── package.json                    ← root scripts: dev, install:all, build, start
├── README.md                       ← this file
│
├── server/                         ← Express backend (Node.js)
│   ├── package.json                ← express, cors, uuid, nodemon
│   ├── index.js                    ← ENTIRE backend: API routes + generation logic
│   └── data/                       ← auto-created on first run
│       ├── ads.json                ← all your saved ads (plain JSON array)
│       └── presets.json            ← style preset metadata
│
└── client/                         ← React frontend (Vite)
    ├── index.html                  ← HTML entry point
    ├── package.json                ← react, react-dom, react-router-dom, vite
    ├── vite.config.js              ← dev server + /api proxy to :3001
    └── src/
        ├── main.jsx                ← ReactDOM.createRoot entry
        ├── App.jsx                 ← BrowserRouter + Routes
        ├── index.css               ← design tokens, global styles, all keyframes
        │
        ├── components/
        │   ├── Layout.jsx          ← sidebar navigation + server status dot
        │   ├── AdPreview.jsx       ← 16:9 ad player with cross-fade + controls
        │   ├── SceneRenderer.jsx   ← renders each scene with all animations
        │   ├── SceneEditor.jsx     ← sidebar form to edit scenes + palette live
        │   └── AdCard.jsx          ← thumbnail card used in library grid
        │
        ├── pages/
        │   ├── HomePage.jsx        ← landing: hero, stats, preset showcase, recent ads
        │   ├── CreatePage.jsx      ← brand input form + preset/colour pickers
        │   ├── AdDetailPage.jsx    ← full preview + editor panel + export modal
        │   ├── LibraryPage.jsx     ← searchable/filterable ad grid
        │   └── StatsPage.jsx       ← usage stats + storage info
        │
        └── utils/
            ├── api.js              ← fetch wrapper for all 9 backend endpoints
            └── colors.js           ← hex helpers: contrast, darken, lighten, alphaHex
```

---

## 4. Tech Stack

| Layer         | Technology                           | Version  |
|---------------|--------------------------------------|----------|
| Frontend      | React                                | 18.x     |
| Routing       | React Router DOM                     | 6.x      |
| Bundler       | Vite                                 | 5.x      |
| Animations    | Pure CSS keyframes (zero libraries)  | —        |
| Fonts         | Google Fonts (injected at runtime)   | —        |
| Backend       | Node.js + Express                    | 4.x      |
| Data Storage  | Local JSON files via Node `fs`       | built-in |
| IDs           | uuid v4                              | 9.x      |
| Dev runner    | concurrently + nodemon               | —        |

**Zero database. Zero ORM. Zero authentication. Zero cloud dependency.**

---

## 5. Prerequisites

| Tool    | Minimum Version | Check                |
|---------|-----------------|----------------------|
| Node.js | 18.x or higher  | `node --version`     |
| npm     | 9.x or higher   | `npm --version`      |

Download Node.js from: **https://nodejs.org**

---

## 6. Installation

### Step 1 — Extract

```bash
unzip adforge.zip
cd adforge
```

### Step 2 — Install all dependencies (one command)

```bash
npm run install:all
```

This installs packages in three directories:
- `/` root — installs `concurrently`
- `/server` — installs `express`, `cors`, `uuid`, `nodemon`
- `/client` — installs `react`, `react-dom`, `react-router-dom`, `vite`

**Manual alternative (if the above fails):**
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

---

## 7. Running the App

### Development (recommended — one command)

From the root `adforge/` folder:

```bash
npm run dev
```

This starts both servers simultaneously using `concurrently`:

| Service             | URL                       | Notes                           |
|---------------------|---------------------------|---------------------------------|
| Frontend (Vite)     | http://localhost:5173     | Open this in your browser       |
| Backend (Express)   | http://localhost:3001     | REST API — do not open directly |

Open **http://localhost:5173** in Chrome, Firefox, or Edge.

---

### Manual (two terminals)

**Terminal 1 — Backend:**
```bash
cd adforge/server
npm run dev
```

Console output:
```
🚀 AdForge Server running at http://localhost:3001
📁 Data stored at: /Users/you/adforge/server/data
📄 Ads file: /Users/you/adforge/server/data/ads.json
```

**Terminal 2 — Frontend:**
```bash
cd adforge/client
npm run dev
```

---

### Production Build

```bash
# 1. Build the React app into client/dist/
npm run build

# 2. Run only the Express server
npm start
```

To serve the built frontend, either configure Express to serve `client/dist/` as static files, or deploy `client/dist/` to a CDN/static host (Netlify, Vercel, etc.) and set the API URL.

---

## 8. How Generation Works

All logic is in `server/index.js` inside `generateAdContent(form)`. **No AI, no external APIs** — pure rule-based inference.

### Step 1 — Tone Inference

The function concatenates your `keywords` and `description` fields and tests them against regex patterns:

```
luxury / premium / elite / exclusive / prestige  →  tone: "luxury"
eco / green / sustain / organic / environ        →  tone: "eco"
tech / ai / digital / software / data / cloud   →  tone: "tech"
health / wellness / fit / medical / nutrition    →  tone: "health"
fun / play / kids / game / creative / vibrant   →  tone: "playful"
finance / invest / bank / wealth / capital      →  tone: "finance"
fashion / style / wear / apparel / boutique     →  tone: "fashion"
(none matched)                                  →  tone: "default"
```

### Step 2 — Copy Generation

Each tone has its own pool of options:

```js
// Headlines — 3 options, one picked at random per generation
headlines.luxury = [
  "Redefine What {company} Means to You",
  "The Pinnacle of Excellence",
  "Where Craft Meets {company}"
]

// Subheadline is derived from the first sentence of your description.

// Eyebrow (small label above headline)
eyebrows.tech = "Next-Gen Technology"

// 3 benefit cards with icon + title + description
benefitSets.eco = [
  { icon: "🌿", title: "100% Sustainable", desc: "..." },
  { icon: "♻",  title: "Zero Waste Pledge", desc: "..." },
  { icon: "🌍", title: "Carbon Neutral", desc: "..." }
]
```

### Step 3 — Palette Derivation

If you provide `primaryColor` and `secondaryColor` in the form, they override the preset defaults.
Otherwise the preset defaults are used:

```
minimal    → #f8f8f8 / #111111 / #ffffff
bold       → #0a0a0a / #e63946 / #111111
futuristic → #060d1f / #00ffe7 / #08101e
playful    → #fffbeb / #f97316 / #fff7ed
corporate  → #0f2644 / #2563eb / #f0f4fa
luxury     → #0d0d0d / #c9a84c / #111111
```

### Step 4 — Font Assignment

```
minimal    → DM Serif Display + DM Sans
bold       → Bebas Neue + Barlow
futuristic → Orbitron + Exo 2
playful    → Righteous + Nunito
corporate  → Playfair Display + Source Sans 3
luxury     → Cormorant Garamond + Montserrat
```

Fonts are loaded dynamically via Google Fonts when the SceneRenderer mounts. They require an internet connection on first load, then are cached by the browser.

### Step 5 — Scene Construction

The server returns a complete `scenes[]` array:

```json
[
  {
    "type": "intro",
    "companyName": "Zenith Coffee",
    "tagline": "Wake up to something better"
  },
  {
    "type": "headline",
    "eyebrow": "Premium Experience",
    "headline": "Redefine What Coffee Means to You",
    "subheadline": "Premium single-origin coffee delivered monthly to your door."
  },
  {
    "type": "benefits",
    "sectionTitle": "Why Choose Us",
    "benefits": [
      { "icon": "✦", "title": "Unmatched Quality", "desc": "Crafted with obsessive attention to detail." },
      { "icon": "◇", "title": "Exclusive Access",  "desc": "Personalized service for members." },
      { "icon": "◈", "title": "Timeless Design",   "desc": "Aesthetics that endure beyond trends." }
    ]
  },
  {
    "type": "cta",
    "ctaHeadline": "Your Exclusive Access Awaits",
    "microcopy": "Zenith Coffee is trusted by coffee lovers worldwide.",
    "ctaText": "Request Access",
    "subCta": "By invitation only · Limited availability"
  }
]
```

---

## 9. Pages & UI Guide

### Home (`/`)
- Animated hero with ambient gradient orbs
- Stats row: total saved, top preset, storage type
- **Preset showcase** — 6 interactive mini-previews; click any to go to Create
- "How it works" 3-step guide with numbered badges
- Features grid
- Recent ads (last 4, with delete buttons)

### Create Ad (`/create`)
**Left column — Brand Info:**
- Company Name *(required)*
- One-line Tagline
- Description *(required)* — drives tone inference
- Target Audience
- Brand Keywords — comma-separated; e.g. `luxury, minimal, sustainable`
- Website URL *(optional, stored but not fetched)*

**Right column — Visual Style:**
- 6 animated preset buttons with icon + name + description
- Primary colour: colour picker + hex text input
- Accent colour: colour picker + hex text input
- Live gradient preview swatch showing your company name in the chosen font

Click **✦ Generate Ad** → redirected to Ad Detail page on success.

### Ad Detail (`/ads/:id`)
- Full 16:9 animated ad canvas
- Scene counter overlay (top-right)
- Dot navigation (bottom)
- Arrow buttons (left/right)
- Keyboard: `←` `→` to navigate, `Space` to play/pause
- Speed toggle: Slow / Normal / Fast (affects all animation durations proportionally)
- **✏ Edit Scenes** — opens sidebar editor panel
- **↗ Export** — modal with JSON / Full JSON / HTML snippet tabs + copy button
- **🗑 Delete** — with confirmation prompt
- **💾 Save** — writes edits back to `ads.json`
- Collapsible "Original Form Inputs" section at bottom

### Library (`/library`)
- Responsive CSS grid (auto-fill, min 300px)
- Filter row: All / Minimal / Bold / Futuristic / Playful / Corporate / Luxury
- Search input (case-insensitive, filters by company name)
- Each card: gradient thumbnail, company name, preset, date, delete button
- "Clear All" with confirmation
- Empty state with CTA to Create

### Stats (`/stats`)
- 3 KPI cards: total ads, top preset, storage type
- Horizontal bar chart (all 6 presets, coloured)
- Recent ads list (last 5, with palette swatch + date)
- Storage info grid: ads file path, data dir path, format, backup method, reset method, migrate method

---

## 10. REST API Reference

All endpoints are prefixed with `/api` and served from `http://localhost:3001`.

In the React app, requests go to `/api/...` which Vite proxies to `:3001` during development.

---

### `GET /api/ads`
Returns a summary list (no full scene arrays — faster for list pages).

**Response `200`:**
```json
{
  "success": true,
  "count": 2,
  "ads": [
    {
      "id": "a1b2c3d4-e5f6-...",
      "companyName": "Zenith Coffee",
      "preset": "luxury",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "palette": { "primary": "#0d0d0d", "accent": "#c9a84c", "neutral": "#111111" }
    }
  ]
}
```

---

### `GET /api/ads/:id`
Returns the full ad record including all scenes.

**Response `200`:** Full ad object with `scenes[]`, `fonts`, `form`, etc.

**Response `404`:**
```json
{ "success": false, "error": "Ad not found" }
```

---

### `POST /api/ads/generate`
Generates a new ad from brand input and saves it to disk.

**Required body fields:** `companyName` (string), `description` (string)

**Full body example:**
```json
{
  "companyName": "Zenith Coffee Co.",
  "tagline": "Wake up to something better",
  "description": "Premium single-origin coffee delivered monthly. We partner with ethical farms across Ethiopia, Colombia, and Guatemala.",
  "audience": "Coffee lovers, professionals aged 25–45",
  "keywords": "premium, artisan, sustainable, ethical",
  "primaryColor": "#1a0a00",
  "secondaryColor": "#c9a84c",
  "preset": "luxury"
}
```

**Response `201`:** Full ad object.

**Response `400`:**
```json
{ "success": false, "error": "companyName and description are required" }
```

---

### `PUT /api/ads/:id`
Updates an existing ad (called after editing in the UI).

**Body:** Partial or full ad object. `id` and `createdAt` are preserved; `updatedAt` is set to current time.

**Response `200`:** Updated ad object.

---

### `DELETE /api/ads/:id`
Deletes one ad by ID.

**Response `200`:**
```json
{ "success": true, "message": "Ad deleted" }
```

---

### `DELETE /api/ads`
Deletes **all** ads — resets `ads.json` to `[]`.

**Response `200`:**
```json
{ "success": true, "message": "All ads deleted" }
```

---

### `GET /api/presets`
Returns all 6 style preset configurations from `presets.json`.

---

### `GET /api/stats`

**Response `200`:**
```json
{
  "success": true,
  "stats": {
    "total": 8,
    "presetCounts": {
      "luxury": 3,
      "bold": 2,
      "futuristic": 1,
      "playful": 1,
      "corporate": 1
    },
    "dataFile": "/absolute/path/adforge/server/data/ads.json"
  }
}
```

---

### `GET /api/health`

**Response `200`:**
```json
{
  "success": true,
  "status": "ok",
  "dataDir": "/absolute/path/adforge/server/data",
  "adsFile": "/absolute/path/adforge/server/data/ads.json"
}
```

---

## 11. Animation System

All animations use pure CSS keyframes defined in `client/src/index.css`. Zero animation libraries.

### The `AB` (AnimationBlock) Component

Every animated element in `SceneRenderer.jsx` is wrapped in:

```jsx
<AB anim="slideUp" delay={d(300)} dur={d(650)} ease="cubic-bezier(0.22,1,0.36,1)">
  {children}
</AB>
```

The `d()` helper applies the speed multiplier:
```js
const mult = animSpeed === "slow" ? 1.65 : animSpeed === "fast" ? 0.52 : 1;
const d = ms => Math.round(ms * mult);
```

### Complete Keyframe Reference

| Keyframe          | What it does                                         | Primary usage                        |
|-------------------|------------------------------------------------------|--------------------------------------|
| `fadeIn`          | Opacity 0 → 1                                        | Scene overlay, modals, badges        |
| `fadeOut`         | Opacity 1 → 0                                        | Scene exit cross-fade                |
| `slideUp`         | TranslateY(36px) + fade in                           | Subheadlines, body copy, cards       |
| `slideDown`       | TranslateY(-28px) + fade in                          | Section headers (benefits)           |
| `slideInLeft`     | TranslateX(-48px) + fade in                          | Eyebrow labels, left-positioned copy |
| `slideInRight`    | TranslateX(48px) + fade in                           | Editor panel slide-in                |
| `scaleIn`         | Scale(0.68) + fade in                                | Company name intro (most presets)    |
| `bounceIn`        | Scale spring: 0.3 → 1.07 → 0.95 → 1                 | CTA button, playful elements         |
| `waveIn`          | TranslateY + skewY + fade (per-word stagger)         | All headline and CTA headline words  |
| `glitchIn`        | SkewX + scaleX + translateX + stabilise              | Futuristic company name entrance     |
| `typewriter`      | `clip-path: inset(0 100% 0 0)` → `inset(0 0% 0 0)`  | Futuristic tagline reveal            |
| `neonFlicker`     | Opacity stutters at irregular intervals              | Futuristic text, button              |
| `gradientDrift`   | Background-position 0% → 100% → 0%                  | Intro + benefits gradient background |
| `floatY`          | TranslateY 0 → -22px → 0 loop                       | Benefit icons, background shapes     |
| `floatYR`         | TranslateY 0 → +18px → 0 loop (reverse)             | Bold diagonal slab                   |
| `rotateSlow`      | Full 360° rotation loop                              | Ring/circle backgrounds              |
| `rotateSlowR`     | Full -360° rotation loop                             | Luxury counter-rotating rings        |
| `morphBlob`       | Border-radius keyframe morphing                      | Playful organic blob shapes          |
| `glowBreath`      | Opacity 0.7 → 1 → 0.7 loop                           | Accent strips, futuristic dots       |
| `shimmer`         | Background-position -200% → +200%                   | Button sheen sweep, futuristic bar   |
| `particleFly`     | TranslateY(-160px) + scale(0.3) + opacity 0          | SVG particle field                   |
| `scanLine`        | Top 0% → 100% sweep                                  | Futuristic scan line                 |
| `ringExpand`      | Scale(0.8) → scale(3.0) + opacity 0                  | CTA button pulse ring                |
| `lineGrow`        | Width 0 → 52px                                       | Accent divider lines                 |
| `spin`            | 360° fast                                            | Loading spinner                      |
| `countUp`         | TranslateY(10px) + fade in                           | Stats page number entrance           |
| `toast`           | Slide up → hold → slide up away                      | Save confirmation toast              |

### Motion Design Principles Applied

1. **Purpose over decoration** — every animation conveys hierarchy or confirms action
2. **Stagger reveals** — words enter sequentially via `waveIn` to guide reading order
3. **Easing** — all entrances use `cubic-bezier(0.22,1,0.36,1)` (natural spring); bouncy elements use `cubic-bezier(0.34,1.56,0.64,1)` (overshoot spring)
4. **Background motion is subtle** — `gradientDrift` at 16 seconds, `rotateSlow` at 22-45 seconds — never distracting
5. **Speed proportionality** — the `d()` multiplier scales all durations together so the ad feels the same at any speed

---

## 12. Visual Presets

### Minimal
- **Display font:** DM Serif Display (serif, elegant)
- **Body font:** DM Sans (clean, geometric)
- **Colours:** Off-white primary, deep black accent, white neutral
- **Background geometry:** Rotating circle outlines + floating square
- **Title animation:** `scaleIn`
- **Feel:** Editorial, airy, Bauhaus-inspired

### Bold
- **Display font:** Bebas Neue (condensed uppercase)
- **Body font:** Barlow (strong grotesque)
- **Colours:** Black primary, vivid red accent
- **Background geometry:** Skewed diagonal slab shapes + giant ring outline
- **Title animation:** `scaleIn` with uppercase transform
- **Special:** All display text forced uppercase
- **Feel:** Urban streetwear, sports brand, high-impact

### Futuristic
- **Display font:** Orbitron (tech, geometric)
- **Body font:** Exo 2 (sci-fi humanist)
- **Colours:** Deep navy primary, electric cyan accent
- **Background geometry:** CSS grid overlay + animated scan line + corner UI brackets + concentric rings
- **Title animation:** `glitchIn` (horizontal glitch)
- **Tagline:** `typewriter` clip-path reveal
- **Text:** `neonFlicker` on title + button
- **Button:** Transparent with neon border + inner glow
- **Special:** Stat readout row on headline scene ("EFFICIENCY: 99.8%"), SVG rectangle particles
- **Feel:** Cyberpunk, HUD interface, space tech

### Playful
- **Display font:** Righteous (rounded, fun)
- **Body font:** Nunito (friendly, rounded)
- **Colours:** Warm cream primary, orange accent
- **Background geometry:** 7 floating colour circles + 2 morphing blobs
- **Title animation:** `bounceIn` with spring easing
- **Divider:** Bouncing star emojis
- **Feel:** Consumer apps, kids products, creative agencies

### Corporate
- **Display font:** Playfair Display (authoritative serif)
- **Body font:** Source Sans 3 (professional, readable)
- **Colours:** Dark navy primary, blue accent, light grey neutral
- **Background geometry:** Right-side gradient panel + 4 animated vertical lines
- **Title animation:** `scaleIn`
- **Feel:** Finance, legal, enterprise SaaS, consulting

### Luxury
- **Display font:** Cormorant Garamond (high fashion serif, italic variants)
- **Body font:** Montserrat (refined sans)
- **Colours:** Near-black primary, gold accent
- **Background geometry:** 3 concentric ornamental rings + rotating diamond + corner filigree brackets
- **Title animation:** `fadeIn` (no scale — stillness conveys luxury)
- **Divider:** Rotating gold diamond flanked by horizontal rules
- **Button:** Gold gradient + deep shadow
- **Typography:** Light weight (300), generous letter-spacing (0.16em), uppercase tagline
- **Feel:** Haute couture, jewellery, premium hospitality

---

## 13. Data Storage

### Location

```
adforge/server/data/ads.json
```

Created automatically when you first generate an ad. Never deleted unless you delete it manually or use "Clear All" in the Library.

### Format

Human-readable JSON array. Each entry:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "companyName": "Zenith Coffee Co.",
  "preset": "luxury",
  "palette": {
    "primary": "#0d0d0d",
    "accent": "#c9a84c",
    "neutral": "#111111"
  },
  "fonts": {
    "display": "'Cormorant Garamond', serif",
    "body": "'Montserrat', sans-serif",
    "gfUrl": "Cormorant+Garamond:ital,wght@0,300;0,400;..."
  },
  "scenes": [
    { "type": "intro", "companyName": "...", "tagline": "..." },
    { "type": "headline", "eyebrow": "...", "headline": "...", "subheadline": "..." },
    { "type": "benefits", "sectionTitle": "...", "benefits": [...] },
    { "type": "cta", "ctaHeadline": "...", "microcopy": "...", "ctaText": "...", "subCta": "..." }
  ],
  "form": {
    "companyName": "Zenith Coffee Co.",
    "tagline": "Wake up to something better",
    "description": "...",
    "audience": "...",
    "keywords": "...",
    "primaryColor": "#1a0a00",
    "secondaryColor": "#c9a84c",
    "preset": "luxury"
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Operations

| Task             | How to do it                                              |
|------------------|-----------------------------------------------------------|
| **Backup**       | `cp server/data/ads.json ~/Desktop/ads-backup.json`       |
| **Restore**      | `cp ~/Desktop/ads-backup.json server/data/ads.json`       |
| **Migrate**      | Copy `ads.json` to new machine, same relative path        |
| **Reset**        | Delete `ads.json` — recreated as `[]` on next server start|
| **View raw data**| Open `server/data/ads.json` in any text editor            |

---

## 14. Configuration

### Change the backend port

```bash
PORT=4000 npm run dev:server
```

Then update `client/vite.config.js`:
```js
proxy: {
  "/api": {
    target: "http://localhost:4000",
  }
}
```

### Change the data directory

In `server/index.js`, change:
```js
const DATA_DIR = path.join(__dirname, "data");
```
to any path, e.g.:
```js
const DATA_DIR = path.join(require("os").homedir(), ".adforge");
```

### Change ad auto-play duration

In `client/src/components/AdPreview.jsx`:
```js
const speedMs = animSpeed === "slow" ? 5500 : animSpeed === "fast" ? 2300 : 3800;
```
Adjust these millisecond values to your preference.

---

## 15. Customisation Guide

### Add a new visual preset

**1. Server — `server/index.js`** — add to `generateAdContent()`:
```js
// In presetPalettes:
mypreset: { primary: "#...", accent: "#...", neutral: "#..." },

// In headlines, eyebrows, benefitSets, ctaTexts, ctaHeadlines, subCtas:
mypreset: [ ... ]
```

**2. Frontend fonts — `client/src/components/SceneRenderer.jsx`:**
```js
const FONT_URLS = {
  // ...existing
  mypreset: "FontName:wght@400;700|BodyFont:wght@300;400",
};
```

**3. Frontend background geometry — `GeoBg` component:**
```jsx
if (p === "mypreset") return (
  <>
    {/* Your decorative divs/SVGs */}
  </>
);
```

**4. Create page — `client/src/pages/CreatePage.jsx`:**
```js
const PRESETS = [
  // ...existing
  { id: "mypreset", name: "My Preset", icon: "★", desc: "Brief description" },
];
```

---

### Add a new scene type

**1. Server — add to scenes array in `generateAdContent()`:**
```js
scenes: [
  ...existingScenes,
  {
    type: "testimonial",
    quote: "This changed everything.",
    author: "Jane D., CEO"
  }
]
```

**2. SceneRenderer — add renderer:**
```jsx
if (scene.type === "testimonial") return (
  <div style={{ width:"100%", height:"100%", background: neu, ... }}>
    <AB anim="scaleIn" delay={d(200)} dur={d(700)}>
      <blockquote style={{ fontFamily: DF, fontSize: "2rem", color: neuFg }}>
        "{scene.quote}"
      </blockquote>
    </AB>
    <AB anim="fadeIn" delay={d(800)} dur={d(500)}>
      <cite style={{ fontFamily: BF, color: acc }}>— {scene.author}</cite>
    </AB>
  </div>
);
```

**3. SceneEditor — add form fields:**
```jsx
{scene.type === "testimonial" && (
  <>
    <F label="Quote" value={scene.quote} onChange={v => updateField("quote", v)} textarea />
    <F label="Author" value={scene.author} onChange={v => updateField("author", v)} />
  </>
)}
```

---

### Override tone detection

Find the tone inference block in `server/index.js`:
```js
const isLuxury = /luxury|premium|elite|exclusive|high.end|prestige/.test(kws + desc);
```

Add your own pattern. The first match wins (top-to-bottom).

---

## 16. Troubleshooting

### "Server offline" banner appears
The Express backend is not running. Open a terminal:
```bash
cd adforge/server
npm run dev
```

### Port already in use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9    # macOS/Linux
netstat -ano | findstr :3001      # Windows — then: taskkill /PID <PID> /F
```

### Vite uses a different port (5174, 5175...)
This is normal if 5173 is taken. Vite prints the actual URL in the terminal. The API proxy still works regardless of which port Vite picks.

### `npm run install:all` hangs or fails
Try manually:
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### Fonts show as fallback (DM Serif Display)
Google Fonts requires an internet connection. On first load, fonts are fetched from `fonts.googleapis.com` and cached. If you're offline, the fallback stacks defined in the `font-family` properties will be used.

### Ad generation returns a 400 error
Both `companyName` and `description` must be non-empty strings. Check the browser's Network tab for the exact error message.

### Changes not persisting after page refresh
You must click **"💾 Save Changes to Disk"** in the editor panel. Until then, edits exist only in React state and are lost on navigation or refresh.

### `ads.json` not found after first install
This is expected — the file is created when you generate your first ad. Start the server (`npm run dev`), go to Create, submit the form, and `ads.json` will appear.

### On Windows: `concurrently` not found
```bash
npm install -g concurrently
npm run dev
```
Or run the two servers manually in separate terminals.

---

## 17. File-by-File Reference

### `server/index.js` (284 lines)
The entire backend in one file:
- **`ensureDataDir()`** — creates `server/data/` folder + `ads.json` + `presets.json` if they don't exist
- **`readAds()` / `writeAds(ads)`** — synchronous JSON file I/O
- **`defaultPresets()`** — returns array of 6 preset metadata objects
- **`generateAdContent(form)`** — core generation: tone regex → copy pools → palette → fonts → scenes[]
- **9 Express route handlers** — all CRUD operations + stats + health

### `client/src/index.css` (265 lines)
Global design system:
- `:root` CSS variables (colours, spacing, typography, shadows, transitions)
- Normalised input / textarea / button styles
- Utility classes: `.card`, `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-danger`, `.btn-sm`, `.btn-lg`, `.label`, `.tag`, `.glass`, `.skeleton`, `.toast`, `.nav-link`, `.preset-btn`, `.ad-canvas`, `.dot-nav-dot`, `.text-gradient`, `.divider`
- 28 `@keyframe` definitions
- `prefers-reduced-motion` override

### `client/src/components/SceneRenderer.jsx` (402 lines)
The core visual engine:
- **`loadFonts(preset)`** — injects Google Fonts `<link>` tag for current preset on mount via `useEffect`
- **`Particles`** — SVG floating particles (circles for most presets, rectangles for futuristic) using deterministic positioning (no Math.random — avoids React re-render flicker)
- **`GeoBg`** — 6 unique background geometry implementations (one per preset)
- **`AnimWords`** — renders a string word-by-word with staggered `waveIn` animation
- **`AB`** (AnimationBlock) — a styled div that applies a CSS keyframe animation via inline `style.animation`
- **4 scene type renderers** — `intro`, `headline`, `benefits`, `cta`

### `client/src/components/AdPreview.jsx` (149 lines)
The ad player component:
- `goTo(idx)` — transitions with `prevScene` fade-out + `currentScene` fade-in
- Auto-play via `useEffect` + `setTimeout` (cleared on unmount)
- Keyboard event listener (`←` `→` `Space`)
- Progress bar, scene type label, speed indicators in the controls bar

### `client/src/components/SceneEditor.jsx`
Sidebar form editor for the currently displayed scene. Supports all 4 scene types with appropriate fields. Also renders palette colour pickers and speed buttons.

### `client/src/utils/api.js`
Thin async wrapper around `fetch`. All 9 endpoints:
```js
api.getAds()          api.getAd(id)         api.generateAd(form)
api.updateAd(id, d)   api.deleteAd(id)      api.deleteAllAds()
api.getPresets()      api.getStats()        api.health()
```

### `client/src/utils/colors.js`
Pure colour math:
- **`hexToRgb(hex)`** — returns `{r, g, b}`
- **`luminance({r,g,b})`** — WCAG 2.0 relative luminance formula
- **`contrastColor(hex)`** — returns `#0a0a0a` (dark) or `#f8f8f8` (light) based on luminance threshold 0.32 — ensures readable text on any background colour
- **`darken(hex, amt)`** / **`lighten(hex, amt)`** — RGB shift clamped to 0-255
- **`alphaHex(hex, alpha)`** — appends 2-char alpha hex to a colour string

---

*MIT License — free to use, modify, and distribute.*
*Built with React 18, Vite 5, Express 4. Zero AI. Zero cloud. Your data stays on your machine.*
