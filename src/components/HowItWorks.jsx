import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      id: "01",
      title: "Service Select Karein",
      description: "Emergency help ya normal repair, transparent pricing ke sath chunein.",
      icon: "📱"
    },
    {
      id: "02",
      title: "Expert Pahuchega",
      description: "Humara verified technician 15-30 minute mein aapki location par hoga.",
      icon: "⏱️"
    },
    {
      id: "03",
      title: "Problem Solved!",
      description: "Kaam pura hone ke baad secure payment karein aur relax karein.",
      icon: "✅"
    }
  ];

  return (
    <div className="py-16 bg-blue-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-blue-900">Kaam Kaise Karta Hai?</h2>
          <p className="mt-4 text-gray-600 font-medium">Sirf 3 aasan steps mein apni problem solve karein</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {steps.map((step) => (
            <div key={step.id} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition">
              <div className="text-5xl mb-4">{step.icon}</div>
              <div className="text-sm font-bold text-yellow-600 mb-2">STEP {step.id}</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HowItWorks;