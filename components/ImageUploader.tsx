import React, { useState, useCallback } from 'react';

interface ImageUploaderProps {
  onImageUploaded: (imageSrc: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded }) => {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError('Invalid file type. Please upload a JPG, JPEG, or PNG image.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File is too large. Maximum size is 5MB.');
        return;
      }
      setError(null);
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUploaded(reader.result as string);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to read the image file.');
        setIsUploading(false);
      }
      reader.readAsDataURL(file);
    }
  }, [onImageUploaded]);

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed border-gray-600 rounded-lg bg-gray-700/50 hover:border-indigo-500 transition-colors duration-300 shadow-inner">
      <label
        htmlFor="imageUpload"
        className={`cursor-pointer px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50
                    ${isUploading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-400'}`}
      >
        {isUploading ? 'Processing...' : 'Upload Image'}
      </label>
      <input
        id="imageUpload"
        type="file"
        accept="image/jpeg, image/png, image/jpg"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      <p className="mt-6 text-sm text-gray-400">Choose a JPG, PNG, or JPEG file (max 5MB).</p>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
};