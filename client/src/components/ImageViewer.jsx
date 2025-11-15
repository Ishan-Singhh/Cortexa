import React, { useState } from 'react';


export default function ImageViewer({ caseId, totalSlices }) {
  // Initialize the slider to the middle slice for a good starting view.
  // Default to 0 if totalSlices is not yet available.
  const initialSlice = totalSlices ? Math.floor(totalSlices / 2) : 0;
  const [currentSlice, setCurrentSlice] = useState(initialSlice);

  // Updates the state when the user moves the slider.
  const handleSliderChange = (event) => {
    setCurrentSlice(Number(event.target.value));
  };

  // Get the API base URL from the .env file, with a fallback for safety.
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Dynamically construct the URL for the current slice image.
  // This URL points to the slice-serving endpoint on your Express server.
  const imageUrl = `${API_BASE_URL}/api/results/${caseId}/slice/${currentSlice}`;

  return (
    <div className="w-full">
      {/* Image Display Area */}
      <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center ring-1 ring-white/10">
        {totalSlices > 0 ? (
          <img 
            src={imageUrl} 
            alt={`MRI Scan Slice ${currentSlice + 1}`} 
            className="w-full h-full object-contain" 
          />
        ) : (
          <p className="text-gray-500">Loading slices...</p>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4">
        <label htmlFor="slice-slider" className="block text-sm font-medium text-gray-400 text-center mb-2">
          {/* Display slice number in a user-friendly way (e.g., 78 / 155) */}
          Slice: {totalSlices > 0 ? currentSlice + 1 : 0} / {totalSlices || 0}
        </label>
        <input
          id="slice-slider"
          type="range"
          min="0"
          max={totalSlices > 0 ? totalSlices - 1 : 0}
          value={currentSlice}
          onChange={handleSliderChange}
          disabled={!totalSlices}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-violet-500 disabled:opacity-50"
        />
      </div>
    </div>
  );
}