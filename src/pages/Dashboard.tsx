import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronDown, ChevronUp, User, Linkedin } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import DashboardSidebar from "@/components/DashboardSidebar";
import Navigation from "@/components/Navigation";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [credits, setCredits] = useState<number | null>(null);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [expandedAnalysis, setExpandedAnalysis] = useState<string | null>(null);
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const maxFreeSearches = 10;

  useEffect(() => {
    const fetchCredits = async () => {
      if (!session?.user?.id) return;

      try {
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
      } catch (error) {
        console.error('Error in fetchCredits:', error);
      }
    };

    const fetchAnalyses = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from('linkedin_analyses')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching analyses:', error);
          return;
        }

        setAnalyses(data || []);
      } catch (error) {
        console.error('Error in fetchAnalyses:', error);
      }
    };

    fetchCredits();
    fetchAnalyses();
  }, [session, supabase]);

  const usagePercentage = credits !== null ? ((maxFreeSearches - credits) / maxFreeSearches) * 100 : 0;

  const renderProfileSummary = (analysis: any) => {
    const profileData = analysis.analysis?.output?.profile_data;
    if (!profileData) return null;

    const sections = profileData.split('\n\n');
    const profileInfo = sections[0]?.split('\n') || [];
    const name = profileInfo[1]?.replace('- ', '') || 'Name not available';
    const summary = sections[1]?.split('\n')[1] || 'No summary available';

    return (
      <Card key={analysis.id} className="mb-4 p-4">
        <Collapsible>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <h3 className="font-medium">{name}</h3>
                <a 
                  href={analysis.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  <Linkedin className="h-4 w-4 mr-1" />
                  View Profile
                </a>
              </div>
            </div>
            <CollapsibleTrigger className="hover:bg-gray-100 p-1 rounded">
              {expandedAnalysis === analysis.id ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CollapsibleTrigger>
          </div>
          
          <p className="text-sm text-gray-600 mt-2 line-clamp-1">{summary}</p>
          
          <CollapsibleContent className="mt-4">
            <div className="space-y-4">
              {sections.slice(1).map((section, index) => {
                const [title, ...content] = section.split('\n');
                return (
                  <div key={index}>
                    <h4 className="font-medium mb-2">{title}</h4>
                    <div className="text-sm text-gray-600">
                      {content.map((line, lineIndex) => (
                        <p key={lineIndex}>{line}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex-1">
          <Navigation onLoginClick={() => navigate('/login')} />
          <main className="bg-gray-50 p-4 pt-20">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-2xl font-bold mb-6 text-[#0177B5]">Your Dashboard</h1>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Current Usage Card */}
                <Card className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Current Usage</h2>
                    <p className="text-gray-600">Free Plan</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>LinkedIn Profile Analyses</span>
                        <span>{credits ?? '...'} / {maxFreeSearches}</span>
                      </div>
                      <Progress value={usagePercentage} className="h-2" />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-[#0177B5] font-medium">
                        {credits !== null ? `${credits} analyses remaining` : 'Loading...'}
                      </p>
                    </div>

                    {/* Recent Analyses */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Recent Analyses</h3>
                      <div className="space-y-4">
                        {analyses.map((analysis) => renderProfileSummary(analysis))}
                      </div>
                    </div>

                    <ul className="space-y-2">
                      <li className="flex items-center text-gray-600">
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        Basic LinkedIn profile analysis
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        Conversation starters
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        Basic insights
                      </li>
                    </ul>
                  </div>
                </Card>

                {/* Upgrade Card */}
                <Card className="p-6 border-2 border-[#0177B5]">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Pro Plan</h2>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">€29</span>
                      <span className="text-gray-600 ml-1">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-gray-600">
                      <Check className="w-5 h-5 text-[#0177B5] mr-2" />
                      Unlimited LinkedIn analyses
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Check className="w-5 h-5 text-[#0177B5] mr-2" />
                      Advanced insights & recommendations
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Check className="w-5 h-5 text-[#0177B5] mr-2" />
                      Priority support
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Check className="w-5 h-5 text-[#0177B5] mr-2" />
                      Download & export options
                    </li>
                  </ul>

                  <Button 
                    className="w-full bg-[#0177B5] hover:bg-[#0177B5]/90 text-white"
                    onClick={() => navigate('/plan')}
                  >
                    Upgrade Now
                  </Button>
                  
                  <p className="text-sm text-gray-500 text-center mt-4">
                    Cancel anytime. No commitment required.
                  </p>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;