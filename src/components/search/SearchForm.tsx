import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import SearchLoadingProgress from "../SearchLoadingProgress";

interface SearchFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
  session: any;
  navigate: (path: string) => void;
}

const SearchForm = ({ onSubmit, isLoading, session, navigate }: SearchFormProps) => {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL format
    if (!url.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a LinkedIn profile URL",
        variant: "destructive",
      });
      return;
    }

    if (!url.includes("linkedin.com")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid LinkedIn profile URL",
        variant: "destructive",
      });
      return;
    }

    if (!session) {
      console.log('No session found, redirecting to login');
      navigate('/login');
      return;
    }

    await onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Input
            type="url"
            placeholder="Paste LinkedIn profile URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full pl-4 pr-10 py-3 rounded-full border-2 border-linkedin-primary focus:outline-none focus:border-linkedin-hover"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit"
          className="w-full sm:w-auto bg-linkedin-primary hover:bg-linkedin-hover text-white rounded-full px-8 py-3"
          disabled={isLoading}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
      <SearchLoadingProgress isLoading={isLoading} />
    </form>
  );
};

export default SearchForm;