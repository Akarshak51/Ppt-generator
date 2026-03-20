import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const PRESET_META = {
  minimal:    { color:"#e2e8f0", icon:"○" },
  bold:       { color:"#ef4444", icon:"◼" },
  futuristic: { color:"#00ffe7", icon:"◈" },
  playful:    { color:"#f97316", icon:"✦" },
  corporate:  { color:"#2563eb", icon:"▣" },
  luxury:     { color:"#c9a84c", icon:"◇" },
};

export default function StatsPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [ads, setAds] = useState([]);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getStats().then(d => setStats(d.stats)),
      api.health().then(d => setHealth(d)),
      api.getAds().then(d => setAds(d.ads)),
    ]);
    setTimeout(() => setAnimated(true), 300);
  }, []);

  const presetCounts = stats?.presetCounts || {};
  const maxCount = Math.max(...Object.values(presetCounts), 1);
  const total = stats?.total || 0;

  return (
    <div className="animate-up">
      <div style={{ marginBottom:36 }}>
        <h1 style={{ fontSize:"2.2rem", marginBottom:8 }}>Stats & Storage</h1>
        <p style={{ color:"var(--muted)", fontSize:"0.9rem" }}>
          All data is stored in plain JSON files on your machine — no cloud, no accounts.
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:36 }}>
        {[
          { label:"Total Ads", value: total, icon:"◉", color:"#a5b4fc", sub: total === 0 ? "Get started!" : total === 1 ? "1 ad created" : `${total} ads created` },
          { label:"Server Status", value: health ? "Online" : health===null?"…":"Offline", icon:"●", color: health ? "#4ade80" : health===null?"#888":"#f87171", sub:`localhost:3001` },
          { label:"Data Format", value:"JSON", icon:"▦", color:"#4ade80", sub:"Human-readable text file" },
        ].map((s,i) => (
          <div key={s.label} className="card" style={{ textAlign:"center", animation:`countUp 0.5s ease ${i*80}ms both` }}>
            <div style={{ fontSize:"1.6rem", marginBottom:8, color:s.color }}>{s.icon}</div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:"2.2rem", fontWeight:400, color:s.color, marginBottom:4 }}>{s.value}</div>
            <div style={{ fontWeight:700, fontSize:"0.85rem", marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:"0.74rem", color:"var(--muted)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>

        {/* Preset bar chart */}
        <div className="card">
          <div style={{ fontWeight:700, fontSize:"0.9rem", marginBottom:24, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"1rem" }}>◈</span> Ads by Preset
          </div>
          {Object.entries(PRESET_META).map(([p, meta]) => {
            const count = presetCounts[p] || 0;
            const pct = animated ? (count / maxCount) * 100 : 0;
            const fillPct = animated ? (count / Math.max(total, 1)) * 100 : 0;
            return (
              <div key={p} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <span style={{ fontSize:"0.83rem", color:"rgba(255,255,255,0.65)", fontWeight:500, display:"flex", alignItems:"center", gap:7 }}>
                    <span style={{ color:meta.color }}>{meta.icon}</span>
                    <span style={{ textTransform:"capitalize" }}>{p}</span>
                  </span>
                  <span style={{ fontSize:"0.78rem", fontFamily:"monospace", color:"var(--muted)" }}>{count}</span>
                </div>
                <div style={{ height:7, borderRadius:4, background:"rgba(255,255,255,0.05)", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg, ${meta.color}cc, ${meta.color})`, borderRadius:4, transition:"width 1s cubic-bezier(0.22,1,0.36,1)" }} />
                </div>
              </div>
            );
          })}
          {total === 0 && <p style={{ color:"var(--muted)", fontSize:"0.85rem", textAlign:"center", padding:"16px 0" }}>No ads created yet</p>}
        </div>

        {/* Recent activity */}
        <div className="card">
          <div style={{ fontWeight:700, fontSize:"0.9rem", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"1rem" }}>◉</span> Recent Ads
            </div>
            {ads.length > 0 && <button className="btn btn-ghost btn-sm" onClick={() => navigate("/library")}>View all</button>}
          </div>
          {ads.slice(0,6).length === 0 && (
            <div style={{ textAlign:"center", padding:"24px 0" }}>
              <p style={{ color:"var(--muted)", marginBottom:16 }}>No ads yet</p>
              <button className="btn btn-primary btn-sm" onClick={() => navigate("/create")}>Create first ad</button>
            </div>
          )}
          {ads.slice(0,6).map((ad,i) => (
            <div key={ad.id} onClick={() => navigate(`/ads/${ad.id}`)}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:10, marginBottom:6, cursor:"pointer", transition:"background 0.18s", animation:`slideInLeft 0.4s ease ${i*60}ms both` }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}
            >
              <div style={{ width:32, height:32, borderRadius:8, background: ad.palette?.primary || "#333", border:`2px solid ${ad.palette?.accent || "#666"}`, flexShrink:0, boxShadow:`0 0 12px ${ad.palette?.accent || "#666"}44` }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:"0.86rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ad.companyName}</div>
                <div style={{ fontSize:"0.71rem", color:"var(--muted)", marginTop:2, display:"flex", gap:8 }}>
                  <span style={{ textTransform:"capitalize" }}>{ad.preset}</span>
                  <span>·</span>
                  <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <span style={{ color:"var(--muted2)", fontSize:"0.8rem" }}>→</span>
            </div>
          ))}
        </div>

        {/* Storage info */}
        <div className="card" style={{ gridColumn:"1 / -1" }}>
          <div style={{ fontWeight:700, fontSize:"0.9rem", marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:"rgba(255,255,255,0.5)" }}>▦</span> Local Storage Details
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {[
              { label:"Ads file",     value: health?.adsFile || "server/data/ads.json",   color:"#7af5a0" },
              { label:"Data folder",  value: health?.dataDir || "server/data/",           color:"#7af5a0" },
              { label:"Format",       value: "JSON (UTF-8)",                               color:"#93c5fd" },
              { label:"Backup",       value: "Copy server/data/ folder",                  color:"#fbbf24" },
              { label:"Reset",        value: "Delete ads.json to start fresh",            color:"#fbbf24" },
              { label:"Migrate",      value: "Copy ads.json to new machine",              color:"#fbbf24" },
            ].map(r => (
              <div key={r.label} style={{ padding:"12px 14px", background:"rgba(255,255,255,0.025)", borderRadius:9, border:"1px solid rgba(255,255,255,0.06)" }}>
                <div className="label" style={{ marginBottom:5, fontSize:"0.64rem" }}>{r.label}</div>
                <div style={{ fontFamily:"'SF Mono','Fira Code',monospace", fontSize:"0.78rem", color:r.color, wordBreak:"break-all", lineHeight:1.4 }}>{r.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
