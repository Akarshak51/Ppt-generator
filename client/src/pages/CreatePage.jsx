import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { contrastColor, darken } from "../utils/colors";

const PRESETS = [
  { id:"minimal",    name:"Minimal",    icon:"○", desc:"Clean & airy",     primary:"#f8f8f8", accent:"#111111" },
  { id:"bold",       name:"Bold",       icon:"◼", desc:"High contrast",    primary:"#0a0a0a", accent:"#e63946" },
  { id:"futuristic", name:"Futuristic", icon:"◈", desc:"Tech & neon",      primary:"#060d1f", accent:"#00ffe7" },
  { id:"playful",    name:"Playful",    icon:"✦", desc:"Bright & fun",     primary:"#fffbeb", accent:"#f97316" },
  { id:"corporate",  name:"Corporate",  icon:"▣", desc:"Professional",     primary:"#0f2644", accent:"#2563eb" },
  { id:"luxury",     name:"Luxury",     icon:"◇", desc:"Refined & gold",   primary:"#0d0d0d", accent:"#c9a84c" },
];

const FONT_NAMES = { minimal:"DM Serif Display", bold:"Bebas Neue", futuristic:"Orbitron", playful:"Righteous", corporate:"Playfair Display", luxury:"Cormorant Garamond" };

export default function CreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    companyName:"", tagline:"", description:"", audience:"", keywords:"",
    primaryColor:"#1e1b4b", secondaryColor:"#7c3aed", website:"", preset:"bold",
  });

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: typeof e === "string" ? e : e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.companyName.trim()) e.companyName = "Company name is required";
    if (form.companyName.length > 60) e.companyName = "Max 60 characters";
    if (!form.description.trim()) e.description = "Description is required";
    if (form.description.trim().length < 20) e.description = "Please add at least 20 characters";
    return e;
  };

  const handleGenerate = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      const { ad } = await api.generateAd(form);
      navigate(`/ads/${ad.id}`);
    } catch (err) {
      setErrors({ _general: err.message || "Generation failed. Is the server running?" });
    } finally { setLoading(false); }
  };

  const activePreset = PRESETS.find(p => p.id === form.preset) || PRESETS[1];
  const previewFg = contrastColor(form.primaryColor);

  return (
    <div className="animate-up">
      <div style={{ marginBottom:36 }}>
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom:16 }}>← Back</button>
        <h1 style={{ fontSize:"2.4rem", marginBottom:8 }}>Create New Ad</h1>
        <p style={{ color:"var(--muted)", fontSize:"0.93rem", maxWidth:480 }}>
          Fill in your brand details — the server generates unique animated copy from your input. No AI required.
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:26, alignItems:"start" }}>

        {/* ── Left: brand info ─────────────────────────────────────────── */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <div className="card">
            <div className="label" style={{ marginBottom:22 }}>① Company Info</div>

            <FF label="Company Name *" error={errors.companyName}>
              <input value={form.companyName} onChange={set("companyName")} placeholder="e.g. Zenith Coffee Co."
                style={{ borderColor: errors.companyName ? "var(--danger)" : undefined }} maxLength={60} />
              <div style={{ textAlign:"right", fontSize:"0.7rem", color:"var(--muted2)", marginTop:4 }}>{form.companyName.length}/60</div>
            </FF>

            <FF label="One-line Tagline">
              <input value={form.tagline} onChange={set("tagline")} placeholder="e.g. Wake up to something better" maxLength={100} />
            </FF>

            <FF label="Description *" error={errors.description}>
              <textarea value={form.description} onChange={set("description")} rows={4}
                placeholder="What does your company do? Who do you serve? What's your USP?"
                style={{ borderColor: errors.description ? "var(--danger)" : undefined }} />
              {!errors.description && (
                <div style={{ fontSize:"0.72rem", color:"var(--muted2)", marginTop:4 }}>Tip: more detail = more unique copy</div>
              )}
            </FF>

            <FF label="Target Audience">
              <input value={form.audience} onChange={set("audience")} placeholder="e.g. Young professionals, 25–40" />
            </FF>

            <FF label="Brand Keywords">
              <input value={form.keywords} onChange={set("keywords")} placeholder="e.g. luxury, minimal, sustainable, innovative" />
              <div style={{ fontSize:"0.72rem", color:"var(--muted2)", marginTop:4 }}>Separate with commas · Used to infer tone</div>
            </FF>

            <FF label="Website URL (optional)">
              <input value={form.website} onChange={set("website")} placeholder="https://yourcompany.com" type="url" />
            </FF>
          </div>
        </div>

        {/* ── Right: style ─────────────────────────────────────────────── */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <div className="card">
            <div className="label" style={{ marginBottom:22 }}>② Visual Preset</div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:20 }}>
              {PRESETS.map(p => (
                <button key={p.id}
                  className={`preset-btn ${form.preset === p.id ? "active" : ""}`}
                  onClick={() => setForm(f => ({ ...f, preset: p.id }))}
                >
                  <div style={{ fontSize:"1.15rem", marginBottom:5, color: form.preset === p.id ? "#a5b4fc" : "rgba(255,255,255,0.4)" }}>{p.icon}</div>
                  <div style={{ fontWeight:700, fontSize:"0.8rem", color: form.preset === p.id ? "#a5b4fc" : "rgba(255,255,255,0.6)", marginBottom:2 }}>{p.name}</div>
                  <div style={{ fontSize:"0.68rem", color:"var(--muted2)" }}>{p.desc}</div>
                </button>
              ))}
            </div>

            {/* Font preview */}
            <div style={{ padding:"8px 14px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, marginBottom:20, fontSize:"0.78rem", color:"var(--muted)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span>Preset font</span>
              <span style={{ color:"rgba(255,255,255,0.55)", fontStyle:"italic" }}>{FONT_NAMES[form.preset]}</span>
            </div>
          </div>

          <div className="card">
            <div className="label" style={{ marginBottom:18 }}>③ Brand Colors</div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18 }}>
              {[["primaryColor","Primary"],["secondaryColor","Accent"]].map(([key,label]) => (
                <div key={key}>
                  <div className="label" style={{ marginBottom:8, fontSize:"0.67rem" }}>{label}</div>
                  <div className="color-input-row">
                    <input type="color" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                    <input type="text" value={form[key]} maxLength={7}
                      onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setForm(f => ({ ...f, [key]: e.target.value })); }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Live preview */}
            <div style={{ borderRadius:10, overflow:"hidden", marginBottom:4 }}>
              <div style={{
                height:72, position:"relative", overflow:"hidden",
                background:`linear-gradient(135deg, ${form.primaryColor}, ${darken(form.primaryColor,30)}, ${form.secondaryColor}44)`,
                backgroundSize:"200% 200%", animation:"gradientDrift 6s ease infinite",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 50%, ${form.secondaryColor}1a, transparent 60%)` }} />
                <span style={{ fontFamily:"var(--font-display)", color:previewFg, fontSize:"1.4rem", fontWeight:700, position:"relative", zIndex:1, textShadow:`0 2px 10px ${form.secondaryColor}44` }}>
                  {form.companyName || "Your Brand Preview"}
                </span>
              </div>
            </div>
            <div style={{ fontSize:"0.7rem", color:"var(--muted2)", textAlign:"center", marginTop:6 }}>Live color preview</div>
          </div>

          {/* Error */}
          {errors._general && (
            <div style={{ padding:"12px 16px", background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.22)", borderRadius:10, color:"#fca5a5", fontSize:"0.85rem" }}>
              ⚠ {errors._general}
            </div>
          )}

          {/* Generate button */}
          <button className="btn btn-primary btn-lg" onClick={handleGenerate} disabled={loading}
            style={{ width:"100%", fontSize:"1rem", padding:"17px", letterSpacing:"0.02em" }}>
            {loading ? (
              <><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite", display:"inline-block" }} /> Generating…</>
            ) : "✦ Generate Ad"}
          </button>

          <p style={{ textAlign:"center", fontSize:"0.76rem", color:"var(--muted2)" }}>
            Saved to <code style={{ background:"rgba(255,255,255,0.06)", padding:"1px 5px", borderRadius:3, fontSize:"0.74rem" }}>server/data/ads.json</code>
          </p>
        </div>
      </div>
    </div>
  );
}

const FF = ({ label, error, children }) => (
  <div style={{ marginBottom:18 }}>
    <label className="label">{label}</label>
    {children}
    {error && <p className="error-text">⚠ {error}</p>}
  </div>
);
