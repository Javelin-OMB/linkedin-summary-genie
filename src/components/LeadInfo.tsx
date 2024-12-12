import React from 'react';
import { Card } from "@/components/ui/card";

const formatSection = (title: string, content: string) => {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}:</h2>
      <div className="pl-4">
        {lines.map((line, index) => {
          if (line.startsWith('-')) {
            // Bullet points
            return (
              <div key={index} className="mb-2 flex items-start">
                <span className="mr-2">•</span>
                <span>{line.substring(1).trim()}</span>
              </div>
            );
          } else if (line.match(/^\d+[\.\:]?/)) {
            // Numbered items
            let [number, ...rest] = line.split(/[\.\:]\s*/);
            const content = rest.join(': ').trim();
            return (
              <div key={index} className="mb-2">
                <span className="font-semibold">{number}. </span>
                <span>{content}</span>
              </div>
            );
          } else {
            // Regular text
            return <p key={index} className="mb-2">{line}</p>;
          }
        })}
      </div>
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
      {/* Profielinformatie */}
      {sections['Profielinformatie'] && 
        formatSection('Profielinformatie', sections['Profielinformatie'])}

      {/* Bedrijfsinformatie */}
      {sections['Bedrijfsinformatie'] && 
        formatSection('Bedrijfsinformatie', sections['Bedrijfsinformatie'])}

      {/* LinkedIn Activiteit */}
      {sections['LinkedIn Activiteit'] && 
        formatSection('LinkedIn Activiteit', sections['LinkedIn Activiteit'])}

      {/* Website Samenvatting */}
      {sections['Website Samenvatting'] && 
        formatSection('Website Samenvatting', sections['Website Samenvatting'])}

      {/* Vergadertips */}
      {sections['Vergadertips'] && 
        formatSection('Vergadertips', sections['Vergadertips'])}

      {/* Spin Selling */}
      {sections['Spin Selling'] && 
        formatSection('Spin Selling', sections['Spin Selling'])}
    </Card>
  );
};

export default LeadInfo;