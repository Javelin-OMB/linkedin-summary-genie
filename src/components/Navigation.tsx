import { Button } from "@/components/ui/button";
import { Menu, Home } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navigation = () => {
  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo + Text */}
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-[#0177B5]" />
            <span className="text-xl font-semibold text-[#0177B5]">LeadSummary</span>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/about" className="text-gray-600 hover:text-[#0177B5]">About</a>
            <a href="/pricing" className="text-gray-600 hover:text-[#0177B5]">Pricing</a>
            <Button 
              variant="outline" 
              onClick={() => console.log('Login clicked')}
              className="text-[#0177B5] border-[#0177B5] hover:bg-[#0177B5] hover:text-white"
            >
              Login
            </Button>
          </div>

          {/* Mobile navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => console.log('Login clicked')}
              className="text-[#0177B5] border-[#0177B5] hover:bg-[#0177B5] hover:text-white"
            >
              Login
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#0177B5]">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col space-y-4 mt-8">
                  <a href="/about" className="text-lg hover:text-[#0177B5]">About</a>
                  <a href="/pricing" className="text-lg hover:text-[#0177B5]">Pricing</a>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <a href="/features" className="text-lg hover:text-[#0177B5]">Features</a>
                  <a href="/contact" className="text-lg hover:text-[#0177B5]">Contact</a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;