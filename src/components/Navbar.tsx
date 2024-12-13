import { Home, User, Info, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import LoginDialog from "./LoginDialog";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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
            <Button 
              variant="outline" 
              className="flex items-center border-linkedin-primary text-linkedin-primary hover:bg-linkedin-primary hover:text-white"
              onClick={() => setIsLoginOpen(true)}
            >
              <User className="h-5 w-5 mr-1" />
              Login
            </Button>
          </div>
        </div>
      </div>

      <LoginDialog 
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onSubmit={(email, password) => {
          console.log('Login attempt:', email);
          setIsLoginOpen(false);
        }}
      />
    </nav>
  );
};

export default Navbar;