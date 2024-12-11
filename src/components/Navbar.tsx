import { Home, User, Info, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Home className="h-6 w-6 text-linkedin-primary" />
              <span className="ml-2 text-xl font-semibold text-linkedin-primary">LeadSummary</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/about">
              <Button variant="ghost" className="flex items-center">
                <Info className="h-5 w-5 mr-1" />
                About
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="ghost" className="flex items-center">
                <DollarSign className="h-5 w-5 mr-1" />
                Pricing
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="flex items-center border-linkedin-primary text-linkedin-primary hover:bg-linkedin-primary hover:text-white">
                <User className="h-5 w-5 mr-1" />
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