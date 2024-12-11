import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RelevanceLoginDialog from "./RelevanceLoginDialog";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-gray-900 hover:text-linkedin-primary transition-colors">
              LeadSummary
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <RelevanceLoginDialog />
            <Button 
              variant="outline" 
              size="sm"
              className="border-linkedin-primary text-linkedin-primary hover:bg-linkedin-primary hover:text-white transition-colors"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;