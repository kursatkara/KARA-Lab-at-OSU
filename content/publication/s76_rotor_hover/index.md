---
title: 'Hover Predictions Using a High-Order Discontinuous Galerkin Off-Body Discretization'

# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - admin
  - Andrew C. Kirby
  - Dimitri J. Mavriplis

# Author notes (optional)
#author_notes:
#  - 'Equal contribution'
#  - 'Equal contribution'

date: '2020-01-05T00:00:00Z'
doi: '10.2514/6.2020-0771'

# Schedule page publish date (NOT publication's date).
publishDate: '2020-01-05T00:00:00Z'

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ['1']

# Publication name and optional abbreviated publication name.
publication: AIAA Scitech 2020 Forum
#publication_short: In *ICW*

abstract: The hover performance of a four-bladed Sikorsky S-76 rotor is studied using a high-order discontinuous Galerkin (DG) off-body discretization. Time accurate Navier-Stokes calculations are performed using the WAKE3D code, which combines solution technologies in a multi-mesh, multi-solver paradigm through a dynamic overset framework that employs an unstructured mesh Navier-Stokes method as a near-body solver and a high-order adaptive discontinuous Galerkin discretization as an off-body solver. The rotor with a swept-tapered tip is simulated. The tip Mach number was 0.65, and the Reynolds number based on the reference chord is 1.2 million. A constant coning angle of 3.5-degrees is applied. The effect of time step size and sub-iterations on the integrated parameters is investigated and convergence results are presented. The effect of the maximum order of accuracy of the adaptive h-p discretization in the off-body solver on solution accuracy and efficiency is also investigated. Thrust coefficient, torque coefficient, and figure of merit are calculated and compared with available data in the literature, and good agreement is found. In general, higher-order off-body simulations are found to result in a better accuracy/cost metric.

# Summary. An optional shortened abstract.
summary: The hover performance of a four-bladed Sikorsky S-76 rotor is studied using a high-order discontinuous Galerkin (DG) off-body discretization.

tags: ["Sikorsky", "S-76", "Rotor", "Hover", "High-Order", "Discontinuous", "Galerkin", "Multi-solver", "Multi-mesh", "Navier-Stokes", "WAKE3D", "Dynamic", "Overset", "Near-body", "off-body", "swept-tapered", "adaptive", "h-p discretization"]

# Display this page in the Featured widget?
featured: true

# Custom links (uncomment lines below)
# links:
# - name: Custom Link
#   url: https://scholar.google.com/citations?view_op=view_citation&hl=en&user=RXSWKeMAAAAJ&citation_for_view=RXSWKeMAAAAJ:qjMakFHDy7sC

# ###url_pdf: 'https://ntrs.nasa.gov/api/citations/20110023840/downloads/20110023840.pdf'
url_pdf: ''
url_code: ''
url_dataset: ''
url_poster: ''
url_project: ''
url_slides: ''
url_source: ''
url_video: s76_rotor_hover.mp4

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
image:
#  caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/pLCdAaMFLTE)'
  filename: featured.jpg
  focal_point: Smart
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects:
  - Rotor_in_Hover

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
#slides: example
---
