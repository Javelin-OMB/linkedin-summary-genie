import Navbar from "@/components/Navbar";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main className="pt-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About LeadSummary</h1>
          <p className="text-lg text-gray-600">
            LeadSummary helps sales professionals prepare for meetings by providing instant insights from LinkedIn profiles. 
            Get personalized conversation starters and DISC-based communication tips to make meaningful connections.
          </p>
        </div>
      </main>
    </div>
  );
};

export default About;