import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import LeadInfo from '../LeadInfo';
import { useToast } from "@/components/ui/use-toast";

const DashboardAnalyses = () => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!session?.user?.id) return;

      try {
        console.log('Fetching analyses for user:', session.user.id);
        const { data, error } = await supabase
          .from('linkedin_analyses')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching analyses:', error);
          toast({
            title: "Error",
            description: "Could not load lead summaries",
            variant: "destructive",
          });
          return;
        }

        console.log('Fetched analyses:', data);
        setAnalyses(data || []);
      } catch (error) {
        console.error('Error in fetchAnalyses:', error);
        toast({
          title: "Error",
          description: "Could not load lead summaries",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [session, supabase, toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#0177B5]">Recent Lead Summaries</h2>
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#0177B5]">Recent Lead Summaries</h2>
      {analyses.length > 0 ? (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <LeadInfo key={analysis.id} data={analysis.analysis} />
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <p className="text-gray-600">No lead summaries found. Try analyzing some LinkedIn profiles first.</p>
        </Card>
      )}
    </div>
  );
};

export default DashboardAnalyses;