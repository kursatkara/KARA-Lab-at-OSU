import { THREE, C, setup, clay, glass, mesh, rbox, streamline, finish } from './lib.js';

// Wing section with a deflected flap; a spanwise array of sweeping jet actuators at the flap shoulder keeps the flow attached.
function airfoilShape(c = 4.2, t = 0.15, hinge = 0.7, defl = 0.42) {
  const yt = x => 5 * t * c * (0.2969 * Math.sqrt(x / c) - 0.126 * (x / c) - 0.3516 * (x / c) ** 2 + 0.2843 * (x / c) ** 3 - 0.1036 * (x / c) ** 4);
  const xh = hinge * c, pt = (x, y) => {
    if (x <= xh) return [x, y];
    const dx = x - xh, cs = Math.cos(-defl), sn = Math.sin(-defl); return [xh + dx * cs - y * sn, dx * sn + y * cs];
  };
  const up = [], lo = [];
  for (let i = 0; i <= 80; i++) { const x = c * (1 - Math.cos(Math.PI * i / 80)) / 2; up.push(pt(x, yt(x))); lo.push(pt(x, -yt(x))); }
  const s = new THREE.Shape(); s.moveTo(...up[0]); for (const p of up.slice(1)) s.lineTo(...p); for (const p of lo.slice().reverse()) s.lineTo(...p);
  return { s, up, c, xh };
}

function oscillatorTexture() {
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 640; const g = cv.getContext('2d');
  g.fillStyle = '#7d8590'; g.fillRect(0, 0, 1024, 640);
  g.fillStyle = '#f3efe8'; g.strokeStyle = '#f3efe8'; g.lineJoin = 'round';
  g.beginPath(); // inlet power nozzle
  g.moveTo(40, 250); g.lineTo(300, 285); g.lineTo(300, 355); g.lineTo(40, 390); g.closePath(); g.fill();
  g.beginPath(); g.roundRect(300, 200, 420, 240, 70); g.fill();               // mixing chamber
  g.lineWidth = 60; g.beginPath(); g.moveTo(380, 210); g.lineTo(380, 90); g.lineTo(760, 90); g.lineTo(760, 250); g.stroke();   // upper feedback
  g.beginPath(); g.moveTo(380, 430); g.lineTo(380, 550); g.lineTo(760, 550); g.lineTo(760, 390); g.stroke();                     // lower feedback
  g.beginPath(); g.moveTo(700, 290); g.lineTo(840, 300); g.lineTo(840, 340); g.lineTo(700, 350); g.closePath(); g.fill();      // throat
  g.beginPath(); g.moveTo(840, 300); g.lineTo(1000, 200); g.lineTo(1000, 440); g.lineTo(840, 340); g.closePath(); g.fill();     // diverging exit
  g.fillStyle = '#ff7a1a'; g.beginPath(); g.ellipse(520, 320, 120, 40, -0.2, 0, Math.PI * 2); g.fill();                         // jet attached to one wall
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export default async function () {
  const ctx = setup({ cam: [-2.6, 9.8, 10.2], target: [2.3, -0.2, 0.3], fov: 30, lightPos: [-3, 12, 8], shadowSize: 8 });
  const { scene } = ctx;
  const span = 6.2;
  const { s, up, c, xh } = airfoilShape(4.4, 0.15, 0.68, 0.45);
  const geo = new THREE.ExtrudeGeometry(s, { depth: span, bevelEnabled: false, curveSegments: 4 });
  const wing = new THREE.Mesh(geo, [clay('#5d6570'), clay('#eceae5')]); wing.position.z = -span / 2; wing.castShadow = wing.receiveShadow = true; scene.add(wing);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.13 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -1.6; floor.receiveShadow = true; scene.add(floor);

  // actuators at the flap shoulder; each jet sweeps side to side within a fan lying on the flap surface
  const defl = 0.45, hy = up.find(p => p[0] >= xh)[1];
  const xd = new THREE.Vector3(Math.cos(-defl), Math.sin(-defl), 0), zd = new THREE.Vector3(0, 0, 1);
  const nrm = new THREE.Vector3().crossVectors(zd, xd).normalize();
  for (let k = -2; k <= 2; k++) {
    const z = k * 1.15, o = new THREE.Vector3(xh + 0.02, hy + 0.03, z);
    scene.add(mesh(rbox(0.14, 0.06, 0.4, 0.02), clay(C.orange, { emissive: C.orange, emissiveIntensity: 0.3 }), { pos: [o.x, o.y, o.z] }));
    const R = 1.45, half = 0.45, pos = [o.x + nrm.x * 0.03, o.y + nrm.y * 0.03, o.z];
    const v = [...pos];
    for (let i = 0; i <= 30; i++) { const ph = -half + 2 * half * i / 30; const p = o.clone().addScaledVector(xd, R * Math.cos(ph)).addScaledVector(zd, R * Math.sin(ph)).addScaledVector(nrm, 0.03); v.push(p.x, p.y, p.z); }
    const idx = []; for (let i = 1; i <= 30; i++) idx.push(0, i, i + 1);
    const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); fg.setIndex(idx); fg.computeVertexNormals();
    scene.add(mesh(fg, glass(C.orangeSoft, 0.6, { emissive: C.orange, emissiveIntensity: 0.3 }), { cast: false }));
    for (const ph of [-half, 0, half]) {
      const e = o.clone().addScaledVector(xd, R * Math.cos(ph)).addScaledVector(zd, R * Math.sin(ph)).addScaledVector(nrm, 0.05);
      const b = o.clone().addScaledVector(nrm, 0.05);
      streamline(scene, [[b.x, b.y, b.z], [e.x, e.y, e.z]], { r: ph === 0 ? 0.03 : 0.02, color: C.orange, opacity: ph === 0 ? 1 : 0.6, arrow: ph === 0 });
    }
    const arc = []; for (let i = 0; i <= 24; i++) { const ph = -half * 0.8 + 1.6 * half * i / 24; const p = o.clone().addScaledVector(xd, 0.8 * Math.cos(ph)).addScaledVector(zd, 0.8 * Math.sin(ph)).addScaledVector(nrm, 0.08); arc.push([p.x, p.y, p.z]); }
    
  }
  // attached streamlines following the upper surface and the deflected flap
  for (const z of [-2.85, -0.6, 1.75]) {
    const pts = [[-1.7, 0.62, z], [-0.6, 0.62, z]];
    for (const p of up.filter((_, i) => i % 6 === 0 && i > 8)) pts.push([p[0], p[1] + 0.3, z]);
    const te = up[up.length - 1]; pts.push([te[0] + 0.9, te[1] - 0.25, z], [te[0] + 2.0, te[1] - 0.5, z]);
    streamline(scene, pts, { r: 0.04, color: C.flow, opacity: 0.9 });
  }
  // actuator geometry (cutaway) floating above the wing
  const tex = oscillatorTexture(), side = clay('#6f7782');
  const block = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.22, 1.56), [side, side, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }), side, side, side]);
  block.position.set(0.2, 1.9, -3.3); block.rotation.y = 0.1; block.castShadow = true; scene.add(block);

  finish(ctx, [
    { t: 'Sweeping jets', at: [xh + 0.9, hy - 0.3, 2.3], dx: -230, dy: 110 },
    { t: 'Fluidic oscillator: no moving parts', at: [1.2, 2.02, -3.0], dx: 300, dy: -25 },
    { t: 'Deflected flap', at: [c * 0.92, up[up.length - 1][1] * 0.5 - 0.1, 3.1], dx: 60, dy: 170 },
    { t: 'Attached flow', at: [c + 1.2, up[up.length - 1][1] - 0.3, -2.85], dx: 80, dy: -90 },
  ]);
}
