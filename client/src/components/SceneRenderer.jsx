import { useEffect } from "react";
import { contrastColor, darken, lighten } from "../utils/colors";

/* ─── Font loader ────────────────────────────────────────────────────────── */
const FONT_URLS = {
  minimal:    "DM+Serif+Display:ital@0;1|DM+Sans:wght@300;400;500;600",
  bold:       "Bebas+Neue|Barlow:wght@400;600;700;800",
  futuristic: "Orbitron:wght@400;600;700;900|Exo+2:wght@300;400;600",
  playful:    "Righteous|Nunito:wght@400;600;800;900",
  corporate:  "Playfair+Display:wght@500;600;700|Source+Sans+3:wght@300;400;600",
  luxury:     "Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300|Montserrat:wght@300;400;500",
};
function loadFonts(preset) {
  const id = `gf-${preset}`;
  if (document.getElementById(id)) return;
  const url = FONT_URLS[preset?.toLowerCase()];
  if (!url) return;
  const link = document.createElement("link");
  link.id = id; link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${url}&display=swap`;
  document.head.appendChild(link);
}

/* ─── Animation block ────────────────────────────────────────────────────── */
const AB = ({ delay=0, dur=650, anim="slideUp", ease="cubic-bezier(0.22,1,0.36,1)", style={}, children, className }) => (
  <div className={className} style={{ animation:`${anim} ${dur}ms ${ease} ${delay}ms both`, ...style }}>
    {children}
  </div>
);

/* ─── SVG floating particles ─────────────────────────────────────────────── */
const Particles = ({ color, count=16, preset }) => {
  const items = Array.from({ length:count }, (_,i) => ({
    x: ((i * 137.5 + 42) % 100),
    y: ((i * 97.3 + 42) % 100),
    r: 1.2 + (i % 4) * 0.9,
    delay: (i * 320) % 5000,
    dur: 3200 + (i * 550) % 3800,
  }));
  return (
    <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", overflow:"hidden" }}>
      {items.map((p,i) => preset === "futuristic"
        ? <rect key={i} x={`${p.x}%`} y={`${p.y}%`} width={p.r*1.8} height={p.r*1.8} fill={color} opacity={0.45} rx={1}
            style={{ animation:`particleFly ${p.dur}ms ease-in ${p.delay}ms infinite` }} />
        : <circle key={i} cx={`${p.x}%`} cy={`${p.y}%`} r={p.r} fill={color} opacity={0.32}
            style={{ animation:`particleFly ${p.dur}ms ease-in ${p.delay}ms infinite` }} />
      )}
    </svg>
  );
};

/* ─── Geometric background per preset ───────────────────────────────────── */
const GeoBg = ({ preset:p, acc, fg }) => {
  if (p === "minimal") return (
    <>
      <div style={{ position:"absolute", top:"6%", right:"5%", width:200, height:200, borderRadius:"50%", border:`1px solid ${acc}1a`, animation:"rotateSlow 30s linear infinite" }} />
      <div style={{ position:"absolute", top:"9%", right:"8%", width:140, height:140, borderRadius:"50%", border:`1px solid ${acc}12`, animation:"rotateSlow 20s linear infinite reverse" }} />
      <div style={{ position:"absolute", bottom:"10%", left:"3%", width:110, height:110, border:`1px solid ${acc}14`, borderRadius:0, transform:"rotate(15deg)", animation:"rotateSlow 25s linear infinite" }} />
      <div style={{ position:"absolute", bottom:"18%", left:"8%", width:60, height:60, border:`1px solid ${acc}1a`, borderRadius:"50%", animation:"floatY 7s ease-in-out infinite" }} />
    </>
  );
  if (p === "bold") return (
    <>
      <div style={{ position:"absolute", top:"-15%", right:"-8%", width:"50%", height:"110%", background:`${acc}07`, transform:"skewX(-14deg)", animation:"floatYR 12s ease-in-out infinite" }} />
      <div style={{ position:"absolute", bottom:"-8%", left:"-4%", width:"35%", height:"70%", background:`${acc}05`, transform:"skewX(10deg)" }} />
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:680, height:680, borderRadius:"50%", border:`1px solid ${acc}08`, animation:"rotateSlow 40s linear infinite" }} />
    </>
  );
  if (p === "futuristic") return (
    <>
      <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${acc}07 1px, transparent 1px), linear-gradient(90deg, ${acc}07 1px, transparent 1px)`, backgroundSize:"44px 44px" }} />
      <div style={{ position:"absolute", left:0, right:0, height:2, background:`linear-gradient(90deg, transparent 0%, ${acc}cc 40%, ${acc}cc 60%, transparent 100%)`, boxShadow:`0 0 12px ${acc}`, animation:"scanLine 3.5s linear infinite" }} />
      {[[{top:"12px",left:"12px"},{borderTop:`2px solid ${acc}cc`,borderLeft:`2px solid ${acc}cc`}],[{top:"12px",right:"12px"},{borderTop:`2px solid ${acc}cc`,borderRight:`2px solid ${acc}cc`}],[{bottom:"12px",left:"12px"},{borderBottom:`2px solid ${acc}cc`,borderLeft:`2px solid ${acc}cc`}],[{bottom:"12px",right:"12px"},{borderBottom:`2px solid ${acc}cc`,borderRight:`2px solid ${acc}cc`}]].map(([pos,bord],i) => (
        <div key={i} style={{ position:"absolute", width:28, height:28, ...pos, ...bord }} />
      ))}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:440, height:440, borderRadius:"50%", border:`1px solid ${acc}18`, animation:"rotateSlow 22s linear infinite" }} />
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:290, height:290, borderRadius:"50%", border:`1px dashed ${acc}20`, animation:"rotateSlowR 16s linear infinite" }} />
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:160, height:160, borderRadius:"50%", border:`1px solid ${acc}18`, animation:"rotateSlow 10s linear infinite" }} />
    </>
  );
  if (p === "playful") return (
    <>
      {Array.from({length:7},(_,i) => (
        <div key={i} style={{ position:"absolute", width:40+i*24, height:40+i*24, borderRadius:"50%", background:`${acc}${Math.max(8,14-i*2).toString(16).padStart(2,"0")}`, top:`${8+i*10}%`, left:`${3+i*13}%`, animation:`floatY ${3.2+i*0.6}s ease-in-out ${i*0.35}s infinite` }} />
      ))}
      <div style={{ position:"absolute", top:"8%", right:"8%", width:96, height:96, background:`${fg}06`, borderRadius:"30% 70% 70% 30% / 30% 30% 70% 70%", animation:"morphBlob 9s ease-in-out infinite" }} />
      <div style={{ position:"absolute", bottom:"14%", right:"10%", width:64, height:64, background:`${acc}18`, borderRadius:"60% 40% 40% 60% / 60% 60% 40% 40%", animation:"morphBlob 7s ease-in-out 2s infinite" }} />
    </>
  );
  if (p === "corporate") return (
    <>
      <div style={{ position:"absolute", top:0, right:0, width:"42%", height:"100%", background:`linear-gradient(135deg, ${acc}08, transparent)` }} />
      <div style={{ position:"absolute", bottom:0, left:0, width:"100%", height:"38%", background:`linear-gradient(to top, ${acc}07, transparent)` }} />
      {[0,1,2,3].map(i => (
        <div key={i} style={{ position:"absolute", right:`${5+i*7}%`, top:"12%", width:1, height:"76%", background:`linear-gradient(to bottom, transparent, ${acc}${(16+i*10).toString(16)}, transparent)`, animation:`glowBreath ${2.8+i*0.4}s ease-in-out ${i*0.6}s infinite` }} />
      ))}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg, transparent, ${acc}44, transparent)` }} />
    </>
  );
  if (p === "luxury") return (
    <>
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:520, height:520, borderRadius:"50%", border:`1px solid ${acc}13`, animation:"rotateSlow 45s linear infinite" }} />
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%) rotate(45deg)", width:368, height:368, border:`1px solid ${acc}0f`, animation:"rotateSlowR 32s linear infinite" }} />
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:200, height:200, borderRadius:"50%", border:`1px solid ${acc}0c`, animation:"rotateSlow 18s linear infinite reverse" }} />
      {[[{top:"14px",left:"14px"},{borderTop:`1px solid ${acc}99`,borderLeft:`1px solid ${acc}99`}],[{top:"14px",right:"14px"},{borderTop:`1px solid ${acc}99`,borderRight:`1px solid ${acc}99`}],[{bottom:"14px",left:"14px"},{borderBottom:`1px solid ${acc}99`,borderLeft:`1px solid ${acc}99`}],[{bottom:"14px",right:"14px"},{borderBottom:`1px solid ${acc}99`,borderRight:`1px solid ${acc}99`}]].map(([pos,bord],i) => (
        <div key={i} style={{ position:"absolute", width:22, height:22, ...pos, ...bord }} />
      ))}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%) rotate(45deg)", width:24, height:24, border:`1px solid ${acc}44`, animation:"rotateSlow 8s linear infinite" }} />
    </>
  );
  return null;
};

/* ─── Word-by-word animated headline ─────────────────────────────────────── */
const AnimWords = ({ text="", baseDelay=0, d, DF, color, fontSize, fontWeight=800, letterSpacing="normal", textTransform="none", lineHeight=1.12 }) => (
  <div style={{ lineHeight }}>
    {text.split(" ").map((word,i) => (
      <span key={i} style={{ display:"inline-block", marginRight:"0.28em" }}>
        <AB anim="waveIn" delay={d(baseDelay + i*58)} dur={d(570)} ease="cubic-bezier(0.22,1,0.36,1)"
          style={{ display:"block", fontFamily:DF, fontSize, fontWeight, color, letterSpacing, textTransform }}>
          {word}
        </AB>
      </span>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function SceneRenderer({ scene, palette, fonts, preset, animSpeed }) {
  const p = (preset || "bold").toLowerCase();
  useEffect(() => { loadFonts(p); }, [p]);

  const mult = animSpeed === "slow" ? 1.65 : animSpeed === "fast" ? 0.52 : 1;
  const d = ms => Math.round(ms * mult);

  const bg    = palette?.primary  || "#0a0a0a";
  const acc   = palette?.accent   || "#6366f1";
  const neu   = palette?.neutral  || "#111111";
  const fg    = contrastColor(bg);
  const accFg = contrastColor(acc);
  const neuFg = contrastColor(neu);

  const DF = fonts?.display || "'DM Serif Display', serif";
  const BF = fonts?.body    || "'DM Sans', sans-serif";

  const r = p==="futuristic" ? 2 : p==="playful" ? 22 : p==="minimal" ? 4 : p==="luxury" ? 1 : 10;

  const titleAnim  = p==="futuristic" ? "glitchIn" : p==="playful" ? "bounceIn" : p==="luxury" ? "fadeIn" : "scaleIn";
  const titleEase  = p==="playful" ? "cubic-bezier(0.34,1.56,0.64,1)" : "cubic-bezier(0.22,1,0.36,1)";

  const gradBg = {
    background:`linear-gradient(135deg, ${bg} 0%, ${darken(bg,38)} 55%, ${acc}1a 100%)`,
    backgroundSize:"300% 300%",
    animation:`gradientDrift ${d(16000)}ms ease infinite`,
  };

  /* ══ INTRO ════════════════════════════════════════════════════════════════ */
  if (scene.type === "intro") return (
    <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", ...gradBg }}>
      <GeoBg preset={p} acc={acc} fg={fg} />
      <Particles color={acc} count={p==="futuristic" ? 22 : 14} preset={p} />

      {/* Centre ambient glow */}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"65%", paddingBottom:"65%", borderRadius:"50%", background:`radial-gradient(circle, ${acc}16 0%, transparent 68%)`, animation:`glowBreath ${d(5500)}ms ease-in-out infinite`, pointerEvents:"none" }} />

      {/* Company name */}
      <AB anim={titleAnim} delay={d(80)} dur={d(750)} ease={titleEase} style={{ position:"relative", zIndex:1 }}>
        <div style={{
          fontFamily:DF, fontSize:"clamp(2.6rem,9.5vw,7rem)", fontWeight:900, color:fg,
          lineHeight:1, letterSpacing: p==="luxury" ? "0.16em" : p==="futuristic" ? "0.07em" : "-0.02em",
          textAlign:"center",
          textShadow: p==="futuristic" ? `0 0 60px ${acc}, 0 0 20px ${acc}88, 0 0 100px ${acc}44`
                    : p==="luxury"     ? `0 2px 50px ${acc}55`
                    : p==="bold"       ? `3px 3px 0 ${acc}33`
                    : "none",
          animation: p==="futuristic" ? `neonFlicker ${d(7000)}ms ease-in-out ${d(1500)}ms infinite` : "none",
          padding:"0 20px",
          textTransform: p==="bold" || p==="futuristic" ? "uppercase" : "none",
        }}>{scene.companyName}</div>
      </AB>

      {/* Divider — varies by preset */}
      <AB anim="fadeIn" delay={d(520)} dur={d(350)} style={{ position:"relative", zIndex:1, width:"100%", display:"flex", justifyContent:"center", alignItems:"center", margin:"22px 0 20px", gap:10 }}>
        {p==="luxury" ? (
          <><div style={{ width:44, height:1, background:acc, opacity:0.7 }} />
            <span style={{ color:acc, fontSize:"0.7rem", animation:`rotateSlow ${d(8000)}ms linear infinite` }}>◆</span>
            <div style={{ width:44, height:1, background:acc, opacity:0.7 }} /></>
        ) : p==="futuristic" ? (
          <div style={{ width:140, height:2, background:`linear-gradient(90deg, transparent, ${acc}, ${acc}, transparent)`, boxShadow:`0 0 10px ${acc}`, animation:`shimmer ${d(2200)}ms ease-in-out infinite`, backgroundSize:"200% 100%" }} />
        ) : p==="playful" ? (
          <div style={{ display:"flex", gap:8 }}>
            {["★","★","★"].map((s,i) => <span key={i} style={{ color:acc, fontSize:"0.9rem", animation:`floatY ${d(2000+i*400)}ms ease-in-out ${i*200}ms infinite` }}>{s}</span>)}
          </div>
        ) : (
          <div style={{ width:70, height:3, background:acc, borderRadius:2, animation:`lineGrow ${d(600)}ms ease-out ${d(500)}ms both` }} />
        )}
      </AB>

      {/* Tagline */}
      <AB anim={p==="futuristic" ? "typewriter" : "slideUp"} delay={d(820)} dur={d(820)} ease="cubic-bezier(0.22,1,0.36,1)" style={{ position:"relative", zIndex:1 }}>
        <div style={{
          fontFamily:BF, fontSize:"clamp(0.88rem,2vw,1.3rem)", color:`${fg}cc`, textAlign:"center",
          maxWidth:560, lineHeight:1.68, padding:"0 32px",
          fontWeight: p==="bold" ? 600 : p==="luxury" ? 300 : 400,
          letterSpacing: p==="luxury" ? "0.24em" : p==="futuristic" ? "0.14em" : "0.03em",
          textTransform: p==="luxury" ? "uppercase" : "none",
          overflow: p==="futuristic" ? "hidden" : "visible",
          whiteSpace: p==="futuristic" ? "nowrap" : "normal",
        }}>{scene.tagline}</div>
      </AB>

      {/* Preset badge */}
      <AB anim="fadeIn" delay={d(1300)} dur={d(450)} style={{ position:"relative", zIndex:1, marginTop:26 }}>
        <div style={{ padding:"5px 16px", borderRadius:20, border:`1px solid ${acc}44`, background:`${acc}0e`, fontSize:"0.68rem", fontFamily:BF, letterSpacing:"0.2em", color:`${acc}dd`, textTransform:"uppercase", fontWeight:700 }}>
          {p}
        </div>
      </AB>
    </div>
  );

  /* ══ HEADLINE ═════════════════════════════════════════════════════════════ */
  if (scene.type === "headline") return (
    <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", background:neu }}>
      {/* Left accent strip */}
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:`linear-gradient(to bottom, transparent, ${acc}cc, transparent)`, animation:`glowBreath ${d(4000)}ms ease-in-out infinite` }} />
      {/* Radial glow from top-right */}
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 75% 35%, ${acc}1e 0%, transparent 55%)`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"6%", right:"6%", width:230, height:230, borderRadius:"50%", background:`radial-gradient(circle, ${acc}10 0%, transparent 70%)`, animation:`floatY ${d(7000)}ms ease-in-out infinite`, pointerEvents:"none" }} />

      <GeoBg preset={p} acc={acc} fg={neuFg} />

      <div style={{ maxWidth:880, padding:"0 64px", position:"relative", zIndex:1, width:"100%" }}>
        {/* Eyebrow */}
        <AB anim="slideInLeft" delay={d(60)} dur={d(580)}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <div style={{ width:32, height:2, background:acc, borderRadius:1, animation:`lineGrow ${d(500)}ms ease-out ${d(100)}ms both`, flexShrink:0 }} />
            <span style={{ fontFamily:BF, fontSize:"0.76rem", letterSpacing:"0.34em", color:acc, textTransform:"uppercase", fontWeight:700 }}>{scene.eyebrow}</span>
          </div>
        </AB>

        {/* Word-by-word headline */}
        <div style={{ marginBottom:28 }}>
          <AnimWords text={scene.headline || ""} baseDelay={200} d={d} DF={DF} color={neuFg}
            fontSize="clamp(1.7rem,5vw,3.6rem)"
            fontWeight={p==="luxury" ? 600 : 800}
            letterSpacing={p==="luxury" ? "0.03em" : "-0.01em"}
            textTransform={p==="bold" || p==="futuristic" ? "uppercase" : "none"}
          />
        </div>

        {/* Accent divider */}
        <AB anim="fadeIn" delay={d(700)} dur={d(380)}>
          <div style={{ width:52, height:3, background:`linear-gradient(90deg, ${acc}, ${lighten(acc,35)})`, borderRadius:2, marginBottom:26, animation:`lineGrow ${d(480)}ms ease-out ${d(700)}ms both` }} />
        </AB>

        {/* Subheadline */}
        <AB anim="slideUp" delay={d(880)} dur={d(680)}>
          <div style={{ fontFamily:BF, fontSize:"clamp(0.88rem,1.8vw,1.1rem)", color:`${neuFg}80`, lineHeight:1.82, maxWidth:510, fontWeight:p==="luxury" ? 300 : 400 }}>
            {scene.subheadline}
          </div>
        </AB>

        {/* Futuristic data readout */}
        {p==="futuristic" && (
          <AB anim="fadeIn" delay={d(1100)} dur={d(500)}>
            <div style={{ marginTop:24, display:"flex", gap:24, flexWrap:"wrap" }}>
              {["EFFICIENCY: 99.8%","LATENCY: <12ms","UPTIME: 99.99%"].map((stat,i) => (
                <div key={i} style={{ fontSize:"0.68rem", fontFamily:BF, color:`${acc}99`, letterSpacing:"0.12em" }}>{stat}</div>
              ))}
            </div>
          </AB>
        )}
      </div>
    </div>
  );

  /* ══ BENEFITS ═════════════════════════════════════════════════════════════ */
  if (scene.type === "benefits") return (
    <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", ...gradBg }}>
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(to bottom, ${bg}00 25%, ${bg}cc 100%)`, pointerEvents:"none" }} />
      <GeoBg preset={p} acc={acc} fg={fg} />

      {/* Header */}
      <AB anim="slideDown" delay={d(60)} dur={d(580)} style={{ position:"relative", zIndex:1, textAlign:"center", marginBottom:30, padding:"0 24px" }}>
        <div style={{ fontFamily:BF, fontSize:"0.7rem", letterSpacing:"0.36em", color:acc, textTransform:"uppercase", fontWeight:700, marginBottom:10, animation:`glowBreath ${d(3500)}ms ease-in-out infinite` }}>OUR PROMISE</div>
        <div style={{ fontFamily:DF, fontSize:"clamp(1.3rem,3.2vw,2.2rem)", fontWeight:700, color:fg, letterSpacing:p==="luxury"?"0.06em":"normal" }}>{scene.sectionTitle}</div>
      </AB>

      {/* Cards */}
      <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center", position:"relative", zIndex:1, padding:"0 20px", width:"100%" }}>
        {(scene.benefits || []).map((c,i) => (
          <AB key={i}
            anim={i===0 ? "slideInLeft" : i===2 ? "slideInRight" : "slideUp"}
            delay={d(280 + i*170)} dur={d(620)}
            ease="cubic-bezier(0.22,1,0.36,1)"
          >
            <div style={{
              background: p==="futuristic" ? `linear-gradient(145deg, ${bg}ee, ${darken(bg,10)})` : p==="luxury" ? `linear-gradient(145deg, ${fg}07, ${fg}03)` : `${fg}0a`,
              backdropFilter:"blur(16px)",
              border: p==="futuristic" ? `1px solid ${acc}44` : p==="luxury" ? `1px solid ${acc}2e` : `1px solid ${fg}16`,
              borderRadius:r, padding:"26px 22px", width:200, maxWidth:220,
              textAlign:"center", position:"relative", overflow:"hidden",
              transition:"transform 0.28s ease, box-shadow 0.28s ease", cursor:"default",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-8px)"; e.currentTarget.style.boxShadow=`0 20px 50px ${acc}33`; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
            >
              {/* Top glow bar */}
              <div style={{ position:"absolute", top:0, left:"15%", right:"15%", height:2, background:`linear-gradient(90deg, transparent, ${acc}cc, transparent)`, boxShadow:p==="futuristic"?`0 0 8px ${acc}`:"none" }} />
              {/* Icon */}
              <div style={{ fontSize:"1.9rem", marginBottom:14, filter:p==="futuristic"?`drop-shadow(0 0 10px ${acc})`:"none", animation:`floatY ${d(3200+i*380)}ms ease-in-out ${i*280}ms infinite` }}>
                {c.icon}
              </div>
              <div style={{ fontFamily:DF, fontSize:"1.02rem", fontWeight:700, color:fg, marginBottom:9, letterSpacing:p==="luxury"?"0.07em":"0" }}>{c.title}</div>
              <div style={{ fontFamily:BF, fontSize:"0.8rem", color:`${fg}aa`, lineHeight:1.62 }}>{c.desc}</div>
              {p==="futuristic" && <div style={{ position:"absolute", bottom:7, right:7, width:5, height:5, borderRadius:"50%", background:acc, animation:`glowBreath ${d(2200)}ms ease-in-out ${i*300}ms infinite` }} />}
              {p==="luxury" && <div style={{ marginTop:12, display:"flex", justifyContent:"center" }}><div style={{ width:20, height:1, background:acc, opacity:0.5 }} /></div>}
            </div>
          </AB>
        ))}
      </div>
    </div>
  );

  /* ══ CTA ══════════════════════════════════════════════════════════════════ */
  if (scene.type === "cta") return (
    <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", background:neu }}>
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 115%, ${acc}30 0%, transparent 52%)`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% -25%, ${acc}0c 0%, transparent 50%)`, pointerEvents:"none" }} />

      <GeoBg preset={p} acc={acc} fg={neuFg} />

      {(p==="luxury" || p==="futuristic") && (
        <div style={{ position:"absolute", top:"50%", left:"50%", width:360, height:360, borderRadius:"50%", border:`1px solid ${acc}18`, animation:`ringExpand ${d(4000)}ms ease-out ${d(900)}ms infinite`, pointerEvents:"none", marginLeft:-180, marginTop:-180 }} />
      )}

      <div style={{ position:"relative", zIndex:1, textAlign:"center", padding:"0 48px", maxWidth:720 }}>
        {/* Eyebrow */}
        <AB anim="fadeIn" delay={d(70)} dur={d(480)}>
          <div style={{ fontFamily:BF, fontSize:"0.7rem", letterSpacing:"0.36em", color:acc, textTransform:"uppercase", fontWeight:700, marginBottom:20, textShadow:p==="futuristic"?`0 0 12px ${acc}`:"none" }}>
            {p==="luxury" ? "— Your Next Step —" : p==="futuristic" ? "[ INITIATE SEQUENCE ]" : p==="playful" ? "🎉 Let's Go!" : "Ready?"}
          </div>
        </AB>

        {/* CTA Headline — word by word */}
        <div style={{ marginBottom:22 }}>
          <AnimWords text={scene.ctaHeadline || ""} baseDelay={180} d={d} DF={DF} color={neuFg}
            fontSize="clamp(1.6rem,4.5vw,3rem)"
            fontWeight={p==="luxury" ? 500 : 800}
            textTransform={p==="bold" || p==="futuristic" ? "uppercase" : "none"}
            letterSpacing={p==="luxury" ? "0.04em" : "normal"}
          />
        </div>

        {/* Microcopy */}
        <AB anim="slideUp" delay={d(680)} dur={d(600)}>
          <div style={{ fontFamily:BF, fontSize:"clamp(0.84rem,1.6vw,1rem)", color:`${neuFg}77`, marginBottom:40, maxWidth:450, margin:"0 auto 42px", lineHeight:1.75 }}>
            {scene.microcopy}
          </div>
        </AB>

        {/* CTA button with ring */}
        <AB anim="bounceIn" delay={d(940)} dur={d(700)} ease="cubic-bezier(0.34,1.56,0.64,1)">
          <div style={{ position:"relative", display:"inline-block" }}>
            <div style={{ position:"absolute", inset:-5, borderRadius:r+5, border:`2px solid ${acc}66`, animation:`ringExpand ${d(3000)}ms ease-out ${d(1400)}ms infinite`, pointerEvents:"none" }} />
            <button style={{
              fontFamily:BF, fontWeight:700, fontSize:"0.95rem", letterSpacing:"0.08em",
              background: p==="luxury" ? `linear-gradient(135deg, ${acc}, ${darken(acc,22)})`
                        : p==="futuristic" ? "transparent"
                        : p==="minimal" ? neuFg : acc,
              color: p==="futuristic" ? acc : p==="minimal" ? neu : accFg,
              border: p==="futuristic" ? `1.5px solid ${acc}` : "none",
              borderRadius:r, padding:"18px 54px", cursor:"pointer", textTransform:"uppercase",
              boxShadow: p==="futuristic" ? `0 0 35px ${acc}44, inset 0 0 35px ${acc}0e`
                       : p==="luxury" ? `0 12px 40px ${acc}66` : `0 10px 36px ${acc}55`,
              transition:"transform 0.22s ease, box-shadow 0.22s ease",
              position:"relative", overflow:"hidden",
              animation: p==="futuristic" ? `neonFlicker ${d(6000)}ms ease-in-out ${d(2500)}ms infinite` : "none",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform="scale(1.07)"; e.currentTarget.style.boxShadow=`0 18px 52px ${acc}88`; }}
              onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow=p==="futuristic"?`0 0 35px ${acc}44`:`0 10px 36px ${acc}55`; }}
            >
              <span style={{ position:"absolute", inset:0, background:`linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.18) 50%, transparent 62%)`, backgroundSize:"200% 100%", animation:`shimmer ${d(3200)}ms ease-in-out ${d(1600)}ms infinite` }} />
              <span style={{ position:"relative", zIndex:1 }}>{scene.ctaText}</span>
            </button>
          </div>
        </AB>

        {/* Sub CTA */}
        <AB anim="fadeIn" delay={d(1300)} dur={d(450)} style={{ marginTop:20 }}>
          <div style={{ fontFamily:BF, fontSize:"0.75rem", color:`${neuFg}3e`, letterSpacing:"0.07em" }}>{scene.subCta}</div>
        </AB>
      </div>
    </div>
  );

  return (
    <div style={{ width:"100%", height:"100%", background:"#111", display:"flex", alignItems:"center", justifyContent:"center", color:"#555", fontFamily:"monospace", fontSize:"0.85rem" }}>
      Unknown scene type: {scene.type}
    </div>
  );
}
