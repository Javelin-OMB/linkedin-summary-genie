import React from 'react';
import { AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Copy, CheckCheck } from "lucide-react";
import ContentSection from './ContentSection';

interface ProfileContentProps {
  sections: Record<string, string>;
  copying: boolean;
  onCopyAll: () => void;
}

const ProfileContent = ({ sections, copying, onCopyAll }: ProfileContentProps) => {
  return (
    <AccordionContent>
      <div className="mt-6 space-y-8">
        {Object.entries(sections).map(([title, content], index) => (
          <div key={title} className={`${index !== 0 ? 'border-t pt-6' : ''}`}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
            <ContentSection title={title} content={content.split('\n')} />
          </div>
        ))}
        <div className="flex justify-center pt-6 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={onCopyAll}
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
  );
};

export default ProfileContent;