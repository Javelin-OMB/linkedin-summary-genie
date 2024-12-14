import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { fetchLinkedInProfile } from "@/services/linkedinService";
import LeadInfo from "./LeadInfo";
import SearchLoadingProgress from "./SearchLoadingProgress";

const SearchBar = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes("linkedin.com")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid LinkedIn profile URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchLinkedInProfile(url);
      setProfileData(data);
      toast({
        title: "Success",
        description: "Profile analysis complete",
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
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
            className="bg-linkedin-primary hover:bg-linkedin-hover text-white rounded-full px-8 py-3"
            disabled={isLoading}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </form>

      <SearchLoadingProgress isLoading={isLoading} />
      
      {profileData && <LeadInfo data={profileData} />}
    </div>
  );
};

export default SearchBar;