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
              <Home className="h-6 w-6 text-[#0077B5]" />
              <span className="ml-2 text-xl font-semibold text-gray-900">LeadSummary</span>
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/about" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <Info className="h-5 w-5" />
              <span>About</span>
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <span>Pricing</span>
            </Link>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-[#0077B5] text-[#0077B5] hover:bg-[#0077B5] hover:text-white"
            >
              <User className="h-5 w-5" />
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;