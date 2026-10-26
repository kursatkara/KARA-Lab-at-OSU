import { THREE, C, setup, clay, glass, glow, mesh, rbox, tile, streamline, swirl, finish } from './lib.js';

function screenTexture() {
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 1024; const g = cv.getContext('2d');
  g.fillStyle = '#fbfaf7'; g.fillRect(0, 0, 1024, 1024);
  // quantum circuit: 4 qubit wires with gates
  g.strokeStyle = '#3a3f47'; g.lineWidth = 6;
  for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(70, 90 + i * 85); g.lineTo(950, 90 + i * 85); g.stroke(); }
  const gate = (x, row, col) => { g.fillStyle = col; g.beginPath(); g.roundRect(x - 34, 90 + row * 85 - 30, 68, 60, 12); g.fill(); };
  [[180, 0, '#ff7a1a'], [180, 1, '#ff7a1a'], [180, 2, '#ff7a1a'], [180, 3, '#ff7a1a'], [430, 1, '#3f86d9'], [600, 3, '#3f86d9'], [780, 0, '#3f86d9'], [780, 2, '#ff7a1a']].forEach(a => gate(...a));
  g.lineWidth = 6; [[330, 0, 1], [520, 2, 3], [690, 1, 2]].forEach(([x, a, b]) => { g.beginPath(); g.moveTo(x, 90 + a * 85); g.lineTo(x, 90 + b * 85); g.stroke(); g.fillStyle = '#3a3f47'; g.beginPath(); g.arc(x, 90 + a * 85, 13, 0, 7); g.fill(); g.beginPath(); g.arc(x, 90 + b * 85, 20, 0, 7); g.stroke(); });
  // Burgers' shock: classical curve and quantum points
  const X0 = 90, X1 = 960, Y0 = 930, Y1 = 520;
  g.strokeStyle = '#c9c4bc'; g.lineWidth = 3; g.beginPath(); g.moveTo(X0, Y1 - 20); g.lineTo(X0, Y0); g.lineTo(X1, Y0); g.stroke();
  const u = x => 0.5 * (1 - Math.tanh((x - 0.55) / 0.035));
  g.strokeStyle = '#3a3f47'; g.lineWidth = 7; g.beginPath();
  for (let i = 0; i <= 400; i++) { const x = i / 400, px = X0 + (X1 - X0) * x, py = Y0 - (Y0 - Y1) * u(x); i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke();
  g.fillStyle = '#ff7a1a'; for (let i = 0; i <= 28; i++) { const x = i / 28, px = X0 + (X1 - X0) * x, py = Y0 - (Y0 - Y1) * u(x); g.beginPath(); g.arc(px, py, 11, 0, 7); g.fill(); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export default async function () {
  const ctx = setup({ cam: [9.5, 8.8, 16.0], target: [-0.3, 2.0, 0.6], fov: 30, lightPos: [6, 13, 7], shadowSize: 9 });
  const { scene } = ctx;
  const top = tile(scene, { w: 11, d: 7.5, top: '#e4ddd0', base: '#d6ccbb' });

  // frame
  const metal = clay('#9aa3ad');
  for (const x of [-3.6, 0.4]) scene.add(mesh(rbox(0.22, 5.6, 0.22, 0.05), metal, { pos: [x, top + 2.8, -0.8] }));
  scene.add(mesh(rbox(4.4, 0.25, 0.9, 0.08), metal, { pos: [-1.6, top + 5.6, -0.8] }));
  // dilution refrigerator "chandelier": gold stages, rods, coiled coax
  const gold = clay('#e2b04a', { roughness: 0.45, metalness: 0.35 }), copper = clay('#c97f4a', { roughness: 0.5, metalness: 0.3 });
  const cx = -1.6, cz = -0.8, stages = [[1.45, 5.15], [1.25, 4.35], [1.05, 3.6], [0.88, 2.9], [0.7, 2.25]];
  stages.forEach(([r, y]) => scene.add(mesh(new THREE.CylinderGeometry(r, r, 0.14, 64), gold, { pos: [cx, top + y, cz] })));
  for (let i = 0; i < stages.length - 1; i++) {
    const [r0, y0] = stages[i], [r1, y1] = stages[i + 1];
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.4, rr = Math.min(r0, r1) * 0.8;
      scene.add(mesh(new THREE.CylinderGeometry(0.035, 0.035, y0 - y1, 10), gold, { pos: [cx + rr * Math.cos(a), top + (y0 + y1) / 2, cz + rr * Math.sin(a)] })); }
    for (let k = 0; k < 3; k++) { const a = k * 2.1 + 1.1, rr = Math.min(r0, r1) * 0.45, pts = [];
      for (let j = 0; j <= 40; j++) { const t = j / 40; pts.push([cx + rr * Math.cos(a) + 0.08 * Math.cos(t * 18), top + y0 - (y0 - y1) * t, cz + rr * Math.sin(a) + 0.08 * Math.sin(t * 18)]); }
      streamline(scene, pts, { r: 0.018, color: '#c97f4a', opacity: 1, arrow: false }); }
  }
  // qubit chip at the mixing-chamber stage
  scene.add(mesh(rbox(0.7, 0.12, 0.7, 0.03), clay('#3a3f47'), { pos: [cx, top + 1.95, cz] }));
  scene.add(mesh(rbox(0.4, 0.04, 0.4, 0.01), glow(C.orange), { pos: [cx, top + 1.87, cz] }));
  for (let k = 0; k < 4; k++) scene.add(mesh(new THREE.SphereGeometry(0.05, 12, 8), glow('#ffd2a8'), { pos: [cx - 0.12 + 0.08 * k, top + 1.84, cz + 0.12] }));

  // display: circuit and Burgers' shock (quantum points on the classical curve)
  const scr = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3.4, 0.16), [clay('#d9d4cb'), clay('#d9d4cb'), clay('#d9d4cb'), clay('#d9d4cb'), new THREE.MeshStandardMaterial({ map: screenTexture(), roughness: 0.7 }), clay('#d9d4cb')]);
  scr.position.set(3.2, top + 2.6, 0.6); scr.rotation.y = -0.38; scr.castShadow = true; scene.add(scr);
  scene.add(mesh(rbox(0.2, 0.9, 0.2, 0.05), metal, { pos: [3.2, top + 0.45, 0.6] }));
  scene.add(mesh(rbox(1.2, 0.1, 0.8, 0.04), metal, { pos: [3.2, top + 0.05, 0.6] }));
  streamline(scene, [[cx + 0.4, top + 1.9, cz + 0.2], [0.6, top + 1.2, 0.2], [2.0, top + 1.3, 0.6]], { r: 0.03, color: C.flow, opacity: 0.9 });

  // Toward realistic aerodynamics: a 3D aircraft model with tip vortices and a turbulent wake
  const ac = new THREE.Group(), body = clay('#eceae5');
  ac.add(mesh(new THREE.CapsuleGeometry(0.16, 1.9, 10, 20), body, { rot: [0, 0, Math.PI / 2] }));
  const wp = new THREE.Shape(); wp.moveTo(0.35, 0); wp.lineTo(-0.35, 1.55); wp.lineTo(-0.7, 1.55); wp.lineTo(-0.45, 0); wp.closePath();
  for (const sgn of [1, -1]) {
    const g = new THREE.ExtrudeGeometry(wp, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 });
    const m = mesh(g, body); m.rotation.x = sgn * Math.PI / 2; m.position.y = sgn > 0 ? 0.03 : -0.03; ac.add(m);
  }
  ac.add(mesh(rbox(0.32, 0.5, 0.04, 0.02), clay(C.orange), { pos: [-0.95, 0.25, 0] }));
  ac.scale.setScalar(1.2); ac.position.set(-3.1, top + 1.9, 2.3); ac.rotation.set(0, Math.PI + 0.1, -0.08); scene.add(ac);
  scene.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 12), clay('#9aa3ad'), { pos: [-3.0, top + 0.95, 2.3] }));
  scene.add(mesh(rbox(0.8, 0.08, 0.8, 0.04), clay('#9aa3ad'), { pos: [-3.0, top + 0.04, 2.3] }));
  for (const sz of [1, -1]) swirl(scene, [-1.1, top + 1.95, 2.3 + sz * 1.95], { axis: [1, 0, 0], radius: 0.2, turns: 3.4, length: 2.6, r: 0.03, color: C.flow, opacity: 0.9, grow: 0.6 });
  let sd = 3; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  for (let k = 0; k < 8; k++) swirl(scene, [-1.6 + rnd() * 1.6, top + 1.7 + rnd() * 0.45, 1.95 + rnd() * 0.75], { axis: [1, (rnd() - 0.5) * 0.5, (rnd() - 0.5) * 0.5], radius: 0.08 + rnd() * 0.08, turns: 2, length: 0.4, r: 0.018, color: C.hot, opacity: 0.85 });
  for (const y of [0.25, -0.25]) streamline(scene, [[-5.4, top + 1.9 + y, 2.3], [-4.6, top + 1.9 + y, 2.3]], { r: 0.035, color: C.ink, opacity: 1 });
  // increasing complexity: from the 1D Burgers' display to the 3D flow
  streamline(scene, [[2.0, top + 0.9, 2.0], [0.6, top + 0.7, 3.0], [-1.4, top + 0.9, 3.2]], { r: 0.07, color: C.orange, opacity: 1 });

  finish(ctx, [
    { t: 'Qubits', at: [cx + 0.3, top + 1.85, cz + 0.2], dx: 120, dy: -20 },
    { t: 'Quantum circuit', at: [3.0, top + 3.7, 0.7], dx: 110, dy: -90 },
    { t: '1D Burgers’ shock', at: [3.4, top + 1.6, 0.6], dx: 120, dy: 70 },
    { t: '3D turbulent aerodynamics', at: [-3.0, top + 2.3, 2.3], dx: -40, dy: -150 },
    { t: 'Increasing complexity', at: [0.6, top + 0.7, 3.0], dx: 30, dy: 110 },
  ]);
}
