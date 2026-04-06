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

## 🎨 Theme Customization

Both the Race Track and the Leaderboard can be fully customized using the `theme` prop to match your application's design system. The engine uses CSS Custom Properties under the hood, ensuring high performance without inline style recalculations.

### Track Theme Example
```tsx
<RaceTrack 
  racers={MY_RACERS} 
  theme={{
    trackBackground: '#bdc3c7',        // Background color of the grass/dirt
    trackBorder: '6px solid #e74c3c',  // The outer wall of the track
    finishLineColor: '#e74c3c',        // The checkered flag color
    laneDivider: '2px solid #34495e',  // The lines between horses
    buttonBackground: '#8e44ad'        // The start/reset buttons
  }}
/>
```

### Leaderboard Theme Example
```tsx
<Leaderboard 
  results={liveResults} 
  theme={{
    background: '#2c3e50',
    textColor: '#ecf0f1',
    border: '2px solid #34495e',
    borderColor: '#34495e',            // The underline beneath the title
    fontFamily: 'monospace',
    listStyle: 'decimal'
  }}
/>
```
---

## 🧩 Modular Layouts & External Leaderboards

The engine is built with **Component Composition** in mind. You do not have to use the built-in leaderboard layout. You can place the `<Leaderboard />` anywhere in your app, or build your own custom UI by hooking into the engine's real-time updates.

By providing the `onLeaderboardUpdate` callback to the `RaceTrack`, the engine will broadcast an array of finished racers the exact millisecond they cross the line.

### Split Layout Example
Here is how you can build a side-by-side layout using React state:

```tsx
import React, { useState } from 'react';
import { RaceTrack, Leaderboard, RacerData } from 'react-horse-racing';

export default function App() {
  // 1. Create a state to catch the real-time results
  const [liveResults, setLiveResults] = useState<RacerData[]>([]);

  return (
    <div style={{ display: 'flex', gap: '30px' }}>
      
      {/* 2. The Main Track Area */}
      <div style={{ flexGrow: 1 }}>
        <RaceTrack 
          racers={MY_RACERS} 
          onLeaderboardUpdate={setLiveResults} // Broadcasts updates here
        />
      </div>

      {/* 3. The Sidebar Leaderboard */}
      <div style={{ width: '300px' }}>
        <Leaderboard 
          results={liveResults} // Consumes the live updates
          title="Live Standings" 
        />
      </div>

    </div>
  );
}
```
---
## 🎨 Theme Customization

Both the Race Track and the Leaderboard can be fully customized using the `theme` prop to match your application's design system. The engine uses CSS Custom Properties under the hood, ensuring high performance without inline style recalculations.

### Track Theme Example
```tsx
<RaceTrack 
  racers={MY_RACERS} 
  theme={{
    // This is the default theme which will be used if no theme prop is provided
     trackBackground: '#4CAF50',                         // Background color of the grass/dirt
     trackBorder: '4px solid #2c3e50',                   // The outer wall of the track
     finishLineColor: '#000000',                         // The checkered flag color
     laneDivider: '2px dashed rgba(255, 255, 255, 0.3)', // The lines between horses
     buttonBackground: '#2c3e50',                        // The start/reset buttons
    
  }}                              
/>

Leaderboard Theme Example
TypeScript
<Leaderboard 
  results={liveResults} 
  theme={{
    background: '#2c3e50',
    textColor: '#ecf0f1',
    border: '2px solid #34495e',
    borderColor: '#34495e',            // The underline beneath the title
    fontFamily: 'monospace',
    listStyle: 'decimal'
  }}
/>
```

## Modular Layouts & External Leaderboards

The engine is built with Component Composition in mind. You do not have to use the built-in leaderboard layout. You can place the <Leaderboard /> anywhere in your app, or build your own custom UI by hooking into the engine's real-time updates.

By providing the onLeaderboardUpdate callback to the RaceTrack, the engine will broadcast an array of finished racers the exact millisecond they cross the line.

Split Layout Example
Here is how you can build a side-by-side layout using React state:

```TypeScript
import React, { useState } from 'react';
import { RaceTrack, Leaderboard, RacerData } from 'react-horse-racing';

export default function App() {
  // 1. Create a state to catch the real-time results
  const [liveResults, setLiveResults] = useState<RacerData[]>([]);

  return (
    <div style={{ display: 'flex', gap: '30px' }}>
      
      {/* 2. The Main Track Area */}
      <div style={{ flexGrow: 1 }}>
        <RaceTrack 
          racers={MY_RACERS} 
          onLeaderboardUpdate={setLiveResults} // Broadcasts updates here
        />
      </div>

      {/* 3. The Sidebar Leaderboard */}
      <div style={{ width: '300px' }}>
        <Leaderboard 
          results={liveResults} // Consumes the live updates
          title="Live Standings" 
        />
      </div>

    </div>
  );
}
```

### `TrackTheme` Object
| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `trackBackground` | `string` | `'#4CAF50'` | Background color of the main race area. |
| `trackBorder` | `string` | `'4px solid #2c3e50'` | Outer border of the race area. |
| `finishLineColor` | `string` | `'#000000'` | Base color for the checkered finish line. |
| `laneDivider` | `string` | `'2px dashed rgba(255, 255, 255, 0.3)'` | The dividing line between individual racers. |
| `buttonBackground`| `string` | `'#2c3e50'` | Default background color for the control buttons. |

### `LeaderboardTheme` Object
| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `background` | `string` | `'#f8f9fa'` | Background color of the leaderboard panel. |
| `textColor` | `string` | `'#2c3e50'` | Primary text color. |
| `border` | `string` | `'1px solid #e0e0e0'` | Outer border of the panel. |
| `borderColor` | `string` | `'#e0e0e0'` | Color of the dividing line under the title. |
| `fontFamily` | `string` | `'system-ui, ...'` | Font family for the leaderboard text. |
| `listStyle` | `string` | `'decimal'` | CSS `list-style-type` (e.g., decimal, lower-alpha, none). |

### New `<RaceTrack>` Props
| Prop | Type | Description |
| :--- | :--- | :--- |
| `theme` | `TrackTheme` | **Optional.** Configuration object for track visuals. |
| `onLeaderboardUpdate` | `(currentLeaderboard: RacerData[]) => void` | **Optional.** Fires in real-time every time a single racer crosses the finish line. |

### `<Leaderboard>` Props
| Prop | Type | Description |
| :--- | :--- | :--- |
| `results` | `RacerData[]` | **Required.** The array of finished racers to display. |
| `title` | `string` | **Optional.** Defaults to "Results". |
| `theme` | `LeaderboardTheme` | **Optional.** Configuration object for leaderboard visuals. |

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
