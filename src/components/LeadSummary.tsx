import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from './Navigation';
import SearchLoadingProgress from './SearchLoadingProgress';
import LoginDialog from './LoginDialog';

const LeadSummary = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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
        throw new Error('Er ging iets mis bij het ophalen van de gegevens');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Er ging iets mis bij het analyseren van het profiel. Probeer het opnieuw.');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleLogin = (email: string, password: string) => {
    console.log('Login attempt:', email);
    setIsLoginOpen(false);
  };

  return (
    <div className="w-full">
      <Navigation onLoginClick={() => setIsLoginOpen(true)} />
      
      <main className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-linkedin-primary">
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
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-700 rounded">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-8">
              <pre className="whitespace-pre-wrap bg-white p-4 rounded shadow">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>

      <LoginDialog 
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onSubmit={(email, password) => {
          console.log('Login attempt:', email);
          setIsLoginOpen(false);
        }}
      />
    </div>
  );
};

export default LeadSummary;