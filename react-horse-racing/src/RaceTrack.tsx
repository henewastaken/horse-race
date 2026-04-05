import React, { useState, useRef, useEffect } from 'react';
import SingleRacer from './SingleRacer';

export interface RacerData {
    id: string | number;
    name: string;
    src: string;
    baseSpeed: number;
    volatility: number;
}

export interface RaceTrackProps {
    racers: RacerData[];
    onRaceComplete?: (leaderboard: RacerData[]) => void;
}

export const RaceTrack: React.FC<RaceTrackProps> = ({ racers, onRaceComplete }) => {
    const trackRef = useRef<HTMLDivElement>(null);

    const [isRunning, setIsRunning] = useState(false);
    const [finishLine, setFinishLine] = useState(800);
    const [finishedIds, setFinishedIds] = useState<(string | number)[]>([]);

    // RENAMED: We use this purely as a trigger variable now, not a key.
    const [resetTrigger, setResetTrigger] = useState(0);

    useEffect(() => {
        if (trackRef.current) {
            const trackWidth = trackRef.current.getBoundingClientRect().width;
            setFinishLine(trackWidth - 50);
        }
    }, []);

    const handleToggleRun = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setFinishedIds([]);
        setResetTrigger(prev => prev + 1); // This triggers the useEffect inside SingleRacer
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
        <div style={{ position: 'relative' }}>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={handleToggleRun} disabled={isRaceFinished}>
                    {isRunning ? 'Pause Race' : (finishedIds.length > 0 ? 'Resume Race' : 'Start Race')}
                </button>

                <button onClick={handleReset}>
                    Reset Track
                </button>
            </div>

            <div ref={trackRef} style={{ position: 'relative', overflow: 'hidden', border: '1px solid #000' }}>
                <div style={{ position: 'absolute', left: `${finishLine}px`, top: 0, bottom: 0, width: '4px', backgroundColor: 'red', zIndex: 10 }} />

                {racers.map((racer) => (
                    <SingleRacer
                        key={racer.id} // RESTORED: Back to the standard React ID
                        id={racer.id}
                        src={racer.src}
                        baseSpeed={racer.baseSpeed}
                        volatility={racer.volatility}
                        isRunning={isRunning}
                        finishLineDistance={finishLine}
                        onFinish={handleFinish}
                        resetTrigger={resetTrigger} // NEW: Passing the soft reset trigger
                    />
                ))}
            </div>

            {finishedIds.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Results:</h3>
                    <ol>
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
