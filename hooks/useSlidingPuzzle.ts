
import { useState, useEffect, useCallback } from 'react';
import { PuzzleTileType } from '../types';

async function sliceImageToTiles(
  imageSrc: string,
  gridSize: number
): Promise<PuzzleTileType[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; 
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Failed to get canvas context'));
      }

      const sourceWidth = img.naturalWidth;
      const sourceHeight = img.naturalHeight;
      const cropSize = Math.min(sourceWidth, sourceHeight);
      const cropX = (sourceWidth - cropSize) / 2;
      const cropY = (sourceHeight - cropSize) / 2;

      const tileActualWidth = cropSize / gridSize;
      const tileActualHeight = cropSize / gridSize;
      
      canvas.width = tileActualWidth;
      canvas.height = tileActualHeight;

      const tiles: PuzzleTileType[] = [];
      for (let i = 0; i < gridSize * gridSize - 1; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        const sx = cropX + col * tileActualWidth;
        const sy = cropY + row * tileActualHeight;

        ctx.clearRect(0, 0, tileActualWidth, tileActualHeight);
        ctx.drawImage(
          img,
          sx, sy, tileActualWidth, tileActualHeight, 
          0, 0, tileActualWidth, tileActualHeight    
        );
        tiles.push({ id: i, imageSrc: canvas.toDataURL() });
      }
      resolve(tiles);
    };
    img.onerror = (error) => {
        console.error("Image loading error for slicing:", error);
        reject(new Error('Failed to load image for slicing.'));
    };
    img.src = imageSrc;
  });
}

const getValidMoves = (emptyIndex: number, gridSize: number): number[] => {
    const moves: number[] = [];
    if (emptyIndex === -1) return moves;
    const row = Math.floor(emptyIndex / gridSize);
    const col = emptyIndex % gridSize;

    if (row > 0) moves.push(emptyIndex - gridSize); // Up
    if (row < gridSize - 1) moves.push(emptyIndex + gridSize); // Down
    if (col > 0) moves.push(emptyIndex - 1); // Left
    if (col < gridSize - 1) moves.push(emptyIndex + 1); // Right
    
    return moves;
};

const calculateManhattanDistance = (currentBoard: (PuzzleTileType | null)[], currentGridSize: number): number => {
    let distance = 0;
    for (let i = 0; i < currentBoard.length; i++) {
        const tile = currentBoard[i];
        if (tile !== null) { 
            const targetX = tile.id % currentGridSize;
            const targetY = Math.floor(tile.id / currentGridSize);
            const currentX = i % currentGridSize;
            const currentY = Math.floor(i / currentGridSize);
            distance += Math.abs(targetX - currentX) + Math.abs(targetY - currentY);
        }
    }
    return distance;
};


export const useSlidingPuzzle = () => {
  const [board, setBoard] = useState<(PuzzleTileType | null)[]>([]);
  const [gridSize, setGridSize] = useState<number>(3);
  const [moves, setMoves] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialTiles, setInitialTiles] = useState<PuzzleTileType[]>([]);
  
  const [isAutoSolving, setIsAutoSolving] = useState<boolean>(false);
  const [autoSolveTimeoutId, setAutoSolveTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const clearAutoSolve = useCallback(() => {
    if (autoSolveTimeoutId) {
      clearTimeout(autoSolveTimeoutId);
      setAutoSolveTimeoutId(null);
    }
    setIsAutoSolving(false);
  }, [autoSolveTimeoutId]); // setIsAutoSolving and setAutoSolveTimeoutId are stable

  const shuffleBoard = useCallback((tilesToShuffle: (PuzzleTileType | null)[], currentGridSize: number): (PuzzleTileType | null)[] => {
    let newBoard = [...tilesToShuffle];
    let currentEmptyIndex = newBoard.indexOf(null);
    if (currentEmptyIndex === -1) { 
        newBoard[newBoard.length -1] = null; 
        currentEmptyIndex = newBoard.length -1;
    }
  
    const shuffleMovesCount = currentGridSize * currentGridSize * currentGridSize * 3 + Math.max(50, currentGridSize * 10) ; 
  
    for (let i = 0; i < shuffleMovesCount; i++) {
      const validBoardMoves = getValidMoves(currentEmptyIndex, currentGridSize);
      if (validBoardMoves.length === 0) continue; 
      const randomMoveIndex = validBoardMoves[Math.floor(Math.random() * validBoardMoves.length)];
      
      [newBoard[currentEmptyIndex], newBoard[randomMoveIndex]] = [newBoard[randomMoveIndex], newBoard[currentEmptyIndex]];
      currentEmptyIndex = randomMoveIndex; 
    }
    
    let solved = true;
    for (let i = 0; i < newBoard.length - 1; i++) {
        if (newBoard[i]?.id !== i) {
            solved = false;
            break;
        }
    }
    if (solved && newBoard[newBoard.length-1] === null) { 
        return shuffleBoard(tilesToShuffle, currentGridSize); 
    }

    return newBoard;
  }, []);

  const initializeAndShuffle = useCallback(async (imageSrc: string, size: number) => {
    clearAutoSolve();
    setIsLoading(true);
    setIsSolved(false);
    setMoves(0);
    setTime(0);
    setGridSize(size);

    try {
      const slicedTiles = await sliceImageToTiles(imageSrc, size);
      setInitialTiles(slicedTiles); 
      const initialBoardConfig: (PuzzleTileType | null)[] = [...slicedTiles, null]; 
      setBoard(shuffleBoard(initialBoardConfig, size));
      setTimerActive(true);
    } catch (error) {
      console.error("Failed to initialize puzzle:", error);
      setBoard([]); 
    } finally {
      setIsLoading(false);
    }
  }, [shuffleBoard, clearAutoSolve, setIsLoading, setIsSolved, setMoves, setTime, setGridSize, setInitialTiles, setBoard, setTimerActive]);

  const checkWinCondition = useCallback(() => {
    if (board.length === 0) return false;
    for (let i = 0; i < board.length - 1; i++) { 
      if (board[i] === null || board[i]?.id !== i) {
        return false;
      }
    }
    return board[board.length - 1] === null;
  }, [board]);

  useEffect(() => {
    if (!isLoading && board.length > 0 && checkWinCondition()) {
      setIsSolved(true);
      setTimerActive(false);
      clearAutoSolve(); 
    }
  }, [board, checkWinCondition, isLoading, clearAutoSolve, setIsSolved, setTimerActive]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setTimeout> | null = null; 
    if (timerActive && !isSolved) {
      intervalId = setInterval(() => { 
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (intervalId) clearInterval(intervalId);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timerActive, isSolved, setTime]);

  const handleTileClick = useCallback((tileIndex: number) => {
    if (isSolved || isLoading || isAutoSolving) return;

    const emptyIndex = board.indexOf(null);
    if (emptyIndex === -1) return; 

    const validBoardMoves = getValidMoves(emptyIndex, gridSize);

    if (validBoardMoves.includes(tileIndex)) {
      const newBoard = [...board];
      [newBoard[tileIndex], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[tileIndex]];
      setBoard(newBoard);
      setMoves(prevMoves => prevMoves + 1);
      if(!timerActive && !isAutoSolving) setTimerActive(true); 
    }
  }, [board, gridSize, isSolved, isLoading, timerActive, isAutoSolving, setBoard, setMoves, setTimerActive]);

  const resetCurrentPuzzle = useCallback(() => {
    clearAutoSolve();
    setIsLoading(true); 
    setIsSolved(false);
    setMoves(0);
    setTime(0); 
    if (initialTiles.length > 0) {
        const boardToShuffle : (PuzzleTileType | null)[] = [...initialTiles, null];
        setBoard(shuffleBoard(boardToShuffle, gridSize));
        setTimerActive(true); 
    }
    setIsLoading(false);
  }, [initialTiles, gridSize, shuffleBoard, clearAutoSolve, setIsLoading, setIsSolved, setMoves, setTime, setBoard, setTimerActive]);

  const autoSolveStep = useCallback(() => {
    if (!isAutoSolving || board.length === 0 || checkWinCondition()) {
      clearAutoSolve();
      if (board.length > 0 && checkWinCondition() && !isSolved) { 
        setIsSolved(true);
        setTimerActive(false);
      }
      return;
    }

    const emptyIndex = board.indexOf(null);
    if (emptyIndex === -1) {
      clearAutoSolve();
      return;
    }

    const validBoardMoves = getValidMoves(emptyIndex, gridSize);
    if (validBoardMoves.length === 0) {
      clearAutoSolve();
      return;
    }

    let bestNextMoveTileIndex = -1;
    let minHeuristicValue = Infinity;
    
    for (const currentMoveTileIndex of validBoardMoves) {
      const tempBoard = [...board];
      [tempBoard[currentMoveTileIndex], tempBoard[emptyIndex]] = [tempBoard[emptyIndex], tempBoard[currentMoveTileIndex]];
      const heuristicValue = calculateManhattanDistance(tempBoard, gridSize);

      if (heuristicValue < minHeuristicValue) {
        minHeuristicValue = heuristicValue;
        bestNextMoveTileIndex = currentMoveTileIndex;
      }
    }
    
    if (bestNextMoveTileIndex !== -1) {
      const newBoard = [...board];
      [newBoard[bestNextMoveTileIndex], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[bestNextMoveTileIndex]];
      setBoard(newBoard);
      setMoves(prevMoves => prevMoves + 1);

      if (checkWinCondition()) {
        setIsSolved(true);
        setTimerActive(false);
        clearAutoSolve();
        return; 
      }

      const nextStepTimeout = setTimeout(autoSolveStep, 200); 
      setAutoSolveTimeoutId(nextStepTimeout);
    } else {
      clearAutoSolve(); 
    }
  }, [
    board, 
    gridSize, 
    isAutoSolving, 
    clearAutoSolve, 
    checkWinCondition, 
    isSolved, 
    setIsSolved, // from state
    setTimerActive, // from state
    setBoard, // from state
    setMoves, // from state
    setAutoSolveTimeoutId // from state
  ]);


  const startAutoSolve = useCallback(() => {
    if (isSolved || isLoading || isAutoSolving || board.length === 0 || checkWinCondition()) {
      return;
    }
  
    setIsAutoSolving(true); 
    if (!timerActive) {
      setTimerActive(true); 
    }
  
    const timeoutId = setTimeout(() => {
      autoSolveStep();
    }, 50); 
    setAutoSolveTimeoutId(timeoutId);
  
  }, [
    isSolved, 
    isLoading, 
    isAutoSolving, 
    board.length, // Use board.length for stability if only length is checked
    timerActive, 
    autoSolveStep, // autoSolveStep is a dependency
    checkWinCondition, 
    setIsAutoSolving, // from state
    setTimerActive, // from state
    setAutoSolveTimeoutId // from state
  ]);

  const formattedTime = new Date(time * 1000).toISOString().substr(14, 5); 

  return {
    board,
    moves,
    time, 
    isSolved,
    isLoading,
    initializeAndShuffle,
    handleTileClick,
    resetCurrentPuzzle,
    formattedTime, 
    gridSize,
    isAutoSolving,
    startAutoSolve,
  };
};
