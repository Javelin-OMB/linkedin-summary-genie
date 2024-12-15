import { Link } from "react-router-dom";

const NavigationLinks = () => {
  return (
    <>
      <Link to="/about" className="text-gray-600 hover:text-linkedin-primary">About</Link>
      <Link to="/pricing" className="text-gray-600 hover:text-linkedin-primary">Pricing</Link>
    </>
  );
};

export default NavigationLinks;