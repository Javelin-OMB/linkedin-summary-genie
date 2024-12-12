import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

interface SearchLoadingProgressProps {
  isLoading: boolean;
}

const SearchLoadingProgress = ({ isLoading }: SearchLoadingProgressProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      // Reset progress when loading starts
      setProgress(0);
      
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95; // Stop at 95% until actual completion
          }
          return prev + 5;
        });
      }, 150);

      return () => {
        clearInterval(interval);
        setProgress(0);
      };
    } else {
      // Complete the progress bar when loading is done
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="w-full mt-4">
      <div className="mb-2 flex justify-between items-center text-sm text-gray-600">
        <span>Analyzing LinkedIn profile...</span>
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