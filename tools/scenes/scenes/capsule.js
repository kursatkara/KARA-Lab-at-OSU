import { THREE, C, setup, clay, glass, mesh, lathe, streamline, swirl, finish, inset } from './lib.js';

// Blunt reentry capsule (60° sphere-cone) pitching in a supersonic stream; flow along +x.
function capsuleGroup(op = 1) {
  const Rn = 0.85, th = Math.PI / 3, R = 1.0;
  const fore = [];
  for (let i = 0; i <= 24; i++) { const a = (Math.PI / 2 - th) * i / 24; fore.push([Rn * Math.sin(a), Rn * (1 - Math.cos(a))]); }
  const [rt, yt] = fore[fore.length - 1];
  const ysh = yt + (0.94 - rt) / Math.tan(th);
  fore.push([0.94, ysh]);
  for (let i = 1; i <= 10; i++) { const a = -Math.PI / 6 + (Math.PI / 2 + Math.PI / 6) * i / 10; fore.push([0.94 + 0.06 * Math.cos(a - Math.PI / 2 + Math.PI / 2), ysh + 0.06 * Math.sin(a)]); }
  const yb = fore[fore.length - 1][1];
  const back = [[R * 0.995, yb]]; for (let i = 1; i <= 12; i++) { const t = i / 12; back.push([R * 0.995 - (R * 0.995 - 0.44) * t, yb + 0.64 * t]); }
  back.push([0.43, yb + 0.67], [0.38, yb + 0.70], [0.2, yb + 0.715], [0.0, yb + 0.72]);
  const m1 = op < 1 ? glass('#4a4038', op) : clay('#5a4a3e');
  const m2 = op < 1 ? glass('#f4f1ec', op) : clay('#efebe4');
  const g = new THREE.Group();
  g.add(mesh(lathe(fore, 160), m1, { receive: false }));
  g.add(mesh(lathe([[R * 0.999, yb - 0.005], ...back], 160), m2, { receive: false }));
  if (op === 1) g.add(mesh(new THREE.TorusGeometry(0.83, 0.035, 12, 96), clay(C.orange), { pos: [0, yb + 0.16, 0], rot: [Math.PI / 2, 0, 0] }));
  g.rotation.z = -Math.PI / 2;           // lathe +y -> +x: heat shield faces the oncoming flow
  const pivot = new THREE.Group(); g.position.x = -0.45; pivot.add(g); return pivot;
}

export default async function () {
  const ctx = setup({ cam: [3.4, 2.2, 17.5], target: [1.4, -0.45, 0], fov: 28, lightPos: [3, 12, 9], shadowSize: 9 });
  const { scene } = ctx;
  // soft contact shadow on an invisible floor

  const S = 1.7, theta = 0.26;
  const cap = capsuleGroup(); cap.scale.setScalar(S); cap.rotation.z = theta; scene.add(cap);
  const ghost = capsuleGroup(0.13); ghost.scale.setScalar(S); ghost.rotation.z = -theta; scene.add(ghost);

  // Detached bow shock wrapping downstream (axisymmetric shell, cut to the visible half)
  const shock = []; for (let i = 0; i <= 48; i++) { const r = 4.2 * i / 48; shock.push([r, -0.95 + 0.105 * r * r]); }
  const sh = mesh(lathe(shock), glass('#a9cff7', 0.22, { emissive: '#a9cff7', emissiveIntensity: 0.25 }), { cast: false });
  sh.rotation.z = -Math.PI / 2; sh.position.x = -1.1; scene.add(sh);
  const shockX = r => -1.1 + (-0.95 + 0.105 * r * r) * -1 * -1; // x of shock surface at radius r

  // Free stream, then streamlines kinked at the shock, deflected around the body, converging into the wake
  for (const y of [-0.7, 0.7]) streamline(scene, [[-5.9, y, 0], [-4.3, y, 0]], { r: 0.06, color: C.ink, opacity: 1 });
  for (const y0 of [1.55, 2.5, -1.55, -2.5]) {
    const s = Math.sign(y0), ay = Math.abs(y0), xs = shockX(ay);
    streamline(scene, [[-4.1, y0, -0.3], [xs - 0.05, y0, -0.3], [xs + 0.35, y0 + s * 0.18, -0.3], [1.2, y0 + s * 0.12, -0.3], [3.0, y0 * 0.62, -0.3], [4.8, y0 * 0.42, -0.3]], { r: 0.042, color: C.flow, opacity: 0.85 });
  }
  // Turbulent wake behind the backshell
  swirl(scene, [2.6, 0.45, 0], { axis: [1, 0.08, 0], radius: 0.36, turns: 2.6, length: 1.8, color: C.hot, opacity: 0.9 });
  swirl(scene, [2.75, -0.5, 0], { axis: [1, -0.08, 0], radius: 0.32, turns: 2.4, length: 1.7, color: C.hot, opacity: 0.9 });

  // Pitch oscillation about the center of gravity: double-headed arc in front of the capsule
  const cg = [-0.05, 0, 1.25], Rr = 2.15, arc = [];
  for (let i = 0; i <= 40; i++) { const a = -0.5 + 1.0 * i / 40; arc.push([cg[0] + Rr * Math.sin(a), cg[1] + Rr * Math.cos(a), cg[2]]); }
  streamline(scene, arc, { r: 0.06, color: C.orange, opacity: 1 });
  streamline(scene, [...arc].reverse(), { r: 0.06, color: C.orange, opacity: 1 });
  scene.add(mesh(new THREE.SphereGeometry(0.1, 24, 16), clay(C.white), { pos: [cg[0], cg[1], 1.7] }));

  // Sub-figure: total angle of attack from two initial conditions. Small alpha_0 (2 deg) is dynamically unstable and grows;
  // large alpha_0 (20 deg) is stable and decays to a limit cycle (dashed).
  const w = 520, h = 404, px0 = 96, px1 = w - 24, ph = 112, amax = 22, L = 10;
  const panel = (yb, a0, grow) => {               // yb: baseline y of the panel
    let path = '', env = '';
    const Y = a => yb - ph * a / amax;
    for (let i = 0; i <= 700; i++) {
      const t = i / 700;
      const A = grow ? a0 * Math.exp(Math.log(amax * 0.86 / a0) * t)   // keeps growing over the whole window
                     : L + (a0 - L) * Math.exp(-5.2 * t);
      const X = px0 + (px1 - px0) * t;
      path += (i ? 'L' : 'M') + X.toFixed(1) + ',' + Y(A * Math.abs(Math.cos(2 * Math.PI * 7.5 * t))).toFixed(1);
      env += (i ? 'L' : 'M') + X.toFixed(1) + ',' + Y(A).toFixed(1);
    }
    return { path, env, yL: Y(L), y0: Y(a0) };
  };
  const yA = 186, yB = 362, top20 = panel(yA, 20, false), bot2 = panel(yB, 2, true);
  const axes = yb => `<line x1="${px0}" y1="${yb - ph - 8}" x2="${px0}" y2="${yb}" stroke="#b9b0a4" stroke-width="3"/><line x1="${px0}" y1="${yb}" x2="${px1}" y2="${yb}" stroke="#b9b0a4" stroke-width="3"/>`;
  const trace = (p, col, lc = true) => `${lc ? `<line x1="${px0}" y1="${p.yL}" x2="${px1}" y2="${p.yL}" stroke="#7a8088" stroke-width="2.5" stroke-dasharray="9 7"/>` : ''}<path d="${p.path}" fill="none" stroke="${col}" stroke-width="3.6" stroke-linejoin="round"/>`;
  const tag = (y, txt, col) => `<text x="${px1}" y="${y}" text-anchor="end" font-family="Plex" font-weight="600" font-size="19" letter-spacing="1" fill="${col}">${txt}</text>`;
  const a0lab = (y, v) => `<text x="${px0 - 10}" y="${y + 8}" text-anchor="end" font-family="PlexMono" font-size="21" fill="#3d4148">${v}°</text><line x1="${px0 - 6}" y1="${y}" x2="${px0}" y2="${y}" stroke="#b9b0a4" stroke-width="3"/>`;
  inset(ctx.stage, { x: 1200 - w - 18, y: 900 - h - 12, w, h, svg: `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <text x="24" y="40" font-family="Plex" font-weight="600" font-size="23" letter-spacing="1.5" fill="#3d4148">TOTAL ANGLE OF ATTACK</text>
      ${axes(yA)}${trace(top20, '#3f86d9')}${a0lab(top20.y0, 20)}${tag(yA - ph - 4, 'LARGE α₀: STABLE, DECAYS', '#3f86d9')}
      ${axes(yB)}${trace(bot2, '#ff7a1a', false)}${a0lab(bot2.y0, 2)}${tag(yB - ph - 4, 'SMALL α₀: UNSTABLE, GROWS', '#d55a00')}
      <text x="22" y="${(yA + yB) / 2 - 30}" font-family="PlexMono" font-size="28" fill="#3d4148">α<tspan font-size="19" dy="7">T</tspan></text>
      <text x="${px0 + 8}" y="${yA + 26}" font-family="Plex" font-weight="600" font-size="17" letter-spacing="1" fill="#7a8088">- - LIMIT CYCLE</text>
      <text x="${px1}" y="${h - 14}" text-anchor="end" font-family="PlexMono" font-size="21" fill="#5a6068">time</text>
    </svg>` });

  finish(ctx, [
    { t: 'Bow shock', at: [shockX(2.9), 2.9, 0], dx: -40, dy: -70 },
    { t: 'Pitch oscillation', at: [-0.05, 2.15, 1.25], dx: 150, dy: -95 },
    { t: 'Turbulent wake', at: [3.2, 0.5, 0], dx: 60, dy: -150 },
    { t: 'M<sub>∞</sub> = 1.44', at: [-5.1, 0.7, 0], dy: -62, math: true },
  ]);
}
