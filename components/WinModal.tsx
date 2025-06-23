import React from 'react';

interface WinModalProps {
  moves: number;
  time: string;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ moves, time, onPlayAgain, onNewGame }) => {
  const buttonBaseClass = "px-6 py-3 font-semibold rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50";
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl text-center w-full max-w-md transform transition-all animate-fadeInScaleUp border border-green-500/30">
        <h2 className="text-3xl md:text-4xl font-bold text-green-400 mb-5 text-glow-green">Puzzle Completed!</h2>
        <p className="text-gray-300 mb-3 text-lg">Congratulations, you solved it!</p>
        <div className="my-8 space-y-3 bg-gray-700/50 p-4 rounded-lg">
          <p className="text-xl"><span className="font-semibold text-gray-400">Moves:</span> <span className="text-indigo-400 font-bold">{moves}</span></p>
          <p className="text-xl"><span className="font-semibold text-gray-400">Time:</span> <span className="text-indigo-400 font-bold">{time}</span></p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            onClick={onPlayAgain}
            className={`${buttonBaseClass} bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-400`}
          >
            Play Again (Same Image)
          </button>
          <button
            onClick={onNewGame}
            className={`${buttonBaseClass} bg-gray-600 hover:bg-gray-500 text-white focus:ring-gray-400`}
          >
            New Game (New Image)
          </button>
        </div>
      </div>
    </div>
  );
};