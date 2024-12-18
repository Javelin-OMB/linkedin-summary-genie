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
  const firstSectionContent = Object.values(sections)[0] || '';
  const profileLines = firstSectionContent.split('\n');
  return {
    name: profileLines[0]?.replace('- ', '') || '-',
    functionTitle: profileLines[1]?.replace('- ', '') || '-',
    company: profileLines[2]?.replace('- ', '') || '-',
  };
};