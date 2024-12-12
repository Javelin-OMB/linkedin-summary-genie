import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import LeadContent from "./LeadContent";
import SearchLoadingProgress from "./SearchLoadingProgress";
import { analyzeProfile } from "@/services/analyzeService";

const LeadSummary = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const resetState = () => {
    setLoading(false);
    setError('');
    setResult(null);
  };

  const handleAnalyze = async () => {
    resetState();
    setLoading(true);

    try {
      const data = await analyzeProfile(url);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">Get Instant Lead Insights</h1>
        <p className="text-lg text-gray-600">
          Enter a LinkedIn profile URL to receive a comprehensive summary
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste LinkedIn profile URL here..."
            className="w-full pr-24 h-12 text-lg"
          />
          <Button 
            onClick={handleAnalyze}
            disabled={loading || !url}
            className="absolute right-0 top-0 h-12 px-6 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Analyzing...' : <Search className="w-5 h-5" />}
          </Button>
        </div>

        <SearchLoadingProgress isLoading={loading} />

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8">
            <LeadContent data={result} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadSummary;