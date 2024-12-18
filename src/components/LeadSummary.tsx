import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';

const LeadSummary = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  const handleLoginClick = () => {
    try {
      navigate('/login');
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Error",
        description: "Er is een probleem opgetreden bij het navigeren naar de login pagina.",
        variant: "destructive",
      });
    }
  };

  if (session === undefined) {
    return <LoadingSpinner message="Even geduld..." />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 pt-8 pb-8">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Transform LinkedIn Profiles into Actionable Sales/Candidates Insights
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get instant, AI-powered summaries of LinkedIn profiles to identify sales opportunities and personalize your outreach.
        </p>
        {!session && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={handleLoginClick}
              className="bg-brand-primary hover:bg-brand-hover text-black px-8 py-6 text-lg"
            >
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/about')}
              className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-black px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadSummary;