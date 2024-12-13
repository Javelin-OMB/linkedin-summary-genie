import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const LeadSummary = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [searchProgress, setSearchProgress] = useState(0);

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setSearchProgress(0);

    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

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
        throw new Error('Er ging iets mis bij het ophalen van de gegevens');
      }

      const data = await response.json();
      setResult(data);
      setSearchProgress(100);
    } catch (err) {
      setError('Er ging iets mis bij het analyseren van het profiel. Probeer het opnieuw.');
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setLoading(false);
        if (!error) setSearchProgress(100);
      }, 500);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto p-4 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Get instant insights and conversation starters from any LinkedIn profile
          </h1>
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
              disabled={loading}
              className="absolute right-0 top-0 h-full px-6 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Analyzing...' : 'Search'}
            </Button>
          </div>

          {loading && (
            <div className="mt-4">
              <Progress value={searchProgress} className="h-2" />
              <div className="flex justify-between mt-1 text-sm text-gray-500">
                <span>Analyzing profile...</span>
                <span>{searchProgress}%</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8">
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadSummary;