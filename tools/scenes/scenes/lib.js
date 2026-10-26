// Shared helpers for the KARA Lab clay-style scenes.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
export { THREE };

export const W = 1200, H = 900;
export const C = {
  bgTop: '#f3f5f8', bgBot: '#e6eaef',
  ink: '#3a3f47', charcoal: '#454b54', steel: '#9aa3ad', light: '#f1eee8', white: '#faf8f4',
  orange: '#ff7a1a', orangeSoft: '#ffb27a', gold: '#e9b44c',
  sage: '#a9c49a', sageDark: '#8fb07f', sand: '#ece3d3', earth: '#c9b49a',
  water: '#86c0c9', waterDeep: '#5fa3b0',
  flow: '#3f86d9', flowSoft: '#8fbdf0', hot: '#ff8a3d', cool: '#3fb6e0',
  bldg: '#dedad3', bldgSide: '#cdc7bd', bldgDark: '#a9a39a',
};

export function setup({ cam = [10, 8, 10], target = [0, 0, 0], fov = 30, shadowSize = 14, lightPos = [7, 12, 6] } = {}) {
  const stage = document.getElementById('stage');
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const g = document.createElement('canvas'); g.width = 4; g.height = 256;
  const gx = g.getContext('2d'); const gr = gx.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, C.bgTop); gr.addColorStop(1, C.bgBot); gx.fillStyle = gr; gx.fillRect(0, 0, 4, 256);
  const bg = new THREE.CanvasTexture(g); bg.colorSpace = THREE.SRGBColorSpace; scene.background = bg;

  scene.add(new THREE.HemisphereLight('#f6f8ff', '#b8ae9f', 1.25));
  const sun = new THREE.DirectionalLight('#fff4e8', 2.3);
  sun.position.set(...lightPos); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); sun.shadow.radius = 10; sun.shadow.blurSamples = 20; sun.shadow.bias = -0.0005;
  const s = shadowSize; Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 0.5, far: 60 });
  scene.add(sun);
  const fill = new THREE.DirectionalLight('#dfe9ff', 0.55); fill.position.set(-8, 5, -4); scene.add(fill);

  const camera = new THREE.PerspectiveCamera(fov, W / H, 0.1, 400);
  camera.position.set(...cam); camera.lookAt(new THREE.Vector3(...target));
  return { renderer, scene, camera, stage };
}

export const clay = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0, ...o });
export const glass = (color, opacity = 0.3, o = {}) => new THREE.MeshStandardMaterial({
  color, transparent: true, opacity, roughness: 0.4, metalness: 0, depthWrite: false, side: THREE.DoubleSide, ...o });
export const glow = (color, opacity = 0.9) => new THREE.MeshStandardMaterial({
  color, emissive: color, emissiveIntensity: 0.55, roughness: 0.5, transparent: opacity < 1, opacity });

export function mesh(geo, mat, { pos = [0, 0, 0], rot = [0, 0, 0], scale, cast = true, receive = true } = {}) {
  const m = new THREE.Mesh(geo, mat); m.position.set(...pos); m.rotation.set(...rot);
  if (scale) m.scale.set(...(Array.isArray(scale) ? scale : [scale, scale, scale]));
  m.castShadow = cast; m.receiveShadow = receive; return m;
}
export const rbox = (w, h, d, r = 0.08, seg = 4) => new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2, h / 2, d / 2) * 0.999);

// A rounded ground tile: colored top slab over a cream base, like a museum diorama.
export function tile(scene, { w = 12, d = 12, top = C.sage, base = C.sand, y = 0, h = 0.7 } = {}) {
  const g = new THREE.Group();
  g.add(mesh(rbox(w, h * 0.72, d, 0.35, 6), clay(base), { pos: [0, y - h * 0.5, 0], cast: false }));
  g.add(mesh(rbox(w - 0.18, h * 0.38, d - 0.18, 0.3, 6), clay(top), { pos: [0, y - h * 0.08, 0], cast: false }));
  scene.add(g); return y + h * 0.11; // returns the top surface height
}

// Smooth flow ribbon (streamline) along points, with an optional arrowhead.
export function streamline(scene, pts, { r = 0.045, color = C.flow, opacity = 0.85, arrow = true, seg = 160 } = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), false, 'centripetal');
  const mat = opacity < 1 ? glass(color, opacity, { roughness: 0.5, emissive: color, emissiveIntensity: 0.15 }) : clay(color, { emissive: color, emissiveIntensity: 0.12 });
  const tube = mesh(new THREE.TubeGeometry(curve, seg, r, 10, false), mat, { cast: false });
  scene.add(tube);
  if (arrow) {
    const end = curve.getPoint(1), tan = curve.getTangent(1);
    const cone = mesh(new THREE.ConeGeometry(r * 3.2, r * 8, 16), mat, { cast: false });
    cone.position.copy(end).addScaledVector(tan, r * 3);
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan); scene.add(cone);
  }
  return curve;
}

// Helix-like swirl to depict a vortex / recirculation around an axis.
export function swirl(scene, center, { axis = [1, 0, 0], radius = 0.5, turns = 2.2, length = 1.2, r = 0.035, color = C.flow, opacity = 0.75, grow = 0.4 } = {}) {
  const a = new THREE.Vector3(...axis).normalize();
  const u = new THREE.Vector3(0, 1, 0); if (Math.abs(a.dot(u)) > 0.9) u.set(1, 0, 0);
  const v1 = new THREE.Vector3().crossVectors(a, u).normalize(), v2 = new THREE.Vector3().crossVectors(a, v1).normalize();
  const pts = []; const n = 90;
  for (let i = 0; i <= n; i++) {
    const t = i / n, ang = t * turns * Math.PI * 2, rr = radius * (1 - grow + grow * t);
    const p = new THREE.Vector3(...center).addScaledVector(a, (t - 0.5) * length)
      .addScaledVector(v1, Math.cos(ang) * rr).addScaledVector(v2, Math.sin(ang) * rr);
    pts.push([p.x, p.y, p.z]);
  }
  return streamline(scene, pts, { r, color, opacity, arrow: true });
}

export function arrow(scene, from, to, { r = 0.06, color = C.orange } = {}) {
  const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to), d = b.clone().sub(a), L = d.length();
  const mat = clay(color, { emissive: color, emissiveIntensity: 0.2 });
  const shaft = mesh(new THREE.CylinderGeometry(r, r, L * 0.78, 16), mat);
  shaft.position.copy(a).addScaledVector(d, 0.39); shaft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  const head = mesh(new THREE.ConeGeometry(r * 2.6, L * 0.26, 20), mat);
  head.position.copy(a).addScaledVector(d, 0.87); head.quaternion.copy(shaft.quaternion);
  scene.add(shaft, head);
}

// Render, then place label pills at projected 3D anchors. labels: [{t, at:[x,y,z], dx, dy, math}]
export function finish({ renderer, scene, camera, stage }, labels = []) {
  renderer.render(scene, camera);
  for (const L of labels) {
    const p = new THREE.Vector3(...L.at).project(camera);
    const ax = (p.x + 1) / 2 * W, ay = (1 - p.y) / 2 * H;
    const x = ax + (L.dx || 0), y = ay + (L.dy || 0);
    if (L.dx || L.dy) {
      const dx = x - ax, dy = y - ay, len = Math.hypot(dx, dy);
      const ln = document.createElement('div'); ln.className = 'lead';
      Object.assign(ln.style, { left: ax + 'px', top: ay + 'px', width: Math.max(0, len - 18) + 'px', transform: `rotate(${Math.atan2(dy, dx)}rad)` });
      stage.appendChild(ln);
      const dot = document.createElement('div'); dot.className = 'lead';
      Object.assign(dot.style, { left: ax - 4 + 'px', top: ay - 4 + 'px', width: '8px', height: '8px', borderRadius: '50%', transform: 'none' });
      stage.appendChild(dot);
    }
    const el = document.createElement('div'); el.className = 'pill' + (L.math ? ' math' : '');
    el.innerHTML = L.t; el.style.left = x + 'px'; el.style.top = y + 'px'; stage.appendChild(el);
    const w = el.offsetWidth, h = el.offsetHeight;   // keep every pill inside the frame
    el.style.left = Math.min(Math.max(x, w / 2 + 14), W - w / 2 - 14) + 'px';
    el.style.top = Math.min(Math.max(y, h / 2 + 14), H - h / 2 - 14) + 'px';
  }
}

// Lathe helper: profile as [[radius, axialPosition], ...] around +Y.
export function lathe(profile, seg = 96) {
  return new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(Math.max(r, 1e-4), y)), seg);
}

// A 2D sub-figure card drawn over the render (SVG plot), positioned in pixels.
export function inset(stage, { x, y, w, h, svg }) {
  const d = document.createElement('div');
  Object.assign(d.style, { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px',
    background: '#fffdfa', border: '2px solid #ddd6cc', borderRadius: '22px', boxShadow: '0 6px 16px rgba(40,30,20,.14)', overflow: 'hidden' });
  d.innerHTML = svg; stage.appendChild(d); return d;
}
