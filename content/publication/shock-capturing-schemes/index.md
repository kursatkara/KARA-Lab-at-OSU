---
title: 'Numerical assessments of high-order accurate shock capturing schemes: Kelvin–Helmholtz type vortical structures in high-resolutions'

# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - Omer San
  - admin

# Author notes (optional)

date: '2014-01-20T00:00:00Z'
doi: '10.1016/j.compfluid.2013.11.006'

# Schedule page publish date (NOT publication's date).
publishDate: '2014-01-20T00:00:00Z'

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ['2']

# Publication name and optional abbreviated publication name.
publication: Computers & Fluids
#publication_short: In *ICW*

abstract: This paper investigates the performance of extensions of the state-of-the-art high-resolution shock-capturing schemes by solving hyperbolic conservation laws in gas dynamics. Such numerical methods used to integrate compressible flow simulations should provide accurate solutions for these flows' long-time integrations. To this end, several joint solvers are developed within the framework of the reconstruction and flux-splitting approaches using the underlying MUSCL and WENO frameworks. The numerical assessments include testing and evaluation of various interpolation procedures, flux-limiters, Riemann solvers, flux-splitting schemes, and their formal order of accuracy. For temporal integration, a three-stage optimal TVD Runge–Kutta time stepping is employed. The modular development of these joint solvers provides ease in characterizing the solution procedures. The performances of these high-resolution solvers are compared for several carefully selected two-dimensional Riemann problems, including shock and rarefaction waves and joint discontinuities. Based on solutions obtained by all five-point stencil schemes, we demonstrate that the reconstruction-based WENO scheme with the Roe solver is more accurate than all the versions of the flux-splitting WENO solvers tested in this study. We also show that results are highly dependent on the choice of the flux limiter. It is shown that the Euler equations discretized by the fifth-order WENO scheme produce solutions that convect vorticity and create small-scale vortical flow structures, which are usually associated with the high Reynolds number viscous flows. Surprisingly, it is found that these Kelvin–Helmholtz instability-like vortical structures are not captured in any form of the third-order five-point stencil schemes.

# Summary. An optional shortened abstract.
summary: WENO schemes with Roe solver are more accurate than all other methods tested. High-order numerical techniques are required to capture small-scale vortical flow structures.

tags: ["Euler Equations", "Compressible", "Flow", "Shock Capturing", "Hyperbolic", "Conservation Laws", "WENO", "MUSCL", "TVD", "Runge–Kutta", "flux-limiters", "Riemann solvers", "flux-splitting", "Kelvin–Helmholtz", "Instability"]

# Display this page in the Featured widget?
featured: true

# Custom links (uncomment lines below)
# links:
# - name: Custom Link

url_pdf: ''
url_code: ''
url_dataset: ''
url_poster: ''
url_project: ''
url_slides: ''
url_source: ''
url_video: ''

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
image:
#  caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/pLCdAaMFLTE)'
  filename: ''
  focal_point: Smart
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects:
  - Shock Waves
  - Kelvin–Helmholtz

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
#slides: example
---
