import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const CLIENT_ID = "779r8mygm8rgk1";
const REDIRECT_URI = `${window.location.origin}/about`; // This is your redirect URL

export const LinkedInConfig = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have an access token
    const token = localStorage.getItem("linkedin_access_token");
    if (token) {
      setIsConnected(true);
    }

    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      handleOAuthCallback(code);
    }
  }, []);

  const handleOAuthCallback = async (code: string) => {
    try {
      console.log("Received authorization code:", code);
      localStorage.setItem("linkedin_auth_code", code);
      setIsConnected(true);
      
      toast({
        title: "Success",
        description: "Successfully connected with LinkedIn!",
      });
    } catch (error) {
      console.error("OAuth callback error:", error);
      toast({
        title: "Error",
        description: "Failed to complete LinkedIn authentication",
        variant: "destructive",
      });
    }
  };

  const handleConnect = () => {
    const scope = "r_liteprofile r_emailaddress w_member_social";
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scope)}`;
    
    window.location.href = authUrl;
  };

  const handleDisconnect = () => {
    localStorage.removeItem("linkedin_auth_code");
    localStorage.removeItem("linkedin_access_token");
    setIsConnected(false);
    
    toast({
      title: "Success",
      description: "LinkedIn disconnected",
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">LinkedIn Connection</h2>
      <div className="space-y-4">
        {isConnected ? (
          <>
            <div className="p-4 bg-green-50 rounded-md">
              <p className="text-green-800">
                ✓ Connected with LinkedIn
              </p>
            </div>
            <Button 
              onClick={handleDisconnect}
              variant="outline"
              className="w-full"
            >
              Disconnect LinkedIn
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Click below to connect your LinkedIn account and start generating leads.
            </p>
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <p className="text-sm text-blue-800">
                Important: Add this URL to LinkedIn OAuth 2.0 Configuration:
                <br />
                <code className="bg-blue-100 px-2 py-1 rounded">{REDIRECT_URI}</code>
              </p>
            </div>
            <Button 
              onClick={handleConnect}
              className="w-full bg-[#0077b5] hover:bg-[#006097]"
            >
              Connect with LinkedIn
            </Button>
          </>
        )}
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Your connection is secure and we only request the necessary permissions to generate leads.
      </p>
    </div>
  );
};