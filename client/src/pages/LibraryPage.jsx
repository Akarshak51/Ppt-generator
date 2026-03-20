import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import AdCard from "../components/AdCard";

const PRESETS = ["all","minimal","bold","futuristic","playful","corporate","luxury"];
const SORTS = [["newest","Newest"],["oldest","Oldest"],["name","A–Z"]];

export default function LibraryPage() {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  const load = () => {
    setLoading(true);
    api.getAds().then(d => { setAds(d.ads); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = ads
    .filter(a => filter === "all" || a.preset === filter)
    .filter(a => !search || a.companyName?.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => {
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      return a.companyName.localeCompare(b.companyName);
    });

  const handleDelete = async (id) => {
    await api.deleteAd(id);
    setAds(a => a.filter(x => x.id !== id));
  };

  const handleClearAll = async () => {
    await api.deleteAllAds();
    setAds([]);
    setConfirmClear(false);
  };

  return (
    <div className="animate-up">
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:14 }}>
        <div>
          <h1 style={{ fontSize:"2.2rem", marginBottom:6 }}>Ad Library</h1>
          <p style={{ color:"var(--muted)", fontSize:"0.88rem" }}>
            {ads.length} ads stored locally at <code style={{ background:"rgba(255,255,255,0.07)", padding:"1px 5px", borderRadius:3, fontSize:"0.8rem" }}>server/data/ads.json</code>
          </p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/create")}>+ New Ad</button>
          {ads.length > 0 && (
            confirmClear
              ? <><button className="btn btn-danger btn-sm" onClick={handleClearAll}>Confirm Delete All ({ads.length})</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setConfirmClear(false)}>Cancel</button></>
              : <button className="btn btn-ghost btn-sm" onClick={() => setConfirmClear(true)}>Clear All</button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:12, marginBottom:28, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flex:1, minWidth:200, maxWidth:300 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--muted2)", fontSize:"0.9rem" }}>⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name…" style={{ paddingLeft:34 }} />
        </div>

        <div style={{ display:"flex", gap:5, padding:"4px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9 }}>
          {PRESETS.map(p => (
            <button key={p} onClick={() => setFilter(p)}
              style={{ padding:"6px 12px", borderRadius:6, background: filter===p ? "rgba(99,102,241,0.2)" : "transparent", border: filter===p?"1px solid rgba(99,102,241,0.35)":"1px solid transparent", color: filter===p?"#a5b4fc":"var(--muted)", cursor:"pointer", fontSize:"0.78rem", fontWeight:600, textTransform:"capitalize", transition:"all 0.18s" }}>
              {p}
            </button>
          ))}
        </div>

        <select value={sort} onChange={e => setSort(e.target.value)} style={{ width:"auto", minWidth:120, padding:"8px 14px" }}>
          {SORTS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {/* Grid */}
      {loading && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:18 }}>
          {[...Array(4)].map((_,i) => (
            <div key={i} style={{ borderRadius:14, overflow:"hidden", animation:`fadeIn 0.4s ease ${i*80}ms both` }}>
              <div className="skeleton" style={{ aspectRatio:"16/9" }} />
              <div style={{ padding:"14px 16px", display:"flex", gap:10, flexDirection:"column" }}>
                <div className="skeleton" style={{ height:14, width:"60%" }} />
                <div className="skeleton" style={{ height:10, width:"40%" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign:"center", padding:"80px 0", border:"1px dashed rgba(255,255,255,0.07)", borderRadius:18 }}>
          <div style={{ fontSize:"3rem", marginBottom:14, opacity:0.2 }}>▦</div>
          <p style={{ color:"var(--muted)", marginBottom:20, fontSize:"1rem" }}>
            {ads.length === 0 ? "No ads yet — create your first one!" : "No ads match your filter."}
          </p>
          {ads.length === 0 && (
            <button className="btn btn-primary" onClick={() => navigate("/create")}>Create First Ad</button>
          )}
          {ads.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setFilter("all"); setSearch(""); }}>Clear filters</button>
          )}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <>
          <div style={{ fontSize:"0.78rem", color:"var(--muted2)", marginBottom:14, letterSpacing:"0.06em" }}>
            Showing {filtered.length} of {ads.length} ad{ads.length !== 1 ? "s" : ""}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:18 }}>
            {filtered.map((ad,i) => (
              <div key={ad.id} style={{ animation:`slideUp 0.4s cubic-bezier(0.22,1,0.36,1) ${i*50}ms both` }}>
                <AdCard ad={ad} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
