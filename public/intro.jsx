// intro.jsx — riso-print full-screen opener (3 scenes, click to advance)
(function () {
const { useState, useEffect, useRef } = React;
const Ico = {
  chip: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="6" width="12" height="12"/><rect x="10" y="10" width="4" height="4" fill="#E15A5A" stroke="none"/><path d="M9 6V2M15 6V2M9 22v-4M15 22v-4M6 9H2M6 15H2M22 9h-4M22 15h-4"/></svg>,
  camera: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="13"/><circle cx="12" cy="13.5" r="4"/><path d="M8 7l2-3h4l2 3"/></svg>,
  plane: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15l-8-4.5V4a1 1 0 0 0-2 0v6.5L3 15v2l8-2.2V20l-2 1.5V23l3-1 3 1v-1.5L13 20v-5.2l8 2.2z"/></svg>,
  timeline: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h17"/><path d="M15 8l4 4-4 4"/><circle cx="5" cy="12" r="1.6" fill="currentColor"/></svg>,
  note: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>
};
// language and theme follow the visitor's system settings, same as the app
function introLang() {
  return (navigator.language || "en").toLowerCase().startsWith("zh") ? "zh" : "en";
}
function introTheme() {
  return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
}
function Intro({ onDone }) {
  const [sc, setSc] = useState(0);
  const doneRef = useRef(false);
  const lastStep = useRef(0);
  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    try { sessionStorage.setItem("mh.introPlayed", "1"); } catch {}
    onDone();
  };
  const advance = () => {
    const now = performance.now();
    if (now - lastStep.current < 350) return;
    lastStep.current = now;
    setSc(s => { if (s >= 2) { finish(); return s; } return s + 1; });
  };
  useEffect(() => {
    const rm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rm) { const id = setTimeout(finish, 400); return () => clearTimeout(id); }
    const onKey = (e) => {
      if (e.key === "Escape") finish();
      else if (["Enter", " ", "ArrowRight", "ArrowDown"].includes(e.key)) advance();
    };
    const onWheel = () => advance();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onWheel, { passive: true });
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("wheel", onWheel); window.removeEventListener("touchmove", onWheel); };
  }, []);
  const st = (i) => ({ animationDelay: i + "ms" });
  const lang = introLang();
  const zh = lang === "zh";
  const dark = introTheme() === "dark";
  const ink = dark ? "#F2EEE4" : "#171717";
  const D = window.SITE_DATA || {};
  const tripCount = (D.trips || []).length;
  const moreList = (D.others || []).map(o => (o.title && o.title[lang]) || "").filter(Boolean).join(" · ");
  const name = zh ? ["黃淯琪", "Meredith"] : ["Meredith", "Huang"];
  const brandbar = zh ? "電腦視覺 · 生成式 AI · EDA" : "Computer Vision · Generative AI · EDA";
  const rows = [
    { word: "RESEARCH", sub: zh ? "研究 · 電腦視覺 · 對抗式 ML" : "Computer Vision · Adversarial ML", ico: Ico.chip, red: false },
    { word: "TRAVEL", sub: zh ? `足跡 · ${tripCount} 個停靠點` : `Footprints · ${tripCount} stops`, ico: Ico.plane, red: true },
    { word: "MORE OF ME", sub: moreList, ico: Ico.note, red: false }
  ];
  return (
    <div id="mh-intro" className={dark ? "in-dark" : ""} aria-hidden="true" onClick={advance}>
      {sc === 0 && (
        <div className="in-scene in-tex">
          <div className="in-stage">
            <div className="in-avatar-wrap in-pop">
              <svg className="in-avatar-ring" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="#E15A5A" strokeWidth="1.6" strokeDasharray="6 8"/></svg>
              <div className="in-avatar"><img src="uploads/Made with FlexClip AI-2026-08-25T140009.png" alt="" /></div>
            </div>
            {[[Ico.camera, "6vmin", "7vmin", null], [Ico.chip, null, "9vmin", "6vmin"], [Ico.plane, "8vmin", "38vmin", null], [Ico.timeline, null, "36vmin", "7vmin"]].map((c, i) => (
              <span key={i} className="in-scatter in-pop" style={{ left: c[1] || "auto", right: c[3] || "auto", top: c[2], animationDelay: 380 + i * 80 + "ms" }}>{c[0]}</span>
            ))}
            <div className="in-brandname in-slide" style={st(180)}><span className="zhname">{name[0]}</span><span className="enname">{name[1]}</span></div>
            <div className="in-brandbar in-wipe" style={st(520)}><span className="in-zh">{brandbar}</span></div>
            <div className="in-label in-brandlabel in-rise" style={st(900)}>FAKE IT UNTIL MAKE IT</div>
          </div>
        </div>
      )}
      {sc === 1 && (
        <div className="in-scene in-tex">
          <div className="in-stage">
            <div className="in-rows">
              {rows.map((r, i) => (
                <div key={i} className="in-row">
                  <div className="in-mega in-slide" style={{ ...st(60 + i * 140), color: r.red ? "#E15A5A" : ink }}>{r.word}</div>
                  <div className="in-zh rzh in-wipe" style={{ ...st(220 + i * 140), ...(r.sub.length > 34 ? { fontSize: "2.6vmin", whiteSpace: "normal", lineHeight: 1.5, maxWidth: "76vmin" } : {}) }}>{r.sub}</div>
                  <span className="in-pop" style={st(160 + i * 140)}>{r.ico}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {sc === 2 && (
        <div className="in-scene in-tex in-coral">
          <div className="in-stage">
            <div className="in-ghost" style={{ animation: "inGhost 300ms ease-out both" }}>26</div>
            <div className="in-mega in-out-mega in-slide" style={st(30)}>HEYYYY!</div>
            <div className="in-out-arrow" style={{ animation: "inArrow 360ms cubic-bezier(.22,1,.36,1) 150ms both" }}></div>
            <div className="in-out-word in-wipe" style={st(320)}>WELCOME</div>
          </div>
        </div>
      )}
      <div className="in-tap">{zh ? "點一下繼續" : "TAP TO CONTINUE"} · {sc + 1}/3</div>
      <button className="in-skip" onClick={(e) => { e.stopPropagation(); finish(); }}>SKIP ↵</button>
    </div>
  );
}
window.Intro = Intro;
})();
