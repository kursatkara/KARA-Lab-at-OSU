---
title: 'Variance Reduction of Quadcopter Trajectory Tracking in Turbulent Wind'

# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - AsmaTabassum
  - Rohit Vuppala
  - He Bai
  - admin
  
# Author notes (optional)

date: '2021-12-15T00:00:00Z'
doi: '10.1016/j.ifacol.2021.11.160'

# Schedule page publish date (NOT publication's date).
publishDate: '2021-12-15T00:00:00Z'

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ['2	']

# Publication name and optional abbreviated publication name.
publication: IFAC-PapersOnLine 
#publication_short: In *ICW*

abstract: We consider a quadcopter operating in a turbulent windy environment. The turbulent flow environment may be imposed on a quadcopter by structures, landscapes, terrains, and most importantly, by the unique physical phenomena in the lower atmosphere. Turbulence can negatively impact a quadcopter’s performance and operations. Modeling turbulence as a stochastic random input, we investigate control designs that can reduce the turbulence effects on the quadcopter’s motion. In particular, we design a minimum cost variance (MCV) controller aiming to minimize the cost in terms of its weighted sum of mean and variance. We linearize the quadcopter dynamics and examine the MCV controller derived from a set of coupled algebraic Riccati equations (CARE) with full-state feedback. Our preliminary simulation results show a reduction in variance and mean trajectory tracking error compared to a traditional linear quadratic regulator (LQR).

# Summary. An optional shortened abstract.
summary: Modeling turbulence as a stochastic random input, we investigate control designs that can reduce the turbulence effects on the quadcopter’s motion. Our preliminary simulation results show a reduction in variance and mean trajectory tracking error compared to a traditional linear quadratic regulator (LQR).

tags: ["Large-Eddy Simulation", "Unmanned Aircraft Systems", "UAS", "Gust", "Turbulence", "Urban Environment", "Machine Learning", "ROM", "LSTM", "NSF", "Award Number 1925147"]

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
  - NSF_NRI_INT_Safe_Wind-Aware_Navigation

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
#slides: example
---
