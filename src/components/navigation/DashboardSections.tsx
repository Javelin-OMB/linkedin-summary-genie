import { LayoutDashboard, CreditCard, History, Settings } from 'lucide-react';
import NavigationMenuItem from './NavigationMenuItem';

interface DashboardSectionsProps {
  onSectionChange: (section: string) => void;
  onClose?: () => void;
}

const dashboardSections = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    section: "overview"
  },
  {
    title: "Plan",
    icon: CreditCard,
    section: "plan"
  },
  {
    title: "Recent Leadsummaries",
    icon: History,
    section: "analyses"
  },
  {
    title: "Settings",
    icon: Settings,
    section: "settings"
  }
];

const DashboardSections = ({ onSectionChange, onClose }: DashboardSectionsProps) => {
  const handleSectionClick = (section: string) => {
    onSectionChange(section);
    onClose?.();
  };

  return (
    <div className="pt-4 border-t">
      <h3 className="text-sm font-semibold text-gray-500 mb-4">Dashboard Sections</h3>
      {dashboardSections.map((item) => (
        <NavigationMenuItem
          key={item.section}
          icon={item.icon}
          title={item.title}
          onClick={() => handleSectionClick(item.section)}
        />
      ))}
    </div>
  );
};

export default DashboardSections;