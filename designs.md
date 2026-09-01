# Web-Tools Design System & Architecture Guide

This document defines the complete design system, typography hierarchy, color tokens, component implementations, and architecture standards replicated from the **Portfolio** codebase for use in **Web-Tools**.

---

## 1. Typography & Font Families

The design language uses a curated combination of custom geometric display fonts, clean editorial sans-serifs, and precision monospace accents.

### Font Hierarchy:

| Role | Font Family | Weights / Variants | Primary Use Cases |
| :--- | :--- | :--- | :--- |
| **Display Headline** | `Clash Display` | `Semibold` (600), `Bold` (700), `Medium` (500) | Section titles (`H2`), Project card titles (`H3`), Showcase headers, Modal titles |
| **Display Eyebrow** | `Array` | `Array-Semibold` (600), `Array-Bold` (700), `Array-Wide` | Section categories, sub-headings, uppercase tracking labels (`Who am I`, `Selected Projects`, `My Tech Arsenal`) |
| **Primary Sans** | `Inter` | `Regular` (400), `Medium` (500), `Semi-Bold` (600), `Extra-Bold` (800), `Black` (900) | Body paragraphs, narrative descriptions, UI buttons, interactive text |
| **Monospace / Meta** | `Roboto Mono` | `Regular` (400), `Medium` (500), `Semi-Bold` (600), `Bold` (700) | Numerical counters (`01/05`), Tech stack badges, timestamps, code snippets, metadata labels |

---

### Google Fonts Preconnect & Import

Add to HTML `<head>` / Layout shell:
```html
<!-- Preconnects for Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Google Fonts (Non-render-blocking with swap) -->
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Roboto+Mono:wght@400;500;600;700&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Roboto+Mono:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'" />
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Roboto+Mono:wght@400;500;600;700&display=swap" />
</noscript>

<!-- Critical Local Font Preloads -->
<link rel="preload" href="/fonts/Array-Semibold.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/ClashDisplay-Semibold.woff2" as="font" type="font/woff2" crossorigin />
```

---

### Local Font Definitions (`@font-face`)

#### `array.css`:
```css
@font-face {
  font-family: 'Array-Semibold';
  src: url('/fonts/Array-Semibold.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
  font-style: normal;
}
```

#### `clash-display.css`:
```css
@font-face {
  font-family: 'ClashDisplay-Semibold';
  src: url('/fonts/ClashDisplay-Semibold.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
  font-style: normal;
}
```

---

## 2. Color Palette & Design Tokens

### Core Color Palette:

- **Signature Accent (`--color-accent`):** `#C44900` (Cardinal / Electric Burnt Orange)
- **Gradient Steps:**
  - `bg-[#C44900]`
  - `bg-[#D65408]`
  - `bg-[#E86711]`
  - `bg-[#F57C20]`
  - `bg-[#FF9436]`
- **Canvas / Background:** `#f8f8f8` (Clean editorial light background) / `#FAFAFA`
- **Primary Text:** `#000000` (Pure Black) & `#0f172a` (Slate 900)
- **Secondary Text / Subtitles:** `#334155` (Slate 700) & `#64748b` (Slate 500)
- **Muted Text / Counters:** `#94a3b8` (Slate 400) & `#cbd5e1` (Slate 300)
- **Border Tokens:**
  - Subtle Default: `border-slate-200/80` (or `border-[#334155]/20`)
  - Hover / Focus Accent: `border-[#C44900]` (`border-accent`)
- **Selection Highlight:** `selection:bg-[#DF2935]/20 selection:text-black`

---

### Tailwind CSS `@theme` Configuration (Tailwind v4)

```css
@import "tailwindcss";
@import "../assets/fonts/array.css";
@import "../assets/fonts/clash-display.css";

@theme {
  /* Signature Brand Accent & Theme Colors */
  --color-accent: #C44900;
  --color-primary: #ffffff;
  --color-surface: #141313;
  --color-surface-dim: #141313;
  --color-surface-container: #201f1f;
  --color-surface-container-low: #1c1b1b;
  --color-surface-container-high: #2a2a2a;
  --color-background: #141313;
  --color-on-background: #e5e2e1;
  --color-outline: #8e9192;
  --color-outline-variant: #444748;

  /* Font Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Roboto Mono', monospace;
  --font-array-semibold: 'Array-Semibold', sans-serif;
  --font-clash-semibold: 'ClashDisplay-Semibold', sans-serif;

  /* Border Radii */
  --radius-sm: 0.25rem;
  --radius-DEFAULT: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-2xl: 2rem;
  --radius-full: 9999px;

  /* Spacing */
  --spacing-container-max: 1600px;
  --spacing-gutter: 24px;
}

html,
body {
  max-width: 100%;
  overflow-x: clip;
  scrollbar-width: none; /* Hide scrollbar for Firefox */
  -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
}

html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome, Safari, Opera */
}

body {
  background-color: #f8f8f8;
  color: #000000;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

---

## 3. Headings & Typography Hierarchy

### 1. `H1` Hero Title
```html
<h1 className="font-sans text-[9vw] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[7rem] 2xl:text-[8.5rem] font-black text-black tracking-tighter leading-[0.9] select-none whitespace-nowrap">
  Main Title
</h1>

<!-- Hero Accent Variant with Animated Strikethrough -->
<h1 className="font-clash-semibold text-[9vw] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[7rem] 2xl:text-[8.5rem] font-semibold text-accent tracking-tighter leading-[0.9] select-none whitespace-nowrap">
  <span className="relative inline-block italic mr-[0.25em]">
    <span>Future</span>
    <motion.span
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      className="absolute left-0 right-0 top-[55%] -translate-y-1/2 h-[3px] sm:h-[5px] lg:h-[7px] bg-black rounded-full pointer-events-none"
    />
  </span>
  Tools
</h1>
```

### 2. `H2` Section Title
```html
<span className="font-array-semibold text-xs sm:text-base md:text-lg font-semibold uppercase tracking-[0.2em] text-[#334155] text-center mb-2 sm:mb-3">
  Category Eyebrow
</span>
<h2 className="font-clash-semibold text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-[4.25rem] 2xl:text-[5rem] font-semibold text-accent tracking-tighter leading-[0.9] select-none text-center mb-8 sm:mb-12">
  Section Title
</h2>
```

### 3. `H3` Card Title
```html
<h3 className="font-clash-semibold text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-tight group-hover:text-accent transition-colors">
  Card Title
</h3>
```

### 4. Subheadings & Metadata
```html
<!-- Eyebrow Subheading -->
<span className="font-array-semibold text-base md:text-lg font-semibold uppercase tracking-[0.2em] text-[#334155]">
  Section Eyebrow
</span>

<!-- Body Copy -->
<p className="font-sans text-xs sm:text-sm md:text-base text-slate-500 leading-relaxed max-w-md">
  Clear, descriptive copy detailing features, operations, and benefits.
</p>

<!-- Numerical Counter / Meta Tag -->
<span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold">
  01 / 08
</span>
```

---

## 4. Card Designs

### Pattern A: Bento Overview Card
Clean white container with subtle slate borders and an accent hover transition.

```tsx
<div className="border-2 border-slate-200/80 bg-white p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-start gap-2 sm:gap-3 hover:border-accent hover:shadow-[0_12px_28px_-8px_rgba(196,73,0,0.1)] transition-all duration-300 group cursor-target">
  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold">
    Category
  </span>
  <h3 className="font-clash-semibold text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-tight group-hover:text-accent transition-colors">
    Feature / Tool Name
  </h3>
  <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed mt-0.5 sm:mt-1">
    Detailed description of the tool utility, purpose, and keyboard shortcuts.
  </p>
</div>
```

---

### Pattern B: Featured Stack Card (ScrollStack)
Full-width gradient hero card with dual column layout (information on the left, browser preview device on the right).

```tsx
<div className="relative bg-[#C44900] text-white flex flex-col justify-between cursor-target overflow-hidden rounded-[32px] sm:rounded-[40px] p-6 sm:p-10">
  {/* Decorative overlay gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none" />

  <div className="w-full h-full grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 z-10">
    {/* Left Info Column */}
    <div className="md:col-span-6 flex flex-col justify-center gap-4">
      <span className="font-mono text-xs text-white/80 font-bold tracking-widest uppercase">
        01 / 05
      </span>
      <h3 className="font-clash-semibold text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase leading-none">
        Tool Name <span className="font-sans text-sm font-normal text-white/90 normal-case">(Utility)</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-black/30 text-white border border-white/25 backdrop-blur-sm font-semibold">
          WebAssembly
        </span>
      </div>
      <p className="font-sans text-sm leading-relaxed text-white/95 max-w-md">
        Instant client-side image compression, conversion, and optimization without server upload.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 hover:bg-black/50 border border-white/30 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-target">
          Launch Tool
        </a>
      </div>
    </div>

    {/* Right Browser Frame Preview Column */}
    <div className="hidden md:flex md:col-span-6 items-center justify-center">
      <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/25 shadow-2xl bg-black/30 flex flex-col">
        <div className="h-5 w-full bg-white/15 border-b border-white/15 flex items-center px-3 gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>
        <div className="w-full flex-1 bg-slate-900 overflow-hidden">
          <img src="/preview.webp" alt="Tool Preview" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </div>
</div>
```

---

### Pattern C: 4:5 Poster / Media Card
Ideal for visual showcases, previews, and templates.

```tsx
<div className="flex-shrink-0 w-full md:w-[320px] flex flex-col group cursor-target select-none">
  <div className="relative aspect-[4/5] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-md group-hover:shadow-xl group-hover:border-accent/40 transition-all duration-300">
    <img
      src="/tool-cover.webp"
      alt="Cover"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none ring-1 ring-inset ring-black/5" />
  </div>

  <div className="mt-3 flex items-center justify-between px-1">
    <div className="flex flex-col">
      <span className="font-clash-semibold text-base font-bold text-slate-800 tracking-tight group-hover:text-accent transition-colors">
        JSON Formatter
      </span>
      <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
        Developer Tool
      </span>
    </div>
    <span className="font-mono text-sm font-bold text-slate-300 group-hover:text-accent/60 transition-colors">
      01
    </span>
  </div>
</div>
```

---

### Pattern D: Filterable Matrix Bento Item
Centered interactive technology / tool grid tile.

```tsx
<div className="w-[calc((100%-1.5rem)/3)] md:w-[calc((100%-3.75rem)/4)] lg:w-[calc((100%-5rem)/5)] max-w-[240px] group relative border-2 border-slate-200/80 bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all duration-300 hover:border-accent hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(196,73,0,0.12)] cursor-target overflow-hidden">
  <div className="w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:scale-110">
    <img src="/icons/react.svg" alt="React" className="w-7 h-7 sm:w-10 sm:h-10 object-contain drop-shadow-sm" />
  </div>
  <span className="font-clash-semibold text-xs sm:text-sm font-bold text-slate-800 text-center relative z-10 group-hover:text-accent transition-colors duration-300 truncate max-w-full">
    React
  </span>
  <span className="font-mono text-[8px] sm:text-[10px] text-slate-400 uppercase font-semibold px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md truncate max-w-full">
    Frontend
  </span>
</div>
```

---

## 5. Interactive Canvas & Physics Components

### `ShapeGrid.tsx` Component
High-performance dynamic HTML5 canvas background simulation with shape morphing, trail dissipation, direction flow, and vignette overlay.

```tsx
import React, { useRef, useEffect } from 'react';

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;

interface GridOffset {
  x: number;
  y: number;
}

export interface ShapeGridProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  speed?: number;
  borderColor?: CanvasStrokeStyle;
  squareSize?: number;
  hoverFillColor?: CanvasStrokeStyle;
  shape?: 'square' | 'hexagon' | 'circle' | 'triangle';
  hoverTrailAmount?: number;
  gradientColor?: string;
}

const ShapeGrid: React.FC<ShapeGridProps> = ({
  direction = 'right',
  speed = 1,
  borderColor = '#999',
  squareSize = 55,
  hoverFillColor = '#222',
  shape = 'square',
  hoverTrailAmount = 0,
  gradientColor = '#FAFAFA'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const numSquaresX = useRef<number>(0);
  const numSquaresY = useRef<number>(0);
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<GridOffset | null>(null);
  const trailCells = useRef<GridOffset[]>([]);
  const cellOpacities = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let isVisible = false;
    let isLoopRunning = false;
    let isPreloaderActive = typeof window !== 'undefined' && !!document.getElementById('preloader');

    const isHex = shape === 'hexagon';
    const isTri = shape === 'triangle';
    const hexHoriz = squareSize * 1.5;
    const hexVert = squareSize * Math.sqrt(3);

    let rect = canvas.getBoundingClientRect();

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
      rect = canvas.getBoundingClientRect();
    };

    const updateRect = () => {
      rect = canvas.getBoundingClientRect();
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', updateRect, { passive: true });
    resizeCanvas();

    const drawHex = (cx: number, cy: number, size: number) => {
      if (!ctx) return;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const vx = cx + size * Math.cos(angle);
        const vy = cy + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
    };

    const drawCircle = (cx: number, cy: number, size: number) => {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
      ctx.closePath();
    };

    const drawTriangle = (cx: number, cy: number, size: number, flip: boolean) => {
      if (!ctx) return;
      ctx.beginPath();
      if (flip) {
        ctx.moveTo(cx, cy + size / 2);
        ctx.lineTo(cx + size / 2, cy - size / 2);
        ctx.lineTo(cx - size / 2, cy - size / 2);
      } else {
        ctx.moveTo(cx, cy - size / 2);
        ctx.lineTo(cx + size / 2, cy + size / 2);
        ctx.lineTo(cx - size / 2, cy + size / 2);
      }
      ctx.closePath();
    };

    const drawGrid = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isHex) {
        const colShift = Math.floor(gridOffset.current.x / hexHoriz);
        const offsetX = ((gridOffset.current.x % hexHoriz) + hexHoriz) % hexHoriz;
        const offsetY = ((gridOffset.current.y % hexVert) + hexVert) % hexVert;

        const cols = Math.ceil(canvas.width / hexHoriz) + 3;
        const rows = Math.ceil(canvas.height / hexVert) + 3;

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * hexHoriz + offsetX;
            const cy = row * hexVert + ((col + colShift) % 2 !== 0 ? hexVert / 2 : 0) + offsetY;

            const cellKey = `${col},${row}`;
            const alpha = cellOpacities.current.get(cellKey);
            if (alpha) {
              ctx.globalAlpha = alpha;
              drawHex(cx, cy, squareSize);
              ctx.fillStyle = hoverFillColor;
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            drawHex(cx, cy, squareSize);
            ctx.strokeStyle = borderColor;
            ctx.stroke();
          }
        }
      } else if (isTri) {
        const halfW = squareSize / 2;
        const colShift = Math.floor(gridOffset.current.x / halfW);
        const rowShift = Math.floor(gridOffset.current.y / squareSize);
        const offsetX = ((gridOffset.current.x % halfW) + halfW) % halfW;
        const offsetY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize;

        const cols = Math.ceil(canvas.width / halfW) + 4;
        const rows = Math.ceil(canvas.height / squareSize) + 4;

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * halfW + offsetX;
            const cy = row * squareSize + squareSize / 2 + offsetY;
            const flip = ((col + colShift + row + rowShift) % 2 + 2) % 2 !== 0;

            const cellKey = `${col},${row}`;
            const alpha = cellOpacities.current.get(cellKey);
            if (alpha) {
              ctx.globalAlpha = alpha;
              drawTriangle(cx, cy, squareSize, flip);
              ctx.fillStyle = hoverFillColor;
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            drawTriangle(cx, cy, squareSize, flip);
            ctx.strokeStyle = borderColor;
            ctx.stroke();
          }
        }
      } else if (shape === 'circle') {
        const offsetX = ((gridOffset.current.x % squareSize) + squareSize) % squareSize;
        const offsetY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize;

        const cols = Math.ceil(canvas.width / squareSize) + 3;
        const rows = Math.ceil(canvas.height / squareSize) + 3;

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * squareSize + squareSize / 2 + offsetX;
            const cy = row * squareSize + squareSize / 2 + offsetY;

            const cellKey = `${col},${row}`;
            const alpha = cellOpacities.current.get(cellKey);
            if (alpha) {
              ctx.globalAlpha = alpha;
              drawCircle(cx, cy, squareSize);
              ctx.fillStyle = hoverFillColor;
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            drawCircle(cx, cy, squareSize);
            ctx.strokeStyle = borderColor;
            ctx.stroke();
          }
        }
      } else {
        const offsetX = ((gridOffset.current.x % squareSize) + squareSize) % squareSize;
        const offsetY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize;

        const cols = Math.ceil(canvas.width / squareSize) + 3;
        const rows = Math.ceil(canvas.height / squareSize) + 3;

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const sx = col * squareSize + offsetX;
            const sy = row * squareSize + offsetY;

            const cellKey = `${col},${row}`;
            const alpha = cellOpacities.current.get(cellKey);
            if (alpha) {
              ctx.globalAlpha = alpha;
              ctx.fillStyle = hoverFillColor;
              ctx.fillRect(sx, sy, squareSize, squareSize);
              ctx.globalAlpha = 1;
            }

            ctx.strokeStyle = borderColor;
            ctx.strokeRect(sx, sy, squareSize, squareSize);
          }
        }
      }

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
      );
      gradient.addColorStop(0, 'rgba(250, 250, 250, 0)');
      gradient.addColorStop(1, gradientColor);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const updateAnimation = () => {
      if (!isVisible || isPreloaderActive) {
        isLoopRunning = false;
        return;
      }

      if (speed > 0) {
        const wrapX = isHex ? hexHoriz * 2 : squareSize;
        const wrapY = isHex ? hexVert : isTri ? squareSize * 2 : squareSize;

        switch (direction) {
          case 'right':
            gridOffset.current.x = (gridOffset.current.x - speed + wrapX) % wrapX;
            break;
          case 'left':
            gridOffset.current.x = (gridOffset.current.x + speed + wrapX) % wrapX;
            break;
          case 'up':
            gridOffset.current.y = (gridOffset.current.y + speed + wrapY) % wrapY;
            break;
          case 'down':
            gridOffset.current.y = (gridOffset.current.y - speed + wrapY) % wrapY;
            break;
          case 'diagonal':
            gridOffset.current.x = (gridOffset.current.x - speed + wrapX) % wrapX;
            gridOffset.current.y = (gridOffset.current.y - speed + wrapY) % wrapY;
            break;
          default:
            break;
        }
      }

      updateCellOpacities();
      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const updateCellOpacities = () => {
      const targets = new Map<string, number>();

      if (hoveredSquareRef.current) {
        targets.set(`${hoveredSquareRef.current.x},${hoveredSquareRef.current.y}`, 1);
      }

      if (hoverTrailAmount > 0) {
        for (let i = 0; i < trailCells.current.length; i++) {
          const t = trailCells.current[i];
          const key = `${t.x},${t.y}`;
          if (!targets.has(key)) {
            targets.set(key, (trailCells.current.length - i) / (trailCells.current.length + 1));
          }
        }
      }

      for (const [key] of targets) {
        if (!cellOpacities.current.has(key)) {
          cellOpacities.current.set(key, 0);
        }
      }

      for (const [key, opacity] of cellOpacities.current) {
        const target = targets.get(key) || 0;
        const next = opacity + (target - opacity) * 0.15;
        if (next < 0.005) {
          cellOpacities.current.delete(key);
        } else {
          cellOpacities.current.set(key, next);
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        handleMouseLeave();
        return;
      }

      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      if (isHex) {
        const colShift = Math.floor(gridOffset.current.x / hexHoriz);
        const offsetX = ((gridOffset.current.x % hexHoriz) + hexHoriz) % hexHoriz;
        const offsetY = ((gridOffset.current.y % hexVert) + hexVert) % hexVert;
        const adjustedX = mouseX - offsetX;
        const adjustedY = mouseY - offsetY;

        const col = Math.round(adjustedX / hexHoriz);
        const rowOffset = (col + colShift) % 2 !== 0 ? hexVert / 2 : 0;
        const row = Math.round((adjustedY - rowOffset) / hexVert);

        if (
          !hoveredSquareRef.current ||
          hoveredSquareRef.current.x !== col ||
          hoveredSquareRef.current.y !== row
        ) {
          if (hoveredSquareRef.current && hoverTrailAmount > 0) {
            trailCells.current.unshift({ ...hoveredSquareRef.current });
            if (trailCells.current.length > hoverTrailAmount) trailCells.current.length = hoverTrailAmount;
          }
          hoveredSquareRef.current = { x: col, y: row };
        }
      } else if (isTri) {
        const halfW = squareSize / 2;
        const offsetX = ((gridOffset.current.x % halfW) + halfW) % halfW;
        const offsetY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize;

        const adjustedX = mouseX - offsetX;
        const adjustedY = mouseY - offsetY;

        const col = Math.round(adjustedX / halfW);
        const row = Math.floor(adjustedY / squareSize);

        if (
          !hoveredSquareRef.current ||
          hoveredSquareRef.current.x !== col ||
          hoveredSquareRef.current.y !== row
        ) {
          if (hoveredSquareRef.current && hoverTrailAmount > 0) {
            trailCells.current.unshift({ ...hoveredSquareRef.current });
            if (trailCells.current.length > hoverTrailAmount) trailCells.current.length = hoverTrailAmount;
          }
          hoveredSquareRef.current = { x: col, y: row };
        }
      } else if (shape === 'circle') {
        const offsetX = ((gridOffset.current.x % squareSize) + squareSize) % squareSize;
        const offsetY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize;

        const adjustedX = mouseX - offsetX;
        const adjustedY = mouseY - offsetY;

        const col = Math.round(adjustedX / squareSize);
        const row = Math.round(adjustedY / squareSize);

        if (
          !hoveredSquareRef.current ||
          hoveredSquareRef.current.x !== col ||
          hoveredSquareRef.current.y !== row
        ) {
          if (hoveredSquareRef.current && hoverTrailAmount > 0) {
            trailCells.current.unshift({ ...hoveredSquareRef.current });
            if (trailCells.current.length > hoverTrailAmount) trailCells.current.length = hoverTrailAmount;
          }
          hoveredSquareRef.current = { x: col, y: row };
        }
      } else {
        const offsetX = ((gridOffset.current.x % squareSize) + squareSize) % squareSize;
        const offsetY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize;

        const adjustedX = mouseX - offsetX;
        const adjustedY = mouseY - offsetY;

        const col = Math.floor(adjustedX / squareSize);
        const row = Math.floor(adjustedY / squareSize);

        if (
          !hoveredSquareRef.current ||
          hoveredSquareRef.current.x !== col ||
          hoveredSquareRef.current.y !== row
        ) {
          if (hoveredSquareRef.current && hoverTrailAmount > 0) {
            trailCells.current.unshift({ ...hoveredSquareRef.current });
            if (trailCells.current.length > hoverTrailAmount) trailCells.current.length = hoverTrailAmount;
          }
          hoveredSquareRef.current = { x: col, y: row };
        }
      }
    };

    const handleMouseLeave = () => {
      if (hoveredSquareRef.current && hoverTrailAmount > 0) {
        trailCells.current.unshift({ ...hoveredSquareRef.current });
        if (trailCells.current.length > hoverTrailAmount) trailCells.current.length = hoverTrailAmount;
      }
      hoveredSquareRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const handlePreloaderRemoved = () => {
      isPreloaderActive = false;
      if (isVisible && !isLoopRunning) {
        isLoopRunning = true;
        requestRef.current = requestAnimationFrame(updateAnimation);
      }
    };

    if (isPreloaderActive) {
      window.addEventListener('preloaderFullyRemoved', handlePreloaderRemoved);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !isLoopRunning) {
          isLoopRunning = true;
          requestRef.current = requestAnimationFrame(updateAnimation);
        }
      });
    }, { threshold: 0.01 });

    observer.observe(canvas);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', updateRect);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('preloaderFullyRemoved', handlePreloaderRemoved);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize, shape, hoverTrailAmount, gradientColor]);

  return <canvas ref={canvasRef} className="w-full h-full border-none block"></canvas>;
};

export default ShapeGrid;
```

---

### `TargetCursor.tsx` Component
GSAP-powered magnetic HUD bracket targeting cursor. Automatically snaps and tracks any element with the `.cursor-target` class.

```tsx
import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { gsap } from 'gsap';

const getContainingBlock = (element: HTMLElement | null): HTMLElement | null => {
  let node = element?.parentElement ?? null;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== 'none' ||
      style.perspective !== 'none' ||
      style.filter !== 'none' ||
      style.willChange.includes('transform') ||
      style.willChange.includes('perspective') ||
      style.willChange.includes('filter') ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

const getContainingBlockOffset = (block: HTMLElement | null): { x: number; y: number } => {
  if (!block) return { x: 0, y: 0 };
  const rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
};

export interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
}

const TargetCursor: React.FC<TargetCursorProps> = ({
  targetSelector = '.cursor-target',
  spinDuration = 5,
  hideDefaultCursor = false,
  hoverDuration = 0.25,
  parallaxOn = true
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const containingBlockRef = useRef<HTMLElement | null>(null);
  const containingBlockOffsetRef = useRef({ x: 0, y: 0 });

  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef<{ x: number; y: number }[] | null>(null);
  const tickerFnRef = useRef<(() => void) | null>(null);
  const activeStrengthRef = useRef({ current: 0 });

  const [isMobile, setIsMobile] = useState(false);
  const [preloaderActive, setPreloaderActive] = useState(
    () => typeof window !== 'undefined' && !!document.getElementById('preloader')
  );

  useEffect(() => {
    if (!preloaderActive) return;
    const handlePreloaderRemoved = () => {
      setPreloaderActive(false);
    };
    window.addEventListener('preloaderFullyRemoved', handlePreloaderRemoved);
    return () => {
      window.removeEventListener('preloaderFullyRemoved', handlePreloaderRemoved);
    };
  }, [preloaderActive]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkMobile = () => {
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
      setIsMobile((hasTouchScreen && isSmallScreen) || isMobileUserAgent);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const constants = useMemo(() => ({ borderWidth: 3, cornerSize: 12 }), []);

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    const { x: offsetX, y: offsetY } = containingBlockOffsetRef.current;
    gsap.to(cursorRef.current, { x: x - offsetX, y: y - offsetY, duration: 0.1, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    if (preloaderActive || isMobile || !cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll<HTMLDivElement>('.target-cursor-corner');

    containingBlockRef.current = getContainingBlock(cursor);
    const updateOffset = () => {
      containingBlockOffsetRef.current = getContainingBlockOffset(containingBlockRef.current);
    };
    updateOffset();

    const getOffset = () => containingBlockOffsetRef.current;
    let activeTarget: Element | null = null;
    let targetRect: DOMRect | null = null;
    const updateTargetRect = () => {
      if (activeTarget) {
        targetRect = activeTarget.getBoundingClientRect();
      }
    };
    let currentLeaveHandler: (() => void) | null = null;
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

    const cleanupTarget = (target: Element) => {
      if (currentLeaveHandler) {
        target.removeEventListener('mouseleave', currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    const initialOffset = getOffset();
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - initialOffset.x,
      y: window.innerHeight / 2 - initialOffset.y
    });

    const createSpinTimeline = () => {
      if (spinTl.current) {
        spinTl.current.kill();
      }
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };

    createSpinTimeline();

    const tickerFn = () => {
      if (!activeTarget || !cursorRef.current || !cornersRef.current || !targetRect) {
        return;
      }
      const strength = activeStrengthRef.current.current;
      if (strength === 0) return;

      const rect = targetRect;
      const { borderWidth, cornerSize } = constants;
      const { x: offsetX, y: offsetY } = getOffset();

      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
        { x: rect.left - borderWidth - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY }
      ];

      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;
      const corners = Array.from(cornersRef.current);
      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x') as number;
        const currentY = gsap.getProperty(corner, 'y') as number;
        const targetX = targetCornerPositionsRef.current![i].x - cursorX;
        const targetY = targetCornerPositionsRef.current![i].y - cursorY;
        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;
        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;
        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration: duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto'
        });
      });
    };

    tickerFnRef.current = tickerFn;

    const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    const scrollHandler = () => {
      updateTargetRect();
      if (!activeTarget || !cursorRef.current) return;
      const { x: offsetX, y: offsetY } = getOffset();
      const mouseX = (gsap.getProperty(cursorRef.current, 'x') as number) + offsetX;
      const mouseY = (gsap.getProperty(cursorRef.current, 'y') as number) + offsetY;
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);
      if (!isStillOverTarget) {
        currentLeaveHandler?.();
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    const mouseDownHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
    };

    const mouseUpHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    const enterHandler = (e: MouseEvent) => {
      const directTarget = e.target as Element;
      const allTargets: Element[] = [];
      let current: Element | null = directTarget;
      while (current && current !== document.body) {
        if (current.matches(targetSelector)) {
          allTargets.push(current);
        }
        current = current.parentElement;
      }
      const target = allTargets[0] || null;
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;
      if (activeTarget) {
        cleanupTarget(activeTarget);
      }
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      targetRect = target.getBoundingClientRect();
      const corners = Array.from(cornersRef.current);
      corners.forEach(corner => gsap.killTweensOf(corner));
      gsap.killTweensOf(cursorRef.current, 'rotation');
      spinTl.current?.pause();
      gsap.set(cursorRef.current, { rotation: 0 });

      const rect = targetRect;
      const { borderWidth, cornerSize } = constants;
      const { x: offsetX, y: offsetY } = getOffset();
      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;

      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
        { x: rect.left - borderWidth - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY }
      ];

      isActiveRef.current = true;
      gsap.ticker.add(tickerFnRef.current!);

      gsap.to(activeStrengthRef.current, { current: 1, duration: hoverDuration, ease: 'power2.out' });

      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: targetCornerPositionsRef.current![i].x - cursorX,
          y: targetCornerPositionsRef.current![i].y - cursorY,
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      const leaveHandler = () => {
        gsap.ticker.remove(tickerFnRef.current!);
        isActiveRef.current = false;
        targetCornerPositionsRef.current = null;
        targetRect = null;
        gsap.set(activeStrengthRef.current, { current: 0, overwrite: true });
        activeTarget = null;
        if (cornersRef.current) {
          const corners = Array.from(cornersRef.current);
          gsap.killTweensOf(corners);
          const { cornerSize } = constants;
          const positions = [
            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
          ];
          const tl = gsap.timeline();
          corners.forEach((corner, index) => {
            tl.to(corner, { x: positions[index].x, y: positions[index].y, duration: 0.3, ease: 'power3.out' }, 0);
          });
        }
        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current && spinTl.current) {
            const currentRotation = gsap.getProperty(cursorRef.current, 'rotation') as number;
            const normalizedRotation = currentRotation % 360;
            spinTl.current.kill();
            spinTl.current = gsap
              .timeline({ repeat: -1 })
              .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
            gsap.to(cursorRef.current, {
              rotation: normalizedRotation + 360,
              duration: spinDuration * (1 - normalizedRotation / 360),
              ease: 'none',
              onComplete: () => {
                spinTl.current?.restart();
              }
            });
          }
          resumeTimeout = null;
        }, 50);
        cleanupTarget(target);
      };
      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };

    window.addEventListener('mouseover', enterHandler as EventListener);

    const resizeHandler = () => {
      containingBlockRef.current = getContainingBlock(cursor);
      updateOffset();
      updateTargetRect();
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
      }
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseover', enterHandler as EventListener);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      if (activeTarget) {
        cleanupTarget(activeTarget);
      }
      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      activeStrengthRef.current.current = 0;
    };
  }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor, isMobile, hoverDuration, parallaxOn, preloaderActive]);

  if (isMobile) {
    return null;
  }

  return (
    <div ref={cursorRef} className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2">
      <div ref={dotRef} className="absolute left-1/2 top-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 will-change-transform" />
      <div className="target-cursor-corner corner-tl absolute left-1/2 top-1/2 w-3 h-3 border-[3px] border-white will-change-transform border-r-0 border-b-0 -translate-x-[150%] -translate-y-[150%]" />
      <div className="target-cursor-corner corner-tr absolute left-1/2 top-1/2 w-3 h-3 border-[3px] border-white will-change-transform border-l-0 border-b-0 translate-x-[50%] -translate-y-[150%]" />
      <div className="target-cursor-corner corner-br absolute left-1/2 top-1/2 w-3 h-3 border-[3px] border-white will-change-transform border-l-0 border-t-0 translate-x-[50%] translate-y-[50%]" />
      <div className="target-cursor-corner corner-bl absolute left-1/2 top-1/2 w-3 h-3 border-[3px] border-white will-change-transform border-r-0 border-t-0 -translate-x-[150%] translate-y-[50%]" />
    </div>
  );
};

export default TargetCursor;
```

---

## 6. Architecture & Framework Guidelines

1. **Framework:** Astro (SSR / Static mode) + React 19 islands.
2. **Hydration Directives:**
   - Use `client:load` for critical first-paint components (`TargetCursor`, `Preloader`).
   - Use `client:visible` for viewport-triggered scroll interactive components (`ShapeGrid`, `BentoGrid`, `Showcase`).
   - Use `client:only="react"` for heavy client-only dynamic physics/canvas modules.
3. **No Unnecessary Hydration:**
   - Static headers, standard grid wrappers, and SEO structures belong in `.astro` files.
   - Interactive components, canvas listeners, and stateful widgets belong in `.tsx` files.
4. **GSAP + Lenis Smooth Scrolling:**
   - Always register `gsap.registerPlugin(ScrollTrigger)`.
   - Synchronize Lenis momentum scrolling with GSAP ticker (`lenis.on('scroll', ScrollTrigger.update)`).
   - Recalculate ScrollTrigger on dynamic asset loading (`ScrollTrigger.refresh()`).
