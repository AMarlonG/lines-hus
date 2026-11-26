import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  THREE, W, FH, OUTLINE, topY, inPoly, pip, S, M, resetState, walkable, mesh, cyl, flat, slab, RECT, canvasTex, rnd, greeter, cat,
} from './core.js';
import { VERSIONS } from './versions.js';

// ---------------------------------------------------------------------------
// Renderer / scene / lights
// ---------------------------------------------------------------------------
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdbe7f0);
scene.fog = new THREE.Fog(0xdbe7f0, 120, 1200);
scene.add(new THREE.HemisphereLight(0xeaf2fb, 0xe6ddd0, 1.1), new THREE.AmbientLight(0xffffff, 0.45));
const sun = new THREE.DirectionalLight(0xfff1dc, 2.3);
sun.position.set(-6, 20, 16); sun.target.position.set(5.5, 0, -5);
sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 60 });
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
scene.add(sun, sun.target);
const fill = new THREE.DirectionalLight(0xdfe8ff, 0.45); fill.position.set(20, 10, -20); scene.add(fill);

const G0 = new THREE.Group(), G1 = new THREE.Group(), GR = new THREE.Group(), GE = new THREE.Group();
scene.add(G0, G1, GR, GE);

// ---------------------------------------------------------------------------
// Environment: lawn, driveway, terrace, coastal rock, ocean, sky (built once)
// ---------------------------------------------------------------------------
let waterNormal;
{
  const SHORE = 15.4, RW = 9, DROP = 2.8;
  const add = (m) => { GE.add(m); return m; };
  const gw = SHORE + 90, gd = 200;
  const g = add(new THREE.Mesh(new THREE.PlaneGeometry(gw, gd), M.grass));
  g.rotation.x = -Math.PI / 2; g.position.set(SHORE - gw / 2, -0.02, -5); g.receiveShadow = true;
  const uv = g.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * gw, uv.getY(i) * gd);
  flat(GE, RECT(-9, 0, 0.2, 3.3), -0.005, M.concrete);
  flat(GE, RECT(-3.5, 0, 3.55, 4.75), -0.004, M.concrete);
  slab(GE, RECT(W + 0.13, W + 4.2, 1.5, 8.5), -0.02, 0.06, M.deck);
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x8d8a84, roughness: 0.9, flatShading: true });
  const rg = new THREE.PlaneGeometry(RW, 200, 30, 120);
  const pos = rg.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const u = (pos.getX(i) + RW / 2) / RW, v = pos.getY(i);
    pos.setZ(i, -Math.pow(u, 0.8) * DROP + Math.sin(v * 0.35 + u * 3) * 0.25 * u + Math.sin(v * 1.3) * 0.12 * u + (Math.random() - 0.5) * 0.08 * u);
  }
  rg.computeVertexNormals();
  const rock = add(new THREE.Mesh(rg, rockMat));
  rock.rotation.x = -Math.PI / 2; rock.position.set(SHORE + RW / 2 - 0.3, -0.03, -5); rock.receiveShadow = true;
  for (let k = 0; k < 26; k++) {
    const b = mesh(new THREE.DodecahedronGeometry(rnd(0.4, 1.6), 0), rockMat, GE);
    const x = SHORE + rnd(2.5, RW), y = rnd(-40, 40);
    b.position.set(x, -Math.pow((x - SHORE) / RW, 0.8) * DROP - 0.2, -y); b.scale.y = 0.45; b.rotation.y = rnd(0, 6);
  }
  waterNormal = canvasTex(512, (c, sz) => {
    const img = c.createImageData(sz, sz);
    for (let y = 0; y < sz; y++) for (let x = 0; x < sz; x++) {
      const a = Math.sin((x / sz) * Math.PI * 8 + Math.sin((y / sz) * Math.PI * 6) * 1.5);
      const b = Math.sin((y / sz) * Math.PI * 10 + Math.sin((x / sz) * Math.PI * 4) * 2);
      const i = (y * sz + x) * 4;
      img.data[i] = 128 + a * 40; img.data[i + 1] = 128 + b * 40; img.data[i + 2] = 255; img.data[i + 3] = 255;
    }
    c.putImageData(img, 0, 0);
  }, 6);
  waterNormal.colorSpace = THREE.NoColorSpace;
  const water = add(new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000),
    new THREE.MeshStandardMaterial({ color: 0x2d5f7c, roughness: 0.12, metalness: 0.35, normalMap: waterNormal, normalScale: new THREE.Vector2(0.35, 0.35) })));
  water.rotation.x = -Math.PI / 2; water.position.set(SHORE + RW - 1.5 + 1500, -DROP + 0.45, -5);
  const wuv = water.geometry.attributes.uv; for (let i = 0; i < wuv.count; i++) wuv.setXY(i, wuv.getX(i) * 3000, wuv.getY(i) * 3000);
  for (const [x, y, s] of [[260, 120, 30], [340, -60, 45], [190, -180, 22], [420, 40, 18]]) {
    const isl = mesh(new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), rockMat, GE, false);
    isl.position.set(x, -1.8, -y); isl.scale.set(s, s * 0.18, s * 0.6);
  }
  const sky = new THREE.Mesh(new THREE.SphereGeometry(1500, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(0x5d93c9) }, bottom: { value: new THREE.Color(0xdbe7f0) } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ float h = clamp(vP.y * 2.2, 0.0, 1.0); gl_FragColor = vec4(mix(bottom, top, pow(h, 0.7)), 1.0); }',
  }));
  sky.renderOrder = -1; scene.add(sky);
  for (const [x, y, s] of [[-6, 12, 1.2], [-4, 17, 1.5], [-12, -3, 1.1], [-8, -7, 1.3], [4, 16, 1.0], [-15, 9, 1.4]]) {
    cyl(GE, x, y, 0.15 * s, 0, 2.2 * s, M.darkWood, 8);
    const c = mesh(new THREE.ConeGeometry(1.4 * s, 4 * s, 10), M.plant, GE); c.position.set(x, 3.6 * s, -y);
  }
}

// ---------------------------------------------------------------------------
// House building / switching
// ---------------------------------------------------------------------------
const labels = { 0: new THREE.Group(), 1: new THREE.Group() };
scene.add(labels[0], labels[1]);
function clearGroup(g) {
  g.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.isSprite) { o.material.map.dispose(); o.material.dispose(); } });
  g.clear();
}
function labelSprite(no, en) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 170;
  const g = c.getContext('2d');
  g.font = '600 64px system-ui, -apple-system, Segoe UI, sans-serif';
  const w = Math.max(g.measureText(no).width, 260) + 70;
  g.fillStyle = 'rgba(255,255,255,0.92)';
  g.beginPath(); g.roundRect((512 - w) / 2, 12, w, 146, 30); g.fill();
  g.fillStyle = '#1f2328'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(no, 256, 70);
  g.font = '400 38px system-ui, -apple-system, Segoe UI, sans-serif'; g.fillStyle = '#6a7079';
  g.fillText(en, 256, 124);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true }));
  s.scale.set(2.3, 0.76, 1); s.renderOrder = 10;
  return s;
}
let current = { v: null, alt: null };
const talkers = { woman: null, cat: null };
function buildHouse(v, alt) {
  [G0, G1, GR, labels[0], labels[1]].forEach(clearGroup);
  resetState(G0, G1, GR);
  v.build(alt);
  talkers.woman = greeter(G0, -1.7, 5.3, -3.0, 4.15); // smiling by the front path, facing arriving visitors
  talkers.cat = cat(G0, -2.0, 5.62, -3.2, 4.45); // three-coloured cat sitting beside her
  talkers.woman.userData.talker = 'woman'; talkers.cat.userData.talker = 'cat';
  for (const lv of [0, 1]) for (const r of S.rooms[lv]) if (r.p) {
    const s = labelSprite(r.no, r.en);
    s.position.set(r.p[0], (lv ? FH : 0) + 1.3, -r.p[1]);
    labels[lv].add(s);
  }
  current = { v, alt };
}
function roomAt(lv, x, y) {
  if (lv === 1 && S.balconies.some((p) => pip(p, x, y))) return { no: 'Balkong', en: 'Balcony' };
  if (!inPoly(x, y)) return null;
  for (const r of S.rooms[lv]) if (x >= r.r[0] && x <= r.r[1] && y >= r.r[2] && y <= r.r[3]) return r;
  return null;
}

// ---------------------------------------------------------------------------
// Camera / controls / UI
// ---------------------------------------------------------------------------
const DOLL_POS = new THREE.Vector3(-3.5, 17, 7.5);
const camera = new THREE.PerspectiveCamera(45, 1, 0.05, 4000);
camera.position.copy(DOLL_POS);
const orbit = new OrbitControls(camera, canvas);
orbit.target.set(5.5, 1, -5);
orbit.enableDamping = true;
orbit.maxPolarAngle = Math.PI * 0.49;
orbit.minDistance = 4; orbit.maxDistance = 70;
orbit.update();

const $ = (id) => document.getElementById(id);
const ui = {
  modeBtns: document.querySelectorAll('[data-mode]'),
  floorBtns: document.querySelectorAll('[data-floor]'),
  floorBar: $('floors'), walkBar: $('walkbar'), labelsChk: $('labels'), room: $('room'), help: $('help'),
  map: $('map'), stick: $('stick'), knob: $('knob'), start: $('start'), viewer: $('top'), title: $('vtitle'),
  altRow: $('altrow'), cards: $('cards'),
};

let mode = 'doll', floor = 'g';
const P = { x: -3.0, y: 4.15, yaw: 0, pitch: -0.05, lv: 0, st: -1, eye: 1.6 };
const resetWalker = () => Object.assign(P, { x: -3.0, y: 4.15, yaw: 0, pitch: -0.05, lv: 0, st: -1, eye: 1.6 });

function applyVisibility() {
  const walk = mode === 'walk';
  G1.visible = walk || floor !== 'g';
  GR.visible = walk || floor === 'all';
  const showL = !walk && ui.labelsChk.checked;
  labels[0].visible = showL && floor === 'g';
  labels[1].visible = showL && floor === 'u';
  ui.floorBar.style.display = walk ? 'none' : '';
  ui.walkBar.style.display = walk ? '' : 'none';
  ui.room.style.display = walk ? '' : 'none';
  ui.map.style.display = walk ? '' : 'none';
  ui.help.style.display = walk ? '' : 'none';
  ui.modeBtns.forEach((b) => b.classList.toggle('on', b.dataset.mode === mode));
  ui.floorBtns.forEach((b) => b.classList.toggle('on', b.dataset.floor === floor));
}
function setMode(m) {
  if (m === mode) return;
  mode = m;
  if (m === 'walk') { orbit.enabled = false; camera.fov = 70; }
  else {
    if (document.pointerLockElement) document.exitPointerLock();
    orbit.enabled = true; camera.fov = 45;
    camera.position.copy(DOLL_POS); camera.rotation.set(0, 0, 0);
    orbit.target.set(5.5, floor === 'u' ? FH : 1, -5); orbit.update();
  }
  camera.updateProjectionMatrix();
  applyVisibility();
}
ui.modeBtns.forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
ui.floorBtns.forEach((b) => b.addEventListener('click', () => { floor = b.dataset.floor; orbit.target.y = floor === 'u' ? FH : 1; applyVisibility(); }));
ui.labelsChk.addEventListener('change', applyVisibility);
document.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
  const k = b.dataset.go;
  const t = k === 'out' ? { x: -3.0, y: 4.15, yaw: 0, lv: 0 } : S.teleports[k];
  Object.assign(P, t, { pitch: -0.05, st: -1 });
  P.eye = (t.lv ? FH : 0) + 1.6;
}));

// ---------------------------------------------------------------------------
// Start page + routing (#v1, #v2-1, #v2-2, #v3)
// ---------------------------------------------------------------------------
let onStart = true;
function routeFromHash() {
  const h = location.hash.replace('#', '');
  const m = h.match(/^(v\d)(?:-(\w+))?$/);
  const v = m && VERSIONS.find((x) => x.id === m[1]);
  if (!v) { showStart(); return; }
  const alt = v.alts ? (v.alts.find((a) => a.id === m[2]) ? m[2] : v.alts[0].id) : null;
  openVersion(v, alt);
}
function showStart() {
  onStart = true;
  if (document.pointerLockElement) document.exitPointerLock();
  ui.start.style.display = ''; ui.viewer.style.display = 'none';
  ['room', 'map', 'help'].forEach((k) => (ui[k].style.display = 'none'));
}
function openVersion(v, alt) {
  const same = current.v === v && current.alt === alt;
  if (!same) { buildHouse(v, alt); resetWalker(); }
  onStart = false;
  ui.start.style.display = 'none'; ui.viewer.style.display = '';
  ui.title.innerHTML = `${v.name} <span>· ${v.sub}</span>`;
  ui.altRow.style.display = v.alts ? '' : 'none';
  if (v.alts) {
    ui.altRow.innerHTML = '<span class="lbl">2. etasje:</span>' + v.alts.map((a) =>
      `<button data-alt="${a.id}" class="${a.id === alt ? 'on' : ''}">${a.label}</button>`).join('');
    ui.altRow.querySelectorAll('[data-alt]').forEach((b) => b.addEventListener('click', () => { location.hash = `${v.id}-${b.dataset.alt}`; }));
  }
  applyVisibility();
  clock.getDelta();
}
$('back').addEventListener('click', () => { location.hash = ''; });
addEventListener('hashchange', routeFromHash);

function snapshot() {
  const saveFloor = floor, saveMode = mode;
  floor = 'u'; mode = 'doll'; applyVisibility(); labels[1].visible = false;
  renderer.setPixelRatio(1);
  renderer.setSize(880, 560, false);
  camera.aspect = 880 / 560; camera.fov = 45; camera.updateProjectionMatrix();
  camera.position.set(-4, 16.5, 7.5);
  camera.lookAt(5.5, FH - 0.5, -5);
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL('image/jpeg', 0.85);
  floor = saveFloor; mode = saveMode;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  resize();
  camera.position.copy(DOLL_POS); orbit.update();
  return url;
}
function buildCards() {
  const html = [];
  for (const v of VERSIONS) {
    buildHouse(v, v.alts ? v.alts[0].id : null);
    const img = snapshot();
    const href = v.alts ? `#${v.id}-${v.alts[0].id}` : `#${v.id}`;
    html.push(`<a class="card" href="${href}">
      <div class="thumb"><img src="${img}" alt="${v.name}">${v.alts ? `<span class="badge">${v.alts.length} alternativer for 2. etasje</span>` : ''}</div>
      <div class="body"><h2>${v.name}</h2><div class="sub">${v.sub}</div>
      <ul>${v.desc.map((d) => `<li>${d}</li>`).join('')}</ul>
      <span class="open">Åpne 3D-modell →</span></div></a>`);
  }
  ui.cards.innerHTML = html.join('');
  current = { v: null, alt: null };
}

// ---------------------------------------------------------------------------
// Walk input
// ---------------------------------------------------------------------------
const keys = {};
addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (!onStart && e.code === 'Tab') { e.preventDefault(); setMode(mode === 'walk' ? 'doll' : 'walk'); }
});
addEventListener('keyup', (e) => { keys[e.code] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
const look = (dx, dy) => { P.yaw -= dx * 0.0032; P.pitch = THREE.MathUtils.clamp(P.pitch - dy * 0.0032, -1.35, 1.35); };
let drag = null;
const touchMove = { id: null, ox: 0, oy: 0, vx: 0, vy: 0 };
canvas.addEventListener('pointerdown', (e) => {
  if (mode !== 'walk') return;
  if (e.pointerType === 'touch') {
    if (e.clientX < innerWidth * 0.45 && touchMove.id === null) {
      Object.assign(touchMove, { id: e.pointerId, ox: e.clientX, oy: e.clientY, vx: 0, vy: 0 });
      ui.stick.style.display = 'block'; ui.stick.style.left = e.clientX - 55 + 'px'; ui.stick.style.top = e.clientY - 55 + 'px';
      ui.knob.style.transform = 'translate(0px,0px)';
    } else drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
    return;
  }
  if (!document.pointerLockElement) {
    try { const p = canvas.requestPointerLock(); if (p && p.catch) p.catch(() => {}); } catch (_) { /* drag fallback */ }
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
  }
});
addEventListener('pointermove', (e) => {
  if (mode !== 'walk') return;
  if (document.pointerLockElement === canvas && e.pointerType === 'mouse') { look(e.movementX, e.movementY); return; }
  if (touchMove.id === e.pointerId) {
    let vx = e.clientX - touchMove.ox, vy = e.clientY - touchMove.oy;
    const l = Math.hypot(vx, vy), max = 45;
    if (l > max) { vx *= max / l; vy *= max / l; }
    touchMove.vx = vx / max; touchMove.vy = vy / max;
    ui.knob.style.transform = `translate(${vx}px,${vy}px)`;
  } else if (drag && drag.id === e.pointerId) {
    const k = e.pointerType === 'touch' ? 1.4 : 1;
    look((e.clientX - drag.x) * k, (e.clientY - drag.y) * k);
    drag.x = e.clientX; drag.y = e.clientY;
  }
});
const endPtr = (e) => {
  if (touchMove.id === e.pointerId) { touchMove.id = null; touchMove.vx = touchMove.vy = 0; ui.stick.style.display = 'none'; }
  if (drag && drag.id === e.pointerId) drag = null;
};
addEventListener('pointerup', endPtr);
addEventListener('pointercancel', endPtr);

// ---------------------------------------------------------------------------
// Click the cat → "Meow!", then the woman cheers "Hurra!" (click her alone for just the cheer)
// ---------------------------------------------------------------------------
function bubbleSprite(text) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256;
  const g = c.getContext('2d');
  g.font = '700 96px system-ui, -apple-system, Segoe UI, sans-serif';
  const w = g.measureText(text).width + 90;
  g.fillStyle = '#fff'; g.strokeStyle = '#1f2328'; g.lineWidth = 8;
  g.beginPath(); g.roundRect((512 - w) / 2, 14, w, 170, 60);
  g.moveTo(230, 182); g.lineTo(256, 240); g.lineTo(290, 182);
  g.fill(); g.stroke();
  g.fillStyle = '#fff'; g.fillRect(234, 172, 52, 16); // hide the stroke where the tail joins
  g.fillStyle = '#1f2328'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, 256, 102);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true }));
  sp.renderOrder = 20;
  return sp;
}
function say(who, text, y, scale, ms = 1800) {
  const g = talkers[who];
  if (!g) return;
  if (g.userData.bubble) { g.remove(g.userData.bubble); g.userData.bubble.material.map.dispose(); g.userData.bubble.material.dispose(); }
  const b = bubbleSprite(text);
  b.position.set(0, y, 0); b.scale.set(scale * 2, scale, 1);
  g.add(b); g.userData.bubble = b;
  clearTimeout(g.userData.bubbleT);
  g.userData.bubbleT = setTimeout(() => {
    if (g.userData.bubble !== b) return;
    g.remove(b); b.material.map.dispose(); b.material.dispose(); g.userData.bubble = null;
  }, ms);
}
let audio = null;
function meowSound() {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') audio.resume();
    const t = audio.currentTime, o = audio.createOscillator(), f = audio.createBiquadFilter(), v = audio.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(480, t); o.frequency.linearRampToValueAtTime(820, t + 0.18); o.frequency.exponentialRampToValueAtTime(380, t + 0.65);
    f.type = 'bandpass'; f.Q.value = 3;
    f.frequency.setValueAtTime(900, t); f.frequency.linearRampToValueAtTime(2200, t + 0.2); f.frequency.linearRampToValueAtTime(700, t + 0.65);
    v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(0.35, t + 0.06); v.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    o.connect(f).connect(v).connect(audio.destination);
    o.start(t); o.stop(t + 0.72);
  } catch (_) { /* no audio available: the bubble still shows */ }
}
function speak(text, lang, pitch) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.pitch = pitch; u.rate = 1.05;
    const voice = speechSynthesis.getVoices().find((vc) => vc.lang.replace('_', '-').toLowerCase().startsWith(lang.slice(0, 2)));
    if (voice) u.voice = voice;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch (_) { /* no speech synthesis: the bubble still shows */ }
}
const cheer = () => { say('woman', 'Hurra!', 2.15, 0.55); speak('Hurra!', 'nb-NO', 1.3); };
function onTalkerClick(who) {
  if (who === 'cat') {
    say('cat', 'Meow!', 0.65, 0.32); meowSound();
    setTimeout(cheer, 650);
  } else cheer();
}
const picker = new THREE.Raycaster();
picker.camera = camera;
const shownInScene = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
function pick(ndcX, ndcY) {
  picker.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
  for (const h of picker.intersectObjects(scene.children, true)) {
    if (h.object.isSprite || !shownInScene(h.object)) continue;
    for (let o = h.object; o; o = o.parent) if (o.userData.talker) return o.userData.talker;
    return null; // first solid thing hit is not one of them (e.g. a wall in the way)
  }
  return null;
}
let press = null;
canvas.addEventListener('pointerdown', (e) => {
  press = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), locked: document.pointerLockElement === canvas };
});
canvas.addEventListener('pointerup', (e) => {
  const p = press; press = null;
  if (!p || p.id !== e.pointerId || performance.now() - p.t > 500) return;
  if (!p.locked && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 6) return; // a drag, not a click
  if (mode === 'walk' && e.pointerType === 'touch' && p.x < innerWidth * 0.45) return; // joystick side
  const r = canvas.getBoundingClientRect();
  const who = p.locked ? pick(0, 0) // pointer-locked walk mode: pick what the crosshair is on
    : pick(((p.x - r.left) / r.width) * 2 - 1, -((p.y - r.top) / r.height) * 2 + 1);
  if (who) onTalkerClick(who);
});

// ---------------------------------------------------------------------------
// Collision + walking (levels 0, 1 and 'S' = on a stair)
// ---------------------------------------------------------------------------
const R = 0.24;
function collide(x, y, lvKey) {
  for (let it = 0; it < 3; it++) {
    for (const s of S.segs) {
      if (!s.lv.has(lvKey)) continue;
      const vx = s.bx - s.ax, vy = s.by - s.ay, l2 = vx * vx + vy * vy;
      let t = l2 ? ((x - s.ax) * vx + (y - s.ay) * vy) / l2 : 0;
      t = Math.max(0, Math.min(1, t));
      const cx = s.ax + vx * t, cy = s.ay + vy * t, dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy), min = R + s.r;
      if (d < min && d > 1e-6) { x = cx + dx / d * min; y = cy + dy / d * min; }
    }
    if (lvKey === 'S') continue;
    for (const o of S.obstacles) {
      if (o.lv !== lvKey) continue;
      const cx = Math.max(o.x0, Math.min(o.x1, x)), cy = Math.max(o.y0, Math.min(o.y1, y));
      const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy);
      if (d < R) {
        if (d > 1e-6) { x = cx + dx / d * R; y = cy + dy / d * R; }
        else {
          const pen = [[x - o.x0, -1, 0], [o.x1 - x, 1, 0], [y - o.y0, 0, -1], [o.y1 - y, 0, 1]].sort((a, b) => a[0] - b[0])[0];
          x += pen[1] * (pen[0] + R); y += pen[2] * (pen[0] + R);
        }
      }
    }
  }
  return [THREE.MathUtils.clamp(x, -30, 40), THREE.MathUtils.clamp(y, -25, 35)];
}
const eyeFor = () => (P.lv === 'S' ? S.stairs[P.st].h(P.x, P.y) : P.lv === 1 ? FH : 0) + 1.6;
function updateWalk(dt) {
  let f = 0, s = 0;
  if (keys.KeyW || keys.ArrowUp) f += 1;
  if (keys.KeyS || keys.ArrowDown) f -= 1;
  if (keys.KeyD) s += 1;
  if (keys.KeyA) s -= 1;
  if (keys.ArrowLeft) P.yaw += 1.8 * dt;
  if (keys.ArrowRight) P.yaw -= 1.8 * dt;
  f -= touchMove.vy; s += touchMove.vx;
  const len = Math.hypot(f, s);
  if (len > 1) { f /= len; s /= len; }
  const speed = (keys.ShiftLeft || keys.ShiftRight ? 3.2 : 1.6) * dt;
  const cy = Math.cos(P.yaw), sy = Math.sin(P.yaw);
  let nx = P.x + (cy * f + sy * s) * speed, ny = P.y + (sy * f - cy * s) * speed;
  [nx, ny] = collide(nx, ny, P.lv);
  let lv = P.lv, st = P.st;
  if (lv === 'S') {
    const stair = S.stairs[st];
    if (!stair.inZone(nx, ny)) { lv = stair.h(P.x, P.y) > FH / 2 ? 1 : 0; st = -1; }
  } else {
    const i = S.stairs.findIndex((q) => q.inZone(nx, ny));
    if (i >= 0) { lv = 'S'; st = i; }
  }
  if (lv !== 'S' && !walkable(lv, nx, ny)) { nx = P.x; ny = P.y; lv = P.lv; st = P.st; }
  Object.assign(P, { x: nx, y: ny, lv, st });
  P.eye += (eyeFor() - P.eye) * Math.min(1, dt * 12);
  camera.position.set(P.x, P.eye, -P.y);
  camera.rotation.order = 'YXZ';
  camera.rotation.set(P.pitch, P.yaw - Math.PI / 2, 0);
}

// ---------------------------------------------------------------------------
// Minimap
// ---------------------------------------------------------------------------
const mctx = ui.map.getContext('2d');
const MAPB = { x0: -1.2, x1: 12.2, y0: -1.2, y1: 11.6 };
function mapXY(x, y) {
  const w = ui.map.width, h = ui.map.height;
  const s = Math.min(w / (MAPB.x1 - MAPB.x0), h / (MAPB.y1 - MAPB.y0));
  return [(x - MAPB.x0) * s, h - (y - MAPB.y0) * s, s];
}
const mapLevel = () => (P.lv === 'S' ? (S.stairs[P.st].h(P.x, P.y) > FH / 2 ? 1 : 0) : P.lv);
function drawMap() {
  const lv = mapLevel(), c = mctx, w = ui.map.width, h = ui.map.height;
  c.clearRect(0, 0, w, h);
  c.fillStyle = 'rgba(255,255,255,0.94)'; c.fillRect(0, 0, w, h);
  c.beginPath(); OUTLINE.forEach(([x, y], i) => { const [px, py] = mapXY(x, y); i ? c.lineTo(px, py) : c.moveTo(px, py); }); c.closePath();
  c.fillStyle = '#f4efe6'; c.fill();
  const [, , s] = mapXY(0, 0);
  const items = S.mapItems[lv];
  for (const it of items) {
    if (it.t === 'poly') { c.beginPath(); it.pts.forEach(([x, y], i) => { const [px, py] = mapXY(x, y); i ? c.lineTo(px, py) : c.moveTo(px, py); }); c.closePath(); c.fillStyle = '#e9dccb'; c.fill(); }
    if (it.t === 'rect') { const [a, b] = mapXY(it.x0, it.y1), [cc, d] = mapXY(it.x1, it.y0); c.fillStyle = '#d8d2c6'; c.fillRect(a, b, cc - a, d - b); }
    if (it.t === 'circle') { const [a, b] = mapXY(it.cx, it.cy); c.fillStyle = '#d8d2c6'; c.beginPath(); c.arc(a, b, it.r * s, 0, 7); c.fill(); }
    if (it.t === 'tl') { const [a, b] = mapXY(...it.a), [cc, d] = mapXY(...it.b); c.strokeStyle = '#b5ad9f'; c.lineWidth = 1; c.beginPath(); c.moveTo(a, b); c.lineTo(cc, d); c.stroke(); }
  }
  for (const it of items) if (it.t === 'wall') {
    const [a, b] = mapXY(...it.a), [cc, d] = mapXY(...it.b);
    c.strokeStyle = '#2b2d2f'; c.lineWidth = Math.max(2, it.w * s); c.lineCap = 'square';
    c.beginPath(); c.moveTo(a, b); c.lineTo(cc, d); c.stroke();
  }
  for (const it of items) if (it.t === 'win' || it.t === 'door') {
    const [a, b] = mapXY(...it.a), [cc, d] = mapXY(...it.b);
    c.strokeStyle = it.t === 'win' ? '#7fb6d6' : '#f4efe6'; c.lineWidth = it.t === 'win' ? 3 : 5; c.lineCap = 'butt';
    c.beginPath(); c.moveTo(a, b); c.lineTo(cc, d); c.stroke();
  }
  const [px, py] = mapXY(P.x, P.y);
  c.save(); c.translate(px, py); c.rotate(-P.yaw);
  c.fillStyle = 'rgba(214,92,46,0.18)'; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 34, -0.6, 0.6); c.closePath(); c.fill();
  c.fillStyle = '#d65c2e'; c.beginPath(); c.moveTo(9, 0); c.lineTo(-6, 6); c.lineTo(-3, 0); c.lineTo(-6, -6); c.closePath(); c.fill();
  c.restore();
  c.fillStyle = '#1f2328'; c.font = '600 22px system-ui, sans-serif';
  c.fillText(lv ? '2. etasje' : '1. etasje', 14, 30);
}
ui.map.addEventListener('click', (e) => {
  const r = ui.map.getBoundingClientRect();
  const mx = (e.clientX - r.left) * ui.map.width / r.width, my = (e.clientY - r.top) * ui.map.height / r.height;
  const [, , s] = mapXY(0, 0);
  const x = mx / s + MAPB.x0, y = (ui.map.height - my) / s + MAPB.y0;
  const lv = mapLevel();
  if (S.stairs.some((q) => q.inZone(x, y))) return;
  if (!walkable(lv, x, y)) return;
  const [cx, cy] = collide(x, y, lv);
  Object.assign(P, { x: cx, y: cy, lv, st: -1 });
});

// ---------------------------------------------------------------------------
// Loop
// ---------------------------------------------------------------------------
function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();
let lastRoom = '';
function frame() {
  requestAnimationFrame(frame);
  if (onStart) return;
  const dt = Math.min(clock.getDelta(), 0.05), tt = clock.elapsedTime;
  if (waterNormal) { waterNormal.offset.x = tt * 0.012; waterNormal.offset.y = tt * 0.007; }
  S.lights.forEach((l, i) => { l.intensity = 2.0 + Math.sin(tt * 9 + i) * 0.25 + Math.sin(tt * 23 + i) * 0.15; });
  if (mode === 'walk') {
    updateWalk(dt);
    drawMap();
    const r = P.lv === 'S' ? { no: 'Trapp', en: 'Stairs' } : roomAt(P.lv, P.x, P.y);
    const txt = r ? `<b>${r.no}</b> · ${r.en}` : '<b>Ute</b> · Outside';
    if (txt !== lastRoom) { ui.room.innerHTML = txt; lastRoom = txt; }
  } else orbit.update();
  renderer.render(scene, camera);
}

buildCards();
routeFromHash();
applyVisibility();
frame();
window.__house = { step: updateWalk, keys, setMode, P, S, setFloor: (f) => { floor = f; applyVisibility(); }, open: (h) => { location.hash = h; } };
