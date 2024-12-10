import Navbar from "@/components/Navbar";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main className="pt-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h1>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Free Trial</h2>
            <p className="text-4xl font-bold text-linkedin-primary mb-4">10 Free Searches</p>
            <p className="text-gray-600">
              Try LeadSummary with 10 free profile analyses. Contact us for enterprise pricing.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;