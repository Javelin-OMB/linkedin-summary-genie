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
    <div className="w-full space-y-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-4">
          <Input
            type="url"
            placeholder="Paste LinkedIn profile URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 pl-4 pr-4 py-6 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 bg-white shadow-sm transition-all duration-200 hover:border-blue-400"
            disabled={isLoading}
          />
          <Button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>

      <div className="text-sm text-gray-500 text-center">
        10 free searches remaining
      </div>

      {relevanceOutput && (
        <Card className="p-8 bg-white shadow-lg rounded-xl border-l-4 border-blue-500 animate-fade-in hover:shadow-xl transition-shadow duration-200">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Profile Analysis</h3>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {relevanceOutput}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;