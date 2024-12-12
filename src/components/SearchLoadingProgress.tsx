import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

interface SearchLoadingProgressProps {
  isLoading: boolean;
}

const SearchLoadingProgress: React.FC<SearchLoadingProgressProps> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      setIsVisible(true);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          if (prev < 30) {
            return prev + 1;
          } else if (prev < 60) {
            return prev + 2;
          } else {
            return prev + 3;
          }
        });
      }, 200);

      return () => {
        clearInterval(interval);
      };
    } else if (isVisible) {
      setProgress(100);
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (!isVisible) return null;

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