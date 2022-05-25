---
title: 'Evaluation of Riemann flux solvers for WENO reconstruction schemes: Kelvin-Helmholtz instability'

# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - Omer San
  - admin

# Author notes (optional)

date: '2015-05-14T00:00:00Z'
doi: '10.1016/j.compfluid.2015.04.026'

# Schedule page publish date (NOT publication's date).
publishDate: '2015-05-14T00:00:00Z'

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ['2']

# Publication name and optional abbreviated publication name.
publication: Computers & Fluids
#publication_short: In *ICW*

abstract: Accurate and computationally efficient simulations of Euler equations are of paramount importance in both fundamental research and engineering applications. In this study, our main objective is to investigate the efficacy and accuracy of several Riemann solvers for high-order accurate weighted essentially non-oscillatory (WENO) reconstruction scheme as a state-of-the-art tool to study shear driven turbulence flows. The Kelvin–Helmholtz instability occurs when a perturbation is introduced to a continuous fluid system with a velocity shear, or where there is a velocity difference across the interface between two fluids. Here, we solve a stratified Kelvin–Helmholtz instability problem to demonstrate the performance of six different Riemann solvers’ ability to evolve a linear perturbation into a transition to nonlinear hydrodynamic two-dimensional turbulence. A single mode perturbation is used for our evaluations. Time evolution process shows that the vortices formed from the turbulence slowly merge together since both energy and enstrophy are simultaneously conserved in two-dimensional turbulence. Third-, fifth- and seventh-order WENO reconstruction schemes are investigated along with the Roe, Rusanov, HLL, FORCE, AUSM, and Marquina Riemann flux solvers at the cell interfaces resulting in 18 joint flow solvers. Based on the numerical assessments of these solvers on various grid resolutions, it is found that the dissipative character of the Riemann solver has significant effect on eddy resolving properties and turbulence statistics. We further show that the order of the reconstruction scheme becomes increasingly important for coarsening the mesh. We illustrate that higher-order schemes become more effective in terms of the tradeoff between the accuracy and efficiency. We also demonstrate that AUSM solver provides the least amount of numerical dissipation, yet resulting in a pile-up phenomenon in energy spectra for underresolved simulations. However, results obtained by the Roe solver agree well with the theoretical energy spectrum scaling providing a marginal dissipation without showing any pile-up at a cost of around 30% increase in computational time.

# Summary. An optional shortened abstract.
summary: The Kelvin–Helmholtz instability is solved to study shear-driven turbulent flows. Efficacy and accuracy of several Riemann solvers for WENO schemes are investigated. Eddy resolving properties and turbulence statistics are studied.

tags: ["Euler Equations", "WENO", "Roe", "Rusanov", "HLL", "FORCE", "AUSM", "Marquina", "Riemann", "Flux", "Solver", "Kelvin-Helmholtz", "Instability", "Shear-Driven", "Turbulent", "Flow"]

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
  - Stability
  - Kelvin–Helmholtz

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
#slides: example
---
