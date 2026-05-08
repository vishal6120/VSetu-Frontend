import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-900 text-white shadow-md">
      {/* Container for alignment */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Side: Brand Name */}
          <div className="flex-shrink-0 flex items-center">
            <span className="font-bold text-2xl tracking-wider text-yellow-400">
              Aapka Sahayak
            </span>
          </div>

          {/* Middle: Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-yellow-400 transition font-medium">Home</a>
            <a href="#" className="hover:text-yellow-400 transition font-medium">Services</a>
            <a href="#" className="hover:text-yellow-400 transition font-medium">B2B Factory</a>
          </div>

          {/* Right Side: Emergency Button */}
          <div className="flex items-center">
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
              🚨 Emergency Help
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;