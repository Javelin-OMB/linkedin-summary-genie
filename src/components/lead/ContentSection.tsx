import React from 'react';

interface ContentSectionProps {
  title: string;
  content: string[];
}

const ContentSection = ({ title, content }: ContentSectionProps) => {
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
                <span className="text-gray-700 text-base leading-relaxed">
                  {rest.join('.').trim()}
                </span>
              </div>
            );
          }
          // Handle bullet points
          else if (line.startsWith('-') || line.startsWith('•')) {
            return (
              <div key={index} className="flex gap-3 pl-2">
                <span className="text-gray-500">•</span>
                <span className="text-gray-700 text-base leading-relaxed">
                  {line.substring(1).trim()}
                </span>
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

export default ContentSection;