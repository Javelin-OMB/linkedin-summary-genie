const SECTIONS = {
  PROFILE: 'Profielinformatie',
  COMPANY: 'Bedrijfsinformatie',
  WEBSITE: 'Websitegegevens',
} as const;

const PROFILE_FIELDS = {
  NAME: 1,
  FUNCTION: 2,
  COMPANY: 3,
} as const;

export const parseProfileData = (profileData: string): Record<string, string> => {
  return profileData.split('\n').reduce((acc: Record<string, string>, line: string) => {
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
};

export const extractProfileInfo = (sections: Record<string, string>) => {
  const allLines = Object.entries(sections).flatMap(([key, value]) => [key, ...value.split('\n')]);
  
  // Get values by index numbers defined in PROFILE_FIELDS
  const getValue = (index: number): string => {
    const line = allLines.find(line => line.includes(`${index}.`));
    return line ? line.split(': ')[1] || '-' : '-';
  };

  return {
    name: getValue(PROFILE_FIELDS.NAME),
    functionTitle: getValue(PROFILE_FIELDS.FUNCTION),
    company: getValue(PROFILE_FIELDS.COMPANY),
  };
};
