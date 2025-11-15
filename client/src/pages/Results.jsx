import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Background from '../components/BackGround';
import ImageViewer from '../components/ImageViewer';

// A simple spinner component for loading states
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const legendData = [
  { color: 'bg-red-500', label: 'Necrotic Tumor Core' },
  { color: 'bg-green-500', label: 'Peritumoral Edema' },
  { color: 'bg-blue-500', label: 'GD-enhancing Tumor' }
];

export default function Results() {
  const { caseId } = useParams();
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get(`/status/${caseId}`);
        setAnalysisData(response.data);
        if (response.data.status === 'completed' || response.data.status === 'error') {
          return true;
        }
      } catch (err) {
        console.error("Failed to fetch results:", err);
        setError("Could not retrieve analysis results. Please try again later.");
        return true;
      }
      return false;
    };

    fetchResults();

    const intervalId = setInterval(async () => {
      const isDone = await fetchResults();
      if (isDone) {
        clearInterval(intervalId);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [caseId]);

  const renderContent = () => {
    if (error) {
        return ( 
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-red-500 sm:text-5xl">Analysis Failed</h1>
                <p className="mt-6 text-lg leading-8 text-gray-400">{error}</p>
            </div>
        );
    }

    if (!analysisData || ['pending', 'processing'].includes(analysisData.status)) {
        // Processing state UI
        return ( 
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Analysis in Progress...</h1>
                <p className="mt-6 text-lg leading-8 text-gray-400">
                    Your MRI scan is being processed. This may take a few moments.
                </p>
                <div className="mt-10 flex items-center justify-center">
                    <Spinner />
                </div>
            </div>
        );
    }
    
    if (analysisData.status === 'completed') {
      const { finding, total_slices } = analysisData.results;
      const findingColor = finding === 'Tumor Detected' ? 'text-red-400' : 'text-green-400';

      return (
        <div>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Analysis Complete</h1>
            <p className="mt-4 text-lg text-gray-400">Case ID: {caseId}</p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-8 ring-1 ring-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* --- MODIFICATION START: Updated Left Column --- */}
              <div className="md:col-span-1 border-r border-gray-700 pr-8">
                <h2 className="text-2xl font-semibold mb-4">Key Findings</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Result</p>
                    <p className={`text-xl font-bold ${findingColor}`}>{finding}</p>
                  </div>
                </div>
                
                <h2 className="text-2xl font-semibold mt-10 mb-4">Legend</h2>
                <div className="space-y-3">
                  {legendData.map((item) => (
                    <div key={item.label} className="flex items-center">
                      <div className={`w-4 h-4 rounded-sm mr-3 ${item.color}`}></div>
                      <span className="text-sm text-gray-300">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* --- MODIFICATION END --- */}

              {/* Right Column: Image Viewer (No change here) */}
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold mb-4">Segmentation Mask</h2>
                <ImageViewer
                  caseId={caseId} 
                  totalSlices={total_slices}
                />
                 <p className="text-xs text-gray-500 mt-2">Segmentation overlay is shown on the Flair sequence.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative isolate bg-gray-900 min-h-screen px-6 text-white">
      <Background />
      <div className="mx-auto max-w-5xl py-48 sm:py-40 lg:py-48">
        {renderContent()}
      </div>
    </div>
  );
}