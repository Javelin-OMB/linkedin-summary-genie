import { Info, DollarSign, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold text-[#221F26]">LeadSummary</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/about" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <Info className="h-4 w-4" />
              About
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pricing
            </Link>
            <Button 
              variant="outline" 
              size="sm"
              className="border-[#0FA0CE] text-[#0FA0CE] hover:bg-[#0FA0CE] hover:text-white"
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;