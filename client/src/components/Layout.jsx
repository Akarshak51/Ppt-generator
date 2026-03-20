import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../utils/api";

const NAV = [
  { to: "/",        icon: "⌂", label: "Home",      badge: null },
  { to: "/create",  icon: "✦", label: "Create Ad",  badge: "new" },
  { to: "/library", icon: "▦", label: "Library",    badge: null },
  { to: "/stats",   icon: "◉", label: "Stats",      badge: null },
];

export default function Layout({ children }) {
  const [serverOk, setServerOk] = useState(null);
  const [adCount, setAdCount] = useState(null);

  useEffect(() => {
    api.health().then(() => setServerOk(true)).catch(() => setServerOk(false));
    api.getStats().then(d => setAdCount(d.stats.total)).catch(() => {});
  }, []);

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside style={{
        width: 228,
        flexShrink: 0,
        background: "rgba(255,255,255,0.016)",
        borderRight: "1px solid rgba(255,255,255,0.055)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        zIndex: 50,
      }}>
        {/* Logo area */}
        <div style={{ padding:"26px 22px 22px", borderBottom:"1px solid rgba(255,255,255,0.055)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:11 }}>
            {/* Animated logo mark */}
            <div style={{ position:"relative", width:36, height:36, flexShrink:0 }}>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#6366f1,#a855f7)", borderRadius:10, animation:"glowBreath 4s ease-in-out infinite" }} />
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", zIndex:1 }}>✦</div>
              <div style={{ position:"absolute", inset:-3, borderRadius:13, border:"1px solid rgba(99,102,241,0.35)", animation:"ringExpand 3s ease-out 1s infinite" }} />
            </div>
            <div>
              <div style={{ fontFamily:"var(--font-display)", fontWeight:400, fontSize:"1.15rem", lineHeight:1, letterSpacing:"-0.01em" }}>AdForge</div>
              <div style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.28)", letterSpacing:"0.18em", marginTop:3, textTransform:"uppercase" }}>Ad Generator</div>
            </div>
          </div>

          {/* Ad count pill */}
          {adCount !== null && (
            <div style={{ marginTop:14, padding:"6px 10px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.08em" }}>SAVED ADS</span>
              <span style={{ fontFamily:"var(--font-display)", fontSize:"1rem", color:"rgba(255,255,255,0.7)" }}>{adCount}</span>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ padding:"14px 10px", flex:1 }}>
          <div style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.22)", letterSpacing:"0.18em", textTransform:"uppercase", padding:"0 8px", marginBottom:8, fontWeight:600 }}>Navigation</div>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === "/"}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              <span style={{ fontSize:"1rem", width:20, textAlign:"center", flexShrink:0 }}>{n.icon}</span>
              <span style={{ flex:1 }}>{n.label}</span>
              {n.badge && (
                <span style={{ fontSize:"0.6rem", padding:"2px 6px", borderRadius:10, background:"rgba(99,102,241,0.25)", color:"#a5b4fc", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase" }}>{n.badge}</span>
              )}
              {n.label === "Library" && adCount > 0 && (
                <span style={{ fontSize:"0.7rem", padding:"1px 7px", borderRadius:10, background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.35)", fontWeight:600 }}>{adCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div style={{ padding:"14px 14px 20px", borderTop:"1px solid rgba(255,255,255,0.055)" }}>
          {/* Data file path */}
          <div style={{ padding:"10px 12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:9, marginBottom:12 }}>
            <div style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.25)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Local Storage</div>
            <div style={{ fontFamily:"monospace", fontSize:"0.72rem", color:"rgba(74,222,128,0.7)" }}>server/data/ads.json</div>
          </div>

          {/* Server status */}
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ position:"relative", width:8, height:8, flexShrink:0 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background: serverOk === null ? "#888" : serverOk ? "#4ade80" : "#f87171" }} />
              {serverOk === true && <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#4ade80", animation:"ringExpand 2s ease-out infinite" }} />}
            </div>
            <span style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.28)", letterSpacing:"0.04em" }}>
              {serverOk === null ? "Connecting…" : serverOk ? "Server online · :3001" : "Server offline"}
            </span>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:"100vh", overflow:"hidden" }}>
        {/* Offline banner */}
        {serverOk === false && (
          <div style={{ background:"rgba(248,113,113,0.08)", borderBottom:"1px solid rgba(248,113,113,0.2)", padding:"10px 32px", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ color:"#f87171", fontSize:"0.85rem" }}>⚠</span>
            <span style={{ fontSize:"0.84rem", color:"#fca5a5" }}>
              Backend not running. Run <code style={{ background:"rgba(255,255,255,0.08)", padding:"1px 6px", borderRadius:4 }}>cd server && npm run dev</code> in a terminal.
            </span>
          </div>
        )}

        <main style={{ flex:1, overflowY:"auto" }}>
          <div style={{ maxWidth:1120, margin:"0 auto", padding:"40px 36px" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
