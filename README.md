# Hyperion WiFi GA

Interactive 3D general-arrangement viewer for WiFi planning on **Ramform Hyperion**.

## Features

- Layered deck planes extracted from the GA PDF (sheet 1/3 — Deck 5 & above)
- Orbit / walk / fly navigation
- Place **behovssoner** (need zones) and **aksesspunkter** (APs)
- Semi-transparent AP coverage spheres (adjustable radius)
- Auto-save to `localStorage` + JSON download/upload

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Source

Deck textures are raster crops from `hyp-ga-plan.pdf` (AutoCAD LT vector sheet).
Sheets 2/3 and 3/3 (lower decks) are not in the provided PDF.
