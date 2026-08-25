# Personal-Site

Single-page personal site (React 18 via Babel standalone, no build step).

Files, all under `public/`:
- `index.html` — the whole site (home / resume / footprints / more me), data inlined
- `intro.jsx`, `intro.css` — riso-print opening animation (plays once per session)
- `uploads/` — resume PDF and portrait illustration

Edit content directly in `public/index.html` (inline data object). There is no JSON data source and no build command.

Deploy on Netlify
- Publish directory: public
- Build command: (empty)
