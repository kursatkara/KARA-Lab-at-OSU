---
#slides: example
#url_pdf: ""
summary: "The hover performance of a four-bladed Sikorsky S-76 rotor is studied
  using a high-order discontinuous Galerkin (DG) off-body discretization. "
#url_video: ""
date: 2022-05-16T17:55:42.929Z
#external_link: ""
#url_slides: ""
title: Rotor in Hover
tags: []
links: []
image:
  focal_point: Smart
  filename: featured.jpg
#url_code: ""
---
The hover performance of a four-bladed Sikorsky S-76 rotor is studied using a high-order discontinuous Galerkin (DG) off-body discretization. Time accurate Navier-Stokes calculations are performed using the WAKE3D code, which combines solution technologies in a multi-mesh, multi-solver paradigm through a dynamic overset framework that employs an unstructured mesh Navier-Stokes method as a near-body solver and a high-order adaptive discontinuous Galerkin discretization as an off-body solver. The rotor with a swept-tapered tip is simulated. The tip Mach number was 0.65, and the Reynolds number based on the reference chord is 1.2 million. A constant coning angle of 3.5-degrees is applied. The effect of time step size and sub-iterations on the integrated parameters is investigated and convergence results are presented. The effect of the maximum order of accuracy of the adaptive h-p discretization in the off-body solver on solution accuracy and efficiency is also investigated.  Thrust coefficient, torque coefficient, and figure of merit are calculated and compared with available data in the literature, and good agreement is found. In general, higher-order off-body simulations are found to result in a better accuracy/cost metric.