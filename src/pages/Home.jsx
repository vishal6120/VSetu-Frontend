import React from 'react';
import HeroSection from '../components/HeroSection';
import ServicesList from '../components/ServicesList';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      {/* SABSE UPAR LAL DABBA - Pata lagane ke liye ki code chal raha hai ya nahi */}
      <div className="bg-red-600 text-white text-2xl p-5 font-bold text-center mt-20">
        🚀 AGAR YE LAAL DABBA DIKH RAHA HAI, TOH CODE UPDATE HO RAHA HAI!
      </div>

      <HeroSection />
      <ServicesList />
      <HowItWorks />
      <Footer />
    </>
  );
};

export default Home;