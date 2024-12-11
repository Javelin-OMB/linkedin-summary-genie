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
          className="border-[#0FA0CE] text-[#0FA0CE] hover:bg-[#0FA0CE] hover:text-white"
        >
          <Key className="h-4 w-4 mr-2" />
          Relevance API
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Relevance API Configuration</DialogTitle>
          <DialogDescription>
            Enter your Relevance API key to enable profile analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button onClick={handleSaveApiKey} className="w-full">
            Save API Key
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RelevanceLoginDialog;