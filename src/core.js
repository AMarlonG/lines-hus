// Shared geometry builders, materials and per-house state
import * as THREE from 'three';
export { THREE };

// Plan coordinates (metres): x → east (entrance end x=0, ocean glass wall x=W),
// y → north (south wall y=0, sloping wall on the north side). Three.js: (x, height, -y).
export const W = 11, DR = 10, DL = 5.6, SLOPE = (DR - DL) / W;
export const topY = (x) => DL + SLOPE * x;
export const FH = 2.95;     // floor-to-floor
export const CH2 = 2.7;     // upper ceiling height
export const OUTLINE = [[0, 0], [W, 0], [W, DR], [0, DL]];
export const RECT = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
export const inPoly = (x, y) => x >= 0 && x <= W && y >= 0 && y <= topY(x);
export function pip(poly, x, y) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
}

// ---------------------------------------------------------------------------
// Textures & materials
// ---------------------------------------------------------------------------
function canvasTex(size, draw, metres = 1) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1 / metres, 1 / metres);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
export const rnd = (a, b) => a + Math.random() * (b - a);
export { canvasTex };

const oakTex = canvasTex(1024, (g, s) => {
  const rows = 10, rh = s / rows;
  for (let r = 0; r < rows; r++) {
    let x = -rnd(0, s);
    while (x < s) {
      const len = rnd(s * 0.45, s * 0.9), l = rnd(62, 70), hue = rnd(30, 36);
      g.fillStyle = `hsl(${hue},${rnd(38, 48)}%,${l}%)`;
      g.fillRect(x, r * rh, len, rh);
      g.globalAlpha = 0.12;
      for (let k = 0; k < 14; k++) {
        g.strokeStyle = `hsl(${hue},40%,${l - rnd(10, 20)}%)`;
        g.beginPath();
        const yy = r * rh + rnd(2, rh - 2);
        g.moveTo(x, yy);
        g.bezierCurveTo(x + len * 0.3, yy + rnd(-3, 3), x + len * 0.7, yy + rnd(-3, 3), x + len, yy + rnd(-2, 2));
        g.stroke();
      }
      g.globalAlpha = 1;
      g.fillStyle = 'rgba(70,50,30,0.35)'; g.fillRect(x, r * rh, 2, rh);
      x += len;
    }
    g.fillStyle = 'rgba(70,50,30,0.3)'; g.fillRect(0, r * rh, s, 2);
  }
}, 2);
const tileTex = canvasTex(512, (g, s) => {
  g.fillStyle = '#b9b5ae'; g.fillRect(0, 0, s, s);
  const n = 3, ts = s / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    g.fillStyle = `hsl(35,6%,${rnd(80, 85)}%)`;
    g.fillRect(i * ts + 3, j * ts + 3, ts - 6, ts - 6);
  }
}, 0.9);
const claddingTex = canvasTex(512, (g, s) => {
  const n = 7, bw = s / n;
  for (let i = 0; i < n; i++) {
    g.fillStyle = `hsl(200,6%,${rnd(19, 24)}%)`; g.fillRect(i * bw, 0, bw, s);
    g.fillStyle = 'rgba(0,0,0,0.45)'; g.fillRect(i * bw, 0, 3, s);
  }
}, 1);
export const grassTex = canvasTex(512, (g, s) => {
  g.fillStyle = '#6f8f50'; g.fillRect(0, 0, s, s);
  for (let k = 0; k < 9000; k++) { g.fillStyle = `hsl(${rnd(80, 100)},${rnd(25, 40)}%,${rnd(30, 45)}%)`; g.fillRect(rnd(0, s), rnd(0, s), 2, 2); }
}, 4);
const concreteTex = canvasTex(512, (g, s) => {
  g.fillStyle = '#a7a59f'; g.fillRect(0, 0, s, s);
  for (let k = 0; k < 6000; k++) { g.fillStyle = `rgba(${Math.random() < 0.5 ? '255,255,255' : '0,0,0'},0.05)`; g.fillRect(rnd(0, s), rnd(0, s), rnd(1, 4), rnd(1, 4)); }
}, 3);
const deckTex = canvasTex(512, (g, s) => {
  const n = 8, bw = s / n;
  for (let i = 0; i < n; i++) {
    g.fillStyle = `hsl(28,${rnd(25, 35)}%,${rnd(42, 50)}%)`; g.fillRect(0, i * bw, s, bw);
    g.fillStyle = 'rgba(0,0,0,0.4)'; g.fillRect(0, i * bw, s, 3);
  }
}, 1.2);

export const M = {
  wall: new THREE.MeshStandardMaterial({ color: 0xf2efe9, roughness: 0.92 }),
  clad: new THREE.MeshStandardMaterial({ map: claddingTex, roughness: 0.85 }),
  oak: new THREE.MeshStandardMaterial({ map: oakTex, roughness: 0.6 }),
  tile: new THREE.MeshStandardMaterial({ map: tileTex, roughness: 0.4 }),
  ceiling: new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 1 }),
  concrete: new THREE.MeshStandardMaterial({ map: concreteTex, roughness: 0.95 }),
  grass: new THREE.MeshStandardMaterial({ map: grassTex, roughness: 1 }),
  deck: new THREE.MeshStandardMaterial({ map: deckTex, roughness: 0.8 }),
  roof: new THREE.MeshStandardMaterial({ color: 0x3a3d40, roughness: 0.9 }),
  glass: new THREE.MeshStandardMaterial({ color: 0xbcd8e8, transparent: true, opacity: 0.22, roughness: 0.05, metalness: 0.1, depthWrite: false, side: THREE.DoubleSide }),
  frame: new THREE.MeshStandardMaterial({ color: 0x2b2d2f, roughness: 0.5, metalness: 0.3 }),
  white: new THREE.MeshStandardMaterial({ color: 0xf7f7f5, roughness: 0.5 }),
  door: new THREE.MeshStandardMaterial({ color: 0xf4f2ee, roughness: 0.6 }),
  frontDoor: new THREE.MeshStandardMaterial({ color: 0x5b4632, roughness: 0.6 }),
  stone: new THREE.MeshStandardMaterial({ color: 0x55575a, roughness: 0.75 }),
  darkStone: new THREE.MeshStandardMaterial({ color: 0x2a2a2b, roughness: 0.4 }),
  plaster: new THREE.MeshStandardMaterial({ color: 0xd9d4cc, roughness: 0.95 }),
  fabric: new THREE.MeshStandardMaterial({ color: 0x7d8a96, roughness: 1 }),
  fabric2: new THREE.MeshStandardMaterial({ color: 0xc9b9a0, roughness: 1 }),
  linen: new THREE.MeshStandardMaterial({ color: 0xf1ede6, roughness: 1 }),
  wood: new THREE.MeshStandardMaterial({ color: 0xb48a5e, roughness: 0.6 }),
  darkWood: new THREE.MeshStandardMaterial({ color: 0x4a3a2c, roughness: 0.6 }),
  black: new THREE.MeshStandardMaterial({ color: 0x18181a, roughness: 0.5 }),
  rug: new THREE.MeshStandardMaterial({ color: 0xd8cfc0, roughness: 1 }),
  fire: new THREE.MeshStandardMaterial({ color: 0xff9a3c, emissive: 0xff7a1a, emissiveIntensity: 2.2 }),
  steel: new THREE.MeshStandardMaterial({ color: 0xc8cacc, roughness: 0.3, metalness: 0.8 }),
  plant: new THREE.MeshStandardMaterial({ color: 0x4f7a43, roughness: 1 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x3b4a52, roughness: 1 }),
  books: new THREE.MeshStandardMaterial({ color: 0x8a6b55, roughness: 0.9 }),
};

export function boxGeo(w, h, d) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) {
    const i = f * 4 + v;
    uv.setXY(i, uv.getX(i) * dims[f][0], uv.getY(i) * dims[f][1]);
  }
  return g;
}

// ---------------------------------------------------------------------------
// Per-house state (reset on every build)
// ---------------------------------------------------------------------------
export const S = {
  G0: null, G1: null, GR: null,
  segs: [], obstacles: [], mapItems: { 0: [], 1: [] }, stairs: [], balconies: [], rooms: { 0: [], 1: [] },
  lights: [], teleports: {},
};
export function resetState(G0, G1, GR) {
  Object.assign(S, { G0, G1, GR, segs: [], obstacles: [], mapItems: { 0: [], 1: [] }, stairs: [], balconies: [], rooms: { 0: [], 1: [] }, lights: [], teleports: {} });
}
export function walkable(lv, x, y) {
  if (lv === 0) return true;
  return inPoly(x, y) || S.balconies.some((p) => pip(p, x, y));
}

export function mesh(geo, mat, parent, shadow = true) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = shadow; m.receiveShadow = true;
  parent.add(m);
  return m;
}
export function box(parent, x0, x1, y0, y1, z0, z1, mat, opt = {}) {
  const m = mesh(boxGeo(x1 - x0, z1 - z0, y1 - y0), mat, parent, opt.shadow !== false);
  m.position.set((x0 + x1) / 2, (z0 + z1) / 2, -(y0 + y1) / 2);
  if (opt.obstacle !== undefined) S.obstacles.push({ x0, x1, y0, y1, lv: opt.obstacle });
  if (opt.map !== undefined) S.mapItems[opt.map].push({ t: 'rect', x0, x1, y0, y1 });
  return m;
}
export function cyl(parent, cx, cy, r, z0, z1, mat, seg = 32) {
  const m = mesh(new THREE.CylinderGeometry(r, r, z1 - z0, seg), mat, parent);
  m.position.set(cx, (z0 + z1) / 2, -cy);
  return m;
}
export const lvOf = (parent) => (parent === S.G1 ? 1 : 0);
export const zOf = (parent) => (parent === S.G1 ? FH : 0);

// ---------------------------------------------------------------------------
// Walls. Openings can be given as distance along the wall {a,b}, or as plan
// coordinates {x0,x1} / {y0,y1}. kind: 'win' | 'door' | 'front' | 'slide'.
// ---------------------------------------------------------------------------
export function wall(parent, ax, ay, bx, by, opts) {
  const t = opts.t ?? 0.1, base = opts.base ?? 0, h = opts.h ?? 2.7;
  const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy);
  const ux = dx / L, uy = dy / L;
  const g = new THREE.Group();
  g.position.set(ax, base, -ay);
  g.rotation.y = Math.atan2(dy, dx);
  parent.add(g);
  const mats = opts.ext ? [M.clad, M.clad, M.wall, M.wall, M.clad, M.wall] : M.wall;
  const ops = (opts.openings || []).map((o) => {
    let a = o.a, b = o.b;
    if (o.x0 !== undefined) { a = (o.x0 - ax) / ux; b = (o.x1 - ax) / ux; }
    else if (o.y0 !== undefined) { a = (o.y0 - ay) / uy; b = (o.y1 - ay) / uy; }
    if (a > b) [a, b] = [b, a];
    return { ...o, a: Math.max(0, a), b: Math.min(L, b) };
  }).sort((p, q) => p.a - q.a);
  const ext = t / 2;
  const piece = (s0, s1, z0, z1) => {
    if (s1 - s0 < 0.001 || z1 - z0 < 0.001) return;
    const m = mesh(boxGeo(s1 - s0, z1 - z0, t), mats, g);
    m.position.set((s0 + s1) / 2, (z0 + z1) / 2, 0);
  };
  const lb = (s0, s1, z0, z1, mat, depth) => {
    const m = mesh(boxGeo(s1 - s0, z1 - z0, depth), mat, g, false);
    m.position.set((s0 + s1) / 2, (z0 + z1) / 2, 0);
    return m;
  };
  const segAdd = (s0, s1) => {
    if (s1 - s0 < 0.01) return;
    S.segs.push({ ax: ax + ux * s0, ay: ay + uy * s0, bx: ax + ux * s1, by: ay + uy * s1, r: t / 2, lv: new Set(opts.lv) });
  };
  const lvl = opts.lv.includes(1) ? 1 : 0;
  let cur = -ext, segStart = -ext;
  for (const o of ops) {
    piece(cur, o.a, 0, h);
    const sill = o.sill ?? 0, head = o.head ?? 2.1;
    piece(o.a, o.b, head, h);
    if (sill > 0) piece(o.a, o.b, 0, sill);
    const fw = 0.05, fd = t * 0.7;
    const P = (s) => [ax + ux * s, ay + uy * s];
    if (o.kind === 'win') {
      lb(o.a, o.b, sill, head, M.glass, 0.02);
      lb(o.a, o.a + fw, sill, head, M.frame, fd);
      lb(o.b - fw, o.b, sill, head, M.frame, fd);
      lb(o.a, o.b, head - fw, head, M.frame, fd);
      lb(o.a, o.b, sill, sill + fw, M.frame, fd);
      const n = Math.ceil((o.b - o.a) / 1.3);
      for (let k = 1; k < n; k++) { const s = o.a + (o.b - o.a) * k / n; lb(s - fw / 2, s + fw / 2, sill, head, M.frame, fd); }
      S.mapItems[lvl].push({ t: 'win', a: P(o.a), b: P(o.b) });
    } else {
      const dm = o.kind === 'door' ? M.white : o.kind === 'front' ? M.frontDoor : M.frame;
      lb(o.a, o.a + 0.04, 0, head, dm, t + 0.02);
      lb(o.b - 0.04, o.b, 0, head, dm, t + 0.02);
      lb(o.a, o.b, head - 0.04, head, dm, t + 0.02);
      if (o.kind === 'slide') {
        const half = o.a + (o.b - o.a) / 2 + 0.04;
        const p = lb(o.a + 0.04, half, 0.02, head - 0.04, M.glass, 0.02); p.position.z = t / 2 + 0.04;
        const f = lb(o.a + 0.04, half, 0.0, 0.05, M.frame, 0.04); f.position.z = t / 2 + 0.04;
      } else if (o.kind === 'door' || o.kind === 'front') {
        const w = o.b - o.a - 0.09;
        const pivot = new THREE.Group();
        pivot.position.set(o.a + 0.045, 0, 0);
        pivot.rotation.y = (o.open === 'R' ? -1 : 1) * Math.PI / 2 * 0.92;
        g.add(pivot);
        const leaf = mesh(boxGeo(w, head - 0.06, 0.04), o.kind === 'front' ? M.frontDoor : M.door, pivot);
        leaf.position.set(w / 2, (head - 0.06) / 2 + 0.01, 0);
        const knob = mesh(new THREE.SphereGeometry(0.03, 12, 8), M.steel, pivot, false);
        knob.position.set(w - 0.07, 1.0, 0.04);
      }
      segAdd(segStart, o.a);
      segStart = o.b;
      S.mapItems[lvl].push({ t: 'door', a: P(o.a), b: P(o.b) });
    }
    cur = o.b;
  }
  piece(cur, L + ext, 0, h);
  segAdd(segStart, L + ext);
  S.mapItems[lvl].push({ t: 'wall', a: [ax, ay], b: [bx, by], w: t });
}

// Wall presets
export const EXT0 = () => ({ t: 0.25, base: 0, h: FH, ext: true, lv: [0, 'S'] });
export const INT0 = () => ({ t: 0.1, base: 0, h: FH, lv: [0, 'S'] });
export const EXT1 = () => ({ t: 0.25, base: FH, h: CH2 + 0.35, ext: true, lv: [1, 'S'] });
export const INT1 = () => ({ t: 0.1, base: FH, h: CH2 + 0.1, lv: [1, 'S'] });
export const iw = (parent, ax, ay, bx, by, openings = [], extra = {}) =>
  wall(parent, ax, ay, bx, by, { ...(parent === S.G1 ? INT1() : INT0()), openings, ...extra });
export const ew = (parent, ax, ay, bx, by, openings = [], extra = {}) =>
  wall(parent, ax, ay, bx, by, { ...(parent === S.G1 ? EXT1() : EXT0()), openings, ...extra });

// ---------------------------------------------------------------------------
// Floors, slabs
// ---------------------------------------------------------------------------
function shapeFrom(pts, holes = []) {
  const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  for (const h of holes) s.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
  return s;
}
export function flat(parent, pts, z, mat, holes = []) {
  const geo = new THREE.ShapeGeometry(shapeFrom(pts, holes));
  geo.rotateX(-Math.PI / 2);
  const m = mesh(geo, mat, parent, false);
  m.position.y = z;
  return m;
}
export function slab(parent, pts, z0, z1, mat, holes = []) {
  const geo = new THREE.ExtrudeGeometry(shapeFrom(pts, holes), { depth: z1 - z0, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2);
  const m = mesh(geo, mat, parent);
  m.position.y = z0;
  return m;
}
export const slopedPoly = (x0, x1, y0) => [[x0, y0], [x1, y0], [x1, topY(x1)], [x0, topY(x0)]]; // room bounded by the sloping wall

// glass railing with handrail + collision segment
export function glassRail(parent, ax, ay, bx, by, base, lv, h = 1.0) {
  const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy);
  const g = new THREE.Group(); g.position.set(ax, base, -ay); g.rotation.y = Math.atan2(dy, dx); parent.add(g);
  const gl = mesh(boxGeo(L, h, 0.02), M.glass, g, false); gl.position.set(L / 2, h / 2, 0);
  const hr = mesh(boxGeo(L, 0.04, 0.06), M.darkWood, g); hr.position.set(L / 2, h + 0.02, 0);
  S.segs.push({ ax, ay, bx, by, r: 0.06, lv: new Set(lv) });
  S.mapItems[lv.includes(1) ? 1 : 0].push({ t: 'wall', a: [ax, ay], b: [bx, by], w: 0.05 });
}

// Balcony hanging off the sloping wall between xa and xb, at upper floor level
export function balcony(xa, xb, depth = 1.4) {
  const nl = Math.hypot(SLOPE, 1), nx = -SLOPE / nl, ny = 1 / nl;
  const A = [xa, topY(xa)], B = [xb, topY(xb)];
  const C = [B[0] + nx * depth, B[1] + ny * depth], D = [A[0] + nx * depth, A[1] + ny * depth];
  const poly = [A, B, C, D];
  slab(S.G1, poly, FH - 0.25, FH - 0.01, M.ceiling);
  flat(S.G1, poly, FH, M.deck);
  glassRail(S.G1, D[0], D[1], C[0], C[1], FH, [1]);
  glassRail(S.G1, A[0], A[1], D[0], D[1], FH, [1]);
  glassRail(S.G1, B[0], B[1], C[0], C[1], FH, [1]);
  S.balconies.push(poly);
  S.mapItems[1].push({ t: 'poly', pts: poly });
  return poly;
}

// ---------------------------------------------------------------------------
// Stairs. Each returns the ceiling-hole rectangle for the upper slab.
// ---------------------------------------------------------------------------
// Straight stair along x. top: 'W' = high end at x0. openTop: length along the
// upper south side (from the top end) left without railing so you can step off sideways.
export function straightStair({ x0, x1, y0, y1, top = 'W', fronts = [], openTop = 0, rails = true }) {
  const n = 14, run = (x1 - x0) / (n - 1), rh = FH / n;
  const h = (x) => THREE.MathUtils.clamp(top === 'W' ? (x1 - x) / (x1 - x0) : (x - x0) / (x1 - x0), 0, 1) * FH;
  for (let i = 0; i < n - 1; i++) {
    const xa = top === 'W' ? x1 - (i + 1) * run : x0 + i * run;
    const xb = xa + run;
    box(S.G0, xa, xb, y0, y1, 0, (i + 1) * rh, M.white);
    box(S.G0, xa - 0.01, xb + 0.01, y0, y1, (i + 1) * rh - 0.04, (i + 1) * rh + 0.005, M.oak);
    S.mapItems[0].push({ t: 'tl', a: [xa, y0], b: [xa, y1] });
    S.mapItems[1].push({ t: 'tl', a: [xa, y0], b: [xa, y1] });
  }
  // cupboard fronts under the high end, facing south
  for (const [a, b] of fronts) {
    const hh = Math.min(h(a), h(b)) - 0.08;
    box(S.G0, a, b, y0 - 0.02, y0, 0.05, hh, M.door);
    box(S.G0, b - 0.06, b - 0.04, y0 - 0.04, y0 - 0.02, hh / 2 - 0.2, hh / 2 + 0.2, M.steel);
  }
  // handrail on the south side
  const len = Math.hypot(x1 - x0, FH);
  const rail = mesh(new THREE.CylinderGeometry(0.022, 0.022, len, 8), M.darkWood, S.G0);
  rail.rotation.z = (top === 'W' ? 1 : -1) * Math.atan2(x1 - x0, FH);
  rail.position.set((x0 + x1) / 2, FH / 2 + 0.92, -(y0 + 0.04));
  for (let k = 0; k <= 4; k++) {
    const x = x1 - 0.15 - k * (x1 - x0 - 0.3) / 4;
    box(S.G0, x - 0.015, x + 0.015, y0 + 0.025, y0 + 0.055, h(x), h(x) + 0.92, M.frame);
  }
  const hiX = top === 'W' ? x0 : x1, loX = top === 'W' ? x1 : x0;
  const sxa = top === 'W' ? x0 + openTop : x0, sxb = top === 'W' ? x1 : x1 - openTop;
  S.segs.push({ ax: x0, ay: y0, bx: x1, by: y0, r: 0.05, lv: new Set([0]) });
  S.segs.push({ ax: sxa, ay: y0, bx: sxb, by: y0, r: 0.05, lv: new Set(['S']) });
  S.segs.push({ ax: x0, ay: y1, bx: x1, by: y1, r: 0.05, lv: new Set([0, 1, 'S']) });
  S.segs.push({ ax: hiX, ay: y0, bx: hiX, by: y1, r: 0.05, lv: new Set([0]) });
  if (rails) {
    glassRail(S.G1, sxa, y0, sxb, y0, FH, [1]);
    glassRail(S.G1, loX, y0, loX, y1, FH, [1]);
  }
  S.stairs.push({
    inZone: (x, y) => x > x0 && x < x1 && y > y0 && y < y1,
    h: (x) => h(x),
  });
  return RECT(x0, x1, y0, y1);
}

// U-shaped stair in an enclosure x0..x1, y0..y1, open (start + finish) at the north edge y1.
// First flight in the west strip going south, landing at the south end, second flight back north.
export function uStair({ x0, x1, y0, y1, landing = 1.2 }) {
  const xm = (x0 + x1) / 2, yL = y0 + landing;
  const nT = 7, run = (y1 - yL) / nT, rh = FH / 16;
  const h = (x, y) => {
    if (y <= yL) return FH / 2;
    const t = THREE.MathUtils.clamp((y1 - y) / (y1 - yL), 0, 1);
    return x < xm ? t * FH / 2 : FH / 2 + (1 - t) * FH / 2;
  };
  for (let i = 0; i < nT; i++) {
    const ya = y1 - (i + 1) * run, yb = y1 - i * run;
    box(S.G0, x0, xm, ya, yb, 0, (i + 1) * rh, M.white);
    box(S.G0, x0, xm, ya - 0.01, yb, (i + 1) * rh - 0.04, (i + 1) * rh + 0.005, M.oak);
    const yc = yL + i * run, yd = yc + run;
    box(S.G0, xm, x1, yc, yd, 0, (9 + i) * rh, M.white);
    box(S.G0, xm, x1, yc, yd + 0.01, (9 + i) * rh - 0.04, (9 + i) * rh + 0.005, M.oak);
    for (const lv of [0, 1]) {
      S.mapItems[lv].push({ t: 'tl', a: [x0, ya], b: [xm, ya] });
      S.mapItems[lv].push({ t: 'tl', a: [xm, yd], b: [x1, yd] });
    }
  }
  box(S.G0, x0, x1, y0, yL, 0, 8 * rh, M.white);
  box(S.G0, x0, x1, y0, yL, 8 * rh - 0.04, 8 * rh + 0.005, M.oak);
  // centre wall between the flights
  box(S.G0, xm - 0.05, xm + 0.05, yL, y1, 0, FH + 1.0, M.wall);
  box(S.G0, xm - 0.04, xm + 0.04, yL, y1, FH + 1.0, FH + 1.04, M.darkWood);
  S.mapItems[0].push({ t: 'wall', a: [xm, yL], b: [xm, y1], w: 0.1 });
  S.mapItems[1].push({ t: 'wall', a: [xm, yL], b: [xm, y1], w: 0.1 });
  S.segs.push({ ax: xm, ay: yL, bx: xm, by: y1, r: 0.06, lv: new Set([0, 1, 'S']) });
  S.segs.push({ ax: xm, ay: y1, bx: x1, by: y1, r: 0.05, lv: new Set([0]) });   // under the top flight
  glassRail(S.G1, x0, y1, xm, y1, FH, [1]);                                      // guard over the first flight
  S.stairs.push({ inZone: (x, y) => x > x0 && x < x1 && y > y0 && y < y1, h });
  return RECT(x0, x1, y0, y1);
}

// ---------------------------------------------------------------------------
// Furniture
// ---------------------------------------------------------------------------
export function roundTable(parent, cx, cy, r, chairs = 4) {
  const z = zOf(parent), lv = lvOf(parent);
  cyl(parent, cx, cy, r, z + 0.70, z + 0.74, M.wood, 48);
  cyl(parent, cx, cy, 0.06, z, z + 0.70, M.darkWood, 12);
  cyl(parent, cx, cy, 0.3, z, z + 0.03, M.darkWood, 24);
  S.obstacles.push({ x0: cx - r * 0.8, x1: cx + r * 0.8, y0: cy - r * 0.8, y1: cy + r * 0.8, lv });
  S.mapItems[lv].push({ t: 'circle', cx, cy, r });
  for (let k = 0; k < chairs; k++) {
    const a = Math.PI / 4 + k * 2 * Math.PI / chairs;
    chair(parent, cx + Math.cos(a) * (r + 0.2), cy + Math.sin(a) * (r + 0.2), Math.PI / 2 + a);
  }
}
export function rectTable(parent, x0, x1, y0, y1) {
  const z = zOf(parent), lv = lvOf(parent);
  box(parent, x0, x1, y0, y1, z + 0.70, z + 0.74, M.wood, { obstacle: lv, map: lv });
  for (const [x, y] of [[x0 + 0.08, y0 + 0.08], [x1 - 0.08, y0 + 0.08], [x0 + 0.08, y1 - 0.08], [x1 - 0.08, y1 - 0.08]]) box(parent, x - 0.025, x + 0.025, y - 0.025, y + 0.025, z, z + 0.7, M.darkWood);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  if (y1 - y0 > x1 - x0) { // long along y: 2 per side + ends
    for (const f of [0.28, 0.72]) {
      const y = y0 + (y1 - y0) * f;
      chair(parent, x0 - 0.3, y, -Math.PI / 2); chair(parent, x1 + 0.3, y, Math.PI / 2);
    }
    chair(parent, cx, y0 - 0.3, 0); chair(parent, cx, y1 + 0.3, Math.PI);
  } else {
    for (const f of [0.28, 0.72]) {
      const x = x0 + (x1 - x0) * f;
      chair(parent, x, y0 - 0.3, 0); chair(parent, x, y1 + 0.3, Math.PI);
    }
    chair(parent, x0 - 0.3, cy, -Math.PI / 2); chair(parent, x1 + 0.3, cy, Math.PI / 2);
  }
}
// ang: rotation; chair faces -z local (back at +z local)
export function chair(parent, cx, cy, ang) {
  const z = zOf(parent);
  const g = new THREE.Group(); g.position.set(cx, z, -cy); g.rotation.y = ang; parent.add(g);
  const s = mesh(boxGeo(0.45, 0.04, 0.45), M.darkWood, g); s.position.y = 0.45;
  const b = mesh(boxGeo(0.45, 0.42, 0.04), M.darkWood, g); b.position.set(0, 0.68, 0.21);
  for (const [lx, lz] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) {
    const l = mesh(boxGeo(0.03, 0.45, 0.03), M.frame, g); l.position.set(lx, 0.225, lz);
  }
}
export function sofa(parent, x0, x1, y0, y1, backSide, mat = M.fabric) {
  const z = zOf(parent), lv = lvOf(parent);
  box(parent, x0, x1, y0, y1, z + 0.08, z + 0.42, mat, { obstacle: lv, map: lv });
  const d = 0.2;
  if (backSide === 'W') box(parent, x0, x0 + d, y0, y1, z + 0.42, z + 0.82, mat);
  if (backSide === 'E') box(parent, x1 - d, x1, y0, y1, z + 0.42, z + 0.82, mat);
  if (backSide === 'S') box(parent, x0, x1, y0, y0 + d, z + 0.42, z + 0.82, mat);
  if (backSide === 'N') box(parent, x0, x1, y1 - d, y1, z + 0.42, z + 0.82, mat);
  if (backSide === 'W' || backSide === 'E') { box(parent, x0, x1, y0, y0 + 0.18, z + 0.42, z + 0.62, mat); box(parent, x0, x1, y1 - 0.18, y1, z + 0.42, z + 0.62, mat); }
  else { box(parent, x0, x0 + 0.18, y0, y1, z + 0.42, z + 0.62, mat); box(parent, x1 - 0.18, x1, y0, y1, z + 0.42, z + 0.62, mat); }
  box(parent, x0 + 0.05, x1 - 0.05, y0 + 0.05, y1 - 0.05, z, z + 0.08, M.frame);
}
// L-sofa: main part along the south wall (back to the south), chaise going north at the east end
export function lSofa(parent, x0, x1, y0, y1, chaiseY1, chaiseW = 0.95) {
  const z = zOf(parent), lv = lvOf(parent), mat = M.fabric;
  sofa(parent, x0, x1, y0, y1, 'S', mat);
  box(parent, x1 - chaiseW, x1, y1, chaiseY1, z + 0.08, z + 0.42, mat, { obstacle: lv, map: lv });
  box(parent, x1 - 0.18, x1, y1, chaiseY1, z + 0.42, z + 0.62, mat);
  box(parent, x1 - chaiseW + 0.05, x1 - 0.05, y1, chaiseY1 - 0.05, z, z + 0.08, M.frame);
}
export function armchair(parent, cx, cy, ang, mat = M.fabric2) {
  const z = zOf(parent), lv = lvOf(parent);
  const g = new THREE.Group(); g.position.set(cx, z, -cy); g.rotation.y = ang; parent.add(g);
  const add = (w, h, d, x, y, zz, m = mat) => { const b = mesh(boxGeo(w, h, d), m, g); b.position.set(x, y, zz); };
  add(0.8, 0.34, 0.8, 0, 0.25, 0);
  add(0.8, 0.4, 0.16, 0, 0.62, 0.32);
  add(0.14, 0.22, 0.8, -0.33, 0.53, 0); add(0.14, 0.22, 0.8, 0.33, 0.53, 0);
  add(0.7, 0.08, 0.7, 0, 0.04, 0, M.frame);
  S.obstacles.push({ x0: cx - 0.4, x1: cx + 0.4, y0: cy - 0.4, y1: cy + 0.4, lv });
  S.mapItems[lv].push({ t: 'circle', cx, cy, r: 0.42 });
}
export function coffeeTable(parent, cx, cy, r = 0.42) {
  const z = zOf(parent), lv = lvOf(parent);
  cyl(parent, cx, cy, r, z + 0.36, z + 0.4, M.wood, 40); cyl(parent, cx, cy, 0.04, z, z + 0.36, M.frame, 8);
  S.obstacles.push({ x0: cx - r * 0.8, x1: cx + r * 0.8, y0: cy - r * 0.8, y1: cy + r * 0.8, lv });
  S.mapItems[lv].push({ t: 'circle', cx, cy, r });
}
export function squareTable(parent, cx, cy, s, ang) {
  const z = zOf(parent), lv = lvOf(parent);
  const g = new THREE.Group(); g.position.set(cx, z, -cy); g.rotation.y = ang; parent.add(g);
  const t = mesh(boxGeo(s, 0.05, s), M.wood, g); t.position.y = 0.38;
  const b = mesh(boxGeo(s * 0.7, 0.36, s * 0.7), M.darkWood, g); b.position.y = 0.18;
  S.obstacles.push({ x0: cx - s * 0.5, x1: cx + s * 0.5, y0: cy - s * 0.5, y1: cy + s * 0.5, lv });
  S.mapItems[lv].push({ t: 'circle', cx, cy, r: s * 0.6 });
}
export function rug(parent, x0, x1, y0, y1) {
  const z = zOf(parent);
  box(parent, x0, x1, y0, y1, z + 0.01, z + 0.022, M.rug, { shadow: false });
}
export function bed(parent, x0, x1, y0, y1, head) {
  const z = zOf(parent), lv = lvOf(parent);
  box(parent, x0, x1, y0, y1, z, z + 0.32, M.wood, { obstacle: lv, map: lv });
  box(parent, x0 + 0.03, x1 - 0.03, y0 + 0.03, y1 - 0.03, z + 0.32, z + 0.55, M.linen);
  const w = x1 - x0, L = y1 - y0;
  const pillows = (ya, yb) => {
    if (w > 1.3) { box(parent, x0 + 0.08, x0 + w / 2 - 0.05, ya, yb, z + 0.55, z + 0.68, M.white); box(parent, x0 + w / 2 + 0.05, x1 - 0.08, ya, yb, z + 0.55, z + 0.68, M.white); }
    else box(parent, x0 + 0.1, x1 - 0.1, ya, yb, z + 0.55, z + 0.68, M.white);
  };
  if (head === 'N') { box(parent, x0, x1, y1 - 0.08, y1, z, z + 1.05, M.fabric2); pillows(y1 - 0.5, y1 - 0.12); box(parent, x0 + 0.02, x1 - 0.02, y0 + 0.02, y0 + L * 0.55, z + 0.55, z + 0.6, M.fabric); }
  else { box(parent, x0, x1, y0, y0 + 0.08, z, z + 1.05, M.fabric2); pillows(y0 + 0.12, y0 + 0.5); box(parent, x0 + 0.02, x1 - 0.02, y1 - L * 0.55, y1 - 0.02, z + 0.55, z + 0.6, M.fabric); }
}
export function nightstand(parent, x0, y0) {
  const z = zOf(parent);
  box(parent, x0, x0 + 0.45, y0, y0 + 0.4, z, z + 0.5, M.wood);
}
export function wardrobe(parent, x0, x1, y0, y1, h = 2.25) {
  const z = zOf(parent), lv = lvOf(parent);
  box(parent, x0, x1, y0, y1, z, z + h, M.white, { obstacle: lv, map: lv });
}
export function shelves(parent, x0, x1, y0, y1) {
  const z = zOf(parent);
  for (const zz of [0.4, 1.0, 1.6]) box(parent, x0, x1, y0, y1, z + zz, z + zz + 0.03, M.wood);
}
export function wc(parent, cx, cy, ang = 0) {
  const z = zOf(parent), lv = lvOf(parent);
  const g = new THREE.Group(); g.position.set(cx, z, -cy); g.rotation.y = ang; parent.add(g);
  const a = mesh(boxGeo(0.38, 0.4, 0.55), M.white, g); a.position.set(0, 0.2, -0.05);
  const b = mesh(boxGeo(0.38, 0.4, 0.15), M.white, g); b.position.set(0, 0.6, 0.2);
  S.obstacles.push({ x0: cx - 0.25, x1: cx + 0.25, y0: cy - 0.25, y1: cy + 0.25, lv });
}
export function vanity(parent, x0, x1, y0, y1) {
  const z = zOf(parent), lv = lvOf(parent);
  box(parent, x0, x1, y0, y1, z + 0.5, z + 0.88, M.wood, { obstacle: lv, map: lv });
  box(parent, x0 - 0.01, x1 + 0.01, y0 - 0.01, y1 + 0.01, z + 0.88, z + 0.92, M.white);
}
export function glassPanel(parent, x0, x1, y0, y1, h = 2.0) {
  const z = zOf(parent), lv = lvOf(parent);
  box(parent, x0, x1, y0, y1, z, z + h, M.glass, { shadow: false });
  S.obstacles.push({ x0: x0 - 0.03, x1: x1 + 0.03, y0: y0 - 0.03, y1: y1 + 0.03, lv });
}
export function plant(parent, cx, cy, s = 1) {
  const z = zOf(parent);
  cyl(parent, cx, cy, 0.2 * s, z, z + 0.4 * s, M.stone);
  const p = mesh(new THREE.SphereGeometry(0.42 * s, 16, 12), M.plant, parent); p.position.set(cx, z + 0.85 * s, -cy);
}
export function fireLight(parent, x, y, z) {
  const l = new THREE.PointLight(0xff8a3a, 2.2, 4, 2);
  l.position.set(x, z, -y); parent.add(l); S.lights.push(l);
}
export function kitchenRun(parent, x0, x1, y0, y1, uppers = null) {
  const z = zOf(parent), lv = lvOf(parent);
  box(parent, x0, x1, y0, y1, z, z + 0.88, M.white, { obstacle: lv, map: lv });
  box(parent, x0 - 0.02, x1 + 0.02, y0 - 0.02, y1 + 0.02, z + 0.88, z + 0.92, M.darkStone);
  if (uppers) box(parent, uppers[0], uppers[1], uppers[2], uppers[3], z + 1.5, z + 2.3, M.white);
  // cooktop + sink
  const long = (x1 - x0) > (y1 - y0);
  if (long) {
    const c = x0 + (x1 - x0) * 0.3, s = x0 + (x1 - x0) * 0.72;
    box(parent, c - 0.3, c + 0.3, y0 + 0.08, y1 - 0.08, z + 0.921, z + 0.925, M.black);
    box(parent, s - 0.22, s + 0.22, y0 + 0.1, y1 - 0.1, z + 0.921, z + 0.926, M.steel);
  } else {
    const c = y0 + (y1 - y0) * 0.3, s = y0 + (y1 - y0) * 0.72;
    box(parent, x0 + 0.08, x1 - 0.08, c - 0.3, c + 0.3, z + 0.921, z + 0.925, M.black);
    box(parent, x0 + 0.1, x1 - 0.1, s - 0.22, s + 0.22, z + 0.921, z + 0.926, M.steel);
  }
}
export function island(parent, x0, x1, y0, y1) {
  const z = zOf(parent), lv = lvOf(parent);
  box(parent, x0, x1, y0, y1, z, z + 0.88, M.wood, { obstacle: lv, map: lv });
  box(parent, x0 - 0.05, x1 + 0.2, y0 - 0.05, y1 + 0.05, z + 0.88, z + 0.93, M.darkStone);
  for (const y of [y0 + 0.4, y1 - 0.4]) { cyl(parent, x1 + 0.45, y, 0.19, z + 0.62, z + 0.66, M.darkWood); cyl(parent, x1 + 0.45, y, 0.025, z, z + 0.62, M.frame, 8); }
}
// box-shaped fireplace against a wall, chimney optional to height zTop
export function fireplace(parent, x0, x1, y0, y1, chimneyTop) {
  const z = zOf(parent), lv = lvOf(parent);
  box(parent, x0, x1, y0, y1, z, z + 0.4, M.stone, { obstacle: lv, map: lv });
  const cx = (x0 + x1) / 2;
  box(parent, x0 + 0.15, x1 - 0.15, y0, y1 - 0.02, z + 0.4, chimneyTop, M.plaster);
  box(parent, cx - 0.3, cx + 0.3, y1 - 0.17, y1 - 0.01, z + 0.5, z + 1.05, M.black);
  box(parent, cx - 0.2, cx + 0.2, y1 - 0.12, y1 - 0.06, z + 0.52, z + 0.72, M.fire, { shadow: false });
  fireLight(parent, cx, y1 + 0.4, z + 0.8);
}
// freestanding round fireplace with flue
export function roundFireplace(parent, cx, cy, flueTop) {
  const z = zOf(parent), lv = lvOf(parent);
  cyl(parent, cx, cy, 0.42, z, z + 0.08, M.stone, 32);
  cyl(parent, cx, cy, 0.34, z + 0.08, z + 0.95, M.black, 32);
  const f = cyl(parent, cx, cy, 0.25, z + 0.35, z + 0.65, M.fire, 24); f.castShadow = false;
  cyl(parent, cx, cy, 0.09, z + 0.95, flueTop, M.black, 16);
  fireLight(parent, cx, cy, z + 0.9);
  S.obstacles.push({ x0: cx - 0.38, x1: cx + 0.38, y0: cy - 0.38, y1: cy + 0.38, lv });
  S.mapItems[lv].push({ t: 'circle', cx, cy, r: 0.42 });
}
export function daybed(parent, x0, x1, y0, y1) {
  const z = zOf(parent), lv = lvOf(parent);
  box(parent, x0, x1, y0, y1, z, z + 0.3, M.wood, { obstacle: lv, map: lv });
  box(parent, x0 + 0.03, x1 - 0.03, y0 + 0.03, y1 - 0.03, z + 0.3, z + 0.48, M.linen);
  for (let k = 0; k < 4; k++) { const x = x0 + 0.2 + k * (x1 - x0 - 0.4) / 3; box(parent, x - 0.25, x + 0.25, y1 - 0.35, y1 - 0.12, z + 0.48, z + 0.75, k % 2 ? M.fabric : M.fabric2); }
}
export function skylights(rects) {
  // rects in plan coords; glass + frame on the roof
  const zt = FH + CH2 + 0.3;
  for (const [x0, x1, y0, y1] of rects) {
    box(S.GR, x0, x1, y0, y1, zt + 0.08, zt + 0.1, M.glass, { shadow: false });
    box(S.GR, x0 - 0.06, x0, y0 - 0.06, y1 + 0.06, zt, zt + 0.12, M.frame);
    box(S.GR, x1, x1 + 0.06, y0 - 0.06, y1 + 0.06, zt, zt + 0.12, M.frame);
    box(S.GR, x0, x1, y0 - 0.06, y0, zt, zt + 0.12, M.frame);
    box(S.GR, x0, x1, y1, y1 + 0.06, zt, zt + 0.12, M.frame);
  }
}
export function roof(skyRects = []) {
  const holes = skyRects.map(([x0, x1, y0, y1]) => RECT(x0, x1, y0, y1));
  slab(S.GR, OUTLINE, FH + CH2, FH + CH2 + 0.3, M.ceiling, holes);
  flat(S.GR, OUTLINE, FH + CH2 + 0.302, M.roof, holes);
  skylights(skyRects);
}
export function upperSlab(holes) {
  slab(S.G1, OUTLINE, FH - 0.26, FH - 0.005, M.ceiling, holes);
  flat(S.G1, OUTLINE, FH, M.oak, holes);
}
export function carportPost() {
  box(S.G0, 0.0, 0.14, 0.0, 0.14, 0, FH - 0.25, M.frame, { obstacle: 0 });
}
export const room = (lv, no, en, r, p) => S.rooms[lv].push({ no, en, r, p });

// ---------------------------------------------------------------------------
// Greeter: a smiling blonde woman standing by the front path (added to every version)
// ---------------------------------------------------------------------------
const PM = {
  skin: new THREE.MeshStandardMaterial({ color: 0xf2c7a8, roughness: 0.7 }),
  hair: new THREE.MeshStandardMaterial({ color: 0xe8cc7e, roughness: 0.6, side: THREE.DoubleSide }),
  top: new THREE.MeshStandardMaterial({ color: 0xc8574f, roughness: 0.9 }),
  jeans: new THREE.MeshStandardMaterial({ color: 0x3d5577, roughness: 0.9 }),
  shoe: new THREE.MeshStandardMaterial({ color: 0xf4f2ee, roughness: 0.6 }),
  eye: new THREE.MeshStandardMaterial({ color: 0x1e2a36, roughness: 0.3 }),
  lips: new THREE.MeshStandardMaterial({ color: 0xb8505a, roughness: 0.5 }),
  cheek: new THREE.MeshStandardMaterial({ color: 0xf0a3a0, roughness: 0.8, transparent: true, opacity: 0.55 }),
};
export function greeter(parent, x, y, faceX, faceY) {
  const g = new THREE.Group();
  const part = (geo, mat, px, py, pz) => { const m = mesh(geo, mat, g); m.position.set(px, py, pz); return m; };
  const limb = (r0, r1, len, mat) => new THREE.CylinderGeometry(r0, r1, len, 14);
  // feet & legs
  for (const s of [-1, 1]) {
    part(new THREE.BoxGeometry(0.09, 0.06, 0.22), PM.shoe, s * 0.085, 0.03, 0.03);
    part(limb(0.06, 0.05, 0.76, PM.jeans), PM.jeans, s * 0.085, 0.44, 0);
  }
  part(new THREE.CylinderGeometry(0.16, 0.15, 0.14, 18), PM.jeans, 0, 0.84, 0);
  // torso, shoulders, neck
  part(new THREE.CylinderGeometry(0.175, 0.15, 0.52, 18), PM.top, 0, 1.15, 0);
  const sh = part(new THREE.SphereGeometry(0.175, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), PM.top, 0, 1.4, 0);
  sh.scale.y = 0.35;
  part(limb(0.045, 0.05, 0.1, PM.skin), PM.skin, 0, 1.47, 0);
  // arms (slightly away from the body) & hands
  for (const s of [-1, 1]) {
    const a = part(limb(0.05, 0.042, 0.6, PM.top), PM.top, s * 0.215, 1.12, 0);
    a.rotation.z = s * 0.1;
    part(new THREE.SphereGeometry(0.045, 12, 10), PM.skin, s * 0.245, 0.8, 0);
  }
  // head & face (front = +z)
  const HY = 1.6, HR = 0.115;
  part(new THREE.SphereGeometry(HR, 28, 20), PM.skin, 0, HY, 0);
  for (const s of [-1, 1]) {
    part(new THREE.SphereGeometry(0.014, 10, 8), PM.eye, s * 0.04, HY + 0.018, 0.104);
    const c = part(new THREE.SphereGeometry(0.022, 10, 8), PM.cheek, s * 0.06, HY - 0.025, 0.093);
    c.scale.z = 0.4; c.castShadow = false;
  }
  const smile = part(new THREE.TorusGeometry(0.036, 0.007, 8, 20, Math.PI), PM.lips, 0, HY - 0.035, 0.104);
  smile.rotation.z = Math.PI; // arc opens upward → a smile
  // blonde hair: crown cap, back half, long hair down the back, side locks
  part(new THREE.SphereGeometry(HR * 1.08, 28, 16, 0, Math.PI * 2, 0, 1.15), PM.hair, 0, HY + 0.008, -0.004);
  part(new THREE.SphereGeometry(HR * 1.1, 28, 16, Math.PI, Math.PI, 0, 2.3), PM.hair, 0, HY, -0.006);
  const back = part(new THREE.CylinderGeometry(0.11, 0.135, 0.36, 18, 1, true, Math.PI / 2, Math.PI), PM.hair, 0, HY - 0.2, -0.025);
  back.scale.z = 0.75;
  for (const s of [-1, 1]) {
    const lock = part(new THREE.CapsuleGeometry(0.03, 0.2, 6, 10), PM.hair, s * 0.11, HY - 0.1, 0.01);
    lock.rotation.z = s * 0.08;
  }
  g.position.set(x, zOf(parent), -y);
  g.rotation.y = Math.atan2(faceX - x, -(faceY - y)); // turn her front (+z) toward the given plan point
  parent.add(g);
  S.obstacles.push({ x0: x - 0.25, x1: x + 0.25, y0: y - 0.25, y1: y + 0.25, lv: lvOf(parent) });
  S.mapItems[lvOf(parent)].push({ t: 'circle', cx: x, cy: y, r: 0.22 });
  return g;
}
