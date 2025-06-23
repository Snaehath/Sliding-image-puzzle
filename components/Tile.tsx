
import React from 'react';
import { PuzzleTileType } from '../types';

interface TileProps {
  tileData: PuzzleTileType | null;
  onClick: () => void;
  isEmpty: boolean;
  isSolved: boolean;
  isAutoSolving: boolean;
  index: number; // Current index of the tile in the board array
}

export const Tile: React.FC<TileProps> = ({ tileData, onClick, isEmpty, isSolved, isAutoSolving, index }) => {
  const baseClasses = "w-full h-full flex items-center justify-center text-white font-bold text-xl rounded-sm transition-all duration-150 ease-in-out relative overflow-hidden";
  
  if (isEmpty) {
    return <div className={`${baseClasses} bg-gray-700/50`}></div>;
  }

  // Disable interactions if solved or auto-solving
  const canInteract = !isSolved && !isAutoSolving;

  const tileClasses = `${baseClasses} bg-cover bg-center ${canInteract ? 'cursor-pointer hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-inset' : 'cursor-default'}`;

  // Check if this specific tile is in its correct final position
  // The tile's 'id' is its correct final index.
  const isTileInCorrectPosition = tileData ? tileData.id === index : false;


  return (
    <div
      className={tileClasses}
      style={{ backgroundImage: tileData ? `url(${tileData.imageSrc})` : 'none' }}
      onClick={canInteract ? onClick : undefined}
      tabIndex={canInteract ? 0 : -1}
      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') { if (canInteract) onClick(); }}}
      role="button"
      aria-label={`Tile ${tileData?.id !== undefined ? `piece ${tileData.id + 1}` : 'empty space'}`}
      aria-pressed={canInteract && !isEmpty ? "false" : undefined}
    >
      {/* Visual cue for solved state - could be if tile is in correct pos OR whole puzzle solved */}
      {isSolved && tileData && ( // Show green overlay only when the whole puzzle is solved
        <div className="absolute inset-0 bg-green-500/10 backdrop-filter backdrop-blur-[1px]"></div>
      )}
      {/* 
        Optional: Visual cue if a tile is in its correct position even if puzzle not fully solved
        {isTileInCorrectPosition && !isSolved && tileData && (
           <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full opacity-70"></div>
        )}
      */}
      {/* 
        If you want to show a visual cue that auto-solving is happening on this tile, 
        you could add a condition for isAutoSolving here.
        Example:
        {isAutoSolving && <div className="absolute inset-0 bg-blue-500/10"></div>}
      */}
    </div>
  );
};
