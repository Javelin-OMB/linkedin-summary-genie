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
    return null;
  }

  return (
    <div className="mt-8">
      <pre className="whitespace-pre-wrap bg-white p-4 rounded shadow">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
};

export default AnalysisResults;