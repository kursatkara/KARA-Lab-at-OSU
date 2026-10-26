import { THREE, C, setup, clay, glass, mesh, rbox, tile, streamline, swirl, finish } from './lib.js';
import { city, streets, fixedWing } from './city.js';

// NSF NRI: LES of the urban wind field, compressed into a reduced-order model, used for wind-aware drone navigation.
function modesTexture() {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 512; const g = cv.getContext('2d');
  g.fillStyle = '#fbfaf7'; g.fillRect(0, 0, 512, 512);
  const cols = ['#3f86d9', '#ff7a1a', '#5aa77a'];
  cols.forEach((c, k) => { g.strokeStyle = c; g.lineWidth = 12; g.beginPath();
    for (let i = 0; i <= 200; i++) { const x = 40 + 432 * i / 200, y = 110 + k * 150 + 45 * Math.sin(i / 200 * Math.PI * (2 + k * 1.5)) * Math.exp(-k * 0.15); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); });
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export default async function () {
  const ctx = setup({ cam: [16.5, 13.0, 17.5], target: [-0.3, 2.0, 0], fov: 30, lightPos: [13, 16, 9], shadowSize: 11 });
  const { scene } = ctx;
  const top = tile(scene, { w: 12, d: 10, top: C.sage, base: C.sand });
  streets(scene, top, 11.6, 9.6);
  const B = city(scene, top, [
    [-3.4, -2.6, 1.6, 1.6, 3.4, 'tank'], [-1.4, -2.9, 1.3, 1.2, 2.2], [2.0, -2.6, 2.2, 1.5, 4.6, 'box'], [4.2, -2.8, 1.2, 1.4, 1.8],
    [-3.6, 2.4, 1.5, 1.8, 2.0, 'box'], [-1.4, 2.6, 1.4, 1.4, 3.0], [1.8, 2.3, 1.6, 1.6, 2.6, 'tank'], [4.0, 2.7, 1.4, 1.3, 1.5],
    [-1.3, -0.95, 0.9, 0.6, 1.0], [2.4, -0.4, 0.9, 0.5, 0.9],
  ]);
  // LES domain: translucent box with edges
  const dom = new THREE.BoxGeometry(11.2, 5.6, 9.2);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(dom), new THREE.LineBasicMaterial({ color: '#8fb3d6' }));
  edges.position.set(0, top + 2.8, 0); scene.add(edges);

  // wind entering from -z side (left in view), deflected around towers, with wakes behind them
  for (const [x, y] of [[-3.0, 1.2], [0.0, 2.4], [3.2, 1.4], [-1.0, 4.6], [2.6, 5.2]]) {
    streamline(scene, [[x, top + y, -5.6], [x, top + y, -4.2], [x + 0.6, top + y + 0.5, -2.6], [x + 0.2, top + y + 0.2, -0.6], [x - 0.3, top + y - 0.1, 1.4], [x - 0.2, top + y, 3.6], [x, top + y, 5.2]], { r: 0.045, color: C.flow, opacity: 0.85 });
  }
  // building-induced wake turbulence: eddies shed behind each tall building (wind along +z)
  let sd = 5; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  for (const b of B) {
    if (b.h < 1.9) continue;
    const n = b.h > 3.5 ? 4 : 3;
    for (let k = 0; k < n; k++) {
      const y = top + 0.5 + rnd() * (b.h - 0.4), zc = b.z + b.d / 2 + 0.45 + k * 0.55 + rnd() * 0.3;
      swirl(scene, [b.x + (rnd() - 0.5) * b.w * 0.8, y, zc], { axis: [(rnd() - 0.5) * 0.5, (rnd() - 0.5) * 0.4, 1], radius: 0.18 + rnd() * 0.16, turns: 2.2, length: 0.55, r: 0.03, color: k % 2 ? C.flow : C.hot, opacity: 0.9, grow: 0.3 });
    }
  }

  // wind-aware path: dashed route with waypoints, and the drone
  const path = new THREE.CatmullRomCurve3([[5.2, 4.2, -4.2], [3.0, 3.5, -1.0], [0.3, 3.3, 0.0], [-1.9, 3.5, 1.2], [-4.6, 4.0, 3.6]].map(p => new THREE.Vector3(p[0], top + p[1], p[2])));
  for (let i = 0; i < 46; i++) { const a = path.getPoint(i / 46), b = path.getPoint((i + 0.55) / 46);
    const d = b.clone().sub(a); const m = mesh(new THREE.CylinderGeometry(0.04, 0.04, d.length(), 8), clay('#2f9b5a'), { cast: false });
    m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); scene.add(m); }
  for (const t of [0.12, 0.34, 0.86]) scene.add(mesh(new THREE.SphereGeometry(0.16, 20, 12), clay('#7fd1a0'), { pos: path.getPoint(t).toArray() }));
  const dr = fixedWing(1.7); const p0 = path.getPoint(0.6), tg = path.getTangent(0.6);
  dr.position.copy(p0); dr.rotation.set(0, -Math.atan2(tg.z, tg.x), 0); scene.add(dr);

  // reduced-order model: a floating panel of POD modes
  const tex = modesTexture();
  const pan = new THREE.Mesh(rbox(2.0, 1.6, 0.12, 0.06), [clay('#e2ddd4'), clay('#e2ddd4'), clay('#e2ddd4'), clay('#e2ddd4'), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 }), clay('#e2ddd4')]);
  pan.geometry.clearGroups(); pan.geometry.addGroup(0, Infinity, 4);
  pan.position.set(-6.4, top + 4.4, 2.6); pan.rotation.y = 0.8; pan.castShadow = true; scene.add(pan);
  streamline(scene, [[-5.3, top + 4.3, 1.6], [-4.4, top + 3.9, 0.9]], { r: 0.035, color: '#b9b0a4', opacity: 1 });

  finish(ctx, [
    { t: 'LES wind field', at: [0, top + 5.6, -4.6], dx: -60, dy: -70 },
    { t: 'Building wakes', at: [2.0, top + 3.0, -1.4], dx: 210, dy: 60 },
    { t: 'Reduced-order model', at: [-6.4, top + 5.2, 2.6], dx: 0, dy: -60 },
    { t: 'Wind-aware path', at: path.getPoint(0.2).toArray(), dx: 120, dy: -150 },
    { t: 'Fixed-wing drone', at: p0.toArray(), dx: -60, dy: 190 },
  ]);
}
