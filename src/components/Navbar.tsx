import { Info, DollarSign, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#0FA0CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-semibold text-[#221F26]">LeadSummary</span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
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