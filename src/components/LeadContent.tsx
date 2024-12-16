import React from 'react';
import { parseProfileData, sectionTitles } from '@/utils/leadContentUtils';
import ContentSection from './lead/ContentSection';
import CopyButton from './lead/CopyButton';

interface LeadContentProps {
  data: any;
}

const LeadContent = ({ data }: LeadContentProps) => {
  console.log("LeadContent data:", data);

  if (!data?.output?.profile_data) {
    console.log("No profile data found in:", data);
    return null;
  }

  const sections = parseProfileData(data.output.profile_data);

  const handleCopyAll = async () => {
    const allContent = Object.entries(sections)
      .map(([key, content]) => `${sectionTitles[key as keyof typeof sectionTitles]}:\n${content.join('\n')}`)
      .join('\n\n');
    await navigator.clipboard.writeText(allContent);
  };

  return (
    <div className="space-y-6 bg-white rounded-lg p-8 shadow-lg">
      {Object.entries(sections).map(([key, content]) => (
        <ContentSection
          key={key}
          title={sectionTitles[key as keyof typeof sectionTitles]}
          content={content}
        />
      ))}

      <div className="flex justify-center mt-8 border-t pt-6">
        <CopyButton onCopy={handleCopyAll} />
      </div>
    </div>
  );
};

export default LeadContent;