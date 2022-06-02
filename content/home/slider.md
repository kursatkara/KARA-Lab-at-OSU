---
# Use the Slider widget as this page section
widget: slider

# Position of this section on the page
weight: 1  

# Publish this section?
active: true  

# This file represents a page section.
headless: true  

design:
  # Slide height is automatic unless you force a specific height (e.g. '400px')
  # slide_height: '600px'
  is_fullscreen: false
  # Automatically transition through slides?
  loop: false
  # Duration of transition between slides (in ms)
  interval: 3000

content:
  slides:
    - title: 
      content: 
      align: center
      background:
        position: center
        color: '#666'
        brightness: 0.7
        media: SOAR.jpg
      placement: 1
      caption: "Photo by [Pratik Bisht](https://unsplash.com/@ob1kanob)"
    - title: Welcome to our website.
      content: Take a look at what we're working on...
      align: center
      background:
        position: center
        color: '#666'
        brightness: 0.7
        media: a-symposium-2022-02.jpg
      link:
        icon: fa-solid
        icon_pack: fas
        text: Papers
        url: '#featured'
    - title: Hypersonic Flows  
      content: 'boundary-layer stability and transition to turbulence'
      align: center
      background:
        position: center
        color: '#666'
        brightness: 0.7
        media: a-symposium-2022-01.jpg
      link:
        icon: fa-solid
        icon_pack: fas
        text: Projects
        url: '#projects'
    - title: Aerodynamic flow separation control
      content: 'transformative aerodynamic concepts'
      align: center
      background:
        position: center
        color: '#666'
        brightness: 0.7
        media: a-symposium-2022-03.jpg
      link:
        icon: graduation-cap
        icon_pack: fas
        text: Join Us
        url: '#contact'
---
