import React from 'react';

interface GameStatsProps {
  moves: number;
  time: string; // Formatted time MM:SS
}

export const GameStats: React.FC<GameStatsProps> = ({ moves, time }) => {
  return (
    <div className="flex justify-around items-center my-5 p-3.5 bg-gray-700/80 rounded-lg shadow-inner">
      <div className="text-center">
        <p className="text-sm text-gray-400 uppercase tracking-wider">Moves</p>
        <p className="text-3xl font-bold text-indigo-400">{moves}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-400 uppercase tracking-wider">Time</p>
        <p className="text-3xl font-bold text-indigo-400">{time}</p>
      </div>
    </div>
  );
};