import React from 'react';

interface AnalysisResultsProps {
  error?: string;
  result: any;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ error, result }) => {
  if (error) {
    return (
      <div className="mb-8 p-4 bg-red-50 text-red-700 rounded">
        {error}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mb-8 p-4 bg-gray-50 text-gray-600 rounded">
        Voer een LinkedIn URL in om een analyse te starten.
      </div>
    );
  }

  const formatAnalysisOutput = (data: any) => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
    return data;
  };

  const formattedResult = formatAnalysisOutput(result);

  return (
    <div className="mt-8">
      <pre className="whitespace-pre-wrap bg-white p-4 rounded shadow overflow-x-auto">
        {typeof formattedResult === 'object' 
          ? JSON.stringify(formattedResult, null, 2)
          : formattedResult}
      </pre>
    </div>
  );
};

export default AnalysisResults;