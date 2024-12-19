import { Info, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NavigationLinks = () => {
  return (
    <>
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
    </>
  );
};

export default NavigationLinks;