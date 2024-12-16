import React from 'react';

interface ContentSectionProps {
  title: string;
  content: string[];
}

const ContentSection = ({ title, content }: ContentSectionProps) => {
  if (!content.length) return null;

  const renderContent = (line: string, index: number) => {
    // Handle numbered items (e.g., "1. Name: John Doe")
    if (line.match(/^\d+\./)) {
      const [num, ...rest] = line.split('.');
      return (
        <div key={index} className="flex gap-2 items-start">
          <span className="font-semibold text-xl min-w-[1.5rem]">{num}.</span>
          <span className="text-xl leading-relaxed">
            {rest.join('.').trim()}
          </span>
        </div>
      );
    }
    
    // Handle bullet points
    if (line.startsWith('-') || line.startsWith('•')) {
      return (
        <div key={index} className="flex gap-2 items-start ml-7">
          <span className="text-xl">•</span>
          <span className="text-xl leading-relaxed">
            {line.substring(1).trim()}
          </span>
        </div>
      );
    }
    
    // Regular text
    return (
      <p key={index} className="text-xl leading-relaxed ml-7">
        {line}
      </p>
    );
  };

  return (
    <div className="space-y-4">
      {title === "Samenvatting voor leadgeneratie" ? (
        <h2 className="text-2xl font-bold mb-6">{title}:</h2>
      ) : null}
      <div className="space-y-4">
        {content.map((line, index) => renderContent(line, index))}
      </div>
    </div>
  );
};

export default ContentSection;