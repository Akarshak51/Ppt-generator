import { useNavigate } from "react-router-dom";
import { contrastColor, darken } from "../utils/colors";

const PRESET_ICONS = { minimal:"○", bold:"◼", futuristic:"◈", playful:"✦", corporate:"▣", luxury:"◇" };

export default function AdCard({ ad, onDelete }) {
  const navigate = useNavigate();
  const pri = ad.palette?.primary || "#0a0a0a";
  const acc = ad.palette?.accent  || "#6366f1";
  const neu = ad.palette?.neutral || "#111";
  const fg  = contrastColor(pri);
  const DF  = ad.fonts?.display   || "'DM Serif Display', serif";

  return (
    <div
      onClick={() => navigate(`/ads/${ad.id}`)}
      style={{ cursor:"pointer", borderRadius:14, overflow:"hidden", border:"1px solid rgba(255,255,255,0.07)", transition:"transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease", background:"rgba(255,255,255,0.02)", position:"relative" }}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow=`0 20px 56px rgba(0,0,0,0.5), 0 0 0 1px ${acc}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
    >
      {/* Animated thumbnail */}
      <div style={{ aspectRatio:"16/9", position:"relative", overflow:"hidden", background:`linear-gradient(135deg, ${pri} 0%, ${darken(pri,30)} 50%, ${acc}22 100%)`, backgroundSize:"200% 200%", animation:"gradientDrift 12s ease infinite" }}>
        {/* Ambient glow */}
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 50%, ${acc}1a, transparent 60%)` }} />

        {/* Animated ring */}
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"80%", paddingBottom:"80%", borderRadius:"50%", border:`1px solid ${acc}18`, animation:"rotateSlow 20s linear infinite" }} />

        {/* Company name */}
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ fontFamily:DF, fontSize:"clamp(0.9rem,2.5vw,1.6rem)", fontWeight:900, color:fg, textAlign:"center", lineHeight:1.1, letterSpacing:"-0.01em", textShadow:`0 2px 20px ${acc}44` }}>
            {ad.companyName}
          </div>
          <div style={{ width:32, height:2, background:acc, margin:"8px auto", borderRadius:1 }} />
          <div style={{ fontSize:"0.65rem", color:`${fg}88`, letterSpacing:"0.2em", textTransform:"uppercase" }}>
            {PRESET_ICONS[ad.preset] || "◆"} {ad.preset}
          </div>
        </div>

        {/* Palette swatches - bottom right */}
        <div style={{ position:"absolute", bottom:10, right:10, display:"flex", gap:3 }}>
          {Object.values(ad.palette || {}).map((c, i) => (
            <div key={i} style={{ width:11, height:11, borderRadius:"50%", background:c, border:"1px solid rgba(255,255,255,0.2)", boxShadow:`0 0 6px ${c}66` }} />
          ))}
        </div>

        {/* Scene count badge */}
        <div style={{ position:"absolute", top:10, left:10, padding:"3px 8px", borderRadius:10, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(6px)", fontSize:"0.65rem", color:"rgba(255,255,255,0.55)", fontFamily:"monospace", letterSpacing:"0.06em" }}>
          {(ad.scenes || []).length} scenes
        </div>
      </div>

      {/* Card footer */}
      <div style={{ padding:"13px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <div style={{ fontWeight:700, fontSize:"0.88rem", color:"#e0e0e0", marginBottom:3 }}>{ad.companyName}</div>
          <div style={{ fontSize:"0.71rem", color:"rgba(255,255,255,0.28)" }}>
            {new Date(ad.createdAt).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })}
          </div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDelete(ad.id); }}
          className="btn btn-sm btn-danger"
          style={{ padding:"5px 10px", fontSize:"0.75rem", flexShrink:0 }}
        >✕</button>
      </div>
    </div>
  );
}
