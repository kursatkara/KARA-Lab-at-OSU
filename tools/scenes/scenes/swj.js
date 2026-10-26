import { THREE, C, setup, clay, glass, mesh, rbox, streamline, swirl, finish, inset } from './lib.js';

// Two wings at an angle of attack beyond stall. Top: actuators off, the flow separates from the leading edge.
// Bottom: sweeping jet actuators on, the flow stays attached to the trailing edge.
const c = 3.6, tcl = 0.15, alpha = 20 * Math.PI / 180, span = 4.4;
const yt = x => 5 * tcl * c * (0.2969 * Math.sqrt(x / c) - 0.126 * (x / c) - 0.3516 * (x / c) ** 2 + 0.2843 * (x / c) ** 3 - 0.1036 * (x / c) ** 4);
const rot = ([x, y]) => [x * Math.cos(-alpha) - y * Math.sin(-alpha), x * Math.sin(-alpha) + y * Math.cos(-alpha)];

function wing(scene, y0) {
  const up = [], lo = [];
  for (let i = 0; i <= 80; i++) { const x = c * (1 - Math.cos(Math.PI * i / 80)) / 2; up.push(rot([x, yt(x)])); lo.push(rot([x, -yt(x)])); }
  const s = new THREE.Shape(); s.moveTo(...up[0]); up.slice(1).forEach(p => s.lineTo(...p)); lo.slice().reverse().forEach(p => s.lineTo(...p));
  const w = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: span, bevelEnabled: false }), [clay('#5d6570'), clay('#eceae5')]);
  w.position.set(-c / 2, y0, -span / 2); w.castShadow = w.receiveShadow = true; scene.add(w);
  const sh = ([x, y]) => [x - c / 2, y + y0];
  return { up: up.map(sh), lo: lo.map(sh) };
}

function oscTexture() {
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 640; const g = cv.getContext('2d');
  g.fillStyle = '#7d8590'; g.fillRect(0, 0, 1024, 640); g.fillStyle = '#f3efe8'; g.strokeStyle = '#f3efe8';
  g.beginPath(); g.moveTo(40, 250); g.lineTo(300, 285); g.lineTo(300, 355); g.lineTo(40, 390); g.closePath(); g.fill();
  g.beginPath(); g.roundRect(300, 200, 420, 240, 70); g.fill();
  g.lineWidth = 60; g.beginPath(); g.moveTo(380, 210); g.lineTo(380, 90); g.lineTo(760, 90); g.lineTo(760, 250); g.stroke();
  g.beginPath(); g.moveTo(380, 430); g.lineTo(380, 550); g.lineTo(760, 550); g.lineTo(760, 390); g.stroke();
  g.beginPath(); g.moveTo(700, 290); g.lineTo(840, 300); g.lineTo(840, 340); g.lineTo(700, 350); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(840, 300); g.lineTo(1000, 200); g.lineTo(1000, 440); g.lineTo(840, 340); g.closePath(); g.fill();
  g.fillStyle = '#ff7a1a'; g.beginPath(); g.ellipse(520, 320, 120, 40, -0.2, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export default async function () {
  const ctx = setup({ cam: [-4.2, 6.0, 24.5], target: [1.5, -0.3, 0], fov: 30, lightPos: [-4, 12, 9], shadowSize: 9 });
  const { scene } = ctx;
  const yTop = 2.3, yBot = -2.4;
  const T = wing(scene, yTop), Bw = wing(scene, yBot), upT = T.up, upB = Bw.up;
  const X1 = -6.6;                                          // upstream start of the streamlines
  // pressure-side streamline: approaches just below the stagnation point, follows the lower surface, leaves the trailing edge
  const lower = (W, y0, z) => { const pts = [[X1, y0 - 0.32, z], [-3.6, y0 - 0.34, z]];
    W.lo.filter((_, i) => i % 10 === 0 && i > 4).forEach(p => pts.push([p[0], p[1] - 0.24, z]));
    const te = W.lo[80]; pts.push([te[0] + 0.8, te[1] - 0.3, z], [te[0] + 1.7, te[1] - 0.4, z]); streamline(scene, pts, { r: 0.04, color: C.flow, opacity: 0.85 }); };

  // --- actuators off: the suction-side streamlines leave the leading edge (separated shear layer); recirculation below them
  for (const z of [0.7, -1.3]) streamline(scene, [[X1, yTop + 0.22, z], [-3.4, yTop + 0.22, z], [upT[2][0] - 0.05, upT[2][1] + 0.16, z], [-0.6, yTop + 0.48, z], [1.6, yTop + 0.56, z], [4.2, yTop + 0.5, z]], { r: 0.042, color: C.flow, opacity: 0.85 });
  lower(T, yTop, 0.0);
  for (const [f, rad] of [[0.3, 0.3], [0.55, 0.4], [0.8, 0.4]]) {
    const p = upT[Math.round(f * 80)];
    swirl(scene, [p[0], p[1] + rad + 0.06, -0.4], { axis: [0, 0, 1], radius: rad, turns: 2.4, length: 1.6, color: C.hot, opacity: 0.9, grow: 0.25 });
  }
  swirl(scene, [2.4, upT[80][1] + 0.25, -0.4], { axis: [0, 0, 1], radius: 0.36, turns: 2, length: 1.4, color: C.hot, opacity: 0.8 });

  // --- actuators on: sweeping jets near the leading edge; the suction-side streamlines stay attached to the trailing edge
  const i0 = 12, p0 = upB[i0], p1 = upB[i0 + 4];
  const xd = new THREE.Vector3(p1[0] - p0[0], p1[1] - p0[1], 0).normalize(), zd = new THREE.Vector3(0, 0, 1);
  const nrm = new THREE.Vector3().crossVectors(zd, xd).normalize();
  for (let k = -1; k <= 1; k++) {
    const z = k * 1.3, o = new THREE.Vector3(p0[0], p0[1], z).addScaledVector(nrm, 0.02);
    const sl = mesh(rbox(0.14, 0.06, 0.42, 0.02), clay(C.orange, { emissive: C.orange, emissiveIntensity: 0.3 }), { pos: o.toArray() });
    sl.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), xd); scene.add(sl);
    const R = 1.25, half = 0.45, v = [o.x, o.y, o.z];
    for (let i = 0; i <= 30; i++) { const ph = -half + 2 * half * i / 30; const p = o.clone().addScaledVector(xd, R * Math.cos(ph)).addScaledVector(zd, R * Math.sin(ph)).addScaledVector(nrm, 0.04); v.push(p.x, p.y, p.z); }
    const idx = []; for (let i = 1; i <= 30; i++) idx.push(0, i, i + 1);
    const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); fg.setIndex(idx); fg.computeVertexNormals();
    scene.add(mesh(fg, glass(C.orangeSoft, 0.6, { emissive: C.orange, emissiveIntensity: 0.3 }), { cast: false }));
    for (const ph of [-half, 0, half]) {
      const e = o.clone().addScaledVector(xd, R * Math.cos(ph)).addScaledVector(zd, R * Math.sin(ph)).addScaledVector(nrm, 0.06);
      streamline(scene, [[o.x, o.y + 0.05, o.z], e.toArray()], { r: ph === 0 ? 0.03 : 0.02, color: C.orange, opacity: ph === 0 ? 1 : 0.6, arrow: ph === 0 });
    }
  }
  for (const z of [0.65, -0.65]) {
    const pts = [[X1, yBot + 0.22, z], [-3.4, yBot + 0.22, z], [upB[2][0] - 0.05, upB[2][1] + 0.16, z]];
    upB.filter((_, i) => i % 8 === 0 && i > 4).forEach(p => pts.push([p[0], p[1] + 0.2, z]));
    const te = upB[80]; pts.push([te[0] + 0.8, te[1] - 0.12, z], [te[0] + 1.7, te[1] - 0.22, z]);
    streamline(scene, pts, { r: 0.042, color: C.flow, opacity: 0.9 });
  }
  lower(Bw, yBot, 0.0);

  // fluidic oscillator (actuator internals)
  const side = clay('#6f7782');
  const block = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.18, 1.25), [side, side, new THREE.MeshStandardMaterial({ map: oscTexture(), roughness: 0.8 }), side, side, side]);
  block.position.set(5.3, 0.35, 0.6); block.rotation.set(0.75, -0.25, 0); block.castShadow = true; scene.add(block);

  // Sub-figure: lift curves. Same lift slope; with actuators off the wing stalls at a lower angle and a lower C_L,max.
  const w = 430, h = 370, gx0 = 70, gx1 = w - 26, gy0 = h - 62, gy1 = 84;
  const s = 1.56, a1 = 0.45, a2 = 0.72, aop = 0.58;
  const cl = (a, as) => { const pk = s * as * 0.82; return a <= as ? s * a * (1 - 0.18 * (a / as) ** 4) : pk * (0.6 + 0.4 * Math.exp(-(a - as) / 0.05)); };
  const P = (a, v) => [gx0 + (gx1 - gx0) * a, gy0 - (gy0 - gy1) * v];
  const curve = as => { let d = ''; for (let i = 0; i <= 300; i++) { const a = i / 300, [x, y] = P(a, cl(a, as)); d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); } return d; };
  const [s1x, s1y] = P(a1, cl(a1, a1)), [s2x, s2y] = P(a2, cl(a2, a2)), [ox] = P(aop, 0);
  const [o1x, o1y] = P(aop, cl(aop, a1)), [o2x, o2y] = P(aop, cl(aop, a2));
  inset(ctx.stage, { x: 1200 - w - 18, y: 900 - h - 18, w, h, svg: `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <text x="22" y="40" font-family="Plex" font-weight="600" font-size="23" letter-spacing="1.5" fill="#3d4148">LIFT CURVE</text>
      <line x1="${s1x}" y1="${s1y}" x2="${s1x}" y2="${gy0}" stroke="#3f86d9" stroke-width="2" stroke-dasharray="6 6"/>
      <line x1="${s2x}" y1="${s2y}" x2="${s2x}" y2="${gy0}" stroke="#d55a00" stroke-width="2" stroke-dasharray="6 6"/>
      <line x1="${ox}" y1="${gy1 - 4}" x2="${ox}" y2="${gy0}" stroke="#b9b0a4" stroke-width="2"/>
      <text x="${ox}" y="${gy1 - 12}" text-anchor="middle" font-family="PlexMono" font-size="15" fill="#7a8088">α shown</text>
      <line x1="${gx0}" y1="${gy1 - 10}" x2="${gx0}" y2="${gy0}" stroke="#b9b0a4" stroke-width="3"/>
      <line x1="${gx0}" y1="${gy0}" x2="${gx1}" y2="${gy0}" stroke="#b9b0a4" stroke-width="3"/>
      <path d="${curve(a1)}" fill="none" stroke="#3f86d9" stroke-width="4" stroke-linejoin="round"/>
      <path d="${curve(a2)}" fill="none" stroke="#ff7a1a" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="${s1x}" cy="${s1y}" r="6.5" fill="#3f86d9"/><circle cx="${s2x}" cy="${s2y}" r="6.5" fill="#ff7a1a"/>
      <circle cx="${o1x}" cy="${o1y}" r="6" fill="#fffdfa" stroke="#3f86d9" stroke-width="3"/><circle cx="${o2x}" cy="${o2y}" r="6" fill="#fffdfa" stroke="#ff7a1a" stroke-width="3"/>
      <text x="${s1x - 10}" y="${s1y - 14}" text-anchor="end" font-family="PlexMono" font-size="19" fill="#3f86d9">C<tspan font-size="13" dy="5">L,max</tspan></text>
      <text x="${s2x}" y="${s2y - 16}" text-anchor="middle" font-family="PlexMono" font-size="19" fill="#d55a00">C<tspan font-size="13" dy="5">L,max</tspan></text>
      <text x="${s1x}" y="${gy0 + 26}" text-anchor="middle" font-family="PlexMono" font-size="18" fill="#3f86d9">α<tspan font-size="12" dy="5">stall</tspan></text>
      <text x="${s2x}" y="${gy0 + 26}" text-anchor="middle" font-family="PlexMono" font-size="18" fill="#d55a00">α<tspan font-size="12" dy="5">stall</tspan></text>
      <text x="${gx1}" y="${gy0 + 50}" text-anchor="end" font-family="PlexMono" font-size="22" fill="#3d4148">α</text>
      <text x="18" y="${(gy0 + gy1) / 2 + 8}" font-family="PlexMono" font-size="22" fill="#3d4148">C<tspan font-size="15" dy="6">L</tspan></text>
      <text x="${gx1}" y="${P(1, cl(1, a2))[1] - 14}" text-anchor="end" font-family="Plex" font-weight="600" font-size="16" letter-spacing="1" fill="#d55a00">ON</text>
      <text x="${gx1}" y="${P(1, cl(1, a1))[1] - 12}" text-anchor="end" font-family="Plex" font-weight="600" font-size="16" letter-spacing="1" fill="#3f86d9">OFF</text>
    </svg>` });

  finish(ctx, [
    { t: '<span class="nc">α</span> beyond stall', at: [-6.0, yTop + 0.22, 0.7], dx: 30, dy: -80 },
    { t: 'Actuators off: separated', at: [upT[45][0], upT[45][1] + 0.9, -0.4], dx: 120, dy: -120 },
    { t: 'Actuators on: attached', at: [upB[60][0], upB[60][1] + 0.2, 0.65], dx: -40, dy: -160 },
    { t: 'Sweeping jets', at: [p0[0] + 0.6, p0[1] + 0.1, 1.3], dx: -120, dy: 150 },
    { t: 'Fluidic oscillator', at: [5.3, 0.6, 0.6], dx: -10, dy: -95 },
  ]);
}
