import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { fetchLinkedInProfile } from "@/services/linkedinService";
import LeadInfo from "./LeadInfo";
import SearchLoadingProgress from "./SearchLoadingProgress";
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL format
    if (!url.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a LinkedIn profile URL",
        variant: "destructive",
      });
      return;
    }

    if (!url.includes("linkedin.com")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid LinkedIn profile URL",
        variant: "destructive",
      });
      return;
    }

    if (!session) {
      console.log('No session found, redirecting to login');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting analysis for URL:', url);
      
      // First, check if there's already an analysis in progress
      const { data: existingAnalyses, error: checkError } = await supabase
        .from('linkedin_analyses')
        .select('*')
        .eq('linkedin_url', url)
        .eq('status', 'processing');

      if (checkError) {
        console.error('Error checking analysis status:', checkError);
        throw new Error('Failed to check analysis status');
      }

      if (existingAnalyses && existingAnalyses.length > 0) {
        toast({
          title: "Analysis in Progress",
          description: "This profile is currently being analyzed. Please try again in a moment.",
          variant: "default",
        });
        setIsLoading(false);
        return;
      }

      // Get user data including trial start and credits
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('credits, trial_start')
        .eq('id', session.user.id)
        .single();

      if (userError) {
        throw new Error('Failed to fetch user data');
      }

      if (!userData || userData.credits <= 0) {
        toast({
          title: "No credits remaining",
          description: "Please purchase more credits to continue using the service.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create a new analysis record
      const { data: newAnalysis, error: insertError } = await supabase
        .from('linkedin_analyses')
        .insert({
          linkedin_url: url,
          user_id: session.user.id,
          status: 'processing',
          started_at: new Date().toISOString(),
          analysis: {}
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating analysis record:', insertError);
        if (insertError.code === '23505') {
          toast({
            title: "Analysis Already in Progress",
            description: "This profile is currently being analyzed. Please try again in a moment.",
            variant: "default",
          });
          setIsLoading(false);
          return;
        }
        throw insertError;
      }

      // Fetch and process the profile
      console.log('Fetching LinkedIn profile...');
      const data = await fetchLinkedInProfile(url);
      console.log('Profile data received:', data);
      setProfileData(data);

      // Update the analysis record with the results
      await supabase
        .from('linkedin_analyses')
        .update({
          analysis: data,
          status: 'completed'
        })
        .eq('id', newAnalysis.id);

      // Decrease credits
      await supabase
        .from('users')
        .update({ credits: userData.credits - 1 })
        .eq('id', session.user.id);

      toast({
        title: "Success",
        description: `Profile analysis complete. You have ${userData.credits - 1} credits remaining.`,
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      
      // Clean up failed analysis
      if (session?.user?.id) {
        await supabase
          .from('linkedin_analyses')
          .update({ status: 'failed' })
          .eq('user_id', session.user.id)
          .eq('linkedin_url', url)
          .eq('status', 'processing');
      }

      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to analyze profile. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Input
              type="url"
              placeholder="Paste LinkedIn profile URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-full border-2 border-linkedin-primary focus:outline-none focus:border-linkedin-hover"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit"
            className="w-full sm:w-auto bg-linkedin-primary hover:bg-linkedin-hover text-white rounded-full px-8 py-3"
            disabled={isLoading}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </form>

      <SearchLoadingProgress isLoading={isLoading} />
      
      {profileData && (
        <div className="mt-8 w-full">
          <LeadInfo data={profileData} />
        </div>
      )}
    </div>
  );
};

export default SearchBar;