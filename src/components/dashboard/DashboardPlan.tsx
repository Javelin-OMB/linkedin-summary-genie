import React from 'react';
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';

const DashboardPlan = () => {
  const navigate = useNavigate();
  const session = useSession();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#0177B5]">Your Plan</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Current Usage</h2>
            <p className="text-gray-600">Free Plan</p>
            {session ? (
              <div className="mt-4">
                <span className="text-3xl font-bold">10</span>
                <span className="text-gray-600 ml-1">free analyses remaining</span>
              </div>
            ) : (
              <div className="mt-4">
                <span className="text-gray-600">Sign in to get your free analyses</span>
              </div>
            )}
          </div>

          <ul className="space-y-3 mb-6 text-gray-600">
            <li className="flex items-center">
              <Check className="w-5 h-5 text-[#0177B5] mr-2" />
              Basic LinkedIn profile analysis
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-[#0177B5] mr-2" />
              Conversation starters
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-[#0177B5] mr-2" />
              Basic insights
            </li>
          </ul>

          {!session && (
            <Button 
              onClick={() => navigate('/login')}
              className="w-full bg-[#0177B5] hover:bg-[#0177B5]/90 text-white"
            >
              Get Free Trial
            </Button>
          )}
        </Card>

        {/* Pro Plan */}
        <Card className="p-6 border-2 border-[#0177B5]">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Pro Plan</h2>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">€29</span>
              <span className="text-gray-600 ml-1">/month</span>
            </div>
          </div>

          <ul className="space-y-3 mb-6 text-gray-600">
            <li className="flex items-center">
              <Check className="w-5 h-5 text-[#0177B5] mr-2" />
              Unlimited LinkedIn analyses
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-[#0177B5] mr-2" />
              Advanced insights & recommendations
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-[#0177B5] mr-2" />
              Priority support
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-[#0177B5] mr-2" />
              Download & export options
            </li>
          </ul>

          <Button 
            onClick={() => navigate('/plan')}
            className="w-full bg-[#0177B5] hover:bg-[#0177B5]/90 text-white"
          >
            Upgrade Now
          </Button>
          
          <p className="text-sm text-gray-500 text-center mt-4">
            Cancel anytime. No commitment required.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPlan;