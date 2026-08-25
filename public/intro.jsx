// intro.jsx — riso-print full-screen opener (3 scenes, matches storyboard; 2.9s)
(function () {
const { useState, useEffect, useRef } = React;
const CUTS = [0, 1.25, 2.1, 2.9]; // BRAND / ABOUT / OUTPUT / end
const Ico = {
  chip: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="6" width="12" height="12"/><rect x="10" y="10" width="4" height="4" fill="#E15A5A" stroke="none"/><path d="M9 6V2M15 6V2M9 22v-4M15 22v-4M6 9H2M6 15H2M22 9h-4M22 15h-4"/></svg>,
  camera: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="13"/><circle cx="12" cy="13.5" r="4"/><path d="M8 7l2-3h4l2 3"/></svg>,
  plane: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15l-8-4.5V4a1 1 0 0 0-2 0v6.5L3 15v2l8-2.2V20l-2 1.5V23l3-1 3 1v-1.5L13 20v-5.2l8 2.2z"/></svg>,
  timeline: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h17"/><path d="M15 8l4 4-4 4"/><circle cx="5" cy="12" r="1.6" fill="currentColor"/></svg>,
  note: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>
};
function Intro({ onDone }) {
  const [t, setT] = useState(0);
  const doneRef = useRef(false);
  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    try { sessionStorage.setItem("mh.introPlayed", "1"); } catch {}
    onDone();
  };
  useEffect(() => {
    const rm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rm) { const id = setTimeout(finish, 400); return () => clearTimeout(id); }
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const s = (now - t0) / 1000;
      if (s >= CUTS[3]) { finish(); return; }
      setT(s);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onKey = (e) => { if (e.key === "Escape") finish(); };
    const onWheel = () => finish();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onWheel, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onKey); window.removeEventListener("wheel", onWheel); window.removeEventListener("touchmove", onWheel); };
  }, []);
  const sc = t < CUTS[1] ? 0 : t < CUTS[2] ? 1 : 2;
  const st = (i) => ({ animationDelay: i + "ms" });
  const rows = [
    { word: "RESEARCH", zh: "研究 · 電腦視覺 · 對抗式 ML", ico: Ico.chip, red: false },
    { word: "TRAVEL", zh: "足跡 · 25 個停靠點", ico: Ico.plane, red: true },
    { word: "MORE OF ME", zh: "跳舞 · 潛水 · 騎馬 · 音樂班", ico: Ico.note, red: false }
  ];
  return (
    <div id="mh-intro" aria-hidden="true" onClick={finish}>
      {sc === 0 && (
        <div className="in-scene in-tex">
          <div className="in-stage">
            <div className="in-avatar-wrap in-pop">
              <svg className="in-avatar-ring" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="#E15A5A" strokeWidth="1.6" strokeDasharray="6 8"/></svg>
              <div className="in-avatar"><img src="uploads/Made with FlexClip AI-2026-08-25T140009.png" alt="" /></div>
            </div>
            {[[Ico.camera, "6vmin", "7vmin", null], [Ico.chip, null, "9vmin", "6vmin"], [Ico.plane, "8vmin", "38vmin", null], [Ico.timeline, null, "36vmin", "7vmin"]].map((c, i) => (
              <span key={i} className="in-scatter in-pop" style={{ left: c[1] || "auto", right: c[3] || "auto", top: c[2], animationDelay: 280 + i * 60 + "ms" }}>{c[0]}</span>
            ))}
            <div className="in-brandname in-slide" style={st(140)}><span className="zhname">黃淯琪</span><span className="enname">Meredith</span></div>
            <div className="in-brandbar in-wipe" style={st(390)}><span className="in-zh">電腦視覺 · 生成式 AI · EDA</span></div>
            <div className="in-label in-brandlabel in-rise" style={st(680)}>FAKE IT UNTIL MAKE IT</div>
          </div>
        </div>
      )}
      {sc === 1 && (
        <div className="in-scene in-tex">
          <div className="in-stage">
            <div className="in-rows">
              {rows.map((r, i) => (
                <div key={i} className="in-row">
                  <div className="in-mega in-slide" style={{ ...st(50 + i * 105), color: r.red ? "#E15A5A" : "#171717" }}>{r.word}</div>
                  <div className="in-zh rzh in-wipe" style={st(165 + i * 105)}>{r.zh}</div>
                  <span className="in-pop" style={st(120 + i * 105)}>{r.ico}</span>
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
      <button className="in-skip" onClick={(e) => { e.stopPropagation(); finish(); }}>SKIP ↵</button>
    </div>
  );
}
window.Intro = Intro;
})();
