import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";

const Index = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    // API call logica hier
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-linkedin-primary mb-6">
              Get instant insights and conversation starters from any LinkedIn profile
            </h1>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste LinkedIn URL here..."
                className="w-full pr-24 h-12 text-lg"
              />
              <Button 
                onClick={handleAnalyze}
                disabled={loading || !url}
                className="absolute right-0 top-0 h-full px-6 bg-linkedin-primary hover:bg-linkedin-primary/90 text-white"
              >
                {loading ? 'Analyzing...' : 'Search'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;