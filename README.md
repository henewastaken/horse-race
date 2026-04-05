# horse-race 🏇 React Horse Racing Engine

A high-performance, highly customizable 2D racing engine built specifically for React.

This engine animates standard HTML elements using optimized CSS transforms and `requestAnimationFrame` instead of a canvas, delivering smooth 60fps motion while allowing any standard web asset (PNG, SVG, animated GIF) to be used as a racer.

---

## Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [How the Engine Works](#-how-the-engine-works)
- [API Documentation](#-api-documentation)
- [Local Development](#-local-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **Bring Your Own Assets** — Works with animated GIFs, PNGs, JPEGs, and SVGs.
- **Highly Performant** — Uses `requestAnimationFrame` and direct DOM transforms to avoid frequent React re-renders.
- **Custom Physics** — Configurable `baseSpeed`, `volatility`, and pacing behavior for lifelike races.
- **Movement Styles** — Choose between `smooth` (fluid) and `arcade` (interpolated/rhythmic) movement.
- **Fully Typed** — Written in TypeScript with complete typings for IDE autocompletion.

---

## 🚀 Installation

Install from NPM :

```bash
# using npm
npm install react-horse-racing

# or using yarn
yarn add react-horse-racing
```

---

## Quick Start (TypeScript)

Import `RaceTrack` and pass an array of racers:

```tsx
import React from "react";
import { RaceTrack, RacerData } from "react-horse-racing";

const MY_RACERS: RacerData[] = [
  {
    id: 1,
    name: "Lightning",
    src: "/assets/horse.gif",
    baseSpeed: 3,
    volatility: 0.5,
    movementStyle: "smooth",
  },
  {
    id: 2,
    name: "Arcade Derby",
    src: "/assets/pixel-horse.png",
    baseSpeed: 2.8,
    volatility: 1,
    movementStyle: "arcade",
    paceInterval: 1000,
  },
];

export default function App() {
  const handleRaceComplete = (leaderboard: RacerData[]) => {
    alert(`The winner is ${leaderboard[0].name}!`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>The Grand Derby</h1>
      <RaceTrack racers={MY_RACERS} onRaceComplete={handleRaceComplete} />
    </div>
  );
}
```

---

## ⚙️ How the Engine Works

- **Game Loop** — Movement runs in a `requestAnimationFrame` loop that calculates time deltas and updates physics each frame (~16ms at 60fps).
- **DOM Mutability** — Uses `useRef` to directly update `element.style.transform` for each racer rather than frequent `useState` updates, avoiding heavy React render cycles.
- **Pacing & Volatility** — Racers have a `baseSpeed` and a `volatility`. Every `paceInterval` milliseconds the engine recalculates a racer's current speed by applying a random variance, simulating bursts of speed and fatigue.
- **Arcade Interpolation** — In `arcade` mode, the engine computes a target position and interpolates (tweens) the racer to that position over a short duration for retro, rhythmic motion (arcade mode is inspired by horse derby arcade games).

---

## 📖 API Documentation

### `RaceTrack` Props

| Prop | Type | Required | Description |
|---|---:|:---:|---|
| `racers` | `RacerData[]` | Yes | Array of racer configuration objects. |
| `onRaceComplete` | `(leaderboard: RacerData[]) => void` | No | Callback fired when the race finishes; receives racers sorted by finish order. |

### `RacerData` Object

| Property | Type | Default | Description |
|---|---:|:---:|---|
| `id` | `string \| number` | — | Required. Unique identifier for the racer. |
| `name` | `string` | — | Required. Display name of the racer. |
| `src` | `string` | — | Required. URL to the racer asset (GIF, PNG, SVG). |
| `baseSpeed` | `number` | — | Required. Baseline pixels moved per frame. |
| `volatility` | `number` | — | Required. Max variance applied to `baseSpeed` (e.g., `baseSpeed = 3`, `volatility = 1` → speed ∈ [2,4]). |
| `movementStyle` | `"smooth" \| "arcade"` | `"smooth"` | Optional. Visual movement: continuous (`smooth`) or interpolated (`arcade`). |
| `paceInterval` | `number` | `1000` | Optional. Milliseconds between recalculating current speed. |

---

## 🛠️ Local Development

To work on the engine locally:

```bash
# Install dependencies
npm install

# Run the Vite dev server
npm run dev
# open http://localhost:5173 to preview

# Build for production / library output
npm run build
# Compiles modules into the `dist` folder
```

---

## Contributing

Contributions, bug reports, and feature requests are welcome. Please open an issue or a pull request with a clear description of the change and how to reproduce any bugs. Any translation help is also welcomed.

---

## License

See the `LICENSE` file for license details.
