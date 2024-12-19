import { Info, DollarSign, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NavigationLinks = () => {
  return (
    <>
      <Link to="/about">
        <Button variant="ghost" className="flex items-center text-gray-600 hover:text-linkedin-primary">
          <Info className="h-5 w-5 mr-1" />
          About
        </Button>
      </Link>
      <Link to="/how-it-works">
        <Button variant="ghost" className="flex items-center text-gray-600 hover:text-linkedin-primary">
          <HelpCircle className="h-5 w-5 mr-1" />
          How it Works
        </Button>
      </Link>
      <Link to="/pricing">
        <Button variant="ghost" className="flex items-center text-gray-600 hover:text-linkedin-primary">
          <DollarSign className="h-5 w-5 mr-1" />
          Pricing
        </Button>
      </Link>
    </>
  );
};

export default NavigationLinks;