import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import AdCard from "../components/AdCard";

const FEATURES = [
  { icon:"✦", title:"Rule-Based Generation",  desc:"Tone is inferred from your brand keywords — luxury, tech, eco, and more. No templates." },
  { icon:"◈", title:"6 Unique Visual Presets", desc:"Minimal, Bold, Futuristic, Playful, Corporate, Luxury — each with its own typography, motion, and palette." },
  { icon:"◉", title:"4-Scene Ad Structure",    desc:"Intro → Headline → Benefits → CTA — all uniquely animated, fully editable after generation." },
  { icon:"▦", title:"Fully Local Storage",     desc:"All ad data stored as a plain JSON file on your machine. No cloud, no accounts, no subscriptions." },
];

const PRESET_SAMPLES = [
  { id:"minimal",    name:"Minimal",    bg:"#f5f5f5", acc:"#111111" },
  { id:"bold",       name:"Bold",       bg:"#0a0a0a", acc:"#e63946" },
  { id:"futuristic", name:"Futuristic", bg:"#060d1f", acc:"#00ffe7" },
  { id:"playful",    name:"Playful",    bg:"#fffbeb", acc:"#f97316" },
  { id:"corporate",  name:"Corporate",  bg:"#0f2644", acc:"#2563eb" },
  { id:"luxury",     name:"Luxury",     bg:"#0d0d0d", acc:"#c9a84c" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [recentAds, setRecentAds] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAds().then(d => setRecentAds(d.ads.slice(0, 4))),
      api.getStats().then(d => setStats(d.stats)),
    ]).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    await api.deleteAd(id);
    setRecentAds(a => a.filter(x => x.id !== id));
    setStats(s => s ? { ...s, total: s.total - 1 } : s);
  };

  return (
    <div className="animate-up">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ textAlign:"center", padding:"16px 0 64px", position:"relative" }}>
        {/* Ambient glow orbs behind hero */}
        <div style={{ position:"absolute", top:"10%", left:"20%", width:340, height:340, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents:"none", animation:"floatY 8s ease-in-out infinite" }} />
        <div style={{ position:"absolute", top:"0%", right:"15%", width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)", pointerEvents:"none", animation:"floatY 10s ease-in-out 2s infinite reverse" }} />

        <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:20, background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.28)", marginBottom:28, position:"relative" }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:"#6366f1", display:"inline-block", animation:"glowBreath 2s ease-in-out infinite" }} />
          <span style={{ fontSize:"0.72rem", color:"#a5b4fc", letterSpacing:"0.14em", textTransform:"uppercase", fontWeight:700 }}>Full-Stack · Rule-Based · Local Data</span>
        </div>

        <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.6rem,5.5vw,4.4rem)", fontWeight:400, margin:"0 0 22px", lineHeight:1.06, position:"relative" }}>
          <span className="text-gradient">Generate cinematic ads</span>
          <br />
          <span style={{ color:"rgba(255,255,255,0.35)", fontStyle:"italic" }}>for any brand</span>
        </h1>

        <p style={{ color:"var(--muted)", fontSize:"1.05rem", maxWidth:500, margin:"0 auto 40px", lineHeight:1.72 }}>
          Enter your company details, pick a style — get a full-screen animated advertisement with unique copy, palette, and 4 animated scenes. Everything saved locally on your machine.
        </p>

        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/create")}>
            ✦ Create New Ad
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate("/library")}>
            ▦ View Library
          </button>
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      {stats && !loading && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:52 }}>
          {[
            { label:"Total Ads Saved", value: stats.total || 0, icon:"◉", color:"#a5b4fc" },
            { label:"Top Preset Used", value: Object.entries(stats.presetCounts||{}).sort((a,b)=>b[1]-a[1])[0]?.[0] || "—", icon:"✦", color:"#c084fc" },
            { label:"Storage Type",    value:"Local JSON", icon:"▦", color:"#4ade80" },
          ].map((s,i) => (
            <div key={s.label} className="card" style={{ padding:"22px 26px", textAlign:"center", animation:`countUp 0.5s ease ${i*80}ms both` }}>
              <div style={{ fontSize:"1.4rem", marginBottom:6, color:s.color, animation:`floatY ${4+i}s ease-in-out ${i*0.5}s infinite` }}>{s.icon}</div>
              <div style={{ fontFamily:"var(--font-display)", fontSize:"1.8rem", fontWeight:400, marginBottom:6, color:s.color, letterSpacing:"-0.01em" }}>{s.value}</div>
              <div className="label" style={{ marginBottom:0, fontSize:"0.66rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Preset showcase ───────────────────────────────────────────────── */}
      <div style={{ marginBottom:56 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"1.7rem", fontWeight:400 }}>6 Visual Presets</h2>
          <div style={{ flex:1, height:1, background:"linear-gradient(90deg, var(--border), transparent)" }} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10 }}>
          {PRESET_SAMPLES.map((p,i) => (
            <div key={p.id} onClick={() => navigate("/create")}
              style={{ cursor:"pointer", borderRadius:12, overflow:"hidden", border:"1px solid rgba(255,255,255,0.08)", transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)", animation:`slideUp 0.5s ease ${i*60}ms both` }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px) scale(1.03)"; e.currentTarget.style.boxShadow=`0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px ${p.acc}44`; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0) scale(1)"; e.currentTarget.style.boxShadow="none"; }}
            >
              <div style={{ aspectRatio:"3/4", background:p.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, position:"relative", overflow:"hidden" }}>
                {/* Animated accent line */}
                <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:2, background:p.acc, opacity:0.8 }} />
                {/* Mini preview elements */}
                <div style={{ width:"60%", height:3, background:p.acc, borderRadius:2, opacity:0.9 }} />
                <div style={{ width:"80%", height:6, background:`${p.acc}22`, borderRadius:2, border:`1px solid ${p.acc}44` }} />
                <div style={{ width:"50%", height:6, background:`${p.acc}22`, borderRadius:2, border:`1px solid ${p.acc}44` }} />
                <div style={{ marginTop:4, padding:"4px 10px", background:p.acc, borderRadius:4 }}>
                  <div style={{ width:20, height:3, background: p.bg === "#f5f5f5" || p.bg === "#fffbeb" ? "#111" : "#fff", borderRadius:1 }} />
                </div>
              </div>
              <div style={{ padding:"8px 10px", background:"rgba(255,255,255,0.025)" }}>
                <div style={{ fontSize:"0.75rem", fontWeight:700, color:"rgba(255,255,255,0.7)", textTransform:"capitalize" }}>{p.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <div style={{ marginBottom:56 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"1.7rem", fontWeight:400 }}>How it works</h2>
          <div style={{ flex:1, height:1, background:"linear-gradient(90deg, var(--border), transparent)" }} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {[
            { n:"01", title:"Enter Brand Details", desc:"Name, tagline, description, target audience, keywords, and brand colors.", accent:"#6366f1" },
            { n:"02", title:"Pick a Style Preset",  desc:"6 presets — each has its own typography, palette, background geometry, and animation choreography.", accent:"#a855f7" },
            { n:"03", title:"Instant Local Ad",     desc:"The server infers your brand's tone and generates unique copy + 4 animated scenes, saved to ads.json.", accent:"#4ade80" },
          ].map((s,i) => (
            <div key={s.n} className="card" style={{ padding:"24px 26px", animation:`slideUp 0.5s ease ${i*100}ms both`, position:"relative", overflow:"hidden" }}>
              {/* Number background watermark */}
              <div style={{ position:"absolute", top:-10, right:10, fontFamily:"var(--font-display)", fontSize:"5rem", color:`${s.accent}0a`, fontWeight:900, lineHeight:1, pointerEvents:"none", userSelect:"none" }}>{s.n}</div>
              <div style={{ width:28, height:28, borderRadius:8, background:`${s.accent}18`, border:`1px solid ${s.accent}33`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, fontSize:"0.85rem", color:s.accent, fontWeight:700 }}>{s.n}</div>
              <div style={{ fontWeight:700, fontSize:"0.95rem", marginBottom:9, color:"rgba(255,255,255,0.88)" }}>{s.title}</div>
              <div style={{ color:"var(--muted)", fontSize:"0.85rem", lineHeight:1.68 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom:56 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"1.7rem", fontWeight:400 }}>Features</h2>
          <div style={{ flex:1, height:1, background:"linear-gradient(90deg, var(--border), transparent)" }} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
          {FEATURES.map((f,i) => (
            <div key={f.title} className="card" style={{ padding:"20px 22px", display:"flex", gap:16, alignItems:"flex-start", animation:`slideUp 0.5s ease ${i*80}ms both` }}>
              <div style={{ width:38, height:38, borderRadius:10, background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.05rem", color:"#a5b4fc", flexShrink:0, transition:"transform 0.2s ease" }}
                onMouseEnter={e => e.currentTarget.style.transform="scale(1.15) rotate(5deg)"}
                onMouseLeave={e => e.currentTarget.style.transform="scale(1) rotate(0deg)"}
              >{f.icon}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:"0.9rem", marginBottom:5 }}>{f.title}</div>
                <div style={{ color:"var(--muted)", fontSize:"0.83rem", lineHeight:1.62 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Ads ────────────────────────────────────────────────────── */}
      {!loading && recentAds.length > 0 && (
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
            <h2 style={{ fontSize:"1.6rem" }}>Recent Ads</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/library")}>View all →</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:18 }}>
            {recentAds.map((ad,i) => (
              <div key={ad.id} style={{ animation:`slideUp 0.5s ease ${i*80}ms both` }}>
                <AdCard ad={ad} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && recentAds.length === 0 && (
        <div style={{ textAlign:"center", padding:"48px 0", border:"1px dashed rgba(255,255,255,0.08)", borderRadius:18 }}>
          <div style={{ fontSize:"2.5rem", marginBottom:14, opacity:0.3 }}>✦</div>
          <p style={{ color:"var(--muted)", marginBottom:20 }}>No ads yet. Create your first one!</p>
          <button className="btn btn-primary" onClick={() => navigate("/create")}>Create First Ad</button>
        </div>
      )}
    </div>
  );
}
