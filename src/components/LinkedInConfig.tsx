import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export const LinkedInConfig = () => {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedClientId = localStorage.getItem("linkedin_client_id");
    if (savedClientId) {
      setClientId(savedClientId);
    }
  }, []);

  const handleSave = () => {
    if (!clientId || !clientSecret) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("linkedin_client_id", clientId);
    // We only store the client ID, not the secret
    
    // Initialize LinkedIn SDK
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(window.location.origin)}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
    
    toast({
      title: "Success",
      description: "LinkedIn configuration saved",
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">LinkedIn API Configuration</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Client ID</label>
          <Input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Enter your LinkedIn Client ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Client Secret</label>
          <Input
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            placeholder="Enter your LinkedIn Client Secret"
          />
        </div>
        <Button onClick={handleSave} className="w-full">
          Connect LinkedIn
        </Button>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Your credentials are stored securely in your browser and are only used to connect with LinkedIn.
      </p>
    </div>
  );
};