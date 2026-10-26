# KARA Lab website (www.kursatkara.com)

Instructions for people and AI agents (Claude Code, Codex) editing this repository.

## What this is
- One static page, `index.html`. Plain HTML + inline CSS + a small inline script. No build step, no framework.
- Hosted on Netlify. `netlify.toml` copies `index.html` and `assets/` into `public/`, which Netlify deploys. A new top-level file
  that must be online has to be added to that copy command. `.nojekyll` lets the same files run on GitHub Pages.
- Images live in `assets/`. Keep the repo small: resize photos before committing (sizes below).

## Source of truth
- Facts (titles, counts, grants, awards, courses, publications) come from Kursat Kara's CV repository,
  `kursatkara/cv_kara` (private): `data/*.csv` (positions, grants, awards, teaching, advising, service, talks),
  `data/highlights.yml` (headline metrics), and `pubs/publications.bib`. Pull it before editing; never invent awards,
  numbers, dates, DOIs, or links.
- The public CV PDF is the 2-page short CV from that repo (`build/<date>_Kursat_Kara_Short_CV.pdf`), copied to
  `assets/Kursat_Kara_CV.pdf`. Never publish the full CV: it lists pending and unfunded proposals.
- Do not publish private CV details (citizenship, proposal outcomes, requested amounts, committee-only advising).
- The "By the numbers" tiles carry an "as of" line (`.asof`). Update it whenever a number changes.
- Update "Last updated" in the footer whenever content changes.

## Style
- Keep the design tokens in `:root` and the two dark-mode blocks in sync. Add new colors as tokens, never hard-coded.
- Accent is OSU orange: `--orange-hi` (#ff7300) for fills and rules, `--orange` (darker) for text links so they pass WCAG AA.
- Fonts: Source Serif 4 (headings), IBM Plex Sans (body), IBM Plex Mono (labels, dates, DOIs).
- Do not use official OSU logos or wordmarks; the airfoil mark in the header and `assets/favicon.svg` is the lab's own.
- Keep text short; this is a landing page, not the CV.
- Use precise technical terminology, as in a paper abstract: "dynamic stability of reentry capsules" (not "tumbling"),
  "urban atmospheric boundary layer" or "urban turbulence" (not "gusts in city streets"), "second-mode instability",
  "pitch-damping derivatives". Name the method, the flow, and the quantity; avoid marketing phrasing.
- Keep the bio and research text in the third person for Kursat Kara and "the lab"/"we" for lab work; don't mix them
  within one paragraph.

## Accessibility (WCAG 2.1 AA)
- Every image needs meaningful `alt` text. Keep heading order h1 → h2 → h3.
- Check at phone width (390 px): no horizontal scrolling.

## Common edits (each section in index.html starts with a `<!-- ===== NAME ===== -->` comment)
- **News:** add an `<li>` at the top of the first `.news` list in `#glance`; keep about 8 items.
- **Publication:** copy one `<li>` in `.pubs` to the top. Set `data-t` to one or more of
  `quantum hyper wind control numerics` (these drive the filter chips). Wrap lab-student authors in `<u>…</u>`.
  Link the DOI as `https://doi.org/<doi>`; never invent one.
- **Team member:** copy an `<article class="person">` block. Photo: `assets/team/<first-last>.jpg`, square 200×200 JPEG.
  Use only photos the student provided. High school researchers use initials (`<span class="ini">`) instead of photos.
- **Graduate → alumni:** delete the person's card and add an `<li>` under Alumni with their current position.
- **Research projects:** one `<article class="proj">` panel per funded project in `.projects`, newest first, plus a link
  in the `.pindex` list above it. Each panel: sponsor · role · years (label), a plain-language title (h3), the official
  award title and number (`.award`), a 2–3 sentence summary, then Team and Papers. Figure: `assets/research/<name>.jpg`,
  the whole figure on a white 800×600 canvas (letterbox, don't crop away axes or colorbars), with a credit line in
  `<figcaption>` (authors, venue + DOI link, and license for open-access figures). A project with no public figure yet
  uses the `<div class="dataplate">` variant listing real simulation conditions; replace it when a figure is available.
  Smaller grants (curriculum, state seed funds) go in the "Other support" list below the panels.
- **Publications list** shows the 10 newest by default; "Show all" reveals the rest. Keep it to about 25 selected papers.
- **Other support:** add an `<li>` at the top of `.grants` (role, title + sponsor, years). Only funded awards;
  memberships and computing allocations go in the note under the list.
- **Honors** (in `#outreach`) and **Professional service** are separate lists; an elected member grade is an honor, not service.
- **Old addresses:** `netlify.toml` redirects the old Hugo paths (`/publication/*`, `/author/*`, …) to page sections.
- **Course:** copy an `<article class="course">`; link the course site in the `<h3>` if there is one.
- **Gallery photo:** `assets/gallery/<name>.jpg`, 720×540 JPEG (< 100 KB), add a `<figure>` in `.gallery`. Keep 9 or 12 photos.
- **CV:** overwrite `assets/Kursat_Kara_CV.pdf` (keep the name), then check the numbers in "By the numbers".
- **Headshot:** overwrite `assets/kursat-kara.jpg` with a square JPEG (~480×480).

Resize a photo (Python + Pillow):

    python3 -c "from PIL import Image,ImageOps;im=ImageOps.fit(Image.open('in.jpg').convert('RGB'),(720,540));im.save('out.jpg',quality=80,optimize=True)"

## Flow banner
- The canvas at the top of `#research` is potential flow past a Joukowski airfoil (z = ζ + 1/ζ) with the Kutta condition;
  the slider sets α and the readout shows C_l = 2Γ/(U c). Code is the last block of the inline script.
  `MU` sets thickness/camber. It pauses off screen and draws one still frame under prefers-reduced-motion.
