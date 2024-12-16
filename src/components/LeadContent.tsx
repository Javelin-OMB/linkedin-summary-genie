import React, { useState } from 'react';
import { Copy, CheckCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface LeadContentProps {
  data: any;
}

const LeadContent = ({ data }: LeadContentProps) => {
  const [copyingAll, setCopyingAll] = useState(false);
  const { toast } = useToast();
  
  console.log("LeadContent data:", data);

  if (!data?.output?.profile_data) {
    console.log("No profile data found in:", data);
    return null;
  }

  // Split the profile data into sections, handling both \n\n and single \n
  const sections = data.output.profile_data.split('\n').reduce((acc: string[], line: string) => {
    if (line.trim() === '') {
      acc.push('');
    } else if (acc.length === 0 || acc[acc.length - 1] === '') {
      acc.push(line);
    } else {
      acc[acc.length - 1] += '\n' + line;
    }
    return acc;
  }, []).filter(section => section !== '');

  const handleCopyAll = async () => {
    try {
      const allContent = sections.join('\n\n');
      await navigator.clipboard.writeText(allContent);
      setCopyingAll(true);
      toast({
        title: "Copied to clipboard",
        description: "The complete lead summary has been copied to your clipboard.",
      });
      setTimeout(() => {
        setCopyingAll(false);
      }, 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "There was an error copying to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {sections.map((section, index) => {
        const lines = section.split('\n');
        const title = lines[0];
        const content = lines.slice(1);
        
        return (
          <div key={index} className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="space-y-2">
              {content.map((line, lineIndex) => {
                if (line.trim().startsWith('-')) {
                  return (
                    <div key={lineIndex} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{line.substring(1).trim()}</span>
                    </div>
                  );
                } else if (line.match(/^\d+\./)) {
                  const [num, ...rest] = line.split('.');
                  return (
                    <div key={lineIndex}>
                      <strong>{num}.</strong>{rest.join('.')}
                    </div>
                  );
                } else {
                  return <p key={lineIndex}>{line.trim()}</p>;
                }
              })}
            </div>
          </div>
        );
      })}
      <div className="flex justify-center mt-8">
        <Button
          variant="default"
          size="lg"
          onClick={handleCopyAll}
          className="gap-2"
        >
          {copyingAll ? (
            <>
              <CheckCheck className="h-5 w-5" />
              Copied Complete Summary
            </>
          ) : (
            <>
              <Copy className="h-5 w-5" />
              Copy Complete Summary
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LeadContent;