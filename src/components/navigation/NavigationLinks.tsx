import { Link } from "react-router-dom";

const NavigationLinks = () => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <Link to="/about" className="text-gray-600 hover:text-linkedin-primary">
        About
      </Link>
      <Link to="/how-it-works" className="text-gray-600 hover:text-linkedin-primary">
        How it Works
      </Link>
      <Link to="/pricing" className="text-gray-600 hover:text-linkedin-primary">
        Pricing
      </Link>
    </div>
  );
};

export default NavigationLinks;