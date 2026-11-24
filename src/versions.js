import {
  THREE, W, DR, DL, FH, CH2, topY, OUTLINE, RECT, S, M, box, cyl, flat, slab, slopedPoly,
  ew, iw, straightStair, uStair, roundTable, rectTable, sofa, lSofa, armchair, coffeeTable, squareTable,
  rug, bed, nightstand, wardrobe, shelves, wc, vanity, glassPanel, plant, kitchenRun, island, fireplace,
  roundFireplace, daybed, roof, upperSlab, carportPost, balcony, room, fireLight,
} from './core.js';

const ROOF_TOP = FH + CH2 + 0.3;
const EAST_GLASS_0 = [{ y0: 0.3, y1: 3.5, kind: 'win', sill: 0.05, head: 2.5 }];

// ===========================================================================
// VERSJON 1 – original drawings
// ===========================================================================
function buildV1() {
  const { G0, G1 } = S;
  const ST = { x0: 2.07, x1: 5.75, y0: 4.7, y1: 5.6 };
  // ---- ground
  slab(G0, OUTLINE, -0.15, 0, M.concrete);
  flat(G0, [[0, 3.5], [4.15, 3.5], [4.15, 0], [W, 0], [W, DR], [0, DL]], 0.01, M.oak);
  flat(G0, RECT(4.15, 5.75, 0, 3.5), 0.015, M.tile);
  ew(G0, 3.4, 0, W, 0);
  ew(G0, W, 0, W, DR, [
    { y0: 0.3, y1: 3.9, kind: 'win', sill: 0.05, head: 2.5 },
    { y0: 4.0, y1: 6.4, kind: 'slide', head: 2.5 },
    { y0: 6.5, y1: 9.75, kind: 'win', sill: 0.05, head: 2.5 }]);
  ew(G0, W, DR, 0, DL, [
    { x0: 8.5, x1: 10.75, kind: 'win', sill: 0.05, head: 2.5 },
    { x0: 6.0, x1: 7.35, kind: 'win', sill: 0.05, head: 2.5 },
    { x0: 2.3, x1: 4.7, kind: 'win', sill: 1.5, head: 2.4 },
    { x0: 0.25, x1: 1.45, kind: 'win', sill: 0.9, head: 2.4 }]);
  ew(G0, 0, DL, 0, 3.5, [
    { y0: 4.75, y1: 5.45, kind: 'win', sill: 0.3, head: 2.4 },
    { y0: 3.65, y1: 4.65, kind: 'front', head: 2.2, open: 'R' }]);
  ew(G0, 0, 3.5, 3.4, 3.5);
  ew(G0, 3.4, 3.5, 3.4, 0, [{ y0: 1.2, y1: 2.1, kind: 'front', head: 2.1, open: 'L' }]);
  iw(G0, 3.4, 3.5, 5.75, 3.5, [{ x0: 4.5, x1: 5.3, kind: 'door', open: 'R' }], { t: 0.15 });
  iw(G0, 4.15, 0, 4.15, 3.5);
  iw(G0, 5.75, 0, 5.75, 3.5);
  iw(G0, 5.75, 3.5, 5.75, 4.7, [{ y0: 3.55, y1: 4.65, kind: 'slide', head: 2.3 }]);
  iw(G0, ST.x0, 5.6, 4.9, 5.6);
  iw(G0, ST.x0, 5.6, ST.x0, topY(ST.x0), [{ y0: 5.64, y1: 6.39, kind: 'door', open: 'R' }]);
  iw(G0, 4.9, 5.6, 4.9, topY(4.9));
  carportPost();
  const hole = straightStair({ ...ST, top: 'W', fronts: [[2.12, 2.72], [2.74, 3.34], [3.36, 3.96]] });
  kitchenRun(G0, 4.95, 5.6, 5.65, 7.5, [4.95, 5.3, 5.65, 7.5]);
  island(G0, 6.6, 7.5, 6.2, 7.6);
  roundTable(G0, 9.2, 7.6, 0.65);
  cyl(G0, 9.2, 7.6, 0.02, 1.5, FH - 0.25, M.frame, 6); cyl(G0, 9.2, 7.6, 0.22, 1.35, 1.5, M.black, 24);
  rug(G0, 7.5, 10.4, 1.2, 3.9);
  sofa(G0, 7.05, 7.95, 1.4, 3.5, 'W');
  sofa(G0, 7.95, 8.85, 3.45, 4.3, 'N', M.fabric2);
  coffeeTable(G0, 8.9, 2.45, 0.45);
  fireplace(G0, 7.4, 8.9, 0, 0.62, FH);
  box(G0, 8.95, 10.85, 0.12, 0.72, 0, 0.42, M.wood, { obstacle: 0, map: 0 });
  box(G0, 8.98, 10.82, 0.15, 0.7, 0.42, 0.5, M.linen);
  box(G0, 8.98, 10.82, 0.12, 0.28, 0.5, 0.95, M.fabric2);
  box(G0, 5.88, 7.35, 0.12, 0.55, 0, 0.45, M.white, { obstacle: 0, map: 0 });
  plant(G0, 10.6, 5.0);
  box(G0, 0.13, 0.5, 4.75, 5.45, 0, 0.45, M.wood, { obstacle: 0, map: 0 });
  wc(G0, 5.45, 0.45, -Math.PI / 2);
  vanity(G0, 5.25, 5.69, 2.6, 3.2);
  glassPanel(G0, 4.2, 5.1, 1.55, 1.57, 2.1);
  shelves(G0, 3.5, 4.08, 2.6, 3.4);
  // ---- upper
  upperSlab([hole]);
  flat(G1, RECT(2.95, 5.6, 0, 3.5), FH + 0.006, M.tile);
  ew(G1, 0, 0, W, 0);
  ew(G1, W, 0, W, DR, [{ y0: 0.3, y1: 5.35, kind: 'win', sill: 0.05, head: 2.4 }, { y0: 5.85, y1: 9.75, kind: 'win', sill: 0.05, head: 2.4 }]);
  ew(G1, W, DR, 0, DL, [{ x0: 8.1, x1: 10.6, kind: 'win', sill: 0.3, head: 2.3 }, { x0: 0.95, x1: 2.0, kind: 'win', sill: 0.8, head: 2.2 }]);
  ew(G1, 0, DL, 0, 0, [{ y0: 3.2, y1: 4.3, kind: 'win', sill: 0.8, head: 2.2 }, { y0: 1.4, y1: 2.9, kind: 'win', sill: 0.8, head: 2.2 }]);
  iw(G1, 0, 3.5, 2.95, 3.5, [{ x0: 1.95, x1: 2.75, kind: 'door', open: 'R' }]);
  iw(G1, 2.95, 0, 2.95, 3.5);
  iw(G1, 2.95, 3.5, 5.6, 3.5, [{ x0: 3.9, x1: 4.7, kind: 'door', open: 'R' }]);
  iw(G1, 5.6, 0, 5.6, 3.5);
  iw(G1, 2.95, 1.4, 3.85, 1.4);
  iw(G1, 4.85, 1.4, 5.6, 1.4);
  iw(G1, ST.x0, 5.6, W, 5.6, [{ x0: 7.5, x1: 8.3, kind: 'door', open: 'L' }]);
  iw(G1, ST.x0, 5.6, ST.x0, topY(ST.x0), [{ y0: 5.64, y1: 6.39, kind: 'door', open: 'R' }]);
  iw(G1, 4.14, 5.6, 4.14, topY(4.14));
  iw(G1, 6.7, 5.6, 6.7, topY(6.7), [{ y0: 6.4, y1: 7.2, kind: 'door', open: 'R' }]);
  bed(G1, 0.45, 2.05, 0.8, 2.85, 'N');
  bed(G1, 8.3, 10.1, 5.72, 7.8, 'S');
  nightstand(G1, 7.75, 5.72); nightstand(G1, 10.2, 5.72);
  wardrobe(G1, 4.22, 6.62, 5.66, 6.22);
  shelves(G1, 2.15, 4.08, 5.66, 6.05);
  vanity(G1, 3.0, 3.52, 2.2, 3.4);
  wc(G1, 5.3, 2.85, Math.PI / 2);
  glassPanel(G1, 4.7, 4.72, 1.5, 2.4); glassPanel(G1, 4.7, 5.1, 2.39, 2.41);
  box(G1, 3.05, 3.65, 0.05, 0.65, FH, FH + 0.85, M.white, { obstacle: 1, map: 1 });
  box(G1, 3.7, 4.3, 0.05, 0.65, FH, FH + 0.85, M.white, { obstacle: 1, map: 1 });
  box(G1, 4.35, 5.55, 0.05, 0.65, FH, FH + 0.9, M.wood, { obstacle: 1, map: 1 });
  rug(G1, 6.9, 10.2, 1.3, 4.3);
  sofa(G1, 6.7, 7.6, 2.0, 4.5, 'W');
  sofa(G1, 8.4, 9.6, 0.75, 1.55, 'S', M.fabric2);
  coffeeTable(G1, 8.8, 2.8, 0.4);
  box(G1, 7.6, 8.7, 0, 0.6, FH, ROOF_TOP + 0.9, M.plaster, { obstacle: 1, map: 1 });
  box(G1, 10.55, 10.85, 2.3, 3.9, FH, FH + 0.5, M.darkWood, { obstacle: 1, map: 1 });
  roof();
  // ---- rooms
  room(0, 'Toalett / dusj', 'Toilet / shower', [4.15, 5.75, 0, 3.5], [4.95, 2.2]);
  room(0, 'Utebod', 'Outdoor storage', [3.4, 4.15, 0, 3.5], [3.78, 1.2]);
  room(0, 'Carport', 'Carport', [0, 3.4, 0, 3.5], [1.7, 1.75]);
  room(0, 'Bod', 'Storage', [2.07, 4.9, 5.6, 10], [3.4, 6.3]);
  room(0, 'Entré', 'Entrance hall', [0, 5.75, 3.5, 10], [1.1, 4.6]);
  room(0, 'Kjøkken', 'Kitchen', [4.9, 7.9, 5.6, 10], [6.2, 8.1]);
  room(0, 'Spiseplass', 'Dining', [7.9, 11, 5.6, 10], [9.2, 8.7]);
  room(0, 'Stue', 'Living room', [5.75, 11, 0, 5.6], [9.4, 3.4]);
  room(1, 'Soverom', 'Bedroom 2', [0, 2.95, 0, 3.5], [1.25, 1.7]);
  room(1, 'Vaskerom', 'Laundry', [2.95, 5.6, 0, 1.4], [4.3, 0.95]);
  room(1, 'Bad', 'Bathroom', [2.95, 5.6, 1.4, 3.5], [4.0, 1.95]);
  room(1, 'Bod', 'Storage', [2.07, 4.14, 5.6, 10], [3.1, 6.35]);
  room(1, 'WIC', 'Walk-in closet', [4.14, 6.7, 5.6, 10], [5.4, 6.8]);
  room(1, 'Hovedsoverom', 'Main bedroom', [6.7, 11, 5.6, 10], [9.0, 8.4]);
  room(1, 'Trapperom', 'Landing', [0, 5.6, 3.5, 10], [1.0, 4.5]);
  room(1, 'Stue', 'Upper lounge', [5.6, 11, 0, 5.6], [8.6, 4.2]);
  S.teleports = { g: { x: 6.6, y: 2.0, yaw: Math.PI * 0.62, lv: 0 }, u: { x: 1.0, y: 4.1, yaw: 0, lv: 1 } };
}

// ===========================================================================
// VERSJON 2 – "nytt": bedroom suite downstairs, kitchen/living upstairs.
// Two alternatives for the upper floor (1 = 2_nytt_1, 2 = 2_nytt_2)
// ===========================================================================
function buildV2(alt) {
  const { G0, G1 } = S;
  const ST = { x0: 2.15, x1: 5.85, y0: 4.7, y1: 5.6 };
  // ---- ground (1_nytt)
  slab(G0, OUTLINE, -0.15, 0, M.concrete);
  flat(G0, [[0, 3.5], [4.45, 3.5], [4.45, 0], [W, 0], [W, DR], [0, DL]], 0.01, M.oak);
  flat(G0, RECT(4.45, 7.1, 0, 3.5), 0.015, M.tile);
  ew(G0, 3.77, 0, W, 0);
  ew(G0, W, 0, W, DR, [
    { y0: 0.3, y1: 3.3, kind: 'win', sill: 0.05, head: 2.5 },
    { y0: 3.4, y1: 4.5, kind: 'slide', head: 2.4 },
    { y0: 4.6, y1: 5.5, kind: 'win', sill: 0.05, head: 2.5 },
    { y0: 5.7, y1: 9.75, kind: 'win', sill: 0.05, head: 2.5 }]);
  ew(G0, W, DR, 0, DL, [
    { x0: 8.5, x1: 10.8, kind: 'win', sill: 0.5, head: 2.4 },
    { x0: 1.55, x1: 2.1, kind: 'win', sill: 0.9, head: 2.4 }]);
  ew(G0, 0, DL, 0, 3.5, [
    { y0: 4.55, y1: 5.35, kind: 'win', sill: 0.3, head: 2.4 },
    { y0: 3.6, y1: 4.5, kind: 'front', head: 2.2, open: 'R' }]);
  ew(G0, 0, 3.5, 3.77, 3.5);
  ew(G0, 3.77, 3.5, 3.77, 0, [{ y0: 1.3, y1: 2.15, kind: 'front', head: 2.1, open: 'L' }]);
  iw(G0, 3.77, 3.5, 7.1, 3.5, [{ x0: 5.2, x1: 5.95, kind: 'door', open: 'R' }], { t: 0.15 });
  iw(G0, 4.45, 0, 4.45, 3.5);
  iw(G0, 7.1, 0, 7.1, 3.5);
  iw(G0, 4.45, 1.45, 5.15, 1.45);
  iw(G0, 5.85, 1.45, 7.1, 1.45);
  iw(G0, 7.1, 3.5, 7.1, 5.6, [{ y0: 3.55, y1: 5.55, kind: 'slide', head: 2.3 }]);
  iw(G0, ST.x0, 5.6, 7.1, 5.6);
  iw(G0, 7.1, 5.6, W, 5.6, [{ x0: 7.9, x1: 8.7, kind: 'door', open: 'L' }]);
  iw(G0, ST.x0, 5.6, ST.x0, topY(ST.x0), [{ y0: 5.64, y1: 6.4, kind: 'door', open: 'R' }]);
  iw(G0, 4.75, 5.6, 4.75, topY(4.75));
  iw(G0, 7.1, 5.6, 7.1, topY(7.1), [{ y0: 6.3, y1: 7.1, kind: 'door', open: 'L' }]);
  carportPost();
  const hole = straightStair({ ...ST, top: 'W', openTop: alt === 1 ? 0.45 : 0, fronts: [[2.3, 2.9], [2.92, 3.52], [3.54, 4.14], [4.16, 4.6]] });
  // entré: two round poufs + bench
  cyl(G0, 0.85, 4.95, 0.25, 0, 0.42, M.fabric2); cyl(G0, 1.5, 5.25, 0.25, 0, 0.42, M.fabric);
  S.obstacles.push({ x0: 0.6, x1: 1.75, y0: 4.7, y1: 5.5, lv: 0 });
  // bad
  wc(G0, 6.65, 3.1, Math.PI);
  vanity(G0, 4.5, 4.98, 2.0, 3.3);
  box(G0, 4.5, 7.05, 0.05, 1.4, 0.016, 0.03, M.darkStone, { shadow: false });
  box(G0, 6.9, 7.05, 0.1, 1.3, 1.9, 2.0, M.steel); // shower head bar
  utebodShelves(G0, 3.85, 4.4);
  // bokhylle / peis wall
  box(G0, 7.15, 7.6, 0, 3.45, 0, FH, M.wood, { obstacle: 0, map: 0 });
  for (const zz of [0.5, 0.9, 1.3, 1.7, 2.1, 2.5]) box(G0, 7.58, 7.62, 0.1, 3.35, zz, zz + 0.25, M.books, { shadow: false });
  box(G0, 7.55, 7.63, 1.3, 2.2, 0, 1.0, M.darkStone);
  box(G0, 7.61, 7.64, 1.45, 2.05, 0.25, 0.75, M.fire, { shadow: false });
  fireLight(G0, 8.0, 1.75, 0.7);
  // stue
  rug(G0, 7.9, 10.6, 0.6, 3.2);
  armchair(G0, 8.05, 1.9, Math.PI / 2 - 0.35);
  armchair(G0, 9.05, 2.75, -Math.PI * 0.85);
  squareTable(G0, 9.75, 1.85, 0.85, Math.PI / 4);
  plant(G0, 10.55, 0.45);
  // soverom, wic, bod
  bed(G0, 8.75, 10.4, 6.5, 8.6, 'S');
  nightstand(G0, 8.2, 6.0); nightstand(G0, 10.45, 6.0);
  wardrobe(G0, 4.82, 7.02, 5.66, 6.2);
  shelves(G0, 2.25, 4.68, 5.66, 6.05);

  // ---- upper (2_nytt_1 / 2_nytt_2)
  upperSlab([hole]);
  const sky = alt === 1 ? [[2.5, 3.6, 1.0, 2.4], [3.9, 5.0, 1.0, 2.4]] : [[3.0, 4.0, 0.9, 2.2], [4.2, 5.2, 0.9, 2.2]];
  ew(G1, 0, 0, W, 0);
  ew(G1, W, 0, W, DR, [{ y0: 0.3, y1: 5.3, kind: 'win', sill: 0.05, head: 2.4 }, { y0: 5.8, y1: 9.75, kind: 'win', sill: 0.05, head: 2.4 }]);
  if (alt === 1) {
    flat(G1, slopedPoly(2.0, 6.7, 5.6), FH + 0.006, M.tile);
    ew(G1, W, DR, 0, DL, [
      { x0: 9.4, x1: 10.85, kind: 'win', sill: 0.05, head: 2.4 },
      { x0: 8.1, x1: 9.3, kind: 'slide', head: 2.3 },
      { x0: 7.3, x1: 8.0, kind: 'win', sill: 0.05, head: 2.4 },
      { x0: 3.4, x1: 4.9, kind: 'win', sill: 1.4, head: 2.3 },
      { x0: 0.8, x1: 1.8, kind: 'win', sill: 0.8, head: 2.2 }]);
    ew(G1, 0, DL, 0, 0, [{ y0: 4.0, y1: 5.0, kind: 'win', sill: 0.8, head: 2.2 }, { y0: 0.7, y1: 2.9, kind: 'win', sill: 0.6, head: 2.3 }]);
    iw(G1, 0, 3.45, 5.55, 3.45);
    iw(G1, 2.0, 3.45, 2.0, topY(2.0), [{ y0: 3.55, y1: 4.35, kind: 'door', open: 'L' }]);
    iw(G1, 2.0, 5.6, 6.7, 5.6, [{ x0: 5.9, x1: 6.6, kind: 'door', open: 'L' }]);
    iw(G1, 6.7, 5.6, 6.7, topY(6.7));
    bed(G1, 0.25, 1.45, 3.6, 5.55, 'N');
    // bad
    vanity(G1, 2.3, 3.5, 5.65, 6.1);
    box(G1, 3.8, 5.5, 5.65, 6.4, FH, FH + 0.55, M.white, { obstacle: 1, map: 1 }); // bathtub
    box(G1, 3.9, 5.4, 5.75, 6.3, FH + 0.4, FH + 0.56, M.tile, { shadow: false });
    wc(G1, 6.4, 7.2, -Math.PI / 2);
    glassPanel(G1, 5.6, 5.62, 6.7, 7.9);
    daybed(G1, 7.6, 9.8, 6.3, 8.0);
    balcony(7.25, W, 1.4);
    kitchenUpper(2.1, 5.45, 6.0);
  } else {
    flat(G1, slopedPoly(3.9, 7.15, 5.6), FH + 0.006, M.tile);
    ew(G1, W, DR, 0, DL, [
      { x0: 9.3, x1: 10.85, kind: 'win', sill: 0.4, head: 2.3 },
      { x0: 8.3, x1: 9.2, kind: 'slide', head: 2.2 },
      { x0: 7.35, x1: 8.2, kind: 'win', sill: 0.4, head: 2.3 },
      { x0: 4.3, x1: 5.9, kind: 'win', sill: 1.4, head: 2.3 },
      { x0: 1.1, x1: 2.0, kind: 'win', sill: 0.8, head: 2.2 }]);
    ew(G1, 0, DL, 0, 0, [{ y0: 3.6, y1: 4.6, kind: 'win', sill: 0.8, head: 2.2 }, { y0: 0.8, y1: 2.6, kind: 'win', sill: 0.6, head: 2.3 }]);
    iw(G1, 0, 3.45, 6.0, 3.45);
    iw(G1, ST.x0, 5.6, W, 5.6, [{ x0: 6.05, x1: 6.85, kind: 'door', open: 'L' }, { x0: 7.4, x1: 8.2, kind: 'door', open: 'L' }]);
    iw(G1, ST.x0, 5.6, ST.x0, topY(ST.x0));
    iw(G1, 3.9, 5.6, 3.9, topY(3.9), [{ y0: 5.7, y1: 6.5, kind: 'slide', head: 2.1 }]);
    iw(G1, 7.15, 5.6, 7.15, topY(7.15));
    // gym
    box(G1, 0.35, 1.15, 3.75, 5.45, FH, FH + 0.25, M.frame, { obstacle: 1, map: 1 });
    box(G1, 0.4, 1.1, 3.8, 5.4, FH + 0.25, FH + 0.28, M.rubber);
    box(G1, 0.35, 1.15, 5.35, 5.45, FH + 0.25, FH + 1.3, M.frame);
    box(G1, 1.45, 2.05, 3.6, 4.4, FH + 0.005, FH + 0.015, M.rubber, { shadow: false });
    box(G1, 1.45, 1.9, 4.6, 5.3, FH, FH + 0.9, M.frame, { obstacle: 1, map: 1 });
    // WIC + bad + sov
    wardrobe(G1, 2.22, 3.85, 5.66, 6.2);
    vanity(G1, 4.0, 5.2, 5.65, 6.1);
    wc(G1, 6.75, 7.4, -Math.PI / 2);
    glassPanel(G1, 5.4, 5.42, 6.5, 7.5);
    bed(G1, 8.5, 10.3, 5.75, 7.85, 'S');
    nightstand(G1, 7.95, 5.75); nightstand(G1, 10.4, 5.75);
    armchair(G1, 9.6, 4.8, -0.5);
    balcony(8.0, 9.9, 1.2);
    kitchenUpper(2.1, 5.9, 6.45);
  }
  roof(sky);
  // ---- rooms
  room(0, 'Bad', 'Bathroom', [4.45, 7.1, 0, 3.5], [5.8, 2.4]);
  room(0, 'Utebod', 'Outdoor storage', [3.77, 4.45, 0, 3.5], [4.1, 1.2]);
  room(0, 'Garasje', 'Garage / carport', [0, 3.77, 0, 3.5], [1.8, 1.75]);
  room(0, 'Bod', 'Storage', [2.15, 4.75, 5.6, 10], [3.4, 6.3]);
  room(0, 'WIC', 'Walk-in closet', [4.75, 7.1, 5.6, 10], [5.9, 6.8]);
  room(0, 'Soverom', 'Bedroom', [7.1, 11, 5.6, 10], [9.6, 9.0]);
  room(0, 'Entré', 'Entrance hall', [0, 2.3, 3.5, 10], [1.0, 4.1]);
  room(0, 'Gang / trapp', 'Hall + stairs', [2.3, 7.1, 3.5, 5.6], [4.3, 4.1]);
  room(0, 'Stue', 'Living room', [7.1, 11, 0, 5.6], [9.4, 4.0]);
  if (alt === 1) {
    room(1, 'Soverom', 'Bedroom', [0, 2.0, 3.45, 10], [1.0, 5.75]);
    room(1, 'Bad', 'Bathroom', [2.0, 6.7, 5.6, 10], [4.4, 6.9]);
    room(1, 'Gang', 'Hall', [2.0, 5.85, 3.45, 5.6], [3.6, 4.1]);
  } else {
    room(1, 'Treningsrom', 'Gym', [0, 2.15, 3.45, 10], [1.5, 5.6]);
    room(1, 'WIC', 'Walk-in closet', [2.15, 3.9, 5.6, 10], [3.0, 6.5]);
    room(1, 'Bad', 'Bathroom', [3.9, 7.15, 5.6, 10], [5.6, 6.9]);
    room(1, 'Soverom', 'Bedroom', [7.15, 11, 5.6, 10], [9.4, 8.6]);
    room(1, 'Trapperom', 'Landing', [2.15, 5.85, 3.45, 4.7], [3.6, 4.1]);
  }
  room(1, 'Kjøkken', 'Kitchen', [2.0, 6.0, 0, 3.45], [3.8, 1.7]);
  room(1, 'Spiseplass', 'Dining', [0, 2.0, 0, 3.45], [1.0, 3.0]);
  room(1, 'Stue', 'Living room', [5.85, 11, 0, 10], [8.6, 4.0]);
  S.teleports = { g: { x: 6.5, y: 4.2, yaw: -0.2, lv: 0 }, u: { x: 6.6, y: 4.3, yaw: -0.25, lv: 1 } };
}
function utebodShelves(G, x0, x1) { shelves(G, x0, x1, 2.6, 3.4); }
// kitchen + dining + living shared by both upper alternatives of Versjon 2
function kitchenUpper(kx0, kx1, peisX) {
  const { G1 } = S;
  kitchenRun(G1, kx0, kx1, 2.78, 3.4, [kx0, kx1, 3.05, 3.4]);
  kitchenRun(G1, 2.15, 5.3, 0.05, 0.68, [2.15, 5.3, 0.05, 0.4]);
  roundFireplace(G1, peisX, 3.0, ROOF_TOP + 0.9);
  rectTable(G1, 0.75, 1.6, 1.1, 2.7);
  rug(G1, 6.6, 10.6, 0.3, 3.6);
  lSofa(G1, 6.9, 9.9, 0.35, 1.25, 2.4);
  coffeeTable(G1, 7.9, 2.3, 0.45);
  plant(G1, 10.55, 4.6);
}

// ===========================================================================
// VERSJON 3 – "ny": U-shaped stair, kitchen/living downstairs, bedrooms upstairs
// ===========================================================================
function buildV3() {
  const { G0, G1 } = S;
  const US = { x0: 5.45, x1: 7.05, y0: 0, y1: 3.8 };
  // ---- ground (1_ny)
  slab(G0, OUTLINE, -0.15, 0, M.concrete);
  flat(G0, [[0, 3.5], [4.85, 3.5], [4.85, 0], [W, 0], [W, DR], [0, DL]], 0.01, M.oak);
  flat(G0, slopedPoly(3.35, 6.35, 5.2), 0.015, M.tile);
  ew(G0, 4.85, 0, W, 0);
  ew(G0, W, 0, W, DR, [
    { y0: 0.3, y1: 3.5, kind: 'win', sill: 0.05, head: 2.5 },
    { y0: 3.6, y1: 6.0, kind: 'slide', head: 2.5 },
    { y0: 6.1, y1: 9.75, kind: 'win', sill: 0.05, head: 2.5 }]);
  ew(G0, W, DR, 0, DL, [
    { x0: 9.1, x1: 10.8, kind: 'win', sill: 0.05, head: 2.5 },
    { x0: 7.3, x1: 8.2, kind: 'win', sill: 0.9, head: 2.4 },
    { x0: 4.6, x1: 5.3, kind: 'win', sill: 1.4, head: 2.3 },
    { x0: 3.5, x1: 4.2, kind: 'win', sill: 1.4, head: 2.3 },
    { x0: 1.2, x1: 2.6, kind: 'win', sill: 0.9, head: 2.4 }]);
  ew(G0, 0, DL, 0, 3.5, [
    { y0: 4.7, y1: 5.4, kind: 'win', sill: 0.3, head: 2.4 },
    { y0: 3.6, y1: 4.55, kind: 'front', head: 2.2, open: 'R' }]);
  ew(G0, 0, 3.5, 4.85, 3.5);
  ew(G0, 4.85, 3.5, 4.85, 0, [{ y0: 1.2, y1: 2.05, kind: 'front', head: 2.1, open: 'L' }]);
  iw(G0, 4.85, 3.5, 5.45, 3.5);
  iw(G0, US.x0, 0, US.x0, US.y1);
  iw(G0, US.x1, 0, US.x1, US.y1);
  iw(G0, US.x1, US.y1, US.x1, 5.2, [{ y0: 3.85, y1: 5.15, kind: 'slide', head: 2.3 }]);
  iw(G0, 3.35, 5.2, 6.35, 5.2, [{ x0: 4.3, x1: 5.1, kind: 'door', open: 'L' }]);
  iw(G0, 3.35, 5.2, 3.35, topY(3.35));
  iw(G0, 6.35, 5.2, 6.35, topY(6.35));
  carportPost();
  const hole = uStair({ ...US, landing: 1.3 });
  // høyskap facing the entrance
  box(G0, 2.85, 3.3, 5.25, topY(2.85) - 0.15, 0, 2.3, M.white, { obstacle: 0, map: 0 });
  // bad
  vanity(G0, 3.4, 3.88, 5.6, 6.6);
  wc(G0, 6.0, 5.6, Math.PI / 2);
  glassPanel(G0, 4.9, 4.92, 6.3, 7.4);
  // kitchen, island, dining
  kitchenRun(G0, 6.4, 7.05, 5.25, 8.1, [6.4, 6.75, 5.25, 8.1]);
  island(G0, 7.45, 8.15, 6.1, 7.9);
  roundTable(G0, 9.7, 7.6, 0.65);
  cyl(G0, 9.7, 7.6, 0.02, 1.5, FH - 0.25, M.frame, 6); cyl(G0, 9.7, 7.6, 0.22, 1.35, 1.5, M.black, 24);
  // stue
  rug(G0, 8.0, 10.7, 1.1, 4.3);
  sofa(G0, 8.4, 9.25, 1.4, 3.5, 'W');
  armchair(G0, 9.75, 4.0, Math.PI);
  coffeeTable(G0, 9.95, 2.4, 0.42);
  fireplace(G0, 8.3, 9.4, 0, 0.62, FH);
  box(G0, 9.45, 10.85, 0.12, 0.72, 0, 0.42, M.wood, { obstacle: 0, map: 0 });
  box(G0, 9.48, 10.82, 0.15, 0.7, 0.42, 0.5, M.linen);
  box(G0, 9.48, 10.82, 0.12, 0.28, 0.5, 0.95, M.fabric2);
  box(G0, 7.15, 8.25, 0.12, 0.55, 0, 0.45, M.white, { obstacle: 0, map: 0 });
  box(G0, 0.13, 0.5, 4.7, 5.4, 0, 0.45, M.wood, { obstacle: 0, map: 0 });
  shelves(G0, 4.92, 5.38, 2.4, 3.4);
  // ---- upper (2_ny)
  upperSlab([hole]);
  flat(G1, slopedPoly(5.55, 8.2, 4.9), FH + 0.006, M.tile);
  ew(G1, 0, 0, W, 0);
  ew(G1, W, 0, W, DR, [{ y0: 0.3, y1: 6.2, kind: 'win', sill: 0.05, head: 2.4 }, { y0: 6.6, y1: 9.75, kind: 'win', sill: 0.05, head: 2.4 }]);
  ew(G1, W, DR, 0, DL, [
    { x0: 9.3, x1: 10.8, kind: 'win', sill: 0.3, head: 2.3 },
    { x0: 6.4, x1: 7.7, kind: 'win', sill: 1.4, head: 2.3 },
    { x0: 3.4, x1: 4.9, kind: 'win', sill: 1.3, head: 2.3 },
    { x0: 0.4, x1: 2.1, kind: 'win', sill: 0.8, head: 2.3 }]);
  ew(G1, 0, DL, 0, 0, [{ y0: 4.5, y1: 5.35, kind: 'win', sill: 0.8, head: 2.2 }, { y0: 0.9, y1: 3.2, kind: 'win', sill: 0.6, head: 2.3 }]);
  iw(G1, 0, 3.9, 3.95, 3.9, [{ x0: 1.5, x1: 2.3, kind: 'door', open: 'R' }]);
  iw(G1, 3.95, 0, 3.95, 3.9);
  iw(G1, 3.95, 3.9, US.x0, 3.9, [{ x0: 4.3, x1: 5.05, kind: 'door', open: 'R' }]);
  iw(G1, US.x0, 0, US.x0, 3.9);
  iw(G1, US.x1, 0, US.x1, 3.9);
  iw(G1, 2.95, 4.9, 8.2, 4.9, [{ x0: 3.6, x1: 4.4, kind: 'door', open: 'L' }, { x0: 6.4, x1: 7.2, kind: 'door', open: 'L' }]);
  iw(G1, 2.95, 4.9, 2.95, topY(2.95));
  iw(G1, 5.55, 4.9, 5.55, topY(5.55));
  iw(G1, 8.2, 4.9, 8.2, topY(8.2));
  iw(G1, 8.2, 5.7, W, 5.7, [{ x0: 8.8, x1: 9.55, kind: 'door', open: 'L' }]);
  // soverom 1 (SW) + bod
  bed(G1, 1.0, 2.8, 0.1, 2.2, 'S');
  nightstand(G1, 0.45, 0.1); nightstand(G1, 2.9, 0.1);
  wardrobe(G1, 0.1, 0.7, 2.6, 3.9);
  shelves(G1, 4.02, 5.38, 0.1, 0.5);
  shelves(G1, 4.02, 5.38, 2.0, 2.4);
  // gym
  box(G1, 1.3, 2.0, 5.1, 5.9, FH + 0.005, FH + 0.015, M.rubber, { shadow: false });
  box(G1, 0.3, 1.05, 4.1, 5.6, FH, FH + 0.25, M.frame, { obstacle: 1, map: 1 });
  box(G1, 0.35, 1.0, 4.15, 5.55, FH + 0.25, FH + 0.28, M.rubber);
  box(G1, 0.3, 1.05, 4.05, 4.15, FH + 0.25, FH + 1.3, M.frame);
  // WIC, bad, soverom 2
  wardrobe(G1, 3.02, 5.48, 4.96, 5.5);
  vanity(G1, 5.62, 6.2, 5.0, 6.2);
  wc(G1, 7.9, 5.6, -Math.PI / 2);
  glassPanel(G1, 6.9, 6.92, 6.5, 7.5);
  bed(G1, 9.3, 10.8, 5.85, 7.9, 'S');
  nightstand(G1, 8.75, 5.8);
  // stue + peis
  rug(G1, 7.6, 10.6, 1.0, 4.4);
  fireplace(G1, 8.4, 9.4, 0, 0.62, ROOF_TOP + 0.9);
  sofa(G1, 7.6, 8.45, 1.2, 3.9, 'W');
  coffeeTable(G1, 9.4, 2.4, 0.4);
  armchair(G1, 9.85, 3.95, Math.PI);
  plant(G1, 10.6, 5.2);
  roof();
  // ---- rooms
  room(0, 'Utebod', 'Outdoor storage', [4.85, 5.45, 0, 3.5], [5.15, 1.2]);
  room(0, 'Carport', 'Carport', [0, 4.85, 0, 3.5], [2.4, 1.75]);
  room(0, 'Bad', 'Bathroom', [3.35, 6.35, 5.2, 10], [4.9, 6.1]);
  room(0, 'Kjøkken', 'Kitchen', [6.35, 8.6, 5.2, 10], [7.8, 8.6]);
  room(0, 'Spiseplass', 'Dining', [8.6, 11, 5.2, 10], [9.7, 8.8]);
  room(0, 'Entré', 'Entrance hall', [0, 7.05, 3.5, 10], [1.3, 4.6]);
  room(0, 'Stue', 'Living room', [7.05, 11, 0, 5.2], [10.0, 3.2]);
  room(1, 'Soverom', 'Bedroom 1', [0, 3.95, 0, 3.9], [2.2, 3.0]);
  room(1, 'Bod', 'Storage', [3.95, 5.45, 0, 3.9], [4.7, 1.3]);
  room(1, 'Treningsrom', 'Gym', [0, 2.95, 3.9, 10], [1.6, 5.4]);
  room(1, 'WIC', 'Walk-in closet', [2.95, 5.55, 4.9, 10], [4.2, 5.9]);
  room(1, 'Bad', 'Bathroom', [5.55, 8.2, 4.9, 10], [6.9, 6.7]);
  room(1, 'Soverom', 'Bedroom 2', [8.2, 11, 5.7, 10], [9.9, 8.6]);
  room(1, 'Gang', 'Hall', [0, 7.05, 3.9, 4.9], [4.2, 4.4]);
  room(1, 'Stue', 'Upper lounge', [7.05, 11, 0, 5.7], [9.4, 4.9]);
  S.teleports = { g: { x: 7.6, y: 4.6, yaw: -0.5, lv: 0 }, u: { x: 3.0, y: 4.4, yaw: 0, lv: 1 } };
}

export const VERSIONS = [
  {
    id: 'v1', name: 'Versjon 1', sub: 'Originaltegningene',
    desc: ['1. etg: entré, kjøkken, spiseplass, stue med peis, toalett/dusj', '2. etg: 2 soverom, WIC, bad, vaskerom, stue'],
    build: () => buildV1(),
  },
  {
    id: 'v2', name: 'Versjon 2', sub: 'Original 2 – stue og kjøkken oppe',
    desc: ['1. etg: soverom, WIC, bad, stue med peis/bokhylle', '2. etg: kjøkken, spiseplass, stue, balkong, takvinduer'],
    alts: [
      { id: '1', label: 'Alt. 1 · daybed + lite soverom', short: 'Alt. 1' },
      { id: '2', label: 'Alt. 2 · treningsrom + soverom', short: 'Alt. 2' },
    ],
    build: (alt) => buildV2(alt === '2' ? 2 : 1),
  },
  {
    id: 'v3', name: 'Versjon 3', sub: 'U-trapp',
    desc: ['1. etg: entré, bad, kjøkken med øy, spiseplass, stue med peis', '2. etg: 2 soverom, treningsrom, WIC, bad, stue'],
    build: () => buildV3(),
  },
];
