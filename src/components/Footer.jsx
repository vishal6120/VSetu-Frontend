import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & About */}
          <div>
            <h3 className="text-2xl font-bold text-yellow-400 tracking-wider mb-4">Aapka Sahayak</h3>
            <p className="text-sm text-gray-400">
              Lucknow ki apni reliable service platform. Ghar ki repairs se lekar factory maintenance aur emergency roadside assistance tak, hum hamesha taiyar hain.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-yellow-400 transition">Home</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">All Services</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">B2B Factory Solutions</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">About Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 Lucknow, Uttar Pradesh</li>
              <li>📞 +91 98765 43210 (24/7 Emergency)</li>
              <li>✉️ support@aapkasahayk.in</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-900 mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Aapka Sahayak. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;