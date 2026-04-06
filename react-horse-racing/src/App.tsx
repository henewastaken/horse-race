import { useState } from 'react';
import { RaceTrack, Leaderboard, RacerData } from './index';
import './App.css';

const MY_RACERS: RacerData[] = [
  { id: 1, name: 'Lightning', src: 'https://cdn-icons-png.flaticon.com/512/3254/3254641.png', baseSpeed: 3, volatility: 1, animationStyle: 'gallop' },
  { id: 2, name: 'Slowpoke', src: 'https://cdn-icons-png.flaticon.com/512/3254/3254641.png', baseSpeed: 2.5, volatility: 3, animationStyle: 'gallop' },
  { id: 3, name: 'Arcade Derby', src: 'https://cdn-icons-png.flaticon.com/512/3254/3254641.png', baseSpeed: 3, volatility: 0.5, movementStyle: 'arcade' },
];

export default function App() {
  const [liveResults, setLiveResults] = useState<RacerData[]>([]);

  return (
    <div className="app-container">
      <h1 className="app-title">Grand Championship</h1>

      <div className="app-layout">

        {/* The Race Track Area */}
        <div className="app-main-content">
          <RaceTrack
            racers={MY_RACERS}
            onLeaderboardUpdate={setLiveResults}
            theme={{
              trackBackground: '#bdc3c7',
              trackBorder: '6px solid #e74c3c',
              finishLineColor: '#e74c3c'
            }}
          />
        </div>

        {/* The Leaderboard Area */}
        <div className="app-sidebar">
          <Leaderboard
            results={liveResults}
            title="Live Standings"
            theme={{
              background: '#2c3e50',
              textColor: '#ecf0f1',
              border: '2px solid #34495e',
              borderColor: '#34495e'
            }}
          />
        </div>
      </div>
    </div>
  );
}