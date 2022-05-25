---
title: 'A Novel Approach in Realistic Wind Data Generation for The Safe Operation of Small Unmanned Aerial Systems in Urban Environment'

# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - Rohit Vuppala
  - admin
  
# Author notes (optional)

date: '2021-07-28T00:00:00Z'
doi: '10.2514/6.2021-2505'

# Schedule page publish date (NOT publication's date).
publishDate: '2021-07-28T00:00:00Z'

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ['1']

# Publication name and optional abbreviated publication name.
publication: AIAA Aviation Forum 2021
#publication_short: In *ICW*

abstract: "In this study, we present preliminary work for a method to efficiently generate realistic wind data for urban environments using existing Large Eddy Simulation (LES) data for the safe operation of small unmanned aerial vehicles. A single building setup in neutral atmospheric conditions is considered a test case to demonstrate the method. The method relies on using Large Eddy Simulation data from a computational fluid dynamics simulation and a non-intrusive Reduced Order Modeling approach (ROM) coupled with Recurrent Neural Networks like Long Short Term Memory (LSTM). Proper Orthogonal Decomposition (POD) transform extracts modal coefficients from the high-resolution data snapshots. The LSTM network is trained on a specific number of modal coefficients defined by their relative information content. Modal predictions for future time steps are then obtained using this trained LSTM network without computationally expensive CFD simulations. An inverse POD transform obtains the corresponding velocity fields on these modal coefficients for future time steps. Since no prior information about the underlying governing equations is utilized for the predictions, the method is entirely non-intrusive."

# Summary. An optional shortened abstract.
summary: "A single building setup in neutral atmospheric conditions is considered a test case to demonstrate the method. The method relies on using Large Eddy Simulation data from a computational fluid dynamics simulation and a non-intrusive Reduced Order Modeling approach (ROM) coupled with Recurrent Neural Networks like Long Short Term Memory (LSTM)."

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
url_video: 'https://doi.org/10.2514/6.2021-2505.vid'

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
