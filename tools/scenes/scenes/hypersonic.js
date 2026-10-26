import { THREE, C, setup, clay, glass, mesh, lathe, streamline, finish } from './lib.js';

// Blunt 7° cone at Mach 6: acoustic disturbances cross the bow shock, second-mode waves grow along the cone;
// passive control by a local cooling strip and an acoustic metasurface. Cone axis along +x.
export default async function () {
  const ctx = setup({ cam: [0.6, 3.6, 19], target: [-0.9, 0.35, 0], fov: 30, lightPos: [2, 12, 8], shadowSize: 9 });
  const { scene } = ctx;

  const rn = 0.32, half = 7 * Math.PI / 180, L = 7.2;
  const prof = [];
  for (let i = 0; i <= 30; i++) { const a = (Math.PI / 2 - half) * i / 30; prof.push([rn * Math.sin(a), rn * (1 - Math.cos(a))]); }
  const [rt, yt] = prof[prof.length - 1];
  const rBase = rt + (L - yt) * Math.tan(half);
  prof.push([rBase, L], [rBase * 0.98, L + 0.03], [0, L + 0.03]);
  const coneRadius = x => (x < yt ? rn : rt + (x - yt) * Math.tan(half));
  const cone = new THREE.Group();
  cone.add(mesh(lathe(prof, 160), clay('#e9e5de'), { receive: false }));
  // Sting support
  cone.add(mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.4, 32), clay(C.charcoal), { pos: [0, L + 1.2, 0] }));
  cone.rotation.z = -Math.PI / 2; cone.position.x = -3.6; scene.add(cone);
  const X0 = -3.6; // nose x

  // Local cooling strip and acoustic metasurface (porous band), as rings on the cone surface
  const ring = (x0, x1, mat) => {
    const p = []; for (let i = 0; i <= 12; i++) { const y = x0 + (x1 - x0) * i / 12; p.push([coneRadius(y) + 0.012, y]); }
    const m = mesh(lathe(p, 160), mat, { receive: false }); m.rotation.z = -Math.PI / 2; m.position.x = X0; scene.add(m);
  };
  ring(1.7, 2.35, clay('#3f86d9', { emissive: '#3f86d9', emissiveIntensity: 0.25 }));
  ring(4.1, 5.1, clay('#b9b2a7'));
  // pores of the metasurface on the visible side
  for (let i = 0; i < 9; i++) for (let j = -3; j <= 3; j++) {
    const y = 4.18 + i * 0.105, r = coneRadius(y) + 0.02, ang = j * 0.22 + 0.15;
    scene.add(mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.02, 10), clay('#4d4740'), { pos: [X0 + y, r * Math.sin(ang), r * Math.cos(ang)], rot: [Math.PI / 2 - ang, 0, 0], cast: false }));
  }

  // Bow shock (nearly conical downstream of the nose)
  const sp = []; for (let i = 0; i <= 50; i++) { const y = -0.12 + 7.6 * i / 50; sp.push([0.08 + Math.sqrt(Math.max(0, y + 0.12)) * 0.5 + y * 0.12, y]); }
  const shock = mesh(lathe(sp, 160), glass('#a9cff7', 0.18, { emissive: '#a9cff7', emissiveIntensity: 0.3 }), { cast: false });
  shock.rotation.z = -Math.PI / 2; shock.position.x = X0 - 0.12; scene.add(shock);

  // Free-stream acoustic disturbances: wavy lines approaching the shock
  for (const [y, z] of [[1.6, 0.4], [0.9, 0.9], [2.3, -0.2]]) {
    const pts = []; for (let i = 0; i <= 60; i++) { const x = -6.6 + 2.6 * i / 60; pts.push([x, y + 0.13 * Math.sin(i / 60 * Math.PI * 5), z]); }
    streamline(scene, pts, { r: 0.035, color: C.hot, opacity: 0.95 });
  }
  for (const y of [-0.9, -1.7]) streamline(scene, [[-6.6, y, 0.3], [-4.6, y, 0.3]], { r: 0.05, color: C.ink, opacity: 1 });

  // Second-mode (Mack-mode) waves: sinusoidal ribbons hugging the surface, amplitude growing downstream,
  // damped over the cooling strip and the metasurface
  const ampAt = y => { let a = 0.012 * Math.exp(0.42 * (y - 0.9)); if (y > 1.7 && y < 2.7) a *= 0.45; if (y > 4.1 && y < 5.4) a *= 0.32; return Math.min(a, 0.2); };
  for (const phi of [0.35, 0.85, 1.35]) {
    const pts = [];
    for (let i = 0; i <= 600; i++) {
      const y = 0.9 + 6.1 * i / 600, r = coneRadius(y) + 0.05 + ampAt(y) * (1 + Math.sin(y * 2 * Math.PI / 0.42));
      pts.push([X0 + y, r * Math.sin(phi), r * Math.cos(phi)]);
    }
    streamline(scene, pts, { r: 0.028, color: C.hot, opacity: 0.95, arrow: false, seg: 900 });
  }
  finish(ctx, [
    { t: 'Mach 6', at: [-6.0, -1.3, 0.3], dy: 70, math: false },
    { t: 'Acoustic disturbances', at: [-5.6, 2.45, -0.2], dx: 30, dy: -95 },
    { t: 'Bow shock', at: [-1.3, 1.05, 0.4], dx: -150, dy: -130 },
    { t: 'Cooling strip', at: [X0 + 2.0, -coneRadius(2.0), 0.3], dx: 10, dy: 150 },
    { t: 'Second-mode waves', at: [X0 + 3.6, coneRadius(3.6) * 0.8, coneRadius(3.6) * 0.6], dx: 40, dy: -150 },
    { t: 'Acoustic metasurface', at: [X0 + 4.6, -coneRadius(4.6), 0.4], dx: 150, dy: 110 },
  ]);
}
