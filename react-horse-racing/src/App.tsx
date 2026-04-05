import React from 'react';
import { RaceTrack, RacerData } from './RaceTrack';

const MY_HORSES: RacerData[] = [
  {
    id: 1,
    name: 'Lightning (Smooth Steady)',
    src: 'https://cdn-icons-png.flaticon.com/512/3254/3254641.png',
    baseSpeed: 3,
    volatility: 0.5,
    movementStyle: 'smooth',
    paceInterval: 2000 // Checks speed every 2 seconds
  },
  {
    id: 2,
    name: 'Slowpoke (Erratic)',
    src: 'https://cdn-icons-png.flaticon.com/512/3254/3254641.png',
    baseSpeed: 2.5,
    volatility: 3,     // Very high variance
    movementStyle: 'smooth',
    paceInterval: 500  // Changes speed rapidly every 0.5 seconds
  },
  {
    id: 3,
    name: 'Arcade Derby (Jagged)',
    src: 'https://cdn-icons-png.flaticon.com/512/3254/3254641.png',
    baseSpeed: 3,
    volatility: 2,
    movementStyle: 'arcade', // Uses the new jump logic
    paceInterval: 1000
  },
];

export default function App() {
  const handleRaceOver = (results: RacerData[]) => {
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>My Horse Race Game</h1>
      <RaceTrack racers={MY_HORSES} onRaceComplete={handleRaceOver} />
    </div>
  );
}