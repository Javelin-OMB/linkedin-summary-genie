import React from 'react';
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const formatSection = (title: string, content: string) => {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  
  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        if (line.startsWith('-')) {
          // Bullet points
          return (
            <div key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{line.substring(1).trim()}</span>
            </div>
          );
        } else if (line.match(/^\d+[\.\:]?/)) {
          // Numbered items
          let [number, ...rest] = line.split(/[\.\:]\s*/);
          const content = rest.join(': ').trim();
          return (
            <div key={index}>
              <span className="font-semibold">{number}. </span>
              <span>{content}</span>
            </div>
          );
        } else {
          // Regular text
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
    };
  };
}

const LeadInfo = ({ data }: LeadInfoProps) => {
  if (!data?.output?.profile_data) return null;

  // Split the profile data into sections
  const sections = data.output.profile_data.split('\n\n').reduce<Record<string, string>>((acc, section) => {
    const [title, ...content] = section.split('\n');
    acc[title.trim()] = content.join('\n');
    return acc;
  }, {});

  return (
    <Card className="p-6 bg-white shadow-lg">
      <Accordion type="single" collapsible>
        <AccordionItem value="profielinformatie" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <h2 className="text-xl font-bold">Profielinformatie</h2>
          </AccordionTrigger>
          <AccordionContent>
            {sections['Profielinformatie'] && 
              formatSection('Profielinformatie', sections['Profielinformatie'])}
          </AccordionContent>
        </AccordionItem>

        {/* Additional sections in accordion */}
        {sections['Bedrijfsinformatie'] && (
          <AccordionItem value="bedrijfsinformatie" className="border-none">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-xl font-bold">Bedrijfsinformatie</h2>
            </AccordionTrigger>
            <AccordionContent>
              {formatSection('Bedrijfsinformatie', sections['Bedrijfsinformatie'])}
            </AccordionContent>
          </AccordionItem>
        )}

        {sections['LinkedIn Activiteit'] && (
          <AccordionItem value="linkedin-activiteit" className="border-none">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-xl font-bold">LinkedIn Activiteit</h2>
            </AccordionTrigger>
            <AccordionContent>
              {formatSection('LinkedIn Activiteit', sections['LinkedIn Activiteit'])}
            </AccordionContent>
          </AccordionItem>
        )}

        {sections['Website Samenvatting'] && (
          <AccordionItem value="website-samenvatting" className="border-none">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-xl font-bold">Website Samenvatting</h2>
            </AccordionTrigger>
            <AccordionContent>
              {formatSection('Website Samenvatting', sections['Website Samenvatting'])}
            </AccordionContent>
          </AccordionItem>
        )}

        {sections['Vergadertips'] && (
          <AccordionItem value="vergadertips" className="border-none">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-xl font-bold">Vergadertips</h2>
            </AccordionTrigger>
            <AccordionContent>
              {formatSection('Vergadertips', sections['Vergadertips'])}
            </AccordionContent>
          </AccordionItem>
        )}

        {sections['Spin Selling'] && (
          <AccordionItem value="spin-selling" className="border-none">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-xl font-bold">Spin Selling</h2>
            </AccordionTrigger>
            <AccordionContent>
              {formatSection('Spin Selling', sections['Spin Selling'])}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </Card>
  );
};

export default LeadInfo;