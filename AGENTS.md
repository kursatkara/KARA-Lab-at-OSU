# KARA Lab website (www.kursatkara.com)

Instructions for people and AI agents (Claude Code, Codex) editing this repository.

## What this is
- One static page, `index.html`. Plain HTML + inline CSS + a small inline script. No build step, no framework.
- Hosted on Netlify (`netlify.toml`: publish `.`, no build command). `.nojekyll` also lets it run on GitHub Pages unchanged.
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
- **Research area:** copy an `<article class="area">`; image `assets/research/<name>.jpg`, 800×600 JPEG (< 100 KB).
  Put the whole figure on a white 800×600 canvas (letterbox, don't crop): axis labels and panel captions must stay visible.
  `blunt-body.jpg` is a schematic drawn with matplotlib, not data; replace it with a real result figure when one is public.
- **Publications list** shows the 10 newest by default; "Show all" reveals the rest. Keep it to about 25 selected papers.
- **Grant:** add an `<li>` at the top of `.grants` (role, title + sponsor + award number, years).
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
