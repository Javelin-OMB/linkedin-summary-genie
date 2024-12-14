import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchLoadingProgress from './SearchLoadingProgress';

interface LinkedInSearchFormProps {
  url: string;
  onUrlChange: (url: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  disabled: boolean;
  credits: number | null;
  isLoggedIn: boolean;
}

const LinkedInSearchForm: React.FC<LinkedInSearchFormProps> = ({
  url,
  onUrlChange,
  onAnalyze,
  loading,
  disabled,
  credits,
  isLoggedIn
}) => {
  return (
    <div className="mb-8">
      <div className="relative">
        <Input
          type="text"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Paste LinkedIn URL here..."
          className="w-full pr-24 h-12 text-lg border-[#0177B5] focus:ring-[#0177B5]"
        />
        <Button 
          onClick={onAnalyze}
          disabled={loading || disabled}
          className="absolute right-0 top-0 h-full px-6 bg-[#0177B5] hover:bg-[#0177B5]/90 text-white"
        >
          {loading ? 'Analyzing...' : !isLoggedIn ? 'Login Required' : credits === 0 ? 'No Credits' : 'Search'}
        </Button>
      </div>
      <SearchLoadingProgress isLoading={loading} />
    </div>
  );
};

export default LinkedInSearchForm;