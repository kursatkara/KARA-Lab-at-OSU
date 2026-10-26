import { THREE, C, clay, glass, mesh, rbox } from './lib.js';

// Deterministic downtown block: returns building footprints [{x, z, w, d, h}].
export function city(scene, top, layout) {
  const out = [];
  const cols = ['#e3dfd8', '#d8d3ca', '#cfc9bf', '#e9e5de', '#d2ccc2'];
  layout.forEach(([x, z, w, d, h, kind], i) => {
    const col = cols[i % cols.length];
    scene.add(mesh(rbox(w, h, d, 0.08, 3), clay(col), { pos: [x, top + h / 2, z] }));
    // window bands on two faces, roof details
    const band = clay('#bfc6cc');
    for (let y = 0.6; y < h - 0.3; y += 0.55) {
      scene.add(mesh(new THREE.BoxGeometry(w * 0.82, 0.12, 0.02), band, { pos: [x, top + y, z + d / 2 + 0.005], cast: false }));
      scene.add(mesh(new THREE.BoxGeometry(0.02, 0.12, d * 0.82), band, { pos: [x + w / 2 + 0.005, top + y, z], cast: false }));
    }
    if (kind === 'tank') scene.add(mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.35, 20), clay('#b9b2a7'), { pos: [x - w * 0.2, top + h + 0.17, z] }));
    if (kind === 'box') scene.add(mesh(rbox(w * 0.4, 0.3, d * 0.4, 0.05), clay('#c5beb3'), { pos: [x + w * 0.15, top + h + 0.15, z - d * 0.1] }));
    out.push({ x, z, w, d, h });
  });
  return out;
}

export function streets(scene, top, w, d) {
  scene.add(mesh(new THREE.BoxGeometry(w, 0.02, 0.7), clay('#b8bcc1'), { pos: [0, top + 0.01, 0], cast: false }));
  scene.add(mesh(new THREE.BoxGeometry(0.7, 0.02, d), clay('#b8bcc1'), { pos: [0, top + 0.012, 0], cast: false }));
}

// Small fixed-wing delivery drone, nose along +x.
export function fixedWing(scale = 1) {
  const g = new THREE.Group(), body = clay(C.charcoal), wing = clay('#e9e6e0'), acc = clay(C.orange);
  g.add(mesh(new THREE.CapsuleGeometry(0.13, 1.1, 8, 16), body, { rot: [0, 0, Math.PI / 2] }));
  g.add(mesh(rbox(0.42, 0.04, 2.3, 0.02), wing, { pos: [0.08, 0.02, 0] }));
  g.add(mesh(rbox(0.25, 0.03, 0.8, 0.015), wing, { pos: [-0.62, 0.05, 0] }));
  g.add(mesh(rbox(0.25, 0.32, 0.03, 0.015), acc, { pos: [-0.62, 0.2, 0] }));
  g.add(mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.015, 24), glass('#7a8189', 0.35), { pos: [0.72, 0, 0], rot: [0, 0, Math.PI / 2], cast: false }));
  g.scale.setScalar(scale); return g;
}

// Lift-plus-cruise eVTOL: fuselage, wing, eight lift rotors on booms, pusher propeller. Nose along +x.
export function evtol(scale = 1) {
  const g = new THREE.Group(), body = clay('#f1eee8'), dark = clay(C.charcoal), acc = clay(C.orange);
  g.add(mesh(new THREE.CapsuleGeometry(0.32, 1.6, 10, 24), body, { rot: [0, 0, Math.PI / 2] }));
  g.add(mesh(new THREE.SphereGeometry(0.3, 24, 16), glass('#5f7a92', 0.75), { pos: [0.75, 0.12, 0], scale: [1.1, 0.6, 0.8] }));
  g.add(mesh(rbox(0.55, 0.06, 4.2, 0.03), body, { pos: [0.1, 0.18, 0] }));
  g.add(mesh(rbox(0.35, 0.05, 1.3, 0.02), body, { pos: [-1.15, 0.45, 0] }));
  g.add(mesh(rbox(0.3, 0.45, 0.05, 0.02), acc, { pos: [-1.15, 0.25, 0] }));
  for (const z of [-1.25, -0.7, 0.7, 1.25]) {
    g.add(mesh(rbox(2.3, 0.06, 0.08, 0.03), dark, { pos: [0.1, 0.2, z] }));
    for (const x of [-0.85, 1.05]) {
      g.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.14, 12), dark, { pos: [x, 0.29, z] }));
      g.add(mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.012, 32), glass('#9aa6b2', 0.4), { pos: [x, 0.37, z], cast: false }));
    }
  }
  g.add(mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.012, 32), glass('#9aa6b2', 0.4), { pos: [-1.22, 0.05, 0], rot: [0, 0, Math.PI / 2], cast: false }));
  g.scale.setScalar(scale); return g;
}
