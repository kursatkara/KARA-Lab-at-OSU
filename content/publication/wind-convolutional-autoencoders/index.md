---
title: 'Realistic Wind Data Generation for Small Unmanned Air Systems in Urban Environment using Convolutional Autoencoders'

# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - Rohit Vuppala
  - admin
  
# Author notes (optional)

date: '2021-11-23T00:00:00Z'
doi: ''

# Schedule page publish date (NOT publication's date).
publishDate: '2021-11-23T00:00:00Z'

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ['2']

# Publication name and optional abbreviated publication name.
publication: 74th APS DFD 
#publication_short: In *ICW*

abstract: This study presents preliminary work on using a data-driven non-linear surrogate model based on deep learning to generate realistic wind data for urban environments efficiently. We attempt to create accurate wind data for an urban environment using high-fidelity CFD data from Large Eddy Simulations (LES) and Convolutional Auto-Encoders (CAE) for non-linear surrogate modeling. The non-linear surrogate model extracts underlying non-linear modes from the high-resolution data snapshots, and the LSTM network trains on these specific modes. Modal predictions for future time steps are then obtained using the trained LSTM network similar to time-series prediction, without computationally expensive CFD simulations. We can decode these modes back to the physical space to get the relevant wind field data predictions. Since no prior information about the underlying governing equations is utilized for the projections, the method is entirely non-intrusive. One can easily extend it for other applications with minimal changes. 

# Summary. An optional shortened abstract.
summary: We attempt to create accurate wind data for an urban environment using high-fidelity CFD data from Large Eddy Simulations (LES) and Convolutional Auto-Encoders (CAE) for non-linear surrogate modeling. The non-linear surrogate model extracts underlying non-linear modes from the high-resolution data snapshots, and the LSTM network trains on these specific modes. 

tags: ["Large-Eddy Simulation", "Unmanned Aircraft Systems", "UAS", "Gust", "Turbulence", "Urban Environment", "Machine Learning", "ROM", "LSTM", "NSF", "Award Number 1925147"]

# Display this page in the Featured widget?
featured: true

# Custom links (uncomment lines below)
# links:
# - name: Custom Link

url_pdf: 'https://meetings.aps.org/Meeting/DFD21/Session/T29.5'
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
