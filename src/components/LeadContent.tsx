import React, { useState } from 'react';
import { Copy, CheckCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface LeadContentProps {
  data: any;
}

const LeadContent = ({ data }: LeadContentProps) => {
  const [copying, setCopying] = useState<{ [key: number]: boolean }>({});
  const { toast } = useToast();
  
  if (!data?.output?.profile_data) return null;

  const sections = data.output.profile_data.split('\n\n');
  
  const handleCopy = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopying(prev => ({ ...prev, [index]: true }));
      toast({
        title: "Copied to clipboard",
        description: "The lead summary has been copied to your clipboard.",
      });
      setTimeout(() => {
        setCopying(prev => ({ ...prev, [index]: false }));
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
        const [title, ...content] = section.split('\n');
        return (
          <div key={index} className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="space-y-2">
              {content.map((line, lineIndex) => {
                if (line.startsWith('-')) {
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
                  return <p key={lineIndex}>{line}</p>;
                }
              })}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(section, index)}
                className="gap-2"
              >
                {copying[index] ? (
                  <>
                    <CheckCheck className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeadContent;