import { THREE, C, setup, clay, glass, mesh, rbox, tile, streamline, swirl, arrow, finish } from './lib.js';
import { city, evtol } from './city.js';

// FAA ASSURE A94. First: the turbulent wind environment, an atmospheric boundary layer (ABL) entering a high-rise district,
// building-induced wakes and gusts, captured as a validated LES wind field. Second: an AAM VTOL aircraft operating in it.
const towers = [
  [-2.6, -1.9, 1.3, 1.3, 5.6, 'tank'], [-2.4, 1.6, 1.2, 1.4, 3.6], [0.0, -0.2, 1.4, 1.4, 6.6, 'box'],
  [1.0, 2.4, 1.2, 1.2, 4.0], [2.6, -2.2, 1.2, 1.2, 4.6], [3.2, 1.0, 1.1, 1.3, 3.0, 'box'], [-0.6, -3.0, 1.0, 1.0, 2.6],
];

// Vertical (x-y) LES slice behind the district: streamwise velocity of the urban ABL with building wakes and turbulence.
function sliceTexture(xmin, xmax, ymax, rows) {
  const W = 640, H = 370, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
  const img = g.createImageData(W, H);
  const cmap = t => { // coolwarm: blue (slow) -> white -> red-orange (fast)
    const a = [59, 76, 192], b = [235, 236, 240], c = [222, 96, 40];
    const m = (p, q, u) => p.map((v, i) => v + (q[i] - v) * u);
    return t < 0.5 ? m(a, b, t * 2) : m(b, c, (t - 0.5) * 2);
  };
  // synthetic turbulence: random Fourier modes with a -5/6 amplitude spectrum (Kolmogorov -5/3 energy spectrum)
  let sd = 29; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const modes = []; for (let m = 0; m < 48; m++) { const k = 1.2 * Math.pow(12, m / 47), th = r() * Math.PI * 2; modes.push([k * Math.cos(th), k * 1.4 * Math.sin(th), r() * 6.28, Math.pow(k, -5 / 6)]); }
  const norm = modes.reduce((a, m) => a + m[3] ** 2, 0) ** 0.5;
  const nz = (x, y) => modes.reduce((a, [kx, ky, ph, A]) => a + A * Math.sin(kx * x + ky * y + ph), 0) / norm * 1.6;
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const x = xmin + (xmax - xmin) * i / W, y = ymax * (1 - j / H), k = (j * W + i) * 4;
    let inside = false, u = 0.98 * Math.pow(Math.max(y, 0.02) / ymax, 0.3), tke = 0.25 * Math.exp(-y / 2.5);
    for (const [bx, bw, h] of rows) {
      if (Math.abs(x - bx) < bw / 2 && y < h) inside = true;
      const dx = x - (bx + bw / 2);
      if (dx > -bw && y < h * 1.6) {
        const fy = Math.exp(-((y - 0.55 * h) ** 2) / (2 * (0.5 * h) ** 2)), fx = dx > 0 ? Math.exp(-dx / 3.2) : 0.6;
        u -= 0.42 * fx * fy; tke += 0.9 * fx * Math.exp(-((y - h) ** 2) / (2 * (0.45 * h) ** 2));
      }
    }
    if (inside) { img.data.set([112, 118, 126, 255], k); continue; }
    const t = Math.min(1, Math.max(0, u + 0.3 * Math.min(tke, 0.75) * nz(x, y)));
    img.data.set([...cmap(t).map(Math.round), 240], k);
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export default async function () {
  const ctx = setup({ cam: [10.0, 12.0, 24.5], target: [0.3, 3.75, -0.6], fov: 31, lightPos: [10, 18, 9], shadowSize: 11 });
  const { scene } = ctx;
  const top = tile(scene, { w: 13, d: 10, top: C.sage, base: C.sand });
  city(scene, top, towers);

  // validated LES wind field: vertical streamwise slice at the back of the domain, behind the towers
  const xmin = -6.4, xmax = 6.4, ymax = 7.4, zs = -4.85;
  const rows = towers.filter(t => t[1] < -1).map(([bx, , bw, , h]) => [bx, bw, h]);   // the slice cuts the back row
  const plane = mesh(new THREE.PlaneGeometry(xmax - xmin, ymax), new THREE.MeshStandardMaterial({ map: sliceTexture(xmin, xmax, ymax, rows), transparent: true, opacity: 0.95, roughness: 0.9, side: THREE.DoubleSide }), { pos: [0, top + ymax / 2, zs], cast: false });
  scene.add(plane);
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(xmax - xmin, ymax)), new THREE.LineBasicMaterial({ color: '#7a8796' }));
  edge.position.set(0, top + ymax / 2, zs + 0.01); scene.add(edge);

  // ABL inflow at the upstream boundary: mean power-law profile (exponent 0.3, urban terrain) and an instantaneous profile
  // with turbulent fluctuations, strongest near the ground
  const x0 = -6.6, zp = 0.6, hmax = 6.6, Lp = 2.4;
  const mean = y => Lp * Math.pow(y / hmax, 0.3);
  const prof = [], inst = [];
  for (let i = 0; i <= 120; i++) {
    const y = 0.12 + (hmax - 0.12) * i / 120;
    prof.push([x0 + mean(y), top + y, zp]);
    const up = (0.5 * Math.exp(-y / 2.6) + 0.1) * (Math.sin(2.9 * y + 0.4) * 0.55 + Math.sin(5.3 * y + 1.1) * 0.35 + Math.sin(9.1 * y + 2.3) * 0.2);
    inst.push([x0 + Math.max(0.05, mean(y) + up), top + y, zp]);
  }
  streamline(scene, inst, { r: 0.028, color: C.hot, opacity: 1, arrow: false, seg: 600 });
  streamline(scene, prof, { r: 0.04, color: C.ink, opacity: 1, arrow: false });
  streamline(scene, [[x0, top, zp], [x0, top + hmax + 0.2, zp]], { r: 0.024, color: C.ink, opacity: 1, arrow: false });
  for (const y of [0.4, 1.3, 2.6, 4.1, 5.9]) arrow(scene, [x0, top + y, zp], [x0 + mean(y), top + y, zp], { r: 0.04, color: C.ink });

  // building-induced turbulence: eddies shed from the tower edges and rooftops, convected downstream (+x)
  let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  for (const [bx, bz, bw, bd, h] of towers) {
    const n = h > 5 ? 6 : h > 3.5 ? 5 : 3;
    for (let k = 0; k < n; k++) {
      const roof = k === 0, dxw = roof ? 0.1 + rnd() * 0.6 : 0.5 + k * 0.75 + rnd() * 0.4;
      const y = roof ? top + h + 0.25 : top + 0.6 + rnd() * (h * 1.05 - 0.4);
      const zc = bz + (k % 2 ? 1 : -1) * (bd / 2 + 0.05 + rnd() * 0.35);
      swirl(scene, [bx + bw / 2 + dxw, y, roof ? bz : zc], { axis: [1, (rnd() - 0.5) * 0.5, (rnd() - 0.5) * 0.5], radius: (roof ? 0.3 : 0.16) + rnd() * 0.16, turns: 2.3, length: 0.65 + rnd() * 0.4, r: 0.03, color: k % 2 ? C.flow : C.hot, opacity: 0.9, grow: 0.3 });
    }
  }
  for (const [y, z] of [[top + 7.6, -1.2], [top + 6.9, 0.9]]) streamline(scene, [[-5.4, y, z], [-2.0, y, z], [0.2, y + 0.45, z + 0.2], [2.6, y - 0.35, z], [5.6, y, z]], { r: 0.045, color: C.flow, opacity: 0.85 });

  // AAM VTOL aircraft operating in the turbulent environment (secondary), in front of the district
  const v = evtol(1.0); v.position.set(3.3, top + 7.7, 3.0); v.rotation.set(0.08, 0.45, 0.12); scene.add(v);

  finish(ctx, [
    { t: 'ABL inflow: mean + fluctuations', at: [x0 + mean(1.2) * 0.6, top + 1.2, zp], dx: 40, dy: 170 },
    { t: 'Validated LES wind field', at: [-4.6, top + 6.6, zs], dx: 0, dy: -80 },
    { t: 'Building-induced turbulence', at: [3.75, top + 2.2, -1.9], dx: 0, dy: 270 },
    { t: 'AAM VTOL', at: [3.3, top + 7.7, 3.0], dx: 170, dy: -40 },
  ]);
}
