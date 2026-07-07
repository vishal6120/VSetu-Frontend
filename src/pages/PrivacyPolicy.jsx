import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white text-gray-800 rounded-lg shadow-md mt-10 mb-10">
      <h1 className="text-3xl font-bold mb-2 border-b pb-4">Privacy Policy - VSetu</h1>
      <p className="text-sm text-gray-500 mb-6">Effective Date: July 07, 2026</p>
      
      <div className="space-y-6 leading-relaxed">
        
        <section>
          <h2 className="text-xl font-semibold mb-2 text-blue-800">1. Introduction</h2>
          <p>Welcome to VSetu. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services. We are committed to protecting your personal information and your right to privacy.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-blue-800">2. Information We Collect</h2>
          <p className="mb-2">To provide you with reliable home and industrial services, we collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Personal Information:</strong> Name, phone number, and email address provided during registration.</li>
            <li><strong>Location Data:</strong> Precise or approximate location data to connect you with nearby service professionals and navigate technicians to your address.</li>
            <li><strong>Service Data:</strong> Details about the services you book, booking history, and feedback.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-blue-800">3. How We Use Your Information</h2>
          <p className="mb-2">We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>To create and manage your account.</li>
            <li>To facilitate service bookings and dispatch technicians to your exact location.</li>
            <li>To communicate with you regarding your bookings, updates, and customer support.</li>
            <li>To improve our app functionality and user experience.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-blue-800">4. Sharing Your Information</h2>
          <p>We do not sell your personal data. We only share your necessary information (such as name, phone number, and location) with our verified service professionals (technicians) strictly for the purpose of fulfilling your requested service booking.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-blue-800">5. Data Retention & Deletion</h2>
          <p>We retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. <strong>User Data Deletion:</strong> You have the right to request the deletion of your account and personal data at any time. You can request data deletion by contacting our support team at the email provided below.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-blue-800">6. Security of Your Information</h2>
          <p>We use administrative, technical, and physical security measures to help protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-blue-800">7. Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, or if you wish to request data deletion, please contact us at:</p>
          <div className="mt-2 p-4 bg-gray-50 rounded-md border border-gray-200">
            <p><strong>Email:</strong> vsetu.care@gmail.com</p>
            <p><strong>Phone:</strong> +91 9118956453 / +91 9839352072</p>
            <p><strong>Location:</strong> Lucknow, Uttar Pradesh, India</p>
          </div>
        </section>
        
        <div className="mt-10 pt-6 border-t text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} VSetu. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;