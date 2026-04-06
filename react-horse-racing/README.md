# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

```markdown
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

## 📖 Extended API Documentation

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
```