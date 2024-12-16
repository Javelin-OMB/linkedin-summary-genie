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
    setProfileData(null); // Reset previous results
    
    try {
      console.log('Starting analysis for URL:', url);
      
      // Valideer URL formaat
      if (!url.includes('linkedin.com/')) {
        throw new Error('Voer een geldige LinkedIn URL in');
      }

      // Check for existing analysis
      const existingAnalyses = await checkExistingAnalysis(url);
      if (existingAnalyses && existingAnalyses.length > 0) {
        toast({
          title: "Analyse in uitvoering",
          description: "Dit profiel wordt momenteel geanalyseerd. Probeer het over een moment opnieuw.",
          variant: "default",
        });
        return;
      }

      // Get user credits
      const userData = await getUserCredits(session.user.id);
      if (!userData || userData.credits <= 0) {
        toast({
          title: "Geen credits meer",
          description: "Koop meer credits om de service te blijven gebruiken.",
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
      
      if (!data) {
        throw new Error('Kon geen profieldata ophalen');
      }

      setProfileData(data);

      // Update analysis with results
      await updateAnalysisWithResults(newAnalysis.id, data);

      // Decrease credits
      await decrementUserCredits(session.user.id, userData.credits);

      toast({
        title: "Succes",
        description: `Profiel analyse voltooid. Je hebt nog ${userData.credits - 1} credits over.`,
      });
    } catch (error) {
      console.error('Error in handleAnalyze:', error);
      
      // Clean up failed analysis
      if (session?.user?.id) {
        await markAnalysisAsFailed(session.user.id, url);
      }

      toast({
        title: "Fout",
        description: error instanceof Error 
          ? error.message 
          : "Kon profiel niet analyseren. Probeer het later opnieuw.",
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