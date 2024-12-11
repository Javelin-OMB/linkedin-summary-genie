import Navbar from "@/components/Navbar";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We help sales professionals and recruiters get instant insights about their LinkedIn prospects.
          </p>
        </div>
      </main>
    </div>
  );
};

export default About;