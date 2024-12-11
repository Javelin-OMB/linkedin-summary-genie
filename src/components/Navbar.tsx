import { Home, Info, DollarSign, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Home className="h-6 w-6 text-linkedin-primary" />
              <span className="ml-2 text-xl font-semibold text-gray-900">LeadSummary</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Link to="/about">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Info className="h-4 w-4 mr-2" />
                About
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <DollarSign className="h-4 w-4 mr-2" />
                Pricing
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                variant="outline" 
                size="sm"
                className="border-linkedin-primary text-linkedin-primary hover:bg-linkedin-primary hover:text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;