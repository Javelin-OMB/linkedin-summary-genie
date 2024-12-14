import React, { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import Navigation from './Navigation';
import LinkedInSearchForm from './LinkedInSearchForm';
import AnalysisResults from './AnalysisResults';
import { analyzeLinkedInProfile } from '@/services/linkedinAnalysisService';

const LeadSummary = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [credits, setCredits] = useState<number | null>(null);
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchCredits = async () => {
    if (!session?.user?.id) return;

    try {
      console.log('Fetching credits for user:', session.user.email);
      const { data, error } = await supabase
        .from('users')
        .select('credits')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching credits:', error);
        return;
      }

      console.log('Credits fetched:', data?.credits);
      setCredits(data?.credits ?? 0);
    } catch (error) {
      console.error('Error in fetchCredits:', error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchCredits();
    }
  }, [session, supabase]);

  const handleAnalyze = async () => {
    if (!session) {
      console.log('No session, redirecting to login');
      navigate('/login');
      return;
    }

    // Fetch latest credits before analyzing
    await fetchCredits();

    if (credits === 0) {
      toast({
        title: "Geen credits meer",
        description: "Koop meer credits om door te gaan met de service.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await analyzeLinkedInProfile(url, session.user.id, credits);
      setResult(data);
      // Refresh credits after successful analysis
      await fetchCredits();
    } catch (err) {
      console.error('Error analyzing profile:', err);
      setError('Er ging iets mis bij het analyseren van het profiel. Probeer het opnieuw.');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div className="w-full">
      <Navigation onLoginClick={() => navigate('/login')} />
      
      <main className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#0177B5]">
              Krijg direct inzichten en gespreksopeners van elk LinkedIn profiel
            </h1>
            {session && (
              <p className="mt-4 text-gray-600">
                Credits over: {credits ?? '...'}
              </p>
            )}
          </div>

          <LinkedInSearchForm
            url={url}
            onUrlChange={setUrl}
            onAnalyze={handleAnalyze}
            loading={loading}
            disabled={session && credits === 0}
            credits={credits}
            isLoggedIn={!!session}
          />

          <AnalysisResults error={error} result={result} />
        </div>
      </main>
    </div>
  );
};

export default LeadSummary;