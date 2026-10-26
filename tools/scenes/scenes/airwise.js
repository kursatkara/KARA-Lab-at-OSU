import { THREE, C, setup, clay, glass, glow, mesh, rbox, tile, streamline, swirl, finish } from './lib.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';

function wakeTexture() {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 360; const g = cv.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 512, 0); gr.addColorStop(0, '#2f6fbf'); gr.addColorStop(1, '#7fb6ea'); g.fillStyle = gr; g.fillRect(0, 0, 512, 360);
  for (const [x, y, rx, ry, c] of [[300, 210, 150, 80, '#9fd0f5'], [270, 220, 95, 50, '#f3d9a8'], [250, 228, 50, 26, '#ff9a4d']]) { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, -0.15, 0, 7); g.fill(); }
  g.fillStyle = '#4b5560'; g.fillRect(40, 250, 170, 110); g.fillRect(150, 170, 60, 80);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export default async function () {
  const ctx = setup({ cam: [8.6, 5.0, 12.6], target: [-0.9, 1.05, 0], fov: 31, lightPos: [9, 15, 9], shadowSize: 11 });
  const { scene } = ctx;
  const top = tile(scene, { w: 13.5, d: 8.5, top: C.water, base: '#e6dccb' });

  // NATO Generic Destroyer (1:50 baseline geometry, STEP -> STL). CAD x: bow 0 -> stern 2818, z up with the waterline at z = 0.
  // Mapped so the bow points to +X; the submerged hull sits inside the opaque water tile and is hidden.
  const sc = 9.4 / 3000, xc = 1318;
  const raw = new STLLoader().parse(await (await fetch('models/natogd.stl')).arrayBuffer());
  const p = raw.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); p.setXYZ(i, -(x - xc) * sc, z * sc, y * sc); }
  raw.deleteAttribute('normal');
  const geo = toCreasedNormals(raw, Math.PI / 6);
  const ship = mesh(geo, clay('#b9c0c7'), { pos: [0, top, 0] }); scene.add(ship);
  const X = cx => -(cx - xc) * sc, Zt = cz => top + cz * sc;
  const deckY = Zt(185.7), hangarX = X(2220), hangarTop = Zt(345.7), mastX = X(1100), mastTop = Zt(606);
  // boot-top stripe at the waterline and flight-deck markings
  scene.add(mesh(new THREE.TorusGeometry(0.47, 0.03, 8, 48), clay(C.orange, { emissive: C.orange, emissiveIntensity: 0.3 }), { pos: [X(2560), deckY + 0.012, 0], rot: [Math.PI / 2, 0, 0], cast: false }));
  scene.add(mesh(new THREE.BoxGeometry(X(2250) - X(2800), 0.01, 0.04), clay(C.white), { pos: [(X(2250) + X(2800)) / 2, deckY + 0.008, 0], cast: false }));
  // anemometers on the mast
  for (const z of [-0.14, 0.14]) scene.add(mesh(new THREE.SphereGeometry(0.075, 16, 12), glow(C.orange), { pos: [mastX, mastTop + 0.06, z] }));

  // wind over deck from the bow (+X -> -X): separation off the hangar roof edge, recirculation over the flight deck
  for (const [y, z] of [[hangarTop + 0.55, -0.75], [hangarTop + 0.3, 0.8], [mastTop + 0.45, 0.0]]) {
    streamline(scene, [[6.2, y, z], [3.2, y, z], [1.2, y + 0.35, z], [-1.2, y + 0.15, z], [hangarX, y + 0.05, z], [hangarX - 1.0, y - 0.45, z], [-6.2, y - 0.55, z]], { r: 0.045, color: C.flow, opacity: 0.85 });
  }
  swirl(scene, [hangarX - 0.65, deckY + 0.4, 0.0], { axis: [0, 0, 1], radius: 0.36, turns: 2.6, length: 1.2, color: C.hot, opacity: 0.9 });
  swirl(scene, [hangarX - 1.5, deckY + 0.45, 0.55], { axis: [-1, 0, 0.2], radius: 0.22, turns: 2.2, length: 0.9, color: C.hot, opacity: 0.8 });

  // superstructure-induced turbulence: small eddies shed from the bridge, mast, funnel, and hangar edges, both sides of the ship
  let sd = 17; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  for (let k = 0; k < 20; k++) {
    const x = hangarX - 0.2 + rnd() * (mastX + 0.8 - hangarX), side = k % 2 ? 1 : -1;
    const yTop = x > mastX - 0.4 && x < mastX + 0.4 ? mastTop : hangarTop + 0.15;
    const y = deckY + 0.5 + rnd() * (yTop - deckY - 0.4), z = side * (0.62 + rnd() * 0.45);
    swirl(scene, [x, y, z], { axis: [-1, (rnd() - 0.5) * 0.6, side * rnd() * 0.5], radius: 0.07 + rnd() * 0.1, turns: 2.2, length: 0.4 + rnd() * 0.25, r: 0.022, color: rnd() > 0.45 ? C.hot : C.flow, opacity: 0.9, grow: 0.3 });
  }
  for (let k = 0; k < 4; k++) swirl(scene, [mastX - 0.45 - k * 0.55, mastTop - 0.25 - k * 0.22 - rnd() * 0.1, (rnd() - 0.5) * 0.4], { axis: [-1, -0.25, 0], radius: 0.14 + 0.03 * k, turns: 2.2, length: 0.45, r: 0.024, color: k % 2 ? C.flow : C.hot, opacity: 0.9, grow: 0.3 });

  // helicopter approaching the stern
  const h = new THREE.Group(), hp = [X(2818) - 1.4, deckY + 1.3, 0.35];
  h.add(mesh(new THREE.SphereGeometry(0.5, 32, 20), clay(C.charcoal), { scale: [1.25, 0.6, 0.6] }));
  h.add(mesh(new THREE.CylinderGeometry(0.07, 0.11, 1.5, 14), clay(C.charcoal), { pos: [-1.1, 0.12, 0], rot: [0, 0, Math.PI / 2] }));
  h.add(mesh(rbox(0.3, 0.32, 0.04, 0.02), clay(C.orange), { pos: [-1.8, 0.28, 0] }));
  h.add(mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.012, 48), glass('#8e9aa6', 0.35), { pos: [0, 0.42, 0], cast: false }));
  h.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2, 10), clay(C.charcoal), { pos: [0, 0.33, 0] }));
  for (const z of [-0.28, 0.28]) h.add(mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 8), clay(C.charcoal), { pos: [0.05, -0.38, z], rot: [0, 0, Math.PI / 2] }));
  h.add(mesh(rbox(0.5, 0.06, 0.06, 0.02), clay(C.orange), { pos: [0.4, 0.05, 0.3] }));
  h.scale.setScalar(1.05); h.position.set(...hp); h.rotation.set(0, 0.25, 0.06); scene.add(h);

  // AI wake inference: mast anemometers -> neural network -> inferred airwake over the flight deck
  const nnX = -1.1, nnY = mastTop + 1.35, layers = [[-0.75, 3], [0, 5], [0.75, 3]], nodes = [];
  layers.forEach(([dx, n], li) => { const col = []; for (let k = 0; k < n; k++) { const p = new THREE.Vector3(nnX + dx, nnY + (k - (n - 1) / 2) * 0.32, 0.4);
    scene.add(mesh(new THREE.SphereGeometry(0.085, 18, 12), glow(li === 1 ? C.flow : C.orange), { pos: p.toArray(), cast: false })); col.push(p); } nodes.push(col); });
  const link = (a, b) => { const d = b.clone().sub(a); const m = mesh(new THREE.CylinderGeometry(0.012, 0.012, d.length(), 6), clay('#9aa3ad'), { cast: false });
    m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); scene.add(m); };
  for (let l = 0; l < 2; l++) for (const a2 of nodes[l]) for (const b2 of nodes[l + 1]) link(a2, b2);
  scene.add(mesh(rbox(2.05, 1.85, 0.06, 0.08), glass('#ffffff', 0.55), { pos: [nnX, nnY, 0.33], cast: false }));
  const dash = (pts, col) => { const cv = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
    for (let i = 0; i < 12; i++) { const a2 = cv.getPoint(i / 12), b2 = cv.getPoint((i + 0.55) / 12), d = b2.clone().sub(a2);
      const m = mesh(new THREE.CylinderGeometry(0.03, 0.03, d.length(), 8), clay(col), { cast: false }); m.position.copy(a2).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); scene.add(m); } };
  dash([[mastX, mastTop + 0.12, 0.14], [mastX - 0.1, mastTop + 0.8, 0.3], [nnX + 0.75 + 0.15, nnY, 0.4]], C.orange);
  dash([[nnX - 0.75 - 0.15, nnY, 0.4], [hangarX - 0.6, nnY - 0.3, 0.3], [hangarX - 1.1, deckY + 1.35, 0.1]], C.flow);
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
  const wakeW = 2.3, wakeH = 1.15;
  scene.add(mesh(new THREE.PlaneGeometry(wakeW, wakeH), new THREE.MeshStandardMaterial({ map: tex, transparent: true, opacity: 0.9, side: THREE.DoubleSide, roughness: 0.9 }), { pos: [hangarX - 0.05 - wakeW / 2, deckY + 0.02 + wakeH / 2, 0.0], cast: false }));

  finish(ctx, [
    { t: 'NATO Generic Destroyer', at: [X(600), Zt(120), 0.5], dx: 120, dy: 150 },
    { t: 'Inferred airwake', at: [hangarX - 1.2, deckY + 0.3, 0.0], dx: -60, dy: 200 },
    { t: 'Helicopter approach', at: hp, dx: -40, dy: -150 },
    { t: 'AIRWISE', at: [nnX, nnY + 0.95, 0.4], dx: 0, dy: -60 },
    { t: 'Anemometers', at: [mastX, mastTop + 0.06, 0.14], dx: 190, dy: -40 },
  ]);
}
