# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Deploy

Netlify, publish directory `public/`, no build command. `netlify.toml` sets security headers (nosniff, DENY framing, strict-origin referrer). The custom domain is configured in the Netlify dashboard and points at this repo's main branch, so pushing to main is the whole deploy.

## Architecture

The site lives entirely under `public/` with no build step:

- `public/index.html` — the whole site as one self-contained file: inline CSS, inline data, and a Babel-compiled React 18 app loaded from unpkg CDN (react, react-dom, babel-standalone, d3, topojson-client). Sections: home / resume / footprints / more me. To edit content, modify the inline data object in `index.html` directly.
- `public/intro.jsx` + `public/intro.css` — riso-print opening animation, plays once per session. `intro.jsx` references the portrait at `uploads/Made with FlexClip AI-2026-08-25T140009.png`.
- `public/uploads/` — resume PDF (`Resume_Meredith_AI-46b41e2b.pdf`, linked from `index.html`) and the portrait PNG.

All asset references are relative paths, so the site also works from any static host or a local `python3 -m http.server` in `public/`.

## History

The previous site (editorial SPA plus a legacy `/en` `/zh` static site with Netlify Forms contact) was removed on 2026-08-25. Tracked files are in git history before that date; a disk-only copy, including one uncommitted iteration of the old SPA, sits in `__archive/` (gitignored). The new site has no Netlify Forms contact form.
