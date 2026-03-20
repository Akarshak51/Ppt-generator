import { useState, useEffect, useRef, useCallback } from "react";
import SceneRenderer from "./SceneRenderer";
import { contrastColor } from "../utils/colors";

export default function AdPreview({ adData, animSpeed = "normal", compact = false }) {
  const [currentScene, setCurrentScene] = useState(0);
  const [prevScene, setPrevScene] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef(null);
  const transRef = useRef(null);

  const scenes = adData?.scenes || [];
  const { palette, fonts, preset } = adData || {};
  const acc = palette?.accent || "#6366f1";
  const accFg = contrastColor(acc);

  const speedMs = animSpeed === "slow" ? 5500 : animSpeed === "fast" ? 2300 : 3800;
  const transMs = 480;

  const goTo = useCallback((idx) => {
    if (transitioning) return;
    setTransitioning(true);
    setPrevScene(currentScene);
    clearTimeout(transRef.current);
    transRef.current = setTimeout(() => {
      setCurrentScene(idx);
      setTransitioning(false);
      setPrevScene(null);
    }, transMs);
  }, [currentScene, transitioning]);

  const next = useCallback(() => goTo((currentScene + 1) % scenes.length), [currentScene, scenes.length, goTo]);
  const prev = useCallback(() => goTo((currentScene - 1 + scenes.length) % scenes.length), [currentScene, scenes.length, goTo]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (isPlaying && scenes.length > 1) timerRef.current = setTimeout(next, speedMs);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentScene, next, speedMs, scenes.length]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") { e.preventDefault(); setIsPlaying(p => !p); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next, prev]);

  useEffect(() => () => { clearTimeout(timerRef.current); clearTimeout(transRef.current); }, []);

  if (!adData || scenes.length === 0) return (
    <div style={{ width:"100%", aspectRatio:"16/9", background:"#111", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", color:"#444" }}>No scenes</div>
  );

  const navBtnStyle = {
    position:"absolute", top:"50%", transform:"translateY(-50%)", zIndex:30,
    width: compact ? 34 : 42, height: compact ? 34 : 42, borderRadius:"50%",
    background:"rgba(0,0,0,0.4)", backdropFilter:"blur(10px)",
    border:"1px solid rgba(255,255,255,0.15)", color:"#fff",
    display:"flex", alignItems:"center", justifyContent:"center",
    cursor:"pointer", fontSize: compact ? "1.1rem" : "1.4rem", lineHeight:1,
    transition:"all 0.2s ease",
  };

  return (
    <div style={{ width:"100%", display:"flex", flexDirection:"column" }}>
      {/* Canvas */}
      <div className="ad-canvas">
        {/* Previous scene fading out */}
        {prevScene !== null && (
          <div style={{ position:"absolute", inset:0, zIndex:1, animation:`fadeOut ${transMs}ms ease-out both` }}>
            <SceneRenderer scene={scenes[prevScene]} palette={palette} fonts={fonts} preset={preset} animSpeed={animSpeed} />
          </div>
        )}

        {/* Current scene fading in */}
        <div key={currentScene} style={{ position:"absolute", inset:0, zIndex:2, animation: transitioning ? `fadeIn ${transMs}ms ease-out both` : "none" }}>
          <SceneRenderer scene={scenes[currentScene]} palette={palette} fonts={fonts} preset={preset} animSpeed={animSpeed} />
        </div>

        {/* Scene counter top-right */}
        <div style={{ position:"absolute", top:14, right:14, zIndex:40, padding:"4px 10px", borderRadius:20, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.12)", fontFamily:"monospace", fontSize:"0.72rem", color:"rgba(255,255,255,0.6)", letterSpacing:"0.08em" }}>
          {currentScene + 1} / {scenes.length}
        </div>

        {/* Dot navigation */}
        {scenes.length > 1 && (
          <div style={{ position:"absolute", bottom:16, left:0, right:0, display:"flex", justifyContent:"center", gap:8, zIndex:30 }}>
            {scenes.map((s, i) => (
              <button key={i} className="dot-nav-dot" onClick={() => goTo(i)} aria-label={`Scene ${i + 1}: ${s.type}`}
                style={{ width: i === currentScene ? 28 : 8, background: i === currentScene ? acc : "rgba(255,255,255,0.38)" }}
              />
            ))}
          </div>
        )}

        {/* Arrow buttons */}
        {scenes.length > 1 && <>
          <button onClick={prev} aria-label="Previous scene" style={{ ...navBtnStyle, left:12 }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(0,0,0,0.65)"; e.currentTarget.style.transform="translateY(-50%) scale(1.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(0,0,0,0.4)"; e.currentTarget.style.transform="translateY(-50%) scale(1)"; }}
          >‹</button>
          <button onClick={next} aria-label="Next scene" style={{ ...navBtnStyle, right:12 }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(0,0,0,0.65)"; e.currentTarget.style.transform="translateY(-50%) scale(1.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(0,0,0,0.4)"; e.currentTarget.style.transform="translateY(-50%) scale(1)"; }}
          >›</button>
        </>}
      </div>

      {/* Controls bar */}
      {!compact && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 18px", background:"rgba(255,255,255,0.022)", border:"1px solid rgba(255,255,255,0.07)", borderTop:"none", borderRadius:"0 0 14px 14px" }}>
          <div style={{ display:"flex", gap:7 }}>
            <MiniBtn icon={isPlaying ? "⏸" : "▶"} label={isPlaying ? "Pause" : "Play"} onClick={() => setIsPlaying(p => !p)} acc={acc} />
            <MiniBtn icon="↺" label="Restart" onClick={() => { setCurrentScene(0); setIsPlaying(true); }} acc={acc} />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontFamily:"monospace", fontSize:"0.72rem", color:"rgba(255,255,255,0.28)", letterSpacing:"0.1em" }}>
              {(scenes[currentScene]?.type || "").toUpperCase()}
            </span>
            {/* Progress bar */}
            <div style={{ width:80, height:3, background:"rgba(255,255,255,0.08)", borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${((currentScene + 1) / scenes.length) * 100}%`, background:acc, borderRadius:2, transition:"width 0.4s ease" }} />
            </div>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <span style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.22)", letterSpacing:"0.08em" }}>SPEED</span>
            {["slow","normal","fast"].map(s => (
              <span key={s} style={{ fontSize:"0.68rem", color: animSpeed===s ? acc : "rgba(255,255,255,0.22)", fontWeight: animSpeed===s ? 700 : 400, cursor:"default", textTransform:"capitalize" }}>{s[0].toUpperCase()}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const MiniBtn = ({ icon, label, onClick, acc }) => (
  <button title={label} onClick={onClick}
    style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.55)", borderRadius:7, padding:"6px 12px", cursor:"pointer", fontSize:"0.85rem", transition:"all 0.2s ease", display:"flex", alignItems:"center", gap:5 }}
    onMouseEnter={e => { e.currentTarget.style.background=`${acc}22`; e.currentTarget.style.color=acc; e.currentTarget.style.borderColor=`${acc}44`; }}
    onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="rgba(255,255,255,0.55)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; }}
  >
    {icon} <span style={{ fontSize:"0.74rem" }}>{label}</span>
  </button>
);
