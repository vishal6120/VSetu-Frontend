// PrivacyPolicy.jsx ka naya version VSetu ke naam ke sath
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white text-gray-800 rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 border-b pb-2">Privacy Policy & Terms of Service - VSetu</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>Welcome to VSetu. By using our application, you agree to these terms. We connect users with trusted home and industrial service professionals.</p>
        </section>
        
        {/* Baki sections mein bhi aap VSetu use kijiye */}
        
        <div className="mt-8 pt-4 border-t text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} VSetu. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;