import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Linkedin, Copy, CheckCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const formatSection = (title: string, content: string) => {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  
  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        if (line.startsWith('-')) {
          return (
            <div key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{line.substring(1).trim()}</span>
            </div>
          );
        } else if (line.match(/^\d+[\.\:]?/)) {
          let [number, ...rest] = line.split(/[\.\:]\s*/);
          const content = rest.join(': ').trim();
          return (
            <div key={index}>
              <span className="font-semibold">{number}. </span>
              <span>{content}</span>
            </div>
          );
        } else {
          return <p key={index}>{line}</p>;
        }
      })}
    </div>
  );
};

interface LeadInfoProps {
  data: {
    output?: {
      profile_data?: string;
      linkedin_url?: string;
    };
  };
}

const LeadInfo = ({ data }: LeadInfoProps) => {
  const [copying, setCopying] = useState(false);
  const { toast } = useToast();

  if (!data?.output?.profile_data) return null;

  const sections = data.output.profile_data.split('\n\n').reduce<Record<string, string>>((acc, section) => {
    const [title, ...content] = section.split('\n');
    acc[title.trim()] = content.join('\n');
    return acc;
  }, {});

  // Extract profile information
  const profileLines = sections['Profielinformatie']?.split('\n') || [];
  const name = profileLines[0]?.replace('- ', '') || 'Naam niet beschikbaar';
  const function_title = profileLines[1]?.replace('- ', '') || 'Functie niet beschikbaar';
  const company = profileLines[2]?.replace('- ', '') || 'Bedrijf niet beschikbaar';

  const handleCopyAll = async () => {
    try {
      const fullContent = Object.entries(sections)
        .map(([title, content]) => `${title}\n${content}`)
        .join('\n\n');
      await navigator.clipboard.writeText(fullContent);
      setCopying(true);
      toast({
        title: "Gekopieerd",
        description: "De volledige samenvatting is gekopieerd naar het klembord.",
      });
      setTimeout(() => {
        setCopying(false);
      }, 2000);
    } catch (err) {
      toast({
        title: "Fout bij kopiëren",
        description: "Er is een fout opgetreden bij het kopiëren naar het klembord.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="summary" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <span className="font-semibold">{name}</span>
                <span className="text-gray-600">|</span>
                <span>{function_title}</span>
                <span className="text-gray-600">|</span>
                <span>{company}</span>
              </div>
              {data.output.linkedin_url && (
                <a 
                  href={data.output.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-4 text-linkedin-primary hover:text-linkedin-hover"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mt-4 space-y-6">
              {Object.entries(sections).map(([title, content]) => (
                <div key={title} className="border-t pt-4 first:border-t-0 first:pt-0">
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  {formatSection(title, content)}
                </div>
              ))}
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAll}
                  className="flex items-center gap-2"
                >
                  {copying ? (
                    <>
                      <CheckCheck className="h-4 w-4" />
                      Gekopieerd
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Kopieer volledige samenvatting
                    </>
                  )}
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default LeadInfo;