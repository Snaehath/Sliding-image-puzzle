import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center" role="status" aria-label="Loading puzzle">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      <p className="mt-4 text-gray-300 text-lg">Loading puzzle...</p>
    </div>
  );
};