import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import LeadInfo from "./LeadInfo";
import SearchForm from "./search/SearchForm";
import { fetchLinkedInProfile } from "@/services/linkedinService";
import { 
  createAnalysis, 
  updateAnalysisWithResults, 
  markAnalysisAsFailed,
  checkExistingAnalysis,
  getUserCredits,
  decrementUserCredits
} from "@/services/analysisService";

const SearchBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    try {
      console.log('Starting analysis for URL:', url);
      
      // Check for existing analysis
      const existingAnalyses = await checkExistingAnalysis(url);
      if (existingAnalyses && existingAnalyses.length > 0) {
        toast({
          title: "Analysis in Progress",
          description: "This profile is currently being analyzed. Please try again in a moment.",
          variant: "default",
        });
        return;
      }

      // Get user credits
      const userData = await getUserCredits(session.user.id);
      if (!userData || userData.credits <= 0) {
        toast({
          title: "No credits remaining",
          description: "Please purchase more credits to continue using the service.",
          variant: "destructive",
        });
        return;
      }

      // Create analysis record
      const newAnalysis = await createAnalysis(url, session.user.id);

      // Fetch and process the profile
      console.log('Fetching LinkedIn profile...');
      const data = await fetchLinkedInProfile(url);
      console.log('Profile data received:', data);
      setProfileData(data);

      // Update analysis with results
      await updateAnalysisWithResults(newAnalysis.id, data);

      // Decrease credits
      await decrementUserCredits(session.user.id, userData.credits);

      toast({
        title: "Success",
        description: `Profile analysis complete. You have ${userData.credits - 1} credits remaining.`,
      });
    } catch (error) {
      console.error('Error in handleAnalyze:', error);
      
      // Clean up failed analysis
      if (session?.user?.id) {
        await markAnalysisAsFailed(session.user.id, url);
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
      <SearchForm 
        onSubmit={handleAnalyze}
        isLoading={isLoading}
        session={session}
        navigate={navigate}
      />
      
      {profileData && (
        <div className="mt-8 w-full">
          <LeadInfo data={profileData} />
        </div>
      )}
    </div>
  );
};

export default SearchBar;