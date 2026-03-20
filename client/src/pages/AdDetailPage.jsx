import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../utils/api";
import AdPreview from "../components/AdPreview";
import SceneEditor from "../components/SceneEditor";
import { contrastColor } from "../utils/colors";

export default function AdDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [animSpeed, setAnimSpeed] = useState("normal");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.getAd(id)
      .then(d => { setAd(d.ad); setLoading(false); })
      .catch(() => navigate("/library"));
  }, [id, navigate]);

  const showToast = (msg, color = "#4ade80") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateAd(id, ad);
      showToast("✓ Changes saved to disk");
    } catch { showToast("✕ Save failed", "#f87171"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${ad.companyName}"? This cannot be undone.`)) return;
    await api.deleteAd(id);
    navigate("/library");
  };

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"50vh", flexDirection:"column", gap:20 }}>
      <div style={{ width:40, height:40, border:"3px solid rgba(99,102,241,0.2)", borderTopColor:"#6366f1", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <span style={{ color:"var(--muted)", fontSize:"0.88rem" }}>Loading ad…</span>
    </div>
  );

  return (
    <div className="animate-up">
      {/* Toast */}
      {toast && <div className="toast" style={{ borderColor: `${toast.color}44` }}><span style={{ color:toast.color }}>●</span> {toast.msg}</div>}

      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:14 }}>
        <div>
          <button onClick={() => navigate("/library")} className="btn btn-ghost btn-sm" style={{ marginBottom:14 }}>← Library</button>
          <h1 style={{ fontSize:"clamp(1.6rem,3vw,2.2rem)", marginBottom:10 }}>{ad.companyName}</h1>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap", alignItems:"center" }}>
            <span className="tag" style={{ textTransform:"capitalize" }}>{ad.preset}</span>
            <span className="tag">{(ad.scenes||[]).length} scenes</span>
            <span className="tag">Created {new Date(ad.createdAt).toLocaleDateString()}</span>
            {ad.updatedAt !== ad.createdAt && <span className="tag">Edited {new Date(ad.updatedAt).toLocaleDateString()}</span>}
          </div>
        </div>

        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          {/* Speed controls */}
          <div style={{ display:"flex", gap:0, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:9, overflow:"hidden" }}>
            {["slow","normal","fast"].map((s,i) => (
              <button key={s} onClick={() => setAnimSpeed(s)}
                style={{ padding:"7px 12px", background: animSpeed===s ? "rgba(99,102,241,0.2)" : "transparent", color: animSpeed===s ? "#a5b4fc" : "var(--muted)", border:"none", borderLeft: i>0?"1px solid rgba(255,255,255,0.08)":"none", cursor:"pointer", fontSize:"0.78rem", fontWeight:600, textTransform:"capitalize", transition:"all 0.18s" }}>
                {s}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowEditor(s => !s)}>
            {showEditor ? "✕ Close Editor" : "✏ Edit Scenes"}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowExport(true)}>↗ Export</button>
          {showEditor && (
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "💾 Save"}
            </button>
          )}
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>🗑</button>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display:"grid", gridTemplateColumns: showEditor ? "1fr 380px" : "1fr", gap:24, alignItems:"start" }}>
        <div>
          <AdPreview adData={ad} animSpeed={animSpeed} />

          {/* Palette + font info */}
          <div style={{ display:"flex", gap:14, marginTop:18, alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ display:"flex", gap:7, alignItems:"center" }}>
              {Object.entries(ad.palette || {}).map(([key, color]) => (
                <div key={key} title={`${key}: ${color}`}
                  style={{ width:32, height:32, borderRadius:9, background:color, border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"default", transition:"transform 0.2s ease" }}
                  onMouseEnter={e => e.currentTarget.style.transform="scale(1.15)"}
                  onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
                >
                  <span style={{ fontSize:"0.58rem", color:contrastColor(color), fontFamily:"monospace", fontWeight:700 }}>{key[0].toUpperCase()}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:12 }}>
              <div style={{ fontSize:"0.78rem", color:"var(--muted)" }}>
                <span style={{ color:"var(--muted2)" }}>Font: </span>
                <span style={{ fontStyle:"italic", color:"rgba(255,255,255,0.6)" }}>{ad.fonts?.display?.replace(/['"]/g,"").split(",")[0] || "—"}</span>
              </div>
              <div style={{ fontSize:"0.78rem", color:"var(--muted)" }}>
                <span style={{ color:"var(--muted2)" }}>Preset: </span>
                <span style={{ color:"rgba(255,255,255,0.6)", textTransform:"capitalize" }}>{ad.preset}</span>
              </div>
            </div>
          </div>
        </div>

        {showEditor && (
          <div className="card" style={{ animation:"slideInRight 0.32s cubic-bezier(0.22,1,0.36,1) both", maxHeight:"82vh", overflowY:"auto", padding:"24px 22px" }}>
            <div className="label" style={{ marginBottom:18 }}>Scene Editor</div>
            <SceneEditor adData={ad} onChange={setAd} animSpeed={animSpeed} onSpeedChange={setAnimSpeed} />
            <div className="divider" />
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ width:"100%" }}>
              {saving ? "Saving…" : "💾 Save Changes to Disk"}
            </button>
            <p style={{ textAlign:"center", fontSize:"0.72rem", color:"var(--muted2)", marginTop:10 }}>
              Changes are written to server/data/ads.json
            </p>
          </div>
        )}
      </div>

      {/* Original form data */}
      {ad.form && (
        <div style={{ marginTop:32 }}>
          <div className="divider" />
          <details>
            <summary style={{ cursor:"pointer", color:"var(--muted)", fontSize:"0.83rem", fontWeight:600, letterSpacing:"0.08em", userSelect:"none", padding:"4px 0" }}>▸ Original Form Inputs</summary>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginTop:16 }}>
              {Object.entries(ad.form).filter(([,v]) => v).map(([k,v]) => (
                <div key={k} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:9, padding:"10px 14px" }}>
                  <div className="label" style={{ marginBottom:4, fontSize:"0.65rem" }}>{k}</div>
                  <div style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.6)", wordBreak:"break-all", lineHeight:1.4 }}>{String(v)}</div>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {showExport && <ExportModal ad={ad} onClose={() => setShowExport(false)} />}
    </div>
  );
}

function ExportModal({ ad, onClose }) {
  const [tab, setTab] = useState("json");
  const [copied, setCopied] = useState(false);
  const acc = ad.palette?.accent || "#6366f1";
  const accFg = contrastColor(acc);

  const json = JSON.stringify({ palette: ad.palette, fonts: ad.fonts, preset: ad.preset, scenes: ad.scenes }, null, 2);
  const fullJson = JSON.stringify(ad, null, 2);
  const html = `<!-- AdForge Export: ${ad.companyName} -->
<!-- Paste AdPreview + SceneRenderer components and mount below -->
<div id="adforge-root"></div>
<script type="application/json" id="adforge-config">
${json}
</script>`;

  const content = tab === "json" ? json : tab === "full" ? fullJson : html;

  const copy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, backdropFilter:"blur(8px)", animation:"fadeIn 0.2s ease" }}
      onClick={onClose}>
      <div style={{ background:"#0f0f12", border:"1px solid rgba(255,255,255,0.1)", borderRadius:18, padding:32, maxWidth:680, width:"92%", maxHeight:"82vh", overflow:"auto", animation:"scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <div>
            <div style={{ fontFamily:"var(--font-display)", fontWeight:400, fontSize:"1.3rem" }}>Export Ad</div>
            <div style={{ fontSize:"0.78rem", color:"var(--muted)", marginTop:4 }}>{ad.companyName} · {ad.preset}</div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)", borderRadius:9, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:"1rem" }}>✕</button>
        </div>

        <div style={{ display:"flex", gap:6, marginBottom:18 }}>
          {[["json","Ad Config JSON"],["full","Full Record"],["html","HTML Snippet"]].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)} className="btn btn-sm"
              style={{ background: tab===t ? acc : "rgba(255,255,255,0.06)", color: tab===t ? accFg : "rgba(255,255,255,0.5)", border: "none" }}>
              {l}
            </button>
          ))}
        </div>

        <div style={{ position:"relative" }}>
          <pre style={{ background:"#080808", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:18, fontSize:"0.74rem", color:"#7af5a0", overflow:"auto", maxHeight:360, whiteSpace:"pre-wrap", fontFamily:"'SF Mono','Fira Code',monospace", lineHeight:1.6 }}>
            {content}
          </pre>
        </div>

        <div style={{ display:"flex", gap:10, marginTop:16 }}>
          <button className="btn btn-primary" onClick={copy} style={{ flex:1 }}>
            {copied ? "✓ Copied!" : "Copy to Clipboard"}
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
