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
    <div className="space-y-8">
      <Card className="p-8 bg-white shadow-lg rounded-2xl border-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-3">
            <Input
              type="url"
              placeholder="Enter LinkedIn URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-14 text-lg rounded-xl border-gray-200 focus:border-linkedin-primary focus:ring-linkedin-primary"
              disabled={isLoading}
            />
            <Button 
              type="submit"
              disabled={isLoading}
              className="h-14 px-8 bg-linkedin-primary hover:bg-linkedin-hover rounded-xl text-lg font-medium transition-all duration-200 hover:shadow-md"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              ) : (
                <Search className="h-6 w-6" />
              )}
            </Button>
          </div>
        </form>

        {relevanceOutput && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl animate-fade-in">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Profile Analysis</h3>
            <div className="text-gray-700 leading-relaxed">
              {relevanceOutput}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SearchBar;