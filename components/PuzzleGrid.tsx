
import React from 'react';
import { Tile } from './Tile';
import { PuzzleTileType } from '../types';

interface PuzzleGridProps {
  board: (PuzzleTileType | null)[];
  onTileClick: (tileIndex: number) => void;
  gridSize: number;
  isSolved: boolean;
  isAutoSolving: boolean; // Added prop
}

export const PuzzleGrid: React.FC<PuzzleGridProps> = ({ board, onTileClick, gridSize, isSolved, isAutoSolving }) => {
  if (board.length === 0) {
    return <div className="text-center text-gray-400 py-10">Puzzle not initialized.</div>;
  }
  
  const puzzleDimension = Math.min(500, window.innerWidth > 768 ? 500 : window.innerWidth - 60);


  return (
    <div 
      className="grid gap-1 p-1 bg-gray-900/50 rounded-md shadow-xl mx-auto border border-gray-700"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        width: `${puzzleDimension}px`,
        height: `${puzzleDimension}px`,
      }}
      role="grid"
      aria-label={`Puzzle grid ${gridSize}x${gridSize}`}
    >
      {board.map((tileData, index) => (
        <Tile
          key={tileData ? `tile-${tileData.id}` : `empty-${index}`}
          tileData={tileData}
          onClick={() => onTileClick(index)}
          isEmpty={tileData === null}
          isSolved={isSolved}
          isAutoSolving={isAutoSolving}
          index={index} // Pass the current index of the tile
        />
      ))}
    </div>
  );
};
