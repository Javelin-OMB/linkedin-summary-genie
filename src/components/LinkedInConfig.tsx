import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CLIENT_ID = "779r8mygm8rgk1";

// Dynamically determine the redirect URI based on the current environment
const REDIRECT_URI = (() => {
  const currentOrigin = window.location.origin;
  // Check if we're in a development environment
  if (currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1')) {
    return `${currentOrigin}/about`;
  }
  // For production environment
  return `${currentOrigin}/about`;
})();

export const LinkedInConfig = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

    // Check for error response from LinkedIn
    const error = urlParams.get("error");
    const errorDescription = urlParams.get("error_description");
    if (error) {
      setError(errorDescription || "Fout bij authenticatie met LinkedIn");
      toast({
        title: "Authenticatie Fout",
        description: `Fout: ${error}. ${errorDescription || ""}`,
        variant: "destructive",
      });
    }
  }, []);

  const handleOAuthCallback = async (code: string) => {
    try {
      // Store both the auth code and a timestamp
      const tokenData = {
        code,
        timestamp: new Date().getTime(),
        expiresIn: 3600 // 1 hour in seconds
      };
      
      localStorage.setItem("linkedin_auth_data", JSON.stringify(tokenData));
      setIsConnected(true);
      setError(null);
      
      toast({
        title: "Succes",
        description: "Succesvol verbonden met LinkedIn!",
      });

      // Log success for debugging
      console.log("LinkedIn authentication successful", {
        code,
        redirectUri: REDIRECT_URI,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("OAuth callback error:", error);
      setError("Fout bij het voltooien van LinkedIn authenticatie");
      toast({
        title: "Fout",
        description: "Fout bij het voltooien van LinkedIn authenticatie",
        variant: "destructive",
      });
    }
  };

  const handleConnect = () => {
    const scopes = [
      'r_basicprofile',
      'r_organization_social',
      'rw_organization_admin',
      'w_member_social'
    ];
    
    const scope = encodeURIComponent(scopes.join(' '));
    const state = Math.random().toString(36).substring(7);
    
    // Log the authentication attempt
    console.log("Initiating LinkedIn authentication", {
      redirectUri: REDIRECT_URI,
      origin: window.location.origin,
      timestamp: new Date().toISOString()
    });

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scope}&state=${state}`;
    
    window.location.href = authUrl;
  };

  const handleDisconnect = () => {
    localStorage.removeItem("linkedin_auth_data");
    localStorage.removeItem("linkedin_access_token");
    setIsConnected(false);
    setError(null);
    
    toast({
      title: "Succes",
      description: "LinkedIn verbinding verbroken",
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">LinkedIn Verbinding</h2>
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isConnected ? (
          <>
            <div className="p-4 bg-green-50 rounded-md">
              <p className="text-green-800">
                ✓ Verbonden met LinkedIn
              </p>
            </div>
            <Button 
              onClick={handleDisconnect}
              variant="outline"
              className="w-full"
            >
              Verbreek LinkedIn verbinding
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Klik hieronder om je LinkedIn account te verbinden en leads te genereren.
            </p>
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <p className="text-sm text-blue-800">
                Belangrijk: Zorg ervoor dat deze URL is toegevoegd aan LinkedIn OAuth 2.0 Configuratie:
                <br />
                <code className="bg-blue-100 px-2 py-1 rounded break-all">{REDIRECT_URI}</code>
              </p>
            </div>
            <Button 
              onClick={handleConnect}
              className="w-full bg-[#0077b5] hover:bg-[#006097]"
            >
              Verbind met LinkedIn
            </Button>
          </>
        )}
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Je verbinding is veilig en we vragen alleen de noodzakelijke permissies aan om leads te genereren.
      </p>
    </div>
  );
};