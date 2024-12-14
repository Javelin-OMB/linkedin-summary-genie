import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import LeadInfo from '../LeadInfo';

const DashboardAnalyses = () => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
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

    fetchAnalyses();
  }, [session, supabase]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#0177B5]">Recent Leadsummaries</h2>
      <div className="space-y-4">
        {analyses.map((analysis) => (
          <LeadInfo key={analysis.id} data={analysis.analysis} />
        ))}
      </div>
    </div>
  );
};

export default DashboardAnalyses;