import { THREE, C, setup, clay, glass, mesh, rbox, tile, streamline, swirl, arrow, finish } from './lib.js';
import { city, evtol } from './city.js';

// FAA ASSURE A94. First: the turbulent wind environment, an atmospheric boundary layer (ABL) entering a high-rise district,
// building-induced wakes and gusts, captured as a validated LES wind field. Second: an AAM VTOL aircraft operating in it.
const towers = [
  [-2.6, -1.9, 1.3, 1.3, 5.6, 'tank'], [-2.4, 1.6, 1.2, 1.4, 3.6], [0.0, -0.2, 1.4, 1.4, 6.6, 'box'],
  [1.0, 2.4, 1.2, 1.2, 4.0], [2.6, -2.2, 1.2, 1.2, 4.6], [3.2, 1.0, 1.1, 1.3, 3.0, 'box'], [-0.6, -3.0, 1.0, 1.0, 2.6],
];

function sliceTexture(xmin, xmax, zmin, zmax) {
  const W = 768, H = 512, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
  const img = g.createImageData(W, H);
  const cmap = t => { // coolwarm: blue (slow) -> white -> red-orange (fast)
    const a = [59, 76, 192], b = [235, 236, 240], c = [222, 96, 40];
    const m = (p, q, u) => p.map((v, i) => v + (q[i] - v) * u);
    return t < 0.5 ? m(a, b, t * 2) : m(b, c, (t - 0.5) * 2);
  };
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const x = xmin + (xmax - xmin) * i / W, z = zmin + (zmax - zmin) * j / H;
    let u = 0.78;
    for (const [bx, bz, bw, bd] of towers) {
      const dx = x - (bx + bw / 2);
      if (dx > -0.2) { const sig = bd * 0.32 + 0.07 * Math.max(dx, 0); u -= 0.48 * Math.exp(-((z - bz) ** 2) / (2 * sig * sig)) * Math.exp(-Math.max(dx, 0) / 7.0); }
      if (Math.abs(x - bx) < bw / 2 + 0.1 && Math.abs(z - bz) < bd / 2 + 0.1) u = -1;
    }
    const n = 0.08 * Math.sin(4.1 * x + 2.2 * Math.sin(3.3 * z)) + 0.07 * Math.sin(7.3 * z + 2.9 * Math.sin(2.9 * x)) + 0.06 * Math.sin(13.1 * x - 9.3 * z + 1.3 * Math.sin(5 * z)) + 0.04 * Math.sin(19.7 * z + 3 * Math.sin(7 * x));
    const k = (j * W + i) * 4;
    if (u === -1) { img.data.set([90, 96, 104, 255], k); continue; }
    const t = Math.min(1, Math.max(0, u + n * (1.6 - u)));
    img.data.set([...cmap(t).map(Math.round), 235], k);
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export default async function () {
  const ctx = setup({ cam: [15.5, 14.5, 19.5], target: [0.2, 2.6, 0.2], fov: 31, lightPos: [10, 18, 9], shadowSize: 11 });
  const { scene } = ctx;
  const top = tile(scene, { w: 13, d: 10, top: C.sage, base: C.sand });
  city(scene, top, towers);

  // validated LES wind field: horizontal slice through the district
  const xmin = -6.2, xmax = 6.2, zmin = -4.6, zmax = 4.6, ys = top + 2.2;
  const plane = mesh(new THREE.PlaneGeometry(xmax - xmin, zmax - zmin), new THREE.MeshStandardMaterial({ map: sliceTexture(xmin, xmax, zmin, zmax), transparent: true, opacity: 0.92, roughness: 0.9, side: THREE.DoubleSide }), { pos: [0, ys, 0], rot: [-Math.PI / 2, 0, 0], cast: false });
  scene.add(plane);
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(xmax - xmin, zmax - zmin)), new THREE.LineBasicMaterial({ color: '#7a8796' }));
  edge.rotation.x = -Math.PI / 2; edge.position.y = ys + 0.01; scene.add(edge);

  // ABL inflow profile (power law, exponent 0.3 for urban terrain) at the upstream boundary
  const x0 = -6.6, zp = 0.0, hmax = 6.2;
  const prof = []; for (let i = 0; i <= 40; i++) { const y = 0.12 + (hmax - 0.12) * i / 40; prof.push([x0 + 2.3 * Math.pow(y / hmax, 0.3), top + y, zp]); }
  streamline(scene, prof, { r: 0.03, color: C.ink, opacity: 1, arrow: false });
  streamline(scene, [[x0, top, zp], [x0, top + hmax, zp]], { r: 0.022, color: C.ink, opacity: 1, arrow: false });
  for (const y of [0.35, 1.2, 2.5, 4.0, 5.8]) { const L = 2.3 * Math.pow(y / hmax, 0.3); arrow(scene, [x0, top + y, zp], [x0 + L, top + y, zp], { r: 0.04, color: C.ink }); }

  // building-induced wakes and gusts above the slice
  let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  for (const [bx, bz, bw, bd, h] of towers) {
    if (h < 3.5) continue;
    for (let k = 0; k < 2; k++) swirl(scene, [bx + bw / 2 + 0.9 + k * 1.2, top + 2.8 + rnd() * (h - 2.6), bz + (rnd() - 0.5) * 0.8], { axis: [1, (rnd() - 0.5) * 0.4, (rnd() - 0.5) * 0.4], radius: 0.28 + rnd() * 0.18, turns: 2.2, length: 0.9, r: 0.032, color: k ? C.flow : C.hot, opacity: 0.85 });
  }
  for (const [y, z] of [[top + 7.3, -1.5], [top + 6.4, 2.6]]) streamline(scene, [[-5.4, y, z], [-2.0, y, z], [0.2, y + 0.4, z + 0.2], [2.6, y - 0.3, z], [5.6, y, z]], { r: 0.045, color: C.flow, opacity: 0.85 });

  // AAM VTOL aircraft operating in the turbulent environment (secondary)
  const v = evtol(0.8); v.position.set(4.6, top + 4.0, 3.2); v.rotation.set(0.05, 0.2, 0.08); scene.add(v);

  finish(ctx, [
    { t: 'ABL inflow', at: [x0, top + hmax, zp], dx: 40, dy: -70 },
    { t: 'Building-induced turbulence', at: [1.9, top + 5.2, -0.4], dx: 110, dy: -150 },
    { t: 'Validated LES wind field', at: [-1.8, ys, 3.6], dx: -110, dy: 140 },
    { t: 'AAM VTOL', at: [4.6, top + 4.0, 3.2], dx: 60, dy: 120 },
  ]);
}
