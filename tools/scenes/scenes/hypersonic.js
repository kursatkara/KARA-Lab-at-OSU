import { THREE, C, setup, clay, glass, mesh, lathe, streamline, swirl, finish } from './lib.js';

// Mach 6 blunt cones, side by side.
// Top, uncontrolled: free-stream acoustic disturbances excite first- and second-mode waves that grow, break down,
// and make the boundary layer turbulent, raising the surface heat flux.
// Bottom, controlled: a local cooling strip and an acoustic metasurface damp the waves; the flow stays laminar.
const rn = 0.3, half = 7 * Math.PI / 180, L = 7.0;
let seed = 7; const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

function coneProfile() {
  const prof = [];
  for (let i = 0; i <= 30; i++) { const a = (Math.PI / 2 - half) * i / 30; prof.push([rn * Math.sin(a), rn * (1 - Math.cos(a))]); }
  const [rt, yt] = prof[prof.length - 1];
  for (let i = 1; i <= 60; i++) { const y = yt + (L - yt) * i / 60; prof.push([rt + (y - yt) * Math.tan(half), y]); }
  const rB = rt + (L - yt) * Math.tan(half); prof.push([rB * 0.98, L + 0.03], [0, L + 0.03]);
  return { prof, R: x => (x < yt ? Math.sqrt(Math.max(0, rn * rn - (rn - x) ** 2)) : rt + (x - yt) * Math.tan(half)) };
}

// Surface coloured by heat flux: cool laminar grey-blue, hot turbulent orange-red downstream of transition.
function heatedCone(hotFrom) {
  const { prof, R } = coneProfile();
  const geo = lathe(prof, 160), pos = geo.attributes.position, col = [];
  const cool = new THREE.Color('#dfe5ec'), warm = new THREE.Color('#ffb27a'), hot = new THREE.Color('#e8542a');
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i); let c = cool.clone();
    if (hotFrom !== null && y > hotFrom) { const t = Math.min(1, (y - hotFrom) / 1.6); c = t < 0.5 ? cool.clone().lerp(warm, t * 2) : warm.clone().lerp(hot, (t - 0.5) * 2); }
    col.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  return { geo, R };
}

function buildCone(scene, y0, controlled) {
  const X0 = -3.4;
  const { geo, R } = heatedCone(controlled ? null : 3.9);
  const g = new THREE.Group();
  g.add(mesh(geo, clay('#ffffff', { vertexColors: true }), { receive: false }));
  g.add(mesh(new THREE.CylinderGeometry(0.15, 0.15, 2.0, 32), clay(C.charcoal), { pos: [0, L + 1.0, 0] }));
  g.rotation.z = -Math.PI / 2; g.position.set(X0, y0, 0); scene.add(g);
  // bow shock
  const sp = []; for (let i = 0; i <= 50; i++) { const y = -0.1 + 7.3 * i / 50; sp.push([0.06 + Math.sqrt(y + 0.1) * 0.42 + y * 0.115, y]); }
  const sh = mesh(lathe(sp, 160), glass('#a9cff7', 0.16, { emissive: '#a9cff7', emissiveIntensity: 0.3 }), { cast: false });
  sh.rotation.z = -Math.PI / 2; sh.position.set(X0 - 0.1, y0, 0); scene.add(sh);

  const ring = (a, b, mat) => {
    const p = []; for (let i = 0; i <= 12; i++) { const y = a + (b - a) * i / 12; p.push([R(y) + 0.014, y]); }
    const m = mesh(lathe(p, 160), mat, { receive: false }); m.rotation.z = -Math.PI / 2; m.position.set(X0, y0, 0); scene.add(m);
  };
  if (controlled) {
    ring(1.5, 2.1, clay('#3f86d9', { emissive: '#3f86d9', emissiveIntensity: 0.25 }));
    ring(3.4, 4.5, clay('#b9b2a7'));
    for (let i = 0; i < 10; i++) for (let j = -3; j <= 3; j++) {
      const y = 3.47 + i * 0.105, r = R(y) + 0.022, ang = j * 0.22 + 0.2;
      scene.add(mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.02, 10), clay('#4d4740'), { pos: [X0 + y, y0 + r * Math.sin(ang), r * Math.cos(ang)], rot: [Math.PI / 2 - ang, 0, 0], cast: false }));
    }
  }
  // instability waves: ribbons on the surface (amplitude growing; damped by the controls)
  const amp = y => {
    let a = 0.012 * Math.exp(0.55 * (y - 0.8));
    if (controlled) { if (y > 1.5) a *= Math.exp(-1.2 * Math.min(y - 1.5, 0.8)); if (y > 3.4) a *= Math.exp(-1.6 * Math.min(y - 3.4, 1.4)); }
    return Math.min(a, 0.16);
  };
  const end = controlled ? 6.9 : 4.0;
  for (const phi of [0.3, 0.85, 1.4]) {
    const pts = [];
    for (let i = 0; i <= 500; i++) { const y = 0.8 + (end - 0.8) * i / 500, r = R(y) + 0.05 + amp(y) * (1 + Math.sin(y * 2 * Math.PI / 0.4));
      pts.push([X0 + y, y0 + r * Math.sin(phi), r * Math.cos(phi)]); }
    streamline(scene, pts, { r: 0.026, color: controlled ? C.flow : C.hot, opacity: 0.95, arrow: false, seg: 700 });
  }
  if (!controlled) { // breakdown: turbulent eddies over the aft cone
    for (let k = 0; k < 16; k++) {
      const y = 4.0 + rand() * 2.8, phi = 0.15 + rand() * 1.5, r = R(y) + 0.18 + rand() * 0.12;
      swirl(scene, [X0 + y, y0 + r * Math.sin(phi), r * Math.cos(phi)], { axis: [1, (rand() - 0.5) * 0.6, (rand() - 0.5) * 0.6], radius: 0.07 + rand() * 0.07, turns: 2, length: 0.35, r: 0.018, color: rand() > 0.5 ? C.hot : '#e8542a', opacity: 0.9, grow: 0.3 });
    }
  }
  return { X0, R };
}

export default async function () {
  const ctx = setup({ cam: [0.4, 4.6, 21], target: [-0.6, 0.0, 0], fov: 30, lightPos: [2, 12, 9], shadowSize: 10 });
  const { scene } = ctx;
  const top = buildCone(scene, 1.75, false), bot = buildCone(scene, -1.85, true);

  for (const y of [2.5, 1.0, -1.1, -2.6]) {
    const pts = []; for (let i = 0; i <= 60; i++) { const x = -6.9 + 2.4 * i / 60; pts.push([x, y + 0.11 * Math.sin(i / 60 * Math.PI * 5), 0.3]); }
    streamline(scene, pts, { r: 0.032, color: C.hot, opacity: 0.95 });
  }
  finish(ctx, [
    { t: 'Acoustic disturbances', at: [-5.6, 2.62, 0.3], dx: 10, dy: -75 },
    { t: 'Mach 6', at: [-5.7, -0.05, 0.3] },
    { t: 'No control: transition', at: [-3.4 + 4.6, 1.75 + top.R(4.6) + 0.25, 0.3], dx: 0, dy: -125 },
    { t: 'High heat flux', at: [-3.4 + 6.4, 1.75 + top.R(6.4) * 0.2, 0.7], dx: 140, dy: 70 },
    { t: 'Cooling strip', at: [-3.4 + 1.8, -1.85 - bot.R(1.8), 0.3], dx: -150, dy: 105 },
    { t: 'Acoustic metasurface', at: [-3.4 + 4.0, -1.85 - bot.R(4.0), 0.4], dx: 60, dy: 125 },
    { t: 'Laminar: low heat flux', at: [-3.4 + 6.4, -1.85 + bot.R(6.4) * 0.3, 0.7], dx: 120, dy: 105 },
  ]);
}
