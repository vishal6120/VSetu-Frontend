import React from 'react';

const HeroSection = () => {
  return (
    <div className="bg-blue-50 py-16 sm:py-24 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Main Tagline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 tracking-tight">
          VSetu: <span className="text-yellow-600 block sm:inline">Ghar, Factory aur Raste Ka.</span>
        </h1>
        
        {/* Sub-heading */}
        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
          Lucknow ki sabse bharosemand service. 15 minute mein emergency rescue, expert home repair, aur reliable B2B factory maintenance.
        </p>
        
        {/* Call to Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-blue-900 text-white font-bold py-3 px-8 rounded-md shadow-lg hover:bg-blue-800 transition-colors text-lg">
            🔍 Book a Service
          </button>
          <button className="bg-white text-blue-900 border-2 border-blue-900 font-bold py-3 px-8 rounded-md shadow hover:bg-gray-50 transition-colors text-lg">
            🏢 B2B Factory Maintenance
          </button>
        </div>
        
        {/* Trust Indicators (Optional small text) */}
        <p className="mt-6 text-sm text-gray-500 font-semibold">
          ✅ Verified Technicians &nbsp; | &nbsp; ⚡ Transparent Pricing &nbsp; | &nbsp; 📍 Lucknow's Own
        </p>
      </div>
    </div>
  );
};

export default HeroSection;