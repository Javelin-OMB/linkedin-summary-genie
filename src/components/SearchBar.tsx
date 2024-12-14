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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SearchBar = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const session = useSession();

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

    if (!session) {
      setShowAuthDialog(true);
      return;
    }

    setIsLoading(true);
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('credits')
        .eq('id', session.user.id)
        .single();

      if (!userData || userData.credits <= 0) {
        toast({
          title: "No credits remaining",
          description: "Please purchase more credits to continue using the service.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const data = await fetchLinkedInProfile(url);
      setProfileData(data);

      // Store analysis in database
      await supabase
        .from('linkedin_analyses')
        .insert({
          linkedin_url: url,
          analysis: data,
          user_id: session.user.id
        });

      // Decrease credits
      await supabase
        .from('users')
        .update({ credits: userData.credits - 1 })
        .eq('id', session.user.id);

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

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              To analyze LinkedIn profiles, you need to be logged in.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Already a customer?</h3>
              <Button 
                onClick={() => {
                  setShowAuthDialog(false);
                  // Trigger your login dialog here
                  document.querySelector<HTMLButtonElement>('[data-login-trigger]')?.click();
                }}
                className="w-full bg-linkedin-primary hover:bg-linkedin-hover"
              >
                Login
              </Button>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">New to LeadSummary?</h3>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowAuthDialog(false);
                  window.location.href = "/pricing";
                }}
                className="w-full border-linkedin-primary text-linkedin-primary hover:bg-linkedin-primary hover:text-white"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchBar;