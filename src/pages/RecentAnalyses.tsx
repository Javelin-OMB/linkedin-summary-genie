import { useState, useEffect } from "react";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Card } from "@/components/ui/card";
import { User, Linkedin } from "lucide-react";
import { parseProfileData, extractProfileInfo } from "@/components/lead/ProfileParser";

const RecentAnalyses = () => {
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
          .order('created_at', { ascending: false });

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

  const renderProfileSummary = (analysis: any) => {
    const profileData = analysis.analysis?.profile_data;
    if (!profileData) return null;

    const sections = parseProfileData(profileData);
    const { name, functionTitle, company } = extractProfileInfo(sections);

    return (
      <Card key={analysis.id} className="mb-6 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-gray-500" />
            <div>
              <h3 className="text-lg font-medium">{name}</h3>
              <p className="text-sm text-gray-600">{company !== '-' ? company : ''}</p>
              <a 
                href={analysis.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center mt-1"
              >
                <Linkedin className="h-4 w-4 mr-1" />
                View Profile
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          {Object.entries(sections).map(([title, content], index) => (
            <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
              <h4 className="font-medium mb-2">{title}</h4>
              {content.split('\n').map((line, lineIndex) => (
                <p key={lineIndex} className="text-gray-600">
                  {line.replace('- ', '')}
                </p>
              ))}
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Recent Analyses</h1>
      <div className="max-w-3xl mx-auto">
        {analyses.length > 0 ? (
          analyses.map((analysis) => renderProfileSummary(analysis))
        ) : (
          <p className="text-gray-500">No analyses yet</p>
        )}
      </div>
    </div>
  );
};

export default RecentAnalyses;
