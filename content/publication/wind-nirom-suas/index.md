---
title: 'A non-intrusive reduced order model using deep learning for realistic wind data generation for small unmanned aerial systems in urban spaces'

# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - Rohit Vuppala
  - admin
  
# Author notes (optional)

date: '2021-08-19T00:00:00Z'
doi: '10.1063/5.0098835'

# Schedule page publish date (NOT publication's date).
publishDate: '2021-08-19T00:00:00Z'

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ['2']

# Publication name and optional abbreviated publication name.
publication: AIP Advances
#publication_short: In *ICW*

abstract: "Realistic wind data are essential in developing, testing, and ensuring the safety of small unmanned aerial systems in operation. We present a non-intrusive reduced order modeling (NIROM) approach to replicate realistic wind data and predict wind fields. The method uses a LES model to generate high-fidelity data. To create a reduced-order model, we use proper orthogonal decomposition to extract modes from the three-dimensional space and use specialized recurrent neural networks and long short-term memory to step in time. This paper combines the traditional approach of using computational fluid dynamic simulations to generate wind data with deep learning and reduced-order modeling techniques to devise a methodology for a non-intrusive data-based model for wind field prediction. A model of an urban subspace with a building setup in neutral atmospheric conditions is tested to demonstrate the method."

# Summary. An optional shortened abstract.
summary: "Realistic wind data are essential in developing, testing, and ensuring the safety of small unmanned aerial systems in operation. We present a non-intrusive reduced order modeling (NIROM) approach to replicate realistic wind data and predict wind fields."

tags: ["Large-Eddy Simulation", "Unmanned Aircraft Systems", "UAS", "Gust", "Turbulence", "Urban Environment", "Machine Learning", "ROM", "NIROM", "LSTM", "NSF", "Award Number 1925147"]

# Display this page in the Featured widget?
featured: true

# Custom links (uncomment lines below)
# links:
# - name: Custom Link

url_pdf: 'https://aip.scitation.org/doi/pdf/10.1063/5.0098835'
url_code: 'https://github.com/rohitvuppala/POD-LSTM_BLDG'
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
