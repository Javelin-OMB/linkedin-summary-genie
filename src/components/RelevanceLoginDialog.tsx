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

const RelevanceLoginDialog = () => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("relevance_api_key", apiKey);
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
    setApiKey("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-[#0FA0CE] text-[#0FA0CE] hover:bg-[#0FA0CE] hover:text-white transition-colors duration-200"
        >
          <Key className="h-4 w-4 mr-2" />
          Relevance API
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">Relevance API Configuration</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Enter your Relevance API key to enable profile analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <Input
            type="password"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full py-2 px-4 rounded-lg border border-gray-200 focus:border-[#0FA0CE] focus:ring-[#0FA0CE] transition-all duration-200"
          />
          <Button 
            onClick={handleSaveApiKey} 
            className="w-full bg-[#0FA0CE] hover:bg-[#0FA0CE]/90 text-white py-2 rounded-lg transition-all duration-200"
          >
            Save API Key
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RelevanceLoginDialog;