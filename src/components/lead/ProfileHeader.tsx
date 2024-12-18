import React from 'react';
import { Linkedin } from "lucide-react";
import { AccordionTrigger } from "@/components/ui/accordion";

interface ProfileHeaderProps {
  name: string;
  functionTitle: string;
  company: string;
  linkedinUrl?: string;
}

const ProfileHeader = ({ name, functionTitle, company, linkedinUrl }: ProfileHeaderProps) => {
  return (
    <AccordionTrigger className="hover:no-underline">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <span className="font-semibold text-lg text-gray-900">{name}</span>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 hidden sm:inline">|</span>
            <span className="text-gray-700">{functionTitle}</span>
            <span className="text-gray-600 hidden sm:inline">|</span>
            <span className="text-gray-700">{company}</span>
          </div>
        </div>
        {linkedinUrl && (
          <a 
            href={linkedinUrl} 
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
  );
};

export default ProfileHeader;