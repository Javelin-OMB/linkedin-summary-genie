import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from './Navigation';
import SearchLoadingProgress from './SearchLoadingProgress';
import LoginDialog from './LoginDialog';
import LeadInfo from './LeadInfo';
import { useToast } from "@/components/ui/use-toast";

const LeadSummary = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    console.log('Starting API request to Relevance...');
    console.log('Request URL:', 'https://api-d7b62b.stack.tryrelevance.com/latest/studios/cf5e9295-e250-4e58-accb-bafe535dd868/trigger_limited');
    console.log('Request body:', {
      params: {
        linkedin_url: url
      },
      project: "d607c466-f207-4c47-907f-d928278273e2"
    });

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

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      setResult(data);
      toast({
        title: "Success",
        description: "Profile successfully analyzed",
      });
    } catch (err) {
      console.error('API Error:', err);
      setError('Er ging iets mis bij het analyseren van het profiel. Probeer het opnieuw.');
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
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
            <h1 className="text-4xl font-bold text-[#0177B5]">
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
                className="w-full pr-24 h-12 text-lg border-[#0177B5] focus:ring-[#0177B5]"
              />
              <Button 
                onClick={handleAnalyze}
                disabled={loading}
                className="absolute right-0 top-0 h-full px-6 bg-[#0177B5] hover:bg-[#0177B5]/90 text-white"
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
            <LeadInfo data={result} />
          )}
        </div>
      </main>

      <LoginDialog 
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onSubmit={handleLogin}
      />
    </div>
  );
};

export default LeadSummary;