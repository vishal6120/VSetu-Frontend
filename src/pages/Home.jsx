import React from 'react';
import HeroSection from '../components/HeroSection';
import ServicesList from '../components/ServicesList';
import HowItWorks from '../components/HowItWorks';

const Home = () => {
  return (
    <>
      <HeroSection />
      <ServicesList />
      <HowItWorks />
    </>
  );
};

export default Home;