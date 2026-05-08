import React from 'react';
import { Link } from 'react-router-dom'; // STEP A: Yeh import add karein

const ServicesList = () => {
  // ... (aapka pehle wala services array waisa hi rahega) ...
  const services = [
    {
      id: 1,
      title: "🚨 Emergency Roadside",
      description: "Gaadi breakdown, puncture, ya towing support. 15 mins ETA.",
      bgColor: "bg-red-50 border-red-200",
      textColor: "text-red-700"
    },
    {
      id: 2,
      title: "⚡ Electrical Repair",
      description: "Short-circuit, wiring, aur appliances ki expert repairing.",
      bgColor: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700"
    },
    {
      id: 3,
      title: "🏢 Factory Maintenance",
      description: "B2B AMC, heavy machinery wiring aur regular checkups.",
      bgColor: "bg-gray-50 border-gray-200",
      textColor: "text-gray-700"
    },
    {
      id: 4,
      title: "🚰 Plumbing Support",
      description: "Leakage, pipe burst aur motor repairing service.",
      bgColor: "bg-cyan-50 border-cyan-200",
      textColor: "text-cyan-700"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-blue-900 sm:text-4xl">Aapki Zaroorat, Humari Service</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service.id} className={`border rounded-xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300 ${service.bgColor}`}>
              <h3 className={`text-xl font-bold mb-3 ${service.textColor}`}>{service.title}</h3>
              <p className="text-gray-600 mb-6 font-medium">{service.description}</p>
              
              {/* STEP B: Button ko Link mein badal diya */}
              <Link to="/book" className="text-blue-900 font-bold text-sm border-b-2 border-blue-900 pb-1 hover:text-blue-700 transition inline-block">
                Book Now &rarr;
              </Link>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default ServicesList;