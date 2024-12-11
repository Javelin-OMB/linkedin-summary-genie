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
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-4">
          <Input
            type="url"
            placeholder="Paste LinkedIn profile URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 pl-4 pr-4 py-6 text-lg rounded-lg border border-gray-200 focus:border-[#0FA0CE] focus:ring-[#0FA0CE] focus:ring-1 bg-white shadow-sm"
            disabled={isLoading}
          />
          <Button 
            type="submit"
            className="bg-[#0FA0CE] hover:bg-[#0FA0CE]/90 text-white px-8 py-6 rounded-lg shadow-sm"
            disabled={isLoading}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </form>

      <div className="text-sm text-gray-500 text-center">
        10 free searches remaining
      </div>

      {relevanceOutput && (
        <Card className="p-6 mt-8 bg-white shadow-sm border-l-4 border-[#0FA0CE]">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">Profile Analysis</h3>
            <div className="whitespace-pre-wrap text-gray-700">
              {relevanceOutput}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;