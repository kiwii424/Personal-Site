// intro.jsx — riso-print full-screen opener (hard cuts, 4.2s)
(function () {
const { useState, useEffect, useRef } = React;
const CUTS = [0, 1.6, 2.15, 2.7, 3.45, 4.2]; // BRAND / RESEARCH / TRAVEL / MORE / OUTPUT / end
const Ico = {
  chip: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="6" width="12" height="12"/><rect x="10" y="10" width="4" height="4" fill="#E15A5A" stroke="none"/><path d="M9 6V2M15 6V2M9 22v-4M15 22v-4M6 9H2M6 15H2M22 9h-4M22 15h-4"/></svg>,
  camera: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="13"/><circle cx="12" cy="13.5" r="4"/><path d="M8 7l2-3h4l2 3"/></svg>,
  plane: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15l-8-4.5V4a1 1 0 0 0-2 0v6.5L3 15v2l8-2.2V20l-2 1.5V23l3-1 3 1v-1.5L13 20v-5.2l8 2.2z"/></svg>,
  play: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M10 8.5L16 12l-6 3.5z" fill="#E15A5A" stroke="none"/></svg>,
  timeline: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="in-draw"><path d="M2 12h17"/><path d="M15 8l4 4-4 4"/><circle cx="5" cy="12" r="1.6" fill="currentColor"/></svg>,
  halftone: <svg viewBox="0 0 24 24" fill="currentColor">{[0,1,2,3].map(r=>[0,1,2,3].map(c=><circle key={r+"-"+c} cx={4+c*5.4} cy={4+r*5.4} r={1.9-(r+c)*0.18}/>))}</svg>,
  note: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>,
  wave: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 8c3 0 3 2.5 6 2.5S11 8 14 8s3 2.5 6 2.5"/><path d="M2 15c3 0 3 2.5 6 2.5s3-2.5 6-2.5 3 2.5 6 2.5"/></svg>,
  horse: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20l2-7 3-4 5-4 2-3 4 4-3 3v4l2 7"/><path d="M9 9l-4 2"/></svg>
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
      if (s >= CUTS[5]) { finish(); return; }
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
  const sc = t < CUTS[1] ? 0 : t < CUTS[2] ? 1 : t < CUTS[3] ? 2 : t < CUTS[4] ? 3 : 4;
  const st = (i) => ({ animationDelay: i + "ms" });
  return (
    <div id="mh-intro" aria-hidden="true" onClick={finish}>
      {sc === 0 && (
        <div className="in-scene in-tex">
          <div className="in-avatar-wrap in-pop">
            <svg className="in-avatar-ring" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="#E15A5A" strokeWidth="1.6" strokeDasharray="6 8"/></svg>
            <div className="in-avatar"><img src="uploads/Made with FlexClip AI-2026-08-25T140009.png" alt="" /></div>
          </div>
          {[[Ico.camera, "7vmin", "9vmin"], [Ico.chip, "auto", "11vmin", "7vmin"], [Ico.plane, "9vmin", "42vmin"], [Ico.timeline, "auto", "40vmin", "8vmin"]].map((c, i) => (
            <span key={i} className="in-scatter in-pop" style={{ left: c[1] === "auto" ? "auto" : c[1], right: c[3] || "auto", top: c[2], animationDelay: 380 + i * 80 + "ms" }}>{c[0]}</span>
          ))}
          <div className="in-mega in-brandname in-slide" style={st(180)}>Meredith<small>Huang</small></div>
          <div className="in-brandbar in-wipe" style={st(520)}><span className="in-zh">電腦視覺 · 生成式 AI · EDA</span></div>
          <div className="in-label in-brandlabel in-rise" style={st(900)}>FAKE IT UNTIL MAKE IT</div>
        </div>
      )}
      {sc === 1 && (
        <div className="in-scene in-tex">
          <div className="in-bannerbar in-banner"></div>
          <div className="in-mega in-key in-slide" style={st(60)}>RESEARCH</div>
          <div className="in-key-icon in-pop" style={{ ...st(180), color: "#171717" }}>{Ico.chip}</div>
          <div className="in-zh in-key-label in-wipe" style={st(280)}>研究 · 電腦視覺 · 對抗式 ML</div>
        </div>
      )}
      {sc === 2 && (
        <div className="in-scene in-tex">
          <div className="in-mega in-vert in-slide" style={st(40)}>TRAVEL</div>
          <div className="in-card in-pop" style={st(120)}>
            {[82, 64, 74, 46].map((w, i) => (
              <div key={i} className="in-cardline in-wipe" style={{ width: w + "%", animationDelay: 220 + i * 70 + "ms" }}></div>
            ))}
            <span className="in-pop" style={{ ...st(430), position: "absolute", right: "4vmin", bottom: "4vmin", color: "#171717", width: "9vmin", display: "block" }}>{Ico.plane}</span>
          </div>
          <div className="in-zh in-key-label in-wipe" style={st(320)}>足跡 · 25 個停靠點</div>
        </div>
      )}
      {sc === 3 && (
        <div className="in-scene in-tex in-dark">
          <div className="in-mega in-stack">
            <div className="in-slide" style={st(40)}>MORE</div>
            <div className="in-slide red" style={st(140)}>OF ME</div>
          </div>
          <div className="in-longarrow" style={{ ...st(260), animation: "inArrow 320ms ease-out 260ms both" }}></div>
          <div className="in-boxes">
            {[Ico.note, Ico.wave, Ico.horse, Ico.camera].map((ic, i) => (
              <span key={i} className="bx in-pop" style={st(380 + i * 90)}>{ic}</span>
            ))}
          </div>
          <div className="in-zh in-key-label in-wipe" style={{ ...st(600), bottom: "6vmin" }}>跳舞 · 潛水 · 騎馬 · 音樂班</div>
        </div>
      )}
      {sc === 4 && (
        <div className="in-scene in-tex in-coral">
          <div className="in-ghost" style={{ animation: "inGhost 300ms ease-out both" }}>26</div>
          <div className="in-mega in-out-mega in-slide" style={st(40)}>HEYYYY!</div>
          <div className="in-out-arrow" style={{ animation: "inArrow 360ms cubic-bezier(.22,1,.36,1) 200ms both" }}></div>
          <div className="in-out-word in-wipe" style={st(430)}>WELCOME</div>
        </div>
      )}
      <button className={"in-skip" + (sc === 3 ? " lite" : "")} onClick={(e) => { e.stopPropagation(); finish(); }}>SKIP ↵</button>
    </div>
  );
}
window.Intro = Intro;
})();
