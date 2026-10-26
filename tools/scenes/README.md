# Research illustrations

Each research panel's picture is a small three.js scene in `scenes/<name>.js`, built from the shared helpers in
`scenes/lib.js` (lighting, clay materials, diorama tiles, flow ribbons, vortex swirls, label pills) and `scenes/city.js`
(buildings, fixed-wing drone, eVTOL). Labels are placed at 3D anchor points and kept inside the frame automatically.

Render (needs Node and Playwright with Chromium):

    cd tools/scenes
    npm install
    python3 -m http.server 8820 &          # serve this folder
    node render.js out capsule airwise faa nsf quantum hypersonic swj

Then convert `out/<name>.png` to `../../assets/research/sketch-<name>.jpg` (1200×900, JPEG quality ~84, under 100 KB):

    python3 -c "from PIL import Image;Image.open('out/capsule.png').convert('RGB').save('../../assets/research/sketch-reentry-capsule.jpg',quality=84,optimize=True)"

| Scene | Site file | Panel |
|---|---|---|
| capsule | sketch-reentry-capsule.jpg | NASA ESI |
| airwise | sketch-ship-airwake.jpg | Navy AIRWISE |
| faa | sketch-aam-turbulence.jpg | FAA ASSURE |
| nsf | sketch-urban-winds.jpg | NSF NRI |
| quantum | sketch-quantum-cfd.jpg | IBM Quantum |
| hypersonic | sketch-hypersonic.jpg | NASA OK EPSCoR |
| swj | sketch-sweeping-jets.jpg | Sweeping jets |

`models/natogd.stl` is the NATO Generic Destroyer 1:50 baseline geometry (STEP, meshed with gmsh). The `airwise` scene maps
its waterline (CAD z = 0) to the water surface, so the submerged hull is hidden inside the tile.

Style: soft clay materials, OSU orange for hardware accents and jets, blue for flow, orange for disturbances and wakes,
sage/teal diorama tiles. Keep label text to 1–3 words in precise terms (see AGENTS.md).
