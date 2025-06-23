import React from 'react';

interface PreviewModalProps {
  imageSrc: string;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ imageSrc, onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4"
        onClick={onClose} // Close on backdrop click
    >
      <div 
        className="bg-gray-800 p-4 pt-10 rounded-xl shadow-2xl max-w-xl w-full max-h-[85vh] relative transform transition-all animate-fadeInScaleUp border border-indigo-700/30"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on modal content
      >
        <h3 className="text-xl font-semibold text-indigo-400 mb-4 text-center absolute top-3 left-1/2 -translate-x-1/2">Original Image</h3>
        <div className="overflow-auto max-h-[calc(85vh-80px)] flex justify-center items-center rounded-md">
            <img src={imageSrc} alt="Original puzzle" className="max-w-full max-h-full h-auto rounded-md shadow-lg" />
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-700/70"
          aria-label="Close preview"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};