import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useSession } from '@supabase/auth-helpers-react';

const LeadSummary = () => {
  const navigate = useNavigate();
  const session = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 pt-8 pb-8">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Transform LinkedIn Profiles into Actionable Sales Insights
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get instant, AI-powered summaries of LinkedIn profiles to identify sales opportunities and personalize your outreach.
        </p>
        {!session && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={() => navigate('/login?mode=signup')}
              className="bg-linkedin-primary hover:bg-linkedin-primary/90 text-white px-8 py-6 text-lg"
            >
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/about')}
              className="border-linkedin-primary text-linkedin-primary hover:bg-linkedin-primary hover:text-white px-8 py-6 text-lg"
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