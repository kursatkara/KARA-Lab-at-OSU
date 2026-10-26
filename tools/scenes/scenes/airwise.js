import { THREE, C, setup, clay, glass, glow, mesh, rbox, tile, streamline, swirl, finish } from './lib.js';

function wakeTexture() {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 360; const g = cv.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 512, 0); gr.addColorStop(0, '#2f6fbf'); gr.addColorStop(1, '#7fb6ea'); g.fillStyle = gr; g.fillRect(0, 0, 512, 360);
  for (const [x, y, rx, ry, c] of [[300, 210, 150, 80, '#9fd0f5'], [270, 220, 95, 50, '#f3d9a8'], [250, 228, 50, 26, '#ff9a4d']]) { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, -0.15, 0, 7); g.fill(); }
  g.fillStyle = '#4b5560'; g.fillRect(40, 250, 170, 110); g.fillRect(150, 170, 60, 80);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export default async function () {
  const ctx = setup({ cam: [10.5, 8.2, 15.5], target: [-0.6, 1.6, 0], fov: 31, lightPos: [9, 15, 9], shadowSize: 11 });
  const { scene } = ctx;
  const top = tile(scene, { w: 13.5, d: 8.5, top: C.water, base: '#e6dccb' });

  // hull (top-view outline extruded upward), deck at y = deckY
  const s = new THREE.Shape(); s.moveTo(-4.6, -0.62); s.lineTo(1.4, -0.66); s.quadraticCurveTo(3.6, -0.55, 4.8, 0); s.quadraticCurveTo(3.6, 0.55, 1.4, 0.66); s.lineTo(-4.6, 0.62); s.closePath();
  const hullGeo = new THREE.ExtrudeGeometry(s, { depth: 0.72, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 4 });
  hullGeo.rotateX(-Math.PI / 2);
  const hull = new THREE.Mesh(hullGeo, [clay('#cfd4d9'), clay('#8e98a2')]); hull.position.y = top - 0.22; hull.castShadow = hull.receiveShadow = true; scene.add(hull);
  const deckY = top - 0.22 + 0.78;
  const band = new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.0, bevelSize: 0.075, bevelSegments: 2 }); band.rotateX(-Math.PI / 2);
  scene.add(mesh(band, clay('#4f5964'), { pos: [0, top - 0.02, 0], cast: false }));
  const grey = clay('#b9c0c7'), dark = clay('#7c858f');
  scene.add(mesh(rbox(2.0, 1.0, 1.05, 0.08), grey, { pos: [1.1, deckY + 0.5, 0] }));          // forward superstructure
  scene.add(mesh(rbox(1.2, 0.5, 0.95, 0.06), grey, { pos: [1.4, deckY + 1.25, 0] }));         // bridge
  scene.add(mesh(rbox(0.9, 0.12, 1.0, 0.03), clay('#5a6470'), { pos: [1.65, deckY + 1.33, 0] })); // bridge windows band
  scene.add(mesh(rbox(0.3, 1.6, 0.3, 0.05), dark, { pos: [0.7, deckY + 2.0, 0] }));             // mast
  scene.add(mesh(rbox(0.7, 0.08, 0.5, 0.03), dark, { pos: [0.7, deckY + 2.5, 0] }));
  scene.add(mesh(rbox(0.5, 0.45, 0.6, 0.06), grey, { pos: [-0.35, deckY + 0.9, 0] }));         // funnel
  scene.add(mesh(rbox(1.45, 0.95, 1.1, 0.06), grey, { pos: [-1.2, deckY + 0.47, 0] }));        // hangar
  scene.add(mesh(rbox(0.5, 0.25, 0.45, 0.05), grey, { pos: [3.0, deckY + 0.13, 0] }));         // gun mount
  scene.add(mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 12), dark, { pos: [3.45, deckY + 0.2, 0], rot: [0, 0, Math.PI / 2 - 0.08] }));
  // flight deck markings
  scene.add(mesh(new THREE.TorusGeometry(0.42, 0.035, 8, 48), clay(C.orange, { emissive: C.orange, emissiveIntensity: 0.3 }), { pos: [-3.25, deckY + 0.06, 0], rot: [Math.PI / 2, 0, 0], cast: false }));
  scene.add(mesh(new THREE.BoxGeometry(2.6, 0.012, 0.05), clay(C.white), { pos: [-3.2, deckY + 0.055, 0], cast: false }));
  // anemometers on the mast
  for (const z of [-0.3, 0.3]) scene.add(mesh(new THREE.SphereGeometry(0.09, 16, 12), glow(C.orange), { pos: [0.7, deckY + 2.62, z] }));

  // wind over deck from the bow (+x -> -x): separation off the hangar roof, recirculation over the flight deck
  for (const [y, z] of [[deckY + 1.9, -0.9], [deckY + 1.5, 0.9], [deckY + 2.8, 0.0]]) {
    streamline(scene, [[6.0, y, z], [3.0, y, z], [1.4, y + 0.55, z], [-0.6, y + 0.25, z], [-1.9, y + 0.1, z], [-3.4, y - 0.45, z], [-5.6, y - 0.55, z]], { r: 0.045, color: C.flow, opacity: 0.85 });
  }
  swirl(scene, [-2.5, deckY + 0.75, 0.0], { axis: [0, 0, 1], radius: 0.48, turns: 2.6, length: 1.3, color: C.hot, opacity: 0.9 });
  swirl(scene, [-3.7, deckY + 0.7, 0.75], { axis: [-1, 0, 0.2], radius: 0.28, turns: 2.2, length: 1.1, color: C.hot, opacity: 0.8 });

  // helicopter approaching the stern
  const h = new THREE.Group(), hp = [-5.7, deckY + 1.7, 0.4];
  h.add(mesh(new THREE.SphereGeometry(0.5, 32, 20), clay(C.charcoal), { scale: [1.25, 0.6, 0.6] }));
  h.add(mesh(new THREE.CylinderGeometry(0.07, 0.11, 1.5, 14), clay(C.charcoal), { pos: [-1.1, 0.12, 0], rot: [0, 0, Math.PI / 2] }));
  h.add(mesh(rbox(0.3, 0.32, 0.04, 0.02), clay(C.orange), { pos: [-1.8, 0.28, 0] }));
  h.add(mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.012, 48), glass('#8e9aa6', 0.35), { pos: [0, 0.42, 0], cast: false }));
  h.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2, 10), clay(C.charcoal), { pos: [0, 0.33, 0] }));
  for (const z of [-0.28, 0.28]) h.add(mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 8), clay(C.charcoal), { pos: [0.05, -0.38, z], rot: [0, 0, Math.PI / 2] }));
  h.add(mesh(rbox(0.5, 0.06, 0.06, 0.02), clay(C.orange), { pos: [0.4, 0.05, 0.3] }));
  h.scale.setScalar(1.3); h.position.set(...hp); h.rotation.set(0, 0.25, 0.06); scene.add(h);

  // AI wake inference: mast anemometers -> neural network -> inferred airwake over the flight deck
  const nnX = -0.9, nnY = deckY + 3.6, layers = [[-0.75, 3], [0, 5], [0.75, 3]], nodes = [];
  layers.forEach(([dx, n], li) => { const col = []; for (let k = 0; k < n; k++) { const p = new THREE.Vector3(nnX + dx, nnY + (k - (n - 1) / 2) * 0.32, 0.4);
    scene.add(mesh(new THREE.SphereGeometry(0.085, 18, 12), glow(li === 1 ? C.flow : C.orange), { pos: p.toArray(), cast: false })); col.push(p); } nodes.push(col); });
  const link = (a, b) => { const d = b.clone().sub(a); const m = mesh(new THREE.CylinderGeometry(0.012, 0.012, d.length(), 6), clay('#9aa3ad'), { cast: false });
    m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); scene.add(m); };
  for (let l = 0; l < 2; l++) for (const a2 of nodes[l]) for (const b2 of nodes[l + 1]) link(a2, b2);
  scene.add(mesh(rbox(2.05, 1.85, 0.06, 0.08), glass('#ffffff', 0.55), { pos: [nnX, nnY, 0.33], cast: false }));
  const dash = (pts, col) => { const cv = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
    for (let i = 0; i < 12; i++) { const a2 = cv.getPoint(i / 12), b2 = cv.getPoint((i + 0.55) / 12), d = b2.clone().sub(a2);
      const m = mesh(new THREE.CylinderGeometry(0.03, 0.03, d.length(), 8), clay(col), { cast: false }); m.position.copy(a2).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); scene.add(m); } };
  dash([[0.7, deckY + 2.7, 0.3], [0.4, deckY + 3.1, 0.4], [nnX + 0.75 + 0.15, nnY, 0.4]], C.orange);
  dash([[nnX - 0.75 - 0.15, nnY, 0.4], [-2.4, nnY - 0.4, 0.4], [-3.0, deckY + 2.05, 0.2]], C.flow);
  // inferred airwake: centerline velocity map over the flight deck (recirculation behind the hangar)
  const cvs = document.createElement('canvas'); cvs.width = 640; cvs.height = 400; const g = cvs.getContext('2d');
  const W = 640, H = 400, img = g.createImageData(W, H);
  const cmap = t => { const a2 = [59, 76, 192], b2 = [235, 236, 240], c2 = [222, 96, 40]; const m2 = (p, q, u) => p.map((v, i) => v + (q[i] - v) * u); return t < 0.5 ? m2(a2, b2, t * 2) : m2(b2, c2, (t - 0.5) * 2); };
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const X = i / W, Y = 1 - j / H;                       // X: 0 = stern, 1 = hangar face; Y: 0 = deck, 1 = top
    const shear = 0.5 + 0.5 * Math.tanh((Y - (0.55 - 0.25 * (1 - X))) / 0.08);
    const bubble = Math.exp(-((X - 0.72) ** 2) / 0.05 - ((Y - 0.28) ** 2) / 0.04);
    let t = 0.15 + 0.7 * shear - 0.25 * bubble + 0.05 * Math.sin(22 * X + 9 * Y);
    img.data.set([...cmap(Math.min(1, Math.max(0, t))).map(Math.round), 225], (j * W + i) * 4);
  }
  g.putImageData(img, 0, 0); const tex = new THREE.CanvasTexture(cvs); tex.colorSpace = THREE.SRGBColorSpace;
  const wakeW = 2.6, wakeH = 1.8;
  scene.add(mesh(new THREE.PlaneGeometry(wakeW, wakeH), new THREE.MeshStandardMaterial({ map: tex, transparent: true, opacity: 0.9, side: THREE.DoubleSide, roughness: 0.9 }), { pos: [-1.95 - wakeW / 2, deckY + 0.06 + wakeH / 2, 0.0], cast: false }));

  finish(ctx, [
    { t: 'NATO Generic Destroyer', at: [2.6, deckY - 0.35, 0.66], dx: 120, dy: 130 },
    { t: 'Inferred airwake', at: [-3.4, deckY + 0.5, 0.0], dx: -40, dy: 190 },
    { t: 'Helicopter approach', at: hp, dx: -40, dy: -150 },
    { t: 'Neural network', at: [nnX, nnY + 0.95, 0.4], dx: 0, dy: -60 },
    { t: 'Anemometers', at: [0.7, deckY + 2.62, 0.3], dx: 190, dy: -40 },
  ]);
}
