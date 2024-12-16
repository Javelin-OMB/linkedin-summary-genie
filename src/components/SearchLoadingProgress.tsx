import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

interface SearchLoadingProgressProps {
  isLoading: boolean;
}

const SearchLoadingProgress: React.FC<SearchLoadingProgressProps> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          // Faster until 65%
          if (prev < 65) {
            return prev + 2;
          }
          // Then very slow
          return prev + 0.5;
        });
      }, 250);

      return () => clearInterval(interval);
    } else if (progress > 0) {
      // Jump to 100% when loading is complete
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="w-full mt-4">
      <div className="mb-2 flex justify-between items-center text-sm text-gray-600">
        <span>Analyzing LinkedIn profile... Please wait while we process your request.</span>
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