import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Key } from "lucide-react";
import { Label } from "@/components/ui/label";

interface RelevanceConfig {
  apiKey: string;
  endpoint: string;
}

const RelevanceLoginDialog = () => {
  const [config, setConfig] = useState<RelevanceConfig>({
    apiKey: localStorage.getItem("relevance_api_key") || "",
    endpoint: localStorage.getItem("relevance_endpoint") || "",
  });
  const { toast } = useToast();

  const handleSaveConfig = () => {
    if (!config.apiKey || !config.endpoint) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("relevance_api_key", config.apiKey);
    localStorage.setItem("relevance_endpoint", config.endpoint);

    toast({
      title: "Success",
      description: "Relevance API configuration saved",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-linkedin-primary text-linkedin-primary hover:bg-linkedin-primary hover:text-white transition-colors"
        >
          <Key className="h-4 w-4 mr-2" />
          Configure API
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Relevance API Configuration
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Enter your Relevance API credentials to enable profile analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoint">API Endpoint</Label>
              <Input
                id="endpoint"
                type="text"
                placeholder="e.g., https://api.relevance.ai/latest/v1"
                value={config.endpoint}
                onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
              />
            </div>
          </div>

          <Button 
            onClick={handleSaveConfig} 
            className="w-full bg-linkedin-primary hover:bg-linkedin-hover text-white"
          >
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RelevanceLoginDialog;