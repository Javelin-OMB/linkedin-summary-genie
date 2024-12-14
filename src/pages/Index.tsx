import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from '@/components/Navigation';
import SearchLoadingProgress from '@/components/SearchLoadingProgress';
import LeadInfo from '@/components/LeadInfo';

const Index = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    setError('');
    
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
      console.log('Received data:', data); // Debug log
      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Er ging iets mis bij het analyseren van het profiel. Probeer het opnieuw.');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-linkedin-primary mb-6 leading-tight">
              Get instant insights and conversation starters from any LinkedIn profile
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Generate personalized insights and DISC-based communication tips for more meaningful connections
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste LinkedIn URL here..."
                className="w-full pr-24 h-12 text-lg border-linkedin-primary focus:ring-linkedin-primary"
              />
              <Button 
                onClick={handleAnalyze}
                disabled={loading || !url}
                className="absolute right-0 top-0 h-full px-6 bg-linkedin-primary hover:bg-linkedin-hover text-white"
              >
                {loading ? 'Analyzing...' : 'Search'}
              </Button>
            </div>

            <SearchLoadingProgress isLoading={loading} />

            {error && (
              <div className="mb-8 p-4 bg-red-50 text-red-700 rounded">
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
      </main>
    </div>
  );
};

export default Index;