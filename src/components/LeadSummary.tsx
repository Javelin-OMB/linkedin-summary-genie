import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import LeadInfo from "./LeadInfo";
import SearchLoadingProgress from "./SearchLoadingProgress";

const LeadSummary = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [remainingSearches] = useState(10);

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('https://api-d7b62b.stack.tryrelevance.com/latest/studios/cf5e9295-e250-4e58-accb-bafe535dd868/trigger_limited', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'd607c466-f207-4c47-907f-d928278273e2:sk-OTQ1ODVjYTQtOGZhYS00MDUwLWIxYWYtOTE0NDIyYTA1YjY2'
        },
        body: JSON.stringify({
          params: {
            linkedin_url: url
          },
          project: "d607c466-f207-4c47-907f-d928278273e2"
        })
      });

      if (!response.ok) {
        throw new Error('Fout bij het ophalen van de gegevens');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      // Add a small delay before setting loading to false to ensure smooth progress bar completion
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
          Enter a LinkedIn profile URL to receive a comprehensive summary and personalized conversation starters
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

        {/* Loading Progress Bar */}
        <SearchLoadingProgress isLoading={loading} />

        <div className="text-center mt-4 text-sm text-gray-500">
          {remainingSearches} free searches remaining
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8">
            <LeadInfo data={result} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadSummary;