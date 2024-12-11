import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { processWithRelevance } from "@/services/relevanceService";
import { Card } from "@/components/ui/card";

const SearchBar = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [relevanceOutput, setRelevanceOutput] = useState<string | null>(null);
  const { toast } = useToast();

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

    setIsLoading(true);
    try {
      const output = await processWithRelevance(url);
      setRelevanceOutput(output);
      toast({
        title: "Success",
        description: "Profile analysis complete",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze profile",
        variant: "destructive",
      });
      setRelevanceOutput(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="LinkedIn URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12"
            disabled={isLoading}
          />
          <Button 
            type="submit"
            disabled={isLoading}
            className="h-12 px-6"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>

      {relevanceOutput && (
        <Card className="p-6 bg-white">
          <div className="prose max-w-none">
            <h3 className="text-lg font-medium mb-2">Profile Analysis</h3>
            <div className="text-gray-700">
              {relevanceOutput}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;