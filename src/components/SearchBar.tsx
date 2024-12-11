import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { fetchLinkedInProfile } from "@/services/linkedinService";
import ProfileSummary from "./ProfileSummary";

const SearchBar = () => {
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState(localStorage.getItem("RELEVANCE_API_KEY") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const { toast } = useToast();

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem("RELEVANCE_API_KEY", apiKey.trim());
      toast({
        title: "Success",
        description: "API key has been saved",
      });
    }
  };

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

    if (!localStorage.getItem("RELEVANCE_API_KEY")) {
      toast({
        title: "API Key Required",
        description: "Please enter your Relevance API key first",
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
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {!localStorage.getItem("RELEVANCE_API_KEY") && (
        <form onSubmit={handleApiKeySubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter your Relevance API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="submit"
              variant="outline"
              className="whitespace-nowrap"
            >
              Save API Key
            </Button>
          </div>
          <p className="text-sm text-gray-500 text-center">
            You need to set up your Relevance API key before using the service
          </p>
        </form>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Paste LinkedIn profile URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 h-14 text-lg"
            disabled={isLoading}
          />
          <Button 
            type="submit"
            size="lg"
            className="bg-[#0077B5] hover:bg-[#006399] text-white h-14 px-8"
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