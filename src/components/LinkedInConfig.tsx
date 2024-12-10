import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const CLIENT_ID = "779r8mygm8rgk1"; // Your LinkedIn Client ID
const REDIRECT_URI = window.location.origin + "/about"; // Redirect back to about page

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
      // In a real application, you would exchange this code for an access token
      // using your backend server to keep the client secret secure
      console.log("Received authorization code:", code);
      
      // For demo purposes, we'll just store the code
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
    // Initialize LinkedIn OAuth flow
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
