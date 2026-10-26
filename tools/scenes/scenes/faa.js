import { THREE, C, setup, clay, glass, mesh, rbox, tile, streamline, swirl, arrow, finish } from './lib.js';
import { city, evtol } from './city.js';

// FAA ASSURE A94: an AAM eVTOL descends to a rooftop vertiport through urban turbulence; gust loads on wing and rotor booms.
export default async function () {
  const ctx = setup({ cam: [17.5, 7.8, 15.5], target: [0.6, 4.4, 0.6], fov: 31, lightPos: [12, 16, 8], shadowSize: 11 });
  const { scene } = ctx;
  const top = tile(scene, { w: 11, d: 9, top: C.sage, base: C.sand });
  city(scene, top, [
    [-3.2, -2.4, 2.0, 2.0, 5.2, 'tank'], [0.6, -2.6, 2.2, 1.8, 4.0], [3.6, -2.2, 1.6, 1.8, 2.6, 'box'],
    [-3.4, 1.6, 1.8, 2.2, 2.8, 'box'], [3.6, 2.0, 1.8, 1.8, 3.2],
  ]);
  // vertiport tower with rooftop pad
  const h = 4.4, px = 0.6, pz = 1.6;
  scene.add(mesh(rbox(2.6, h, 2.6, 0.1, 3), clay('#e6e2db'), { pos: [px, top + h / 2, pz] }));
  for (let y = 0.6; y < h - 0.3; y += 0.55) scene.add(mesh(new THREE.BoxGeometry(2.2, 0.12, 0.02), clay('#bfc6cc'), { pos: [px, top + y, pz + 1.305], cast: false }));
  scene.add(mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.08, 64), clay('#596069'), { pos: [px, top + h + 0.04, pz] }));
  scene.add(mesh(new THREE.TorusGeometry(0.85, 0.05, 10, 64), clay(C.orange, { emissive: C.orange, emissiveIntensity: 0.3 }), { pos: [px, top + h + 0.09, pz], rot: [Math.PI / 2, 0, 0] }));

  // eVTOL descending
  const v = evtol(1.3); v.position.set(px + 2.4, top + h + 1.7, pz + 1.4); v.rotation.set(0.04, 2.6, 0.08); scene.add(v);

  // urban turbulence: separated shear layers off roof edges and building wakes (wind from -x)
  for (const [y, z] of [[top + 5.6, -1.2], [top + 6.6, 0.6], [top + 4.9, 3.2]]) {
    streamline(scene, [[-5.6, y, z], [-3.5, y + 0.1, z], [-1.6, y + 0.45, z + 0.2], [0.4, y + 0.1, z], [2.6, y - 0.2, z - 0.1], [5.2, y, z]], { r: 0.045, color: C.flow, opacity: 0.85 });
  }
  swirl(scene, [-1.2, top + 5.6, -2.0], { axis: [0, 0, 1], radius: 0.5, turns: 2.4, length: 1.4, color: C.flow, opacity: 0.8 });
  swirl(scene, [2.3, top + 4.7, 1.6], { axis: [0, 0, 1], radius: 0.42, turns: 2.2, length: 1.2, color: C.flow, opacity: 0.8 });
  swirl(scene, [-1.9, top + 3.4, 1.4], { axis: [0, 0, 1], radius: 0.36, turns: 2, length: 1.0, color: C.flow, opacity: 0.7 });

  // fluctuating loads on the wing and booms
  const wp = new THREE.Vector3(); v.updateMatrixWorld();
  for (const lp of [[0.1, 0.2, -1.9], [0.1, 0.2, 1.9], [1.05, 0.37, -1.25]]) {
    wp.set(...lp).applyMatrix4(v.matrixWorld);
    arrow(scene, [wp.x, wp.y + 0.15, wp.z], [wp.x, wp.y + 1.0, wp.z], { r: 0.055 });
  }
  const tip = new THREE.Vector3(0.1, 0.2, 1.9).applyMatrix4(v.matrixWorld);
  const pad = [px, top + h + 0.1, pz + 1.0];
  finish(ctx, [
    { t: 'AAM VTOL aircraft', at: [v.position.x, v.position.y + 0.1, v.position.z], dx: -250, dy: -150 },
    { t: 'Gust loads', at: [tip.x, tip.y + 1.05, tip.z], dx: 120, dy: -70 },
    { t: 'Rooftop vertiport', at: pad, dx: -190, dy: 120 },
    { t: 'Urban turbulence', at: [2.3, top + 4.7, 2.2], dx: 170, dy: 70 },
  ]);
}
