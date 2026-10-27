# KARA Lab website (www.kursatkara.com)

Instructions for people and AI agents (Claude Code, Codex) editing this repository.

## What this is
- One static page, `index.html`. Plain HTML + inline CSS + a small inline script. No build step, no framework.
- Hosted on Netlify. `netlify.toml` copies `index.html` and `assets/` into `public/`, which Netlify deploys (`tools/` is not deployed). A new top-level file
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
- **News:** add an `<li>` at the top of the first `.news` list in `#glance`; keep about 8 items. Frequent updates go on
  LinkedIn (linked under the list); link a news item to its LinkedIn post when there is one.
- **Publication:** copy one `<li>` in `.pubs` to the top. Set `data-t` to one or more of
  `quantum hyper wind control numerics` (these drive the filter chips). Wrap lab-student authors in `<u>…</u>`.
  Link the DOI as `https://doi.org/<doi>`; never invent one.
- **Team member:** copy an `<article class="person">` block. Photo: `assets/team/<first-last>.jpg`, square 200×200 JPEG.
  Use only photos the student provided. High school researchers use initials (`<span class="ini">`) instead of photos.
- **Graduate → alumni:** delete the person's card and add an `<li>` under Alumni with their current position.
- **Research projects:** one `<article class="proj">` panel per funded project in `.projects`, newest first, plus a link
  in the `.pindex` list above it. Each panel: sponsor · role · years (label), a plain-language title (h3), the official
  award title and number (`.award`), a 2–3 sentence summary, an optional "From the paper" inset (`.pinset`), then Setup
  (if useful), Team, and Papers. The main image is an illustration, `assets/research/sketch-<name>.jpg` (1200×900), made
  with the three.js scenes in `tools/scenes/` (see its README); describe the scene fully in the `alt` text.
  The inset is a real paper figure on a white 800×600 canvas (letterbox, don't crop away axes or colorbars) with a
  credit: authors, venue + DOI link, and license for open-access figures.
  Smaller grants (curriculum, state seed funds) go in the "Other support" list below the panels.
- **Publication counts** (By the numbers and the Publications lede): peer-reviewed = published journal articles plus
  peer-reviewed conference papers (AIAA, AMS, IEEE; `keywords` contains `peer-reviewed` in `publications.bib`).
  APS DFD and other abstracts and posters are not peer-reviewed; count them separately.
- **Publications list** shows the 10 newest by default; "Show all" reveals the rest. Keep it to about 25 selected papers.
- **Sponsors and funding:** one `<li>` in `.sponsors` per funding organization (name + programs). Put the official logo in
  `assets/sponsors/<name>.svg` (or a PNG at least 120 px tall; square seals and wide wordmarks both fit) and replace the `<span class="smark">` text mark with
  `<img src="assets/sponsors/<name>.svg" alt="<Sponsor> logo">`. Only organizations that funded an award.
- **Other support:** add an `<li>` at the top of `.grants` (role, title + sponsor, years). Only funded awards;
  memberships, computing allocations, and in-kind software licenses (e.g., Volcano ScaLES) go in the
  "Computing and software support" note under the list.
- **Honors and awards** (in `#outreach`) and **Professional service** are separate lists; an elected member grade is an honor, not service.
- **Old addresses:** `netlify.toml` redirects the old Hugo paths (`/publication/*`, `/author/*`, …) to page sections.
- **Course:** copy an `<article class="course">`; link the course site in the `<h3>` if there is one.
- **Gallery photo:** `assets/gallery/<name>.jpg`, 720×540 JPEG (< 100 KB), add a `<figure>` in `.gallery`. Keep 9 or 12 photos.
- **CV:** overwrite `assets/Kursat_Kara_CV.pdf` (keep the name), then check the numbers in "By the numbers".
- **Headshot:** overwrite `assets/kursat-kara.jpg` with a square JPEG (~480×480).

Resize a photo (Python + Pillow):

    python3 -c "from PIL import Image,ImageOps;im=ImageOps.fit(Image.open('in.jpg').convert('RGB'),(720,540));im.save('out.jpg',quality=80,optimize=True)"

## Light and dark themes
- The page follows the visitor's system setting; the round button at the right of the top bar switches themes and stores
  the choice in `localStorage` (`theme`). A one-line script in `<head>` applies it before the first paint.
- Every color is a token in `:root`, repeated in both dark blocks (`@media (prefers-color-scheme: dark)` and
  `:root[data-theme="dark"]`), so the toggle and the system setting give the same colors.
