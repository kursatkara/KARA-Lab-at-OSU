import { THREE, C, setup, clay, glass, mesh, rbox, streamline, swirl, finish } from './lib.js';

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
  return up.map(([x, y]) => [x - c / 2, y + y0]);
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
  const ctx = setup({ cam: [-5.0, 6.0, 21.5], target: [0.5, -0.1, 0], fov: 30, lightPos: [-4, 12, 9], shadowSize: 9 });
  const { scene } = ctx;
  const yTop = 2.3, yBot = -2.4;
  const upT = wing(scene, yTop), upB = wing(scene, yBot);

  // --- actuators off: leading-edge separation, recirculation over the suction side, wide wake
  for (const z of [-1.4, 0.4]) {
    const le = upT[3];
    streamline(scene, [[-5.6, le[1] + 0.9, z], [-3.2, le[1] + 0.85, z], [le[0] + 0.1, le[1] + 0.35, z], [0.4, le[1] + 0.85, z], [2.4, le[1] + 0.95, z], [4.6, le[1] + 0.8, z]], { r: 0.042, color: C.flow, opacity: 0.85 });
  }
  for (const [f, rad] of [[0.3, 0.36], [0.55, 0.45], [0.8, 0.42]]) {
    const p = upT[Math.round(f * 80)];
    swirl(scene, [p[0], p[1] + rad + 0.08, -0.4], { axis: [0, 0, 1], radius: rad, turns: 2.4, length: 1.6, color: C.hot, opacity: 0.9, grow: 0.25 });
  }
  swirl(scene, [2.6, upT[80][1] + 0.1, -0.4], { axis: [0, 0, 1], radius: 0.38, turns: 2, length: 1.4, color: C.hot, opacity: 0.8 });

  // --- actuators on: sweeping jets near the leading edge; streamlines follow the suction side to the trailing edge
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
  for (const z of [-1.9, 0.6]) {
    const pts = [[-5.6, upB[0][1] + 0.75, z], [-3.0, upB[0][1] + 0.7, z]];
    upB.filter((_, i) => i % 7 === 0 && i > 2).forEach(p => pts.push([p[0], p[1] + 0.28, z]));
    const te = upB[80]; pts.push([te[0] + 0.9, te[1] - 0.2, z], [te[0] + 2.2, te[1] - 0.35, z]);
    streamline(scene, pts, { r: 0.042, color: C.flow, opacity: 0.9 });
  }

  // fluidic oscillator (actuator internals), top right
  const side = clay('#6f7782');
  const block = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.18, 1.25), [side, side, new THREE.MeshStandardMaterial({ map: oscTexture(), roughness: 0.8 }), side, side, side]);
  block.position.set(3.9, 0.15, 0.6); block.rotation.set(0.75, -0.25, 0); block.castShadow = true; scene.add(block);

  finish(ctx, [
    { t: '<span class="nc">α</span> beyond stall', at: [-5.2, yTop + 0.9, -1.4], dx: 20, dy: -70 },
    { t: 'Actuators off: separated', at: [upT[45][0], upT[45][1] + 1.0, -0.4], dx: 170, dy: -110 },
    { t: 'Actuators on: attached', at: [upB[60][0], upB[60][1] + 0.28, 0.6], dx: 210, dy: 100 },
    { t: 'Sweeping jets', at: [p0[0] + 0.6, p0[1] + 0.1, 1.3], dx: -170, dy: 120 },
    { t: 'Fluidic oscillator', at: [3.9, -0.05, 0.6], dx: 10, dy: 95 },
  ]);
}
