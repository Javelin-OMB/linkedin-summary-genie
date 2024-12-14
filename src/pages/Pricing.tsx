import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const Pricing = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFreePlan = async () => {
    if (!session) {
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          trial_start: new Date().toISOString(),
          credits: 10
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've been enrolled in the free plan with 10 analyses.",
      });

      navigate('/');
    } catch (error) {
      console.error('Error activating free plan:', error);
      toast({
        title: "Error",
        description: "Failed to activate free plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation onLoginClick={() => navigate('/login')} />
      <main className="pt-32 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Simple Pricing</h1>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-[#0177B5]">
              <h2 className="text-2xl font-semibold mb-4">Free Trial</h2>
              <p className="text-4xl font-bold text-linkedin-primary mb-4">10 Free Analyses</p>
              <ul className="space-y-3 mb-6 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#0177B5] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  LinkedIn Profile Analysis
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#0177B5] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Basic Insights
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#0177B5] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Conversation Starters
                </li>
              </ul>
              <Button 
                onClick={handleFreePlan}
                className="w-full bg-[#0177B5] hover:bg-[#0177B5]/90 text-white"
              >
                Start Free Trial
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Pro Plan</h2>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold">€29</span>
                <span className="text-gray-600 ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-6 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#0177B5] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited Analyses
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#0177B5] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced Insights
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#0177B5] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Priority Support
                </li>
              </ul>
              <Button 
                className="w-full border-2 border-[#0177B5] text-[#0177B5] hover:bg-[#0177B5] hover:text-white"
                variant="outline"
                onClick={() => navigate('/plan')}
              >
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;