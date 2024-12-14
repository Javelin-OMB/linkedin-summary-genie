import { LucideIcon } from 'lucide-react';

interface NavigationMenuItemProps {
  icon: LucideIcon;
  title: string;
  onClick?: () => void;
  className?: string;
}

const NavigationMenuItem = ({ icon: Icon, title, onClick, className = '' }: NavigationMenuItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 w-full py-2 px-2 rounded-lg hover:bg-gray-100 text-gray-700 ${className}`}
    >
      <Icon className="w-5 h-5" />
      <span>{title}</span>
    </button>
  );
};

export default NavigationMenuItem;