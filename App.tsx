
import React, { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PuzzleGrid } from './components/PuzzleGrid';
import { Controls } from './components/Controls';
import { GameStats } from './components/GameStats';
import { WinModal } from './components/WinModal';
import { PreviewModal } from './components/PreviewModal';
import { useSlidingPuzzle } from './hooks/useSlidingPuzzle';
import { DEFAULT_GRID_SIZE, GRID_OPTIONS } from './constants';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [selectedGridSize, setSelectedGridSize] = useState<number>(DEFAULT_GRID_SIZE);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [puzzleKey, setPuzzleKey] = useState<number>(0); 

  const {
    board,
    moves,
    isSolved,
    isLoading,
    initializeAndShuffle,
    handleTileClick,
    resetCurrentPuzzle,
    formattedTime,
    isAutoSolving, 
    startAutoSolve, 
  } = useSlidingPuzzle();

  useEffect(() => {
    if (uploadedImageSrc) {
      initializeAndShuffle(uploadedImageSrc, selectedGridSize);
    } else {
        // Clear board if no image is uploaded (e.g., after "New Game")
        // This logic might be better inside the hook if it should clear more state
        // initializeAndShuffle(null, selectedGridSize) // Or a specific clear function in hook
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedImageSrc, selectedGridSize, puzzleKey]); 

  const handleImageUpload = (imageSrc: string) => {
    setUploadedImageSrc(imageSrc);
    setSelectedGridSize(DEFAULT_GRID_SIZE); 
    setPuzzleKey(prevKey => prevKey + 1); 
  };

  const handleGridSizeChange = (size: number) => {
    if (selectedGridSize !== size) {
        setSelectedGridSize(size);
        // Re-initialization will be triggered by useEffect watching selectedGridSize (and puzzleKey if we increment it)
        // To ensure re-slicing and re-shuffling for new grid size:
        setPuzzleKey(prevKey => prevKey + 1);
    }
  };
  
  const handleResetForPlayAgain = () => { // Used by WinModal "Play Again"
    if (uploadedImageSrc) {
       setPuzzleKey(prevKey => prevKey + 1); 
    }
  };
  
  const handleActualResetForButton = () => { // For the "Reset" button during play
    resetCurrentPuzzle();
  }


  const handleNewGame = () => {
    setUploadedImageSrc(null); // This will trigger useEffect to clear/reset
    // Any other global state for a new game session can be reset here
    setPuzzleKey(prevKey => prevKey + 1); // Ensures full re-init even if grid size is same
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full border border-indigo-700/30">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-400 text-glow-indigo">Sliding Image Puzzle</h1>
      </header>

      {!uploadedImageSrc && (
        <ImageUploader onImageUploaded={handleImageUpload} />
      )}

      {uploadedImageSrc && (
        <>
          <Controls
            gridOptions={GRID_OPTIONS}
            selectedGridSize={selectedGridSize}
            onGridSizeChange={handleGridSizeChange}
            onReset={handleActualResetForButton} 
            onNewGame={handleNewGame}
            onPreview={() => setShowPreview(true)}
            isPuzzleActive={!!uploadedImageSrc && board.length > 0 && !isSolved && !isLoading}
            disabled={isLoading || isAutoSolving} 
            onStartAutoSolve={startAutoSolve}
            isAutoSolving={isAutoSolving}
            isSolved={isSolved}
          />
          
          <GameStats moves={moves} time={formattedTime} />

          {isLoading && (
             <div className="flex justify-center items-center h-64 my-4">
                <LoadingSpinner />
             </div>
          )}

          {!isLoading && board.length > 0 && (
            <div className="my-6">
              <PuzzleGrid
                board={board}
                onTileClick={handleTileClick}
                gridSize={selectedGridSize}
                isSolved={isSolved}
                isAutoSolving={isAutoSolving} 
              />
            </div>
          )}
        </>
      )}

      {isSolved && uploadedImageSrc && !isAutoSolving && ( 
        <WinModal
          moves={moves}
          time={formattedTime}
          onPlayAgain={handleResetForPlayAgain} 
          onNewGame={handleNewGame} 
        />
      )}
      {showPreview && uploadedImageSrc && (
        <PreviewModal imageSrc={uploadedImageSrc} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
};

export default App;
