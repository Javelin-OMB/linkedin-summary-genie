import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

interface SearchLoadingProgressProps {
  isLoading: boolean;
}

const SearchLoadingProgress: React.FC<SearchLoadingProgressProps> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initialiseren...');

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          // Snellere progressie tot 85%
          if (prev < 85) {
            // Update loading message based on progress
            if (prev < 30) {
              setLoadingMessage('LinkedIn profiel ophalen...');
            } else if (prev < 60) {
              setLoadingMessage('Profiel analyseren...');
            } else {
              setLoadingMessage('Afronden...');
            }
            return prev + 5; // Snellere toename
          }
          // Dan langzamer
          return prev + 0.5;
        });
      }, 100); // Kortere interval voor vloeiendere animatie

      return () => clearInterval(interval);
    } else if (progress > 0) {
      setProgress(100);
      setLoadingMessage('Analyse voltooid!');
      const timeout = setTimeout(() => {
        setProgress(0);
        setLoadingMessage('Initialiseren...');
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="w-full mt-4">
      <div className="mb-2 flex justify-between items-center text-sm text-gray-600">
        <span>{loadingMessage}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress 
        value={progress} 
        className="h-2"
      />
    </div>
  );
};

export default SearchLoadingProgress;