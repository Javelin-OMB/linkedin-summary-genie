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
import { Key, ExternalLink } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface RelevanceConfig {
  apiKey: string;
  projectId: string;
  region: string;
  authToken: string;
}

const RelevanceLoginDialog = () => {
  const [config, setConfig] = useState<RelevanceConfig>({
    apiKey: localStorage.getItem("relevance_api_key") || "",
    projectId: localStorage.getItem("relevance_project_id") || "",
    region: localStorage.getItem("relevance_region") || "",
    authToken: localStorage.getItem("relevance_auth_token") || "",
  });
  const { toast } = useToast();

  const handleSaveConfig = () => {
    if (!config.apiKey || !config.projectId || !config.region || !config.authToken) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("relevance_api_key", config.apiKey);
    localStorage.setItem("relevance_project_id", config.projectId);
    localStorage.setItem("relevance_region", config.region);
    localStorage.setItem("relevance_auth_token", config.authToken);

    toast({
      title: "Success",
      description: "Relevance API configuration saved successfully",
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
          Relevance API
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Relevance API Configuration
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Enter your Relevance API credentials to enable profile analysis.
            <a 
              href="https://docs.relevanceai.com/docs/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-linkedin-primary hover:underline mt-2"
            >
              <ExternalLink className="h-4 w-4" />
              Learn how to get your API credentials
            </a>
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
              <Label htmlFor="projectId">Project ID</Label>
              <Input
                id="projectId"
                type="text"
                placeholder="Enter your Project ID"
                value={config.projectId}
                onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                type="text"
                placeholder="e.g., f1db6c"
                value={config.region}
                onChange={(e) => setConfig({ ...config, region: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authToken">Authorization Token</Label>
              <Input
                id="authToken"
                type="password"
                placeholder="ProjectId:APIKey format"
                value={config.authToken}
                onChange={(e) => setConfig({ ...config, authToken: e.target.value })}
              />
            </div>
          </div>

          <Separator className="my-4" />

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