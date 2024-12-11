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
        description: "Vul alstublieft alle velden in",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("relevance_api_key", config.apiKey);
    localStorage.setItem("relevance_endpoint", config.endpoint);

    toast({
      title: "Success",
      description: "Relevance API configuratie opgeslagen",
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
            Relevance API Configuratie
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Voer je Relevance API gegevens in om profielanalyse mogelijk te maken.
            <a 
              href="https://docs.relevanceai.com/docs/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-linkedin-primary hover:underline mt-2"
            >
              <ExternalLink className="h-4 w-4" />
              Leer hoe je API gegevens kunt verkrijgen
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
                placeholder="Voer je API key in"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoint">API Endpoint</Label>
              <Input
                id="endpoint"
                type="text"
                placeholder="Bijv: https://api.relevance.ai/latest/v1"
                value={config.endpoint}
                onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
              />
            </div>
          </div>

          <Separator className="my-4" />

          <Button 
            onClick={handleSaveConfig} 
            className="w-full bg-linkedin-primary hover:bg-linkedin-hover text-white"
          >
            Configuratie Opslaan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RelevanceLoginDialog;