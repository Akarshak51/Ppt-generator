/**
 * AdForge — Express Server
 * Stores all ad data as JSON files on your local machine.
 * Data directory: ./data/  (created automatically)
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Data directory ──────────────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, "data");
const ADS_FILE = path.join(DATA_DIR, "ads.json");
const PRESETS_FILE = path.join(DATA_DIR, "presets.json");

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(ADS_FILE)) fs.writeFileSync(ADS_FILE, JSON.stringify([], null, 2));
  if (!fs.existsSync(PRESETS_FILE)) fs.writeFileSync(PRESETS_FILE, JSON.stringify(defaultPresets(), null, 2));
};

const readAds = () => {
  ensureDataDir();
  try { return JSON.parse(fs.readFileSync(ADS_FILE, "utf-8")); }
  catch { return []; }
};

const writeAds = (ads) => {
  ensureDataDir();
  fs.writeFileSync(ADS_FILE, JSON.stringify(ads, null, 2));
};

// ── Default style presets ────────────────────────────────────────────────────
function defaultPresets() {
  return [
    { id: "minimal",    name: "Minimal",    icon: "○", desc: "Clean, white space, subtle",          primaryColor: "#f5f5f5", accentColor: "#111111", fontPreset: "dm-serif" },
    { id: "bold",       name: "Bold",       icon: "◼", desc: "High contrast, strong type",          primaryColor: "#0f0f0f", accentColor: "#ff3b3b", fontPreset: "bebas"    },
    { id: "futuristic", name: "Futuristic", icon: "◈", desc: "Tech, glows, sharp lines",            primaryColor: "#060d1f", accentColor: "#00ffe7", fontPreset: "orbitron" },
    { id: "playful",    name: "Playful",    icon: "✦", desc: "Bright, bouncy, fun",                 primaryColor: "#fff7ed", accentColor: "#f97316", fontPreset: "righteous"},
    { id: "corporate",  name: "Corporate",  icon: "▣", desc: "Professional, trustworthy",           primaryColor: "#0f2644", accentColor: "#2563eb", fontPreset: "playfair" },
    { id: "luxury",     name: "Luxury",     icon: "◇", desc: "Elegant, gold accents, refined",      primaryColor: "#0d0d0d", accentColor: "#c9a84c", fontPreset: "cormorant"},
  ];
}

// ── Ad generation logic (rule-based, no AI) ──────────────────────────────────
function generateAdContent(form) {
  const { companyName, tagline, description, audience, keywords, primaryColor, secondaryColor, preset } = form;

  // ── Infer tone from keywords ─────────────────────────────────────────────
  const kws = (keywords || "").toLowerCase();
  const desc = (description || "").toLowerCase();

  const isLuxury    = /luxury|premium|elite|exclusive|high.end|prestige/.test(kws + desc);
  const isEco       = /eco|green|sustain|nature|organic|environ/.test(kws + desc);
  const isTech      = /tech|ai|digital|software|data|cloud|cyber|auto/.test(kws + desc);
  const isHealth    = /health|wellness|fit|medical|care|nourish|nutrition/.test(kws + desc);
  const isPlayful   = /fun|play|kids|game|creative|colour|color|vibrant/.test(kws + desc);
  const isFinance   = /finance|invest|bank|money|wealth|capital|fund/.test(kws + desc);
  const isFashion   = /fashion|style|wear|cloth|apparel|trend|boutique/.test(kws + desc);

  // ── Palette derivation ───────────────────────────────────────────────────
  const presetPalettes = {
    minimal:    { primary: primaryColor || "#f8f8f8", accent: secondaryColor || "#111111", neutral: "#ffffff" },
    bold:       { primary: primaryColor || "#0a0a0a", accent: secondaryColor || "#e63946", neutral: "#111111" },
    futuristic: { primary: primaryColor || "#060d1f", accent: secondaryColor || "#00ffe7", neutral: "#08101e" },
    playful:    { primary: primaryColor || "#fffbeb", accent: secondaryColor || "#f97316", neutral: "#fff7ed" },
    corporate:  { primary: primaryColor || "#0f2644", accent: secondaryColor || "#2563eb", neutral: "#f0f4fa" },
    luxury:     { primary: primaryColor || "#0d0d0d", accent: secondaryColor || "#c9a84c", neutral: "#111111" },
  };

  const palette = presetPalettes[preset] || presetPalettes.bold;
  if (primaryColor)  palette.primary = primaryColor;
  if (secondaryColor) palette.accent  = secondaryColor;

  // ── Copy generation ──────────────────────────────────────────────────────
  const headlines = {
    luxury:    [`Redefine What ${companyName} Means to You`, `The Pinnacle of Excellence`, `Where Craft Meets ${companyName}`],
    eco:       [`A Greener Future Starts Here`, `${companyName} — Built for the Planet`, `Sustainable Choices, Real Impact`],
    tech:      [`The Future Runs on ${companyName}`, `Smarter Solutions, Faster Results`, `Engineered for Tomorrow`],
    health:    [`Your Wellness Journey Begins`, `Live Better with ${companyName}`, `Feel the Difference Every Day`],
    playful:   [`Life's More Fun with ${companyName}`, `Ready, Set, ${companyName}!`, `Where Every Day is an Adventure`],
    finance:   [`Grow Your Wealth with Confidence`, `Smart Money Moves with ${companyName}`, `Your Financial Future, Secured`],
    fashion:   [`Style is a Statement`, `Wear What You Stand For`, `${companyName} — Dress the Part`],
    default:   [`${companyName} — Built Different`, `The Better Choice is Clear`, `Transform the Way You Think`],
  };

  const tone = isLuxury ? "luxury" : isEco ? "eco" : isTech ? "tech" : isHealth ? "health" : isPlayful ? "playful" : isFinance ? "finance" : isFashion ? "fashion" : "default";
  const headlinePool = headlines[tone];
  const headline = headlinePool[Math.floor(Math.random() * headlinePool.length)];

  const subheadlines = [
    `${description.split(".")[0].trim()}.`,
    `Trusted by ${audience || "thousands of customers"} who demand more.`,
    `We believe in ${(keywords || "quality, innovation, and results").split(",")[0].trim()}.`,
  ];
  const subheadline = subheadlines[0].length > 20 ? subheadlines[0] : subheadlines[1];

  const eyebrows = {
    luxury:    "Premium Experience",
    eco:       "Sustainable by Design",
    tech:      "Next-Gen Technology",
    health:    "Wellness Redefined",
    playful:   "Pure Joy Awaits",
    finance:   "Smart Investments",
    fashion:   "Define Your Style",
    default:   "Introducing",
  };

  const benefitSets = {
    luxury:    [{ icon: "✦", title: "Unmatched Quality",    desc: "Crafted with the finest materials and obsessive attention to detail." }, { icon: "◇", title: "Exclusive Access",     desc: "Members enjoy personalized service and priority experiences." }, { icon: "◈", title: "Timeless Design",      desc: "Aesthetics that endure beyond trends and seasons." }],
    eco:       [{ icon: "🌿", title: "100% Sustainable",     desc: "Every product is designed with the planet in mind, from source to shelf." }, { icon: "♻", title: "Zero Waste Pledge",   desc: "We're committed to eliminating waste across our entire supply chain." }, { icon: "🌍", title: "Carbon Neutral",       desc: "Certified carbon-neutral operations and verified offset programs." }],
    tech:      [{ icon: "⚡", title: "Lightning Fast",       desc: "Performance-optimized infrastructure delivering sub-100ms responses." }, { icon: "🔒", title: "Enterprise Security", desc: "Bank-grade encryption and compliance with global data standards." }, { icon: "📊", title: "Real-Time Analytics",  desc: "Actionable insights delivered instantly to your dashboard." }],
    health:    [{ icon: "💪", title: "Clinically Proven",    desc: "Backed by research and validated by healthcare professionals worldwide." }, { icon: "🍃", title: "All Natural",          desc: "No harmful additives, preservatives, or synthetic ingredients." }, { icon: "❤️", title: "Community Support",    desc: "Join thousands on the same journey with guided programs." }],
    playful:   [{ icon: "🎉", title: "Endless Fun",          desc: "Designed to spark joy and creativity at every turn." }, { icon: "🎨", title: "Fully Customizable",   desc: "Make it yours — pick colors, styles, and make it personal." }, { icon: "🚀", title: "Instant to Start",     desc: "Zero learning curve — dive in and start having fun immediately." }],
    finance:   [{ icon: "📈", title: "Consistent Returns",   desc: "Data-driven strategies built for long-term portfolio growth." }, { icon: "🛡️", title: "Risk Protected",      desc: "Advanced algorithms identify and mitigate exposure automatically." }, { icon: "💼", title: "Expert Guidance",      desc: "Dedicated advisors available around the clock for your needs." }],
    fashion:   [{ icon: "✂️", title: "Artisan Crafted",      desc: "Every piece is made with care by skilled artisans using premium fabrics." }, { icon: "🌟", title: "Trend Forward",        desc: "Curated collections that sit at the intersection of art and fashion." }, { icon: "📦", title: "Free Global Shipping",  desc: "Delivered to your door, anywhere in the world, at no extra cost." }],
    default:   [{ icon: "⚡", title: "Fast Results",          desc: "See measurable improvements from day one with our proven approach." }, { icon: "🎯", title: "Precision Focused",    desc: "Every feature is purpose-built to solve your specific challenges." }, { icon: "🤝", title: "Always Supported",     desc: "A dedicated team ready to help you succeed at every step." }],
  };

  const benefits = benefitSets[tone];

  const ctaHeadlines = {
    luxury:    `Your Exclusive Access Awaits`,
    eco:       `Join the Movement Today`,
    tech:      `Start Building the Future`,
    health:    `Begin Your Transformation`,
    playful:   `Jump In — It's Time to Play!`,
    finance:   `Unlock Your Financial Potential`,
    fashion:   `Discover Your Signature Look`,
    default:   `Ready to Get Started?`,
  };

  const ctaTexts = {
    luxury:    "Request Access",
    eco:       "Shop Sustainably",
    tech:      "Start Free Trial",
    health:    "Begin Today",
    playful:   "Let's Go!",
    finance:   "Invest Now",
    fashion:   "Shop the Look",
    default:   "Get Started",
  };

  const subCtas = {
    luxury:    "By invitation only · Limited availability",
    eco:       "Free shipping on orders over $50",
    tech:      "No credit card required · 14-day free trial",
    health:    "Cancel anytime · 30-day money back",
    playful:   "No signup needed · 100% free to try",
    finance:   "FDIC insured · Regulated & transparent",
    fashion:   "Free returns · Ships in 24h",
    default:   "No commitment required · Start instantly",
  };

  const microcopy = [
    `${companyName} is trusted by ${audience || "professionals and consumers"} worldwide.`,
    `Join the community that's already transforming how they ${isTech ? "work" : isHealth ? "live" : isEco ? "shop" : "achieve their goals"}.`,
  ];

  // ── Font mapping ─────────────────────────────────────────────────────────
  const fontMap = {
    minimal:    { display: "'DM Serif Display', serif",  body: "'DM Sans', sans-serif",      gfUrl: "DM+Serif+Display|DM+Sans:wght@300;400;500" },
    bold:       { display: "'Bebas Neue', cursive",      body: "'Barlow', sans-serif",        gfUrl: "Bebas+Neue|Barlow:wght@400;600;700" },
    futuristic: { display: "'Orbitron', sans-serif",     body: "'Exo+2', sans-serif",         gfUrl: "Orbitron:wght@400;700;900|Exo+2:wght@300;400;600" },
    playful:    { display: "'Righteous', cursive",       body: "'Nunito', sans-serif",        gfUrl: "Righteous|Nunito:wght@400;600;800" },
    corporate:  { display: "'Playfair Display', serif",  body: "'Source Sans 3', sans-serif", gfUrl: "Playfair+Display:wght@600;700|Source+Sans+3:wght@400;600" },
    luxury:     { display: "'Cormorant Garamond', serif",body: "'Montserrat', sans-serif",    gfUrl: "Cormorant+Garamond:wght@300;400;600|Montserrat:wght@300;400;500" },
  };

  return {
    preset,
    palette,
    fonts: fontMap[preset] || fontMap.bold,
    scenes: [
      { type: "intro",    companyName, tagline: tagline || `${headline.split(" ").slice(0, 5).join(" ")}…` },
      { type: "headline", eyebrow: eyebrows[tone], headline, subheadline },
      { type: "benefits", sectionTitle: "Why Choose Us", benefits },
      { type: "cta",      ctaHeadline: ctaHeadlines[tone], microcopy: microcopy[0], ctaText: ctaTexts[tone], subCta: subCtas[tone] },
    ],
  };
}

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"] }));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────

// GET /api/ads — list all ads (summary)
app.get("/api/ads", (req, res) => {
  const ads = readAds();
  const summary = ads.map(({ id, companyName, preset, createdAt, updatedAt, palette }) => ({ id, companyName, preset, createdAt, updatedAt, palette }));
  res.json({ success: true, count: ads.length, ads: summary });
});

// GET /api/ads/:id — get single ad
app.get("/api/ads/:id", (req, res) => {
  const ads = readAds();
  const ad = ads.find((a) => a.id === req.params.id);
  if (!ad) return res.status(404).json({ success: false, error: "Ad not found" });
  res.json({ success: true, ad });
});

// POST /api/ads/generate — generate new ad from form data
app.post("/api/ads/generate", (req, res) => {
  const form = req.body;
  if (!form.companyName || !form.description) {
    return res.status(400).json({ success: false, error: "companyName and description are required" });
  }

  const generated = generateAdContent(form);
  const ad = {
    id: uuidv4(),
    companyName: form.companyName,
    form,
    ...generated,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const ads = readAds();
  ads.unshift(ad);
  writeAds(ads);

  res.status(201).json({ success: true, ad });
});

// PUT /api/ads/:id — update ad (scenes, palette, etc.)
app.put("/api/ads/:id", (req, res) => {
  const ads = readAds();
  const idx = ads.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: "Ad not found" });
  ads[idx] = { ...ads[idx], ...req.body, id: ads[idx].id, updatedAt: new Date().toISOString() };
  writeAds(ads);
  res.json({ success: true, ad: ads[idx] });
});

// DELETE /api/ads/:id — delete ad
app.delete("/api/ads/:id", (req, res) => {
  const ads = readAds();
  const filtered = ads.filter((a) => a.id !== req.params.id);
  if (filtered.length === ads.length) return res.status(404).json({ success: false, error: "Ad not found" });
  writeAds(filtered);
  res.json({ success: true, message: "Ad deleted" });
});

// DELETE /api/ads — delete all ads
app.delete("/api/ads", (req, res) => {
  writeAds([]);
  res.json({ success: true, message: "All ads deleted" });
});

// GET /api/presets — get style presets
app.get("/api/presets", (req, res) => {
  ensureDataDir();
  const presets = JSON.parse(fs.readFileSync(PRESETS_FILE, "utf-8"));
  res.json({ success: true, presets });
});

// GET /api/stats — quick stats
app.get("/api/stats", (req, res) => {
  const ads = readAds();
  const presetCounts = {};
  ads.forEach((a) => { presetCounts[a.preset] = (presetCounts[a.preset] || 0) + 1; });
  res.json({ success: true, stats: { total: ads.length, presetCounts, dataFile: ADS_FILE } });
});

// GET /api/health
app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok", dataDir: DATA_DIR, adsFile: ADS_FILE });
});

// ── Start ────────────────────────────────────────────────────────────────────
ensureDataDir();
app.listen(PORT, () => {
  console.log(`\n  🚀 AdForge Server running at http://localhost:${PORT}`);
  console.log(`  📁 Data stored at: ${DATA_DIR}`);
  console.log(`  📄 Ads file: ${ADS_FILE}\n`);
});
