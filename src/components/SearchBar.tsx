import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const SearchBar = () => {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes("linkedin.com")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid LinkedIn profile URL",
        variant: "destructive",
      });
      return;
    }
    // Handle the LinkedIn URL processing here
    toast({
      title: "Processing",
      description: "Analyzing LinkedIn profile...",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            type="url"
            placeholder="Paste LinkedIn profile URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full pl-4 pr-10 py-3 rounded-full border-2 border-linkedin-primary focus:outline-none focus:border-linkedin-hover"
          />
        </div>
        <Button 
          type="submit"
          className="bg-linkedin-primary hover:bg-linkedin-hover text-white rounded-full px-8 py-3"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;