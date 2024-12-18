import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import ProfileHeader from './lead/ProfileHeader';
import ProfileContent from './lead/ProfileContent';
import { parseProfileData, extractProfileInfo } from './lead/ProfileParser';

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

  const sections = parseProfileData(data.output.profile_data);
  const { name, functionTitle, company } = extractProfileInfo(sections);

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
          <ProfileHeader
            name={name}
            functionTitle={functionTitle}
            company={company}
            linkedinUrl={data.output.linkedin_url}
          />
          <ProfileContent
            sections={sections}
            copying={copying}
            onCopyAll={handleCopyAll}
          />
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default LeadInfo;