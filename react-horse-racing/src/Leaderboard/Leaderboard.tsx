import React from 'react';
import './Leaderboard.css';
import { RacerData } from '../RaceTrack/RaceTrack';

export interface LeaderboardTheme {
    background?: string;
    textColor?: string;
    border?: string;
    borderColor?: string; // Used for the line under the title
    fontFamily?: string;
    listStyle?: string;
}

export interface LeaderboardProps {
    results: RacerData[];
    title?: string;
    theme?: LeaderboardTheme;
}

const DEFAULT_THEME: LeaderboardTheme = {
    background: '#f8f9fa',
    textColor: '#2c3e50',
    border: '1px solid #e0e0e0',
    borderColor: '#e0e0e0',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    listStyle: 'decimal'
};

const Leaderboard: React.FC<LeaderboardProps> = ({ results, title = "Results", theme }) => {
    const activeTheme = { ...DEFAULT_THEME, ...theme };

    const cssVariables = {
        '--lb-bg': activeTheme.background,
        '--lb-text': activeTheme.textColor,
        '--lb-border': activeTheme.border,
        '--lb-border-color': activeTheme.borderColor,
        '--lb-font': activeTheme.fontFamily,
        '--lb-list-style': activeTheme.listStyle,
    } as React.CSSProperties;

    // Don't render anything if no one has finished yet
    if (results.length === 0) return null;

    return (
        <div className="engine-leaderboard-panel" style={cssVariables}>
            <h3 className="engine-leaderboard-title">{title}</h3>
            <ol className="engine-leaderboard-list">
                {results.map((racer) => (
                    <li key={racer.id}>{racer.name}</li>
                ))}
            </ol>
        </div>
    );
};

export default Leaderboard;