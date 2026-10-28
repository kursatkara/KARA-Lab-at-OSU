# KARA Lab website (www.kursatkara.com)

Instructions for people and AI agents (Claude Code, Codex) editing this repository.

## What this is
- One static page, `index.html`. Plain HTML + inline CSS + a small inline script. No build step, no framework.
- Hosted on GitHub Pages from the `main` branch (repository root); every merge to `main` goes live in about a minute.
  `CNAME` holds the custom domain (www.kursatkara.com). `404.html` forwards the old Hugo addresses (`/publication/*`,
  `/author/*`, …) to page sections; add new mappings there. `.nojekyll` makes Pages serve the files as they are. HTTPS is enforced in Settings → Pages.
- `robots.txt` and `sitemap.xml` help search engines; update the `<lastmod>` date in `sitemap.xml` when content changes.
- Images live in `assets/`. Keep the repo small: resize photos before committing (sizes below).
- When you replace an image but keep its file name, bump the `?v=` date on its `src`/`href` in `index.html`
  (e.g. `sketch-hypersonic.jpg?v=20261027`) so browsers that cached the old file load the new one.

## Source of truth
- Facts (titles, counts, grants, awards, courses, publications) come from Kursat Kara's CV repository,
  `kursatkara/cv_kara` (private): `data/*.csv` (positions, grants, awards, teaching, advising, service, talks),
  `data/highlights.yml` (headline metrics), and `pubs/publications.bib`. Pull it before editing; never invent awards,
  numbers, dates, DOIs, or links.
- The public CV PDF is the 2-page short CV from that repo (`build/<date>_Kursat_Kara_Short_CV.pdf`), copied to
  `assets/Kursat_Kara_CV.pdf`. Never publish the full CV: it lists pending and unfunded proposals.
- Do not publish private CV details (citizenship, proposal outcomes, requested amounts, committee-only advising).
- The "Research record" list (`.record`, under the bio in `#glance`) has an HTML comment with the date the counts were
  taken (not shown on the page). Update that date whenever a number changes.
- Update "Last updated" in the footer whenever content changes.

## Style
- Keep the design tokens in `:root` and the two dark-mode blocks in sync. Add new colors as tokens, never hard-coded.
- Palette: white paper (`--bg`), navy ink (`--ink` #12233d) for body text, headings, figures, and strong rules, slate
  (`--muted` #4a5667) for secondary text, and visible hairlines (`--line` #c9d1db). Navy and orange are the lab's colors.
- Section bands: the hero and footer sit on a navy band (`--band`); `.heroband` and `footer` re-map `--ink`, `--muted`,
  and `--line` so their contents adapt. Below the hero, sections alternate white and light gray (`class="alt"`, `--alt`
  #f2f4f7); keep the alternation when adding or moving a section. Sections are separated by color, not rules.
- Dark mode is a near-neutral graphite (`--bg` #141619) with only a faint cool hue; do not make it blue.
- OSU orange is the signature, used sparingly: the 3px stripe on the top bar, the airfoil mark, link underlines, the
  current-position marker, the focus ring, and the "Join the lab" button. Do not color text, labels, dates, or numbers
  orange. `--orange-hi` (#ff7300) is for marks and rules; `--orange` (#b34b00) is the hover text color (passes WCAG AA).
- Containers: research project panels are the only bordered boxes. Rules are for larger entries only (publications,
  Ph.D. and M.Sc. alumni, graduate students, the Research record). Short items (news, honors, service, sponsors, other
  support, undergraduate and high school researchers) are separated by space, not lines. Secondary text is at least 0.86rem.
- No middle dots (·) as separators. Use commas or structure instead: in `.pline`, the sponsor or course number sits on
  the left and role and years on the right; alumni show the graduation year after the name and the position below.
- Fonts: Source Serif 4 (headings, figures in the Research record) and Source Sans 3 (body, labels, dates, DOIs). No monospace
  font; use `font-variant-numeric: tabular-nums` where digits must align. No all-caps letter-spaced labels.
- Corners are nearly square: `--radius` (2px) for panels, cards, buttons, and photos. No pill buttons or circular photos;
  the only circles are the Career path timeline markers.
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
- **News:** add an `<li>` at the top of the `.news` list in `#news` (its own section, below About); keep about 8 items. Frequent updates go on
  LinkedIn (linked under the list); link a news item to its LinkedIn post when there is one.
- **Publication:** copy one `<li>` in `.pubs` to the top. Set `data-t` to one or more of
  `quantum hyper wind control numerics` (these drive the filter chips). Wrap lab-student authors in `<u>…</u>`.
  Link the DOI as `https://doi.org/<doi>`; never invent one.
- **Team member:** copy an `<article class="person">` block. Photo: `assets/team/<first-last>.jpg`, square 200×200 JPEG.
  Use only photos the student provided. High school researchers (minors) use initials (`<span class="ini">`) instead of
  photos and are named by first name and last initial (e.g., "Ceyda K.").
- **Graduate → alumni:** delete the person's card and add an `<li>` under the matching Alumni column (Ph.D., M.Sc., or
  Undergraduate researchers; graduation year in `<span class="when">` after the name) with their current position, plus a
  `<span>Thesis: <a href="…">title</a></span>` line (Dissertation for Ph.D.) linking the thesis in the university repository.
- **Research projects:** one `<article class="proj">` panel per funded project in `.projects`, newest first, plus a link
  in the `.pindex` list above it. Each panel: a `.pline` with the sponsor on the left and "PI, years" on the right, a plain-language title (h3), the official
  award title and number (`.award`), a 2–3 sentence summary, an optional "From the paper" inset (`.pinset`), then Setup
  (if useful), Team, and Papers ("Related papers" for earlier work, "Status" before the first paper). The main image is an illustration, `assets/research/sketch-<name>.jpg` (1200×900), made
  with the three.js scenes in `tools/scenes/` (see its README); describe the scene fully in the `alt` text.
  The inset is a real paper figure on a white 800×600 canvas (letterbox, don't crop away axes or colorbars) with a
  credit: authors, venue + DOI link, and license for open-access figures.
  Smaller grants (curriculum, state seed funds) go in the "Other support" list below the panels.
- **Publication counts** (Research record and the Publications lede): peer-reviewed = published journal articles plus
  peer-reviewed conference papers (AIAA, AMS, IEEE; `keywords` contains `peer-reviewed` in `publications.bib`).
  APS DFD and other abstracts and posters are not peer-reviewed; count them separately.
- **Publications list** shows the 10 newest by default; "Show all" reveals the rest. Keep it to about 25 selected papers.
- **Sponsors and funding:** one `<li>` in `.sponsors` per funding organization (name + programs). Put the official logo in
  `assets/sponsors/<name>.svg` (or a PNG on white, at least 120 px tall; square seals and wide wordmarks both fit). Logos sit
  directly on the page, left-aligned, with no plate or box (dark mode adds a small white backing). Replace the `<span class="smark">` text mark with
  `<img src="assets/sponsors/<name>.svg" alt="<Sponsor> logo">`. Only organizations that funded an award.
- **Other support:** add an `<li>` at the top of `.grants` (role, title + sponsor, years). Only funded awards;
  memberships, computing allocations, and in-kind software licenses (e.g., Volcano ScaLES) go in the
  "Computing and software support" note under the list.
- **Honors and awards** (in `#outreach`) and **Professional service** are separate lists; an elected member grade is an honor, not service.
- **Old addresses:** `404.html` forwards the old Hugo paths (`/publication/*`, `/author/*`, …) to page sections.
- **Course:** copy an `<article class="course">`; link the course site in the `<h3>` if there is one.
- **Gallery photo:** `assets/gallery/<name>.jpg`, 720×540 JPEG (< 100 KB), add a `<figure>` in `.gallery`. Keep 9 or 12 photos.
- **Recruiting flyer:** overwrite `assets/kara-lab-flyer.pdf` (keep the name so printed links and QR codes keep working)
  and regenerate the preview `assets/kara-lab-flyer.jpg` (800×1035 JPEG, < 200 KB) from page 1; set the PDF Title/Author
  metadata, bump the `?v=` dates in the `#join` section, and update the flyer's `<lastmod>` in `sitemap.xml`. The
  "Join the lab" section (`#join`) sits above Contact: flyer on the left, text and buttons on the right. When not
  recruiting, delete the `<a class="flyer">` and the download button, set `.joinlab` to one column, change the lede, and remove the News item that links to the flyer.
  Shareable link: `https://www.kursatkara.com/#join`.
- **CV:** overwrite `assets/Kursat_Kara_CV.pdf` (keep the name), then check the numbers in the Research record.
- **Headshot:** overwrite `assets/kursat-kara.jpg` with a square JPEG (~480×480).
- **Link preview** (LinkedIn, Slack, etc.): `assets/og-card.jpg`, 1200×630, built from `tools/og-card/og-card.html` with
  `node tools/og-card/render.js` (see the comment in that file). Re-render after a title, headshot, or illustration change.

Resize a photo (Python + Pillow):

    python3 -c "from PIL import Image,ImageOps;im=ImageOps.fit(Image.open('in.jpg').convert('RGB'),(720,540));im.save('out.jpg',quality=80,optimize=True)"

## Light and dark themes
- The page follows the visitor's system setting; the round button at the right of the top bar switches themes and stores
  the choice in `localStorage` (`theme`). A one-line script in `<head>` applies it before the first paint.
- Every color is a token in `:root`, repeated in both dark blocks (`@media (prefers-color-scheme: dark)` and
  `:root[data-theme="dark"]`), so the toggle and the system setting give the same colors.
