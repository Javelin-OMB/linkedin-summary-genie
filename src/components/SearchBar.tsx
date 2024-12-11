import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { fetchLinkedInProfile } from "@/services/linkedinService";
import ProfileSummary from "./ProfileSummary";

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
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="url"
              placeholder="Paste LinkedIn profile URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-4 pr-4 py-6 text-lg rounded-lg border border-gray-300 focus:border-linkedin-primary focus:ring-linkedin-primary"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit"
            size="lg"
            className="bg-[#0077B5] hover:bg-[#006399] text-white px-8 py-6 rounded-lg"
            disabled={isLoading}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </form>

      <div className="text-sm text-gray-500 text-center">
        10 free searches remaining
      </div>

      {profileData && <ProfileSummary data={profileData} />}
    </div>
  );
};

export default SearchBar;