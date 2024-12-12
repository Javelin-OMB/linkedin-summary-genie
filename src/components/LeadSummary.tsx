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

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await analyzeProfile(url);
      setResult(data);
    } catch (err) {
      setError('Er ging iets mis bij het analyseren van het profiel. Probeer het opnieuw.');
      console.error('Analysis error:', err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Turn LinkedIn Profiles into Sales Opportunities
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get instant insights and conversation starters from any LinkedIn profile
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste LinkedIn URL here..."
            className="w-full pr-24 h-12 text-lg"
          />
          <Button 
            onClick={handleAnalyze}
            disabled={loading || !url}
            className="absolute right-0 top-0 h-full px-6 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Analyzing...' : <Search className="w-5 h-5" />}
          </Button>
        </div>

        <SearchLoadingProgress isLoading={loading} />
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {result && <LeadContent data={result} />}
    </div>
  );
};

export default LeadSummary;