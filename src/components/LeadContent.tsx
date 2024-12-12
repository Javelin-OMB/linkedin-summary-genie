import React from 'react';

interface LeadContentProps {
  data: any;
}

const LeadContent = ({ data }: LeadContentProps) => {
  if (!data?.output?.profile_data) return null;

  const sections = data.output.profile_data.split('\n\n');
  
  return (
    <div className="space-y-8">
      {sections.map((section, index) => {
        const [title, ...content] = section.split('\n');
        return (
          <div key={index} className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="space-y-2">
              {content.map((line, lineIndex) => {
                if (line.startsWith('-')) {
                  return (
                    <div key={lineIndex} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{line.substring(1).trim()}</span>
                    </div>
                  );
                } else if (line.match(/^\d+\./)) {
                  const [num, ...rest] = line.split('.');
                  return (
                    <div key={lineIndex}>
                      <strong>{num}.</strong>{rest.join('.')}
                    </div>
                  );
                } else {
                  return <p key={lineIndex}>{line}</p>;
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeadContent;