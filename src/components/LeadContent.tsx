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

  // Split the profile data into main sections
  const sections = {
    samenvatting: [] as string[],
    profielinformatie: [] as string[],
    bedrijfsinformatie: [] as string[],
    linkedinActiviteit: [] as string[],
    websiteSamenvatting: [] as string[],
    vergadertips: [] as string[],
    spinVragen: [] as string[]
  };

  // Parse the profile data
  const lines = data.output.profile_data.split('\n');
  let currentSection = 'samenvatting';

  lines.forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    if (trimmedLine.toLowerCase().includes('profielinformatie')) {
      currentSection = 'profielinformatie';
    } else if (trimmedLine.toLowerCase().includes('bedrijfsinformatie')) {
      currentSection = 'bedrijfsinformatie';
    } else if (trimmedLine.toLowerCase().includes('linkedin-activiteit')) {
      currentSection = 'linkedinActiviteit';
    } else if (trimmedLine.toLowerCase().includes('website samenvatting')) {
      currentSection = 'websiteSamenvatting';
    } else if (trimmedLine.toLowerCase().includes('vergadertips')) {
      currentSection = 'vergadertips';
    } else if (trimmedLine.toLowerCase().includes('spin-selling vragen')) {
      currentSection = 'spinVragen';
    } else {
      sections[currentSection].push(trimmedLine);
    }
  });

  const handleCopyAll = async () => {
    try {
      const allContent = Object.entries(sections)
        .map(([title, content]) => `${title}:\n${content.join('\n')}`)
        .join('\n\n');
      await navigator.clipboard.writeText(allContent);
      setCopyingAll(true);
      toast({
        title: "Gekopieerd",
        description: "De volledige samenvatting is gekopieerd naar het klembord.",
      });
      setTimeout(() => {
        setCopyingAll(false);
      }, 2000);
    } catch (err) {
      toast({
        title: "Fout bij kopiëren",
        description: "Er is een fout opgetreden bij het kopiëren naar het klembord.",
        variant: "destructive",
      });
    }
  };

  const renderSection = (title: string, content: string[]) => {
    if (!content.length) return null;

    return (
      <div className="space-y-3 border-t pt-4 first:border-t-0 first:pt-0">
        <h3 className="font-bold text-xl text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {content.map((line, index) => {
            // Handle numbered items
            if (line.match(/^\d+\./)) {
              const [num, ...rest] = line.split('.');
              return (
                <div key={index} className="flex gap-3">
                  <span className="font-semibold min-w-[24px]">{num}.</span>
                  <span className="text-gray-700 text-base leading-relaxed">{rest.join('.').trim()}</span>
                </div>
              );
            }
            // Handle bullet points
            else if (line.startsWith('-') || line.startsWith('•')) {
              return (
                <div key={index} className="flex gap-3 pl-2">
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-700 text-base leading-relaxed">{line.substring(1).trim()}</span>
                </div>
              );
            }
            // Regular text
            return (
              <p key={index} className="text-gray-700 text-base leading-relaxed">
                {line}
              </p>
            );
          })}
        </div>
      </div>
    );
  };

  const sectionTitles = {
    samenvatting: "Samenvatting voor leadgeneratie",
    profielinformatie: "Profielinformatie",
    bedrijfsinformatie: "Bedrijfsinformatie",
    linkedinActiviteit: "LinkedIn-activiteit",
    websiteSamenvatting: "Website Samenvatting",
    vergadertips: "Vergadertips",
    spinVragen: "SPIN-selling vragen"
  };

  return (
    <div className="space-y-6 bg-white rounded-lg p-8 shadow-lg">
      {Object.entries(sections).map(([key, content]) => 
        renderSection(sectionTitles[key as keyof typeof sectionTitles], content)
      )}

      <div className="flex justify-center mt-8 border-t pt-6">
        <Button
          variant="outline"
          size="lg"
          onClick={handleCopyAll}
          className="gap-2"
        >
          {copyingAll ? (
            <>
              <CheckCheck className="h-5 w-5" />
              Gekopieerd
            </>
          ) : (
            <>
              <Copy className="h-5 w-5" />
              Kopieer volledige samenvatting
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LeadContent;