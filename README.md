# PPT Generator — AI-Powered Presentation Builder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)

> Transform your ideas into professional PowerPoint-style presentations instantly. A full-stack application that automatically generates structured presentations from text input using JavaScript.

---

## Table of Contents

1. [What Is PPT Generator?](#what-is-ppt-generator)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Tech Stack](#tech-stack)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [Running the App](#running-the-app)
8. [How Generation Works](#how-generation-works)
9. [API Reference](#api-reference)
10. [Customisation](#customisation)
11. [Troubleshooting](#troubleshooting)

---

## What Is PPT Generator?

PPT Generator is a full-stack web application that converts simple text input into structured, professional presentations. Instead of manually designing slides, you provide your content — a topic, key points, and desired style — and the app generates a complete presentation with slides, formatting, and visual hierarchy.

**How it works:**
- You enter your presentation topic and content outlines
- The system structures your input into logical slides
- It applies visual styles, typography, and layout rules
- The result is a polished presentation ready to export

---

## Features

### Core Generation
- **Smart content structuring** — automatically organizes input into title, agenda, content, and conclusion slides
- **Rule-based layout engine** — applies consistent slide layouts without external AI
- **Multiple style templates** — choose from predefined visual themes
- **Slide count customization** — generate presentations of varying lengths

### Presentation Editor
- **Live preview** — see your slides update in real-time
- **Inline editing** — modify text, reorder slides, adjust layouts
- **Template switching** — change visual themes without losing content
- **Slide navigation** — keyboard shortcuts and click navigation

### Export Options
- **PDF export** — download as a print-ready PDF document
- **JSON export** — save presentation data for later reuse
- **Print-ready format** — optimized for professional printing

### Slide Templates
- **Title Slide** — eye-catching introduction with title and subtitle
- **Agenda Slide** — structured overview of presentation sections
- **Content Slides** — bullet points, key messages, supporting details
- **Conclusion Slide** — summary and closing remarks

---

## Project Structure

```text
ppt-generator/
├── package.json              ← root scripts: dev, install:all, build, start
├── README.md                 ← this file
│
├── server/                   ← Express backend (Node.js)
│   ├── package.json          ← express, cors, uuid, nodemon
│   ├── index.js              ← API routes + presentation generation logic
│   └── data/                 ← auto-created on first run
│       ├── presentations.json
│       └── templates.json
│
└── client/                   ← React frontend (Vite)
    ├── index.html            ← HTML entry point
    ├── package.json          ← react, react-dom, react-router-dom, vite
    ├── vite.config.js        ← dev server + /api proxy to :3001
    └── src/
        ├── main.jsx          ← ReactDOM.createRoot entry
        ├── App.jsx           ← BrowserRouter + Routes
        ├── index.css         ← design tokens, global styles
        │
        ├── components/
        │   ├── Layout.jsx    ← sidebar navigation + server status
        │   ├── SlidePreview.jsx
        │   ├── SlideEditor.jsx
        │   ├── TemplateSelector.jsx
        │   └── SlideCard.jsx
        │
        ├── pages/
        │   ├── HomePage.jsx  ← landing: hero, features, recent presentations
        │   ├── CreatePage.jsx ← topic/content input + template picker
        │   ├── PresentPage.jsx ← full presentation view + editor
        │   └── LibraryPage.jsx ← list of saved presentations
        │
        └── utils/
            ├── api.js        ← fetch wrapper for backend endpoints
            └── layouts.js    ← slide layout definitions
```

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | React | 18.x |
| Routing | React Router DOM | 6.x |
| Bundler | Vite | 5.x |
| Styling | Pure CSS + CSS Modules | — |
| Backend | Node.js + Express | 4.x |
| Data Storage | Local JSON files | built-in |
| IDs | uuid v4 | 9.x |
| Dev runner | concurrently + nodemon | — |

**Zero database. Zero external AI APIs. Zero cloud dependency.**

---

## Prerequisites

| Tool | Minimum Version | Check |
|------|-----------------|-------|
| Node.js | 18.x or higher | `node --version` |
| npm | 9.x or higher | `npm --version` |

Download Node.js from: **https://nodejs.org**

---

## Installation

### Step 1 — Clone or Extract
```bash
git clone https://github.com/Akarshak51/Ppt-generator.git
cd ppt-generator
```

### Step 2 — Install all dependencies
```bash
npm run install:all
```

This installs packages in three directories:
- `/` root — installs `concurrently`
- `/server` — installs `express`, `cors`, `uuid`, `nodemon`
- `/client` — installs `react`, `react-dom`, `react-router-dom`, `vite`

**Manual alternative:**
```bash
npm install && cd server && npm install && cd ../client && npm install && cd ..
```

---

## Running the App

### Development (one command)
```bash
npm run dev
```

This starts both servers simultaneously:

| Service | URL | Notes |
|---------|-----|-------|
| Frontend (Vite) | http://localhost:5173 | Open this in your browser |
| Backend (Express) | http://localhost:3001 | REST API |

### Manual (two terminals)
**Terminal 1 — Backend:**
```bash
cd server && npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client && npm run dev
```

### Production Build
```bash
npm run build   # Build React app
npm start       # Run Express server with static files
```

---

## How Generation Works

All logic is in `server/index.js` inside `generatePresentation(input)`.

### Step 1 — Content Analysis
The function parses your input text and identifies:
- **Title keywords** — first line or explicitly marked title
- **Section headers** — numbered items or capitalized lines
- **Key points** — bullet items or short phrases
- **Conclusion markers** — summary phrases or closing statements

### Step 2 — Slide Structuring
Based on content analysis:
```javascript
// Example slide generation
slides.push({ type: "title", title: parsed.title, subtitle: parsed.subtitle });
slides.push({ type: "agenda", items: parsed.sections });
sections.forEach(s => slides.push({ type: "content", title: s.header, points: s.items }));
slides.push({ type: "conclusion", summary: parsed.conclusion });
```

### Step 3 — Template Application
Each slide type gets a layout template:
- **Title** — Large centered heading, subtle background
- **Agenda** — Numbered list with progress indicators
- **Content** — Heading + bullet points + visual accent
- **Conclusion** — Full-width summary with call-to-action

### Step 4 — Style Theming
Colors, fonts, and spacing are derived from the selected template:
| Template | Font Pairing | Color Scheme |
|----------|-------------|---------------|
| Professional | Inter + Georgia | Navy + White |
| Creative | Poppins + Lora | Teal + Coral |
| Minimal | DM Sans | Gray + Black |
| Bold | Montserrat | Black + Accent |

---

## API Reference

All endpoints are prefixed with `/api` at `http://localhost:3001`.

### `GET /api/presentations`
Returns a list of all saved presentations.

### `GET /api/presentations/:id`
Returns a full presentation by ID.

### `POST /api/presentations/generate`
Generates a new presentation from input.

**Body:**
```json
{
  "topic": "Introduction to AI",
  "content": "- What is AI\n- History of AI\n- Current applications\n- Future trends",
  "template": "professional"
}
```

### `PUT /api/presentations/:id`
Updates an existing presentation.

### `DELETE /api/presentations/:id`
Deletes a presentation.

### `GET /api/templates`
Returns available presentation templates.

### `GET /api/health`
Health check endpoint.

---

## Customisation

### Add a New Template

**1. Server — `server/index.js`:**
```javascript
const templateStyles = {
  myTemplate: {
    colors: { primary: "#...", accent: "#..." },
    fonts: { display: "FontName", body: "BodyFont" }
  }
};
```

**2. Frontend — `client/src/components/TemplateSelector.jsx`:**
```javascript
const templates = [
  { id: "myTemplate", name: "My Template", icon: "★" }
];
```

### Change Default Settings
Edit `server/index.js` to modify default template, slide counts, or layout rules.

---

## Troubleshooting

### "Server offline" banner
The Express backend is not running:
```bash
cd server && npm run dev
```

### Port already in use
```bash
# macOS/Linux
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Fonts showing as fallback
Google Fonts requires internet. Fonts are cached after first load.

### Changes not persisting
Click **"💾 Save"** in the editor panel. Edits in React state are lost on refresh.

---

**Built with React 18, Vite 5, and Express 4.**
**No AI. No cloud. Your presentations stay on your machine.**
