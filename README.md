# Huset ved sjøen – 3D

A walk-through 3D model of three versions of the house (Three.js), with a start page and an
upper-floor swap for Versjon 2.

## Publish it
See **[DEPLOY.md](DEPLOY.md)** for a step-by-step recipe to push this repo to GitHub and publish it on GitHub Pages (the included workflow builds and deploys automatically).

## Quick look (no install)
Open `dist/index.html` in a browser. It is one self-contained file.

## Develop
```bash
npm install
npm run build      # rebuilds dist/index.html from src/
npm run serve      # optional: serve dist/ on http://localhost:3000
```

## Where things are
| File | What it does |
|---|---|
| `src/versions.js` | **The house plans.** One `buildV1/V2/V3` function per version: walls, doors, windows, stairs, furniture, room names. Edit here to change a layout or add a version (append to `VERSIONS`). |
| `src/core.js` | Building blocks: footprint, materials, `wall()`, stairs (straight + U), balconies, furniture helpers, collision state. |
| `src/app.js` | Renderer, ocean/terrain, start page, dollhouse + walk controls, minimap, routing (`#v1`, `#v2-1`, `#v2-2`, `#v3`). |
| `src/index.template.html` | Page layout and styles; the build inlines the bundled script into it. |

### Coordinates
Metres, seen from above: `x` runs from the entrance wall (x=0) to the glass wall facing the
sea (x=11); `y` runs from the south wall (y=0) to the sloping north wall (`topY(x)`, 5.6 m at the
narrow end → 10 m at the broad end). Floor-to-floor height `FH` = 2.95 m.

### Adding a new version
1. Write a `buildV4()` in `src/versions.js` (copy one of the existing functions as a template).
2. Add an entry to the `VERSIONS` array (use `alts` if it has several upper-floor options).
3. `npm run build`.
