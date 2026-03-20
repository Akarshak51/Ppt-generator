import { useState } from "react";
import { contrastColor } from "../utils/colors";

export default function SceneEditor({ adData, onChange, animSpeed, onSpeedChange }) {
  const [editIdx, setEditIdx] = useState(0);
  const scenes = adData.scenes || [];
  const scene = scenes[editIdx] || {};
  const acc = adData.palette?.accent || "#6366f1";
  const accFg = contrastColor(acc);

  const updateField = (field, value) => {
    const updated = scenes.map((s, i) => i === editIdx ? { ...s, [field]: value } : s);
    onChange({ ...adData, scenes: updated });
  };

  const updateBenefit = (bi, field, value) => {
    const benefits = (scene.benefits || []).map((b, i) => i === bi ? { ...b, [field]: value } : b);
    updateField("benefits", benefits);
  };

  const F = ({ label, value, onChange: onCh, textarea, small, mono, hint }) => (
    <div style={{ marginBottom:15 }}>
      <label className="label" style={{ fontSize:"0.65rem" }}>{label}</label>
      {textarea
        ? <textarea value={value || ""} onChange={e => onCh(e.target.value)} rows={3} style={{ lineHeight:1.5 }} />
        : <input value={value || ""} onChange={e => onCh(e.target.value)} style={{ width: small || "100%", fontFamily: mono ? "monospace" : "inherit" }} />}
      {hint && <div style={{ fontSize:"0.68rem", color:"var(--muted2)", marginTop:4 }}>{hint}</div>}
    </div>
  );

  const SCENE_ICONS = { intro:"⊙", headline:"▸", benefits:"▦", cta:"◎" };

  return (
    <div>
      {/* Scene tabs */}
      <div className="label" style={{ fontSize:"0.64rem" }}>Select Scene</div>
      <div style={{ display:"flex", gap:5, marginBottom:22, flexWrap:"wrap" }}>
        {scenes.map((s, i) => (
          <button key={i} onClick={() => setEditIdx(i)}
            style={{ padding:"7px 13px", borderRadius:8, border: `1px solid ${i===editIdx ? acc : "rgba(255,255,255,0.08)"}`, background: i===editIdx ? `${acc}22` : "rgba(255,255,255,0.04)", color: i===editIdx ? acc : "rgba(255,255,255,0.45)", cursor:"pointer", fontSize:"0.78rem", fontWeight:700, transition:"all 0.18s", display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ fontSize:"0.85rem" }}>{SCENE_ICONS[s.type] || "◆"}</span>
            {i + 1}. {s.type}
          </button>
        ))}
      </div>

      {/* Scene type label */}
      <div style={{ padding:"6px 12px", borderRadius:8, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", marginBottom:18, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:"0.72rem", color:"var(--muted)", letterSpacing:"0.08em" }}>SCENE TYPE</span>
        <span style={{ fontSize:"0.8rem", fontWeight:700, textTransform:"uppercase", color:acc, letterSpacing:"0.1em" }}>{scene.type}</span>
      </div>

      {/* Intro scene */}
      {scene.type === "intro" && <>
        <F label="Company Name" value={scene.companyName} onChange={v => updateField("companyName", v)} hint="Displayed large on scene 1" />
        <F label="Tagline" value={scene.tagline} onChange={v => updateField("tagline", v)} textarea hint="Short, punchy line below company name" />
      </>}

      {/* Headline scene */}
      {scene.type === "headline" && <>
        <F label="Eyebrow Text" value={scene.eyebrow} onChange={v => updateField("eyebrow", v)} hint="Small text above the headline" />
        <F label="Main Headline" value={scene.headline} onChange={v => updateField("headline", v)} textarea />
        <F label="Subheadline" value={scene.subheadline} onChange={v => updateField("subheadline", v)} textarea />
      </>}

      {/* Benefits scene */}
      {scene.type === "benefits" && <>
        <F label="Section Title" value={scene.sectionTitle} onChange={v => updateField("sectionTitle", v)} />
        {(scene.benefits || []).map((b, bi) => (
          <div key={bi} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:14, marginBottom:12 }}>
            <div style={{ fontSize:"0.68rem", color:acc, letterSpacing:"0.14em", textTransform:"uppercase", fontWeight:700, marginBottom:12 }}>Benefit {bi + 1}</div>
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ flexShrink:0 }}>
                <label className="label" style={{ fontSize:"0.65rem" }}>Icon</label>
                <input value={b.icon || ""} onChange={e => updateBenefit(bi, "icon", e.target.value)} style={{ width:56, textAlign:"center", fontSize:"1.2rem" }} />
              </div>
              <div style={{ flex:1 }}>
                <F label="Title" value={b.title} onChange={v => updateBenefit(bi, "title", v)} />
              </div>
            </div>
            <F label="Description" value={b.desc} onChange={v => updateBenefit(bi, "desc", v)} textarea />
          </div>
        ))}
      </>}

      {/* CTA scene */}
      {scene.type === "cta" && <>
        <F label="CTA Headline" value={scene.ctaHeadline} onChange={v => updateField("ctaHeadline", v)} textarea />
        <F label="Button Text" value={scene.ctaText} onChange={v => updateField("ctaText", v)} />
        <F label="Microcopy" value={scene.microcopy} onChange={v => updateField("microcopy", v)} textarea />
        <F label="Sub-CTA (reassurance)" value={scene.subCta} onChange={v => updateField("subCta", v)} hint='e.g. "No credit card required"' />
      </>}

      <div className="divider" />

      {/* Animation speed */}
      <div className="label" style={{ fontSize:"0.64rem" }}>Animation Speed</div>
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {["slow","normal","fast"].map(s => (
          <button key={s} onClick={() => onSpeedChange(s)}
            style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${animSpeed===s ? acc : "rgba(255,255,255,0.08)"}`, background: animSpeed===s ? `${acc}22` : "rgba(255,255,255,0.04)", color: animSpeed===s ? acc : "rgba(255,255,255,0.45)", cursor:"pointer", fontSize:"0.78rem", fontWeight:700, textTransform:"capitalize", transition:"all 0.18s" }}>
            {s}
          </button>
        ))}
      </div>

      {/* Palette */}
      <div className="label" style={{ fontSize:"0.64rem" }}>Color Palette</div>
      <div style={{ display:"flex", gap:12, marginBottom:4 }}>
        {[["Primary","primary"],["Accent","accent"],["Neutral","neutral"]].map(([label,key]) => (
          <div key={key} style={{ flex:1, textAlign:"center" }}>
            <label className="label" style={{ fontSize:"0.62rem", marginBottom:7, textAlign:"center", display:"block" }}>{label}</label>
            <input type="color" value={adData.palette?.[key] || "#000000"}
              onChange={e => onChange({ ...adData, palette: { ...adData.palette, [key]: e.target.value } })}
              style={{ width:"100%", height:40, border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, background:"none", cursor:"pointer" }} />
            <div style={{ fontFamily:"monospace", fontSize:"0.65rem", color:"var(--muted2)", marginTop:5, textAlign:"center" }}>
              {adData.palette?.[key]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
