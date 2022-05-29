---
title: 'Solving Burgers’ equation with quantum computing'

# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - Furkan Oz
  - Rohit Vuppala
  - admin
  - Frank Gaitan
  
# Author notes (optional)

date: '2021-12-31T00:00:00Z'
doi: '10.1007/s11128-021-03391-8'

# Schedule page publish date (NOT publication's date).
publishDate: '2021-12-31T00:00:00Z'

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ['2']

# Publication name and optional abbreviated publication name.
publication: Quantum Information Processing
#publication_short: In *Quantum Inf Process*

abstract: "Computational fluid dynamics (CFD) simulations are a vital part of the design process in the aerospace industry. Although reliable CFD results can be obtained with turbulence models, direct numerical simulation of complex bodies in three spatial dimensions (3D) is impracticable due to the massive amount of computational elements. For instance, a 3D direct numerical simulation of a turbulent boundary-layer over the wing of a commercial jetliner that resolves all relevant length scales using a serial CFD solver on a modern digital computer would take approximately 750 million years or roughly 20% of the earth’s age. Over the past 25 years, quantum computers have become the object of great interest worldwide as powerful quantum algorithms have been constructed for several important, computationally challenging problems that provide enormous speed-up over the best-known classical algorithms. In this paper, we adapt a recently introduced quantum algorithm for partial differential equations to Burgers’ equation and develop a quantum CFD solver that determines its solutions. We used our quantum CFD solver to verify the quantum Burgers’ equation algorithm to find the flow solution when a shockwave is and is not present. The quantum simulation results were compared to: (i) an exact analytical solution for a flow without a shockwave; and (ii) the results of a classical CFD solver for flows with and without a shockwave. Excellent agreement was found in both cases, and the error of the quantum CFD solver was comparable to that of the classical CFD solver."

# Summary. An optional shortened abstract.
summary: This paper adopts a recently introduced quantum algorithm for partial differential equations to solve Burgers’ equation and develops a quantum CFD solver. We used our quantum CFD solver to verify the quantum Burgers’ equation algorithm to find the flow solution when a shockwave is and is not present. We found excellent agreements for both cases, and the error of the quantum CFD solver was comparable to that of the classical CFD solver.

tags: ["Quantum", "Computing", "Computational", "Fluid", "Dynamics", "Navier-Stokes", "Burger", "Equation", "partial", "differential", "equation", "ODE", "PDE", "QCFD", "CCFD", "CFD"]

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
  - Quantum_Computing_Fluid_Dynamics

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
#slides: example
---
