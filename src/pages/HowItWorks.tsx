import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation onLoginClick={() => {}} />
      <main className="pt-32 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">How It Works</h1>
          
          <div className="space-y-8">
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Create Your Account</h2>
              <p className="text-lg text-gray-600">
                Start by creating a new account or logging in if you already have one. This gives you access to our LinkedIn profile analysis tools.
              </p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Navigate to Home</h2>
              <p className="text-lg text-gray-600">
                Once logged in, you'll be automatically directed to the home page where you can start analyzing LinkedIn profiles.
              </p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Analyze LinkedIn Profiles</h2>
              <p className="text-lg text-gray-600">
                Simply paste a LinkedIn URL into the search bar. Our AI will analyze the profile, which typically takes 30-40 seconds to complete.
              </p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Get Your Summary</h2>
              <p className="text-lg text-gray-600">
                After processing, you'll receive a detailed summary of the profile with actionable insights for your sales outreach.
              </p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Continue Analyzing</h2>
              <p className="text-lg text-gray-600">
                Stay logged in to analyze more profiles. Each analysis helps you better understand your potential leads and personalize your approach.
              </p>
            </section>

            <div className="text-center mt-12">
              <Button
                onClick={() => navigate('/login?mode=signup')}
                className="bg-linkedin-primary hover:bg-linkedin-primary/90 text-black px-8 py-6 text-lg"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
