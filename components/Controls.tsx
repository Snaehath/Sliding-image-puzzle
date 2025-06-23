
import React from 'react';
import { GridOption } from '../types';
import { ResetIcon, EyeIcon, NewGameIcon, SparklesIcon } from './icons/ActionIcons';

interface ControlsProps {
  gridOptions: GridOption[];
  selectedGridSize: number;
  onGridSizeChange: (size: number) => void;
  onReset: () => void;
  onNewGame: () => void;
  onPreview: () => void;
  isPuzzleActive: boolean;
  disabled?: boolean; // General disabled state (e.g. loading, auto-solving)
  onStartAutoSolve: () => void;
  isAutoSolving: boolean;
  isSolved: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  gridOptions,
  selectedGridSize,
  onGridSizeChange,
  onReset,
  onNewGame,
  onPreview,
  isPuzzleActive,
  disabled,
  onStartAutoSolve,
  isAutoSolving,
  isSolved,
}) => {
  const baseButtonClass = "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm text-white transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed";
  const primaryButtonClass = `${baseButtonClass} bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-400 disabled:bg-indigo-600/50`;
  const secondaryButtonClass = `${baseButtonClass} bg-gray-600 hover:bg-gray-500 focus:ring-gray-400 disabled:bg-gray-600/50`;

  return (
    <div className="mb-6 p-4 bg-gray-700/60 rounded-lg shadow">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Grid Size Selector */}
        <div className="flex flex-col">
          <label htmlFor="gridSizeSelect" className="block text-sm font-medium text-gray-300 mb-1">
            Grid Size:
          </label>
          <select
            id="gridSizeSelect"
            value={selectedGridSize}
            onChange={(e) => onGridSizeChange(Number(e.target.value))}
            disabled={disabled}
            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 shadow-sm appearance-none"
            aria-label="Select puzzle grid size"
          >
            {gridOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons Group */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end pt-2 sm:pt-0">
          <button
            onClick={onStartAutoSolve}
            className={`${primaryButtonClass} md:col-span-1`}
            disabled={disabled || !isPuzzleActive || isAutoSolving || isSolved}
            aria-label={isAutoSolving ? "Solving puzzle automatically" : "Start automatic puzzle solver"}
            aria-live="polite"
          >
            <SparklesIcon />
            {isAutoSolving ? 'Solving...' : 'Solve'}
          </button>
          <button
            onClick={onReset}
            className={`${secondaryButtonClass} md:col-span-1`}
            disabled={disabled || !isPuzzleActive}
            aria-label="Reset current puzzle"
          >
            <ResetIcon /> Reset
          </button>
          <button
            onClick={onPreview}
            className={`${secondaryButtonClass} md:col-span-1`}
            disabled={disabled || !isPuzzleActive} // Can preview even if solved, but not if no active puzzle
            aria-label="Preview full image"
          >
            <EyeIcon /> Preview
          </button>
          <button
            onClick={onNewGame}
            className={`${secondaryButtonClass} md:col-span-1`}
            disabled={disabled && isAutoSolving} // Allow new game even if current is loading, but not while auto-solving
            aria-label="Start a new game with a new image"
          >
            <NewGameIcon /> New Game
          </button>
        </div>
      </div>
    </div>
  );
};
