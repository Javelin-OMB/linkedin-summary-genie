import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from './Navigation';
import SearchLoadingProgress from './SearchLoadingProgress';
import LoginDialog from './LoginDialog';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const LeadSummary = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }

    const fetchCredits = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('credits')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching credits:', error);
        return;
      }

      setCredits(data?.credits ?? 0);
    };

    fetchCredits();
  }, [session, supabase, navigate]);

  const handleAnalyze = async () => {
    if (!session) {
      navigate('/login');
      return;
    }

    if (credits === 0) {
      toast({
        title: "No credits remaining",
        description: "Please purchase more credits to continue using the service.",
        variant: "destructive",
      });
      return;
    }

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

      // Store analysis in Supabase
      const { error: analysisError } = await supabase
        .from('linkedin_analyses')
        .insert({
          linkedin_url: url,
          analysis: data,
          user_id: session.user.id
        });

      if (analysisError) {
        console.error('Error storing analysis:', analysisError);
      }

      // Decrease credits
      const { error: updateError } = await supabase
        .from('users')
        .update({ credits: credits - 1 })
        .eq('id', session.user.id);

      if (updateError) {
        console.error('Error updating credits:', updateError);
      } else {
        setCredits(prev => prev !== null ? prev - 1 : null);
      }

    } catch (err) {
      setError('Er ging iets mis bij het analyseren van het profiel. Probeer het opnieuw.');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleLogin = (email: string, password: string) => {
    navigate('/login');
  };

  if (!session) {
    return null;
  }

  return (
    <div className="w-full">
      <Navigation onLoginClick={() => navigate('/login')} />
      
      <main className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#0177B5]">
              Get instant insights and conversation starters from any LinkedIn profile
            </h1>
            <p className="mt-4 text-gray-600">
              Credits remaining: {credits ?? '...'}
            </p>
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
                disabled={loading || credits === 0}
                className="absolute right-0 top-0 h-full px-6 bg-[#0177B5] hover:bg-[#0177B5]/90 text-white"
              >
                {loading ? 'Analyzing...' : credits === 0 ? 'No Credits' : 'Search'}
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
        onSubmit={handleLogin}
      />
    </div>
  );
};

export default LeadSummary;