import React, { useState, useRef, useEffect } from 'react';
import './RaceTrack.css';
import SingleRacer from '../SingleRacer/SingleRacer';

// Define the customizable theme options
export interface TrackTheme {
    trackBackground?: string;
    trackBorder?: string;
    finishLineColor?: string;
    laneDivider?: string;
    buttonBackground?: string;
}

export interface RacerData {
    id: string | number;
    name: string;
    src: string;
    baseSpeed: number;
    volatility: number;
    movementStyle?: 'smooth' | 'arcade';
    paceInterval?: number;
    animationStyle?: 'straight' | 'gallop';
}

export interface RaceTrackProps {
    racers: RacerData[];
    onRaceComplete?: (leaderboard: RacerData[]) => void;
    theme?: TrackTheme; // Expose the theme prop
}

// Set the default look so the track works out-of-the-box
const DEFAULT_THEME: TrackTheme = {
    trackBackground: '#4CAF50',
    trackBorder: '4px solid #2c3e50',
    finishLineColor: '#000000',
    laneDivider: '2px dashed rgba(255, 255, 255, 0.3)',
    buttonBackground: '#2c3e50',
};

const RaceTrack: React.FC<RaceTrackProps> = ({ racers, onRaceComplete, theme }) => {
    const trackRef = useRef<HTMLDivElement>(null);

    const [isRunning, setIsRunning] = useState(false);
    const [finishLine, setFinishLine] = useState(800);
    const [finishedIds, setFinishedIds] = useState<(string | number)[]>([]);
    const [resetTrigger, setResetTrigger] = useState(0);

    // Merge the user's theme with our defaults
    const activeTheme = { ...DEFAULT_THEME, ...theme };

    // Convert the theme object into CSS Variables
    const cssVariables = {
        '--track-bg': activeTheme.trackBackground,
        '--track-border': activeTheme.trackBorder,
        '--finish-color': activeTheme.finishLineColor,
        '--lane-divider': activeTheme.laneDivider,
        '--button-bg': activeTheme.buttonBackground,
    } as React.CSSProperties; // Cast required for TypeScript to accept CSS variables

    useEffect(() => {
        if (trackRef.current) {
            const trackWidth = trackRef.current.getBoundingClientRect().width;
            setFinishLine(trackWidth - 50);
        }
    }, []);

    const handleToggleRun = () => setIsRunning(!isRunning);

    const handleReset = () => {
        setIsRunning(false);
        setFinishedIds([]);
        setResetTrigger(prev => prev + 1);
    };

    const handleFinish = (id: string | number) => {
        setFinishedIds((prev) => {
            const newLeaderboard = [...prev, id];
            if (newLeaderboard.length === racers.length) {
                setIsRunning(false);
                if (onRaceComplete) {
                    const finalResults = newLeaderboard.map(
                        finishedId => racers.find(r => r.id === finishedId)!
                    );
                    onRaceComplete(finalResults);
                }
            }
            return newLeaderboard;
        });
    };

    const isRaceFinished = finishedIds.length === racers.length;

    return (
        // Inject the CSS variables into the very top level container
        <div className="game-wrapper" style={cssVariables}>
            <div className="control-panel">
                <button className="control-button" onClick={handleToggleRun} disabled={isRaceFinished}>
                    {isRunning ? 'Pause Race' : (finishedIds.length > 0 ? 'Resume Race' : 'Start Race')}
                </button>
                <button className="control-button" onClick={handleReset}>
                    Reset Track
                </button>
            </div>

            <div ref={trackRef} className="track-area">
                <div className="finish-line-visual" style={{ left: `${finishLine}px` }} />

                {racers.map((racer) => (
                    <SingleRacer
                        key={racer.id}
                        id={racer.id}
                        src={racer.src}
                        baseSpeed={racer.baseSpeed}
                        volatility={racer.volatility}
                        movementStyle={racer.movementStyle}
                        paceInterval={racer.paceInterval}
                        animationStyle={racer.animationStyle}
                        isRunning={isRunning}
                        finishLineDistance={finishLine}
                        onFinish={handleFinish}
                        resetTrigger={resetTrigger}
                    />
                ))}
            </div>

            {finishedIds.length > 0 && (
                <div className="leaderboard-panel">
                    <h3 style={{ margin: '0 0 10px 0' }}>Results:</h3>
                    <ol className="leaderboard-list">
                        {finishedIds.map(id => {
                            const racer = racers.find(r => r.id === id);
                            return <li key={id}>{racer?.name}</li>;
                        })}
                    </ol>
                </div>
            )}
        </div>
    );
};

export default RaceTrack;