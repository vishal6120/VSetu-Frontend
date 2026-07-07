import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200 mt-20 font-sans">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* TOP SECTION: Logo */}
        <div className="mb-10">
          <div className="font-extrabold text-2xl text-black flex items-center gap-2">
            <span className="bg-black text-white px-2 py-1 rounded-md">VS</span>
            VSetu
          </div>
        </div>

        {/* MIDDLE SECTION: Sirf 2 Columns (Clean & Professional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Column 1: Customer Support */}
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-4">Customer Support</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li>
                <span className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Call / WhatsApp</span>
                <div className="flex flex-col gap-2">
                  <a href="tel:+919118956453" className="flex items-center gap-2 hover:text-black transition-colors font-bold text-gray-800 text-base w-fit">
                    📞 +91 9118956453
                  </a>
                  <a href="tel:+919839352072" className="flex items-center gap-2 hover:text-black transition-colors font-bold text-gray-800 text-base w-fit">
                    📞 +91 9839352072
                  </a>
                </div>
              </li>
              <li>
                <span className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Email for Complaints</span>
                <a href="mailto:support@aapkasahayak.com" className="flex items-center gap-2 hover:text-black transition-colors font-bold text-gray-800 text-base break-all">
                  ✉️ vsetu.care@gmail.com
                </a>
                <Link to="/privacy-policy" className="text-gray-500 hover:text-blue-600 text-sm">
  Privacy Policy
</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Social Links & App */}
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-4">Social links</h4>
            <div className="flex gap-3 mb-6">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-colors">𝕏</a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors">f</a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-pink-600 hover:text-white transition-colors">Insta</a>
            </div>
            
            <div className="space-y-3">
              
              <button className="w-40 bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.736 21.055c-.244-.244-.37-.624-.37-1.127V4.086c0-.503.125-.883.37-1.127L13.9 12.012l-10.164 9.043z" />
                  <path d="M14.654 12.756l2.36 2.099-11.107 6.136c-.463.256-.84.22-1.071-.011l9.818-8.224z" />
                  <path d="M14.654 11.267L4.836 3.044c.23-.23.608-.266 1.071-.011l11.107 6.136-2.36 2.098z" />
                  <path d="M17.585 13.882l3.414-1.887c.883-.488.883-1.282 0-1.77l-3.414-1.887-2.464 2.189 2.464 2.355z" />
                </svg> 
                <div className="text-left">
                  <p className="text-[10px] leading-tight text-gray-300">GET IT ON</p>
                  <p className="text-sm font-bold leading-tight">Google Play</p>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-400 font-medium">
            * Proudly serving Lucknow, Uttar Pradesh.
          </p>
          <p className="text-xs text-gray-400 font-medium mt-1">
            © Copyright 2026 VSetu. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;