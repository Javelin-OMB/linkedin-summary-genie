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
    <div className="space-y-3">
      {lines.map((line, index) => {
        if (line.startsWith('-')) {
          return (
            <div key={index} className="flex items-start space-x-2 pl-4">
              <span className="text-brand-primary font-bold">•</span>
              <span className="text-gray-700">{line.substring(1).trim()}</span>
            </div>
          );
        } else if (line.match(/^\d+[\.\:]?/)) {
          let [number, ...rest] = line.split(/[\.\:]\s*/);
          const content = rest.join(': ').trim();
          return (
            <div key={index} className="pl-4">
              <span className="font-semibold text-brand-primary">{number}. </span>
              <span className="text-gray-700">{content}</span>
            </div>
          );
        } else {
          return <p key={index} className="text-gray-700 leading-relaxed">{line}</p>;
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

  if (!data?.output?.profile_data) {
    return null;
  }

  const sections = data.output.profile_data.split('\n').reduce((acc: Record<string, string>, line: string) => {
    if (line.trim()) {
      const firstDash = line.indexOf('-');
      if (firstDash === -1) {
        // This is a section title
        acc[line.trim()] = '';
      } else {
        // This is content for the current section
        const lastTitle = Object.keys(acc).pop() || 'Miscellaneous';
        acc[lastTitle] = acc[lastTitle] ? acc[lastTitle] + '\n' + line : line;
      }
    }
    return acc;
  }, {});

  const firstSectionContent = Object.values(sections)[0] || '';
  const profileLines = firstSectionContent.split('\n');
  const name = profileLines[0]?.replace('- ', '') || '-';
  const function_title = profileLines[1]?.replace('- ', '') || '-';
  const company = profileLines[2]?.replace('- ', '') || '-';

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
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                <span className="font-semibold text-lg text-gray-900">{name}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 hidden sm:inline">|</span>
                  <span className="text-gray-700">{function_title}</span>
                  <span className="text-gray-600 hidden sm:inline">|</span>
                  <span className="text-gray-700">{company}</span>
                </div>
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
            <div className="mt-6 space-y-8">
              {Object.entries(sections).map(([title, content], index) => (
                <div key={title} className={`${index !== 0 ? 'border-t pt-6' : ''}`}>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
                  {formatSection(title, content)}
                </div>
              ))}
              <div className="flex justify-center pt-6 border-t">
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