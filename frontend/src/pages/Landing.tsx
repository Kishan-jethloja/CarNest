import React from 'react';
import LandingNavbar from '../components/LandingNavbar';
import Hero from '../components/Hero';
import About from '../components/About';
import BrandCarousel from '../components/BrandCarousel';
import PurchaseCTA from '../components/PurchaseCTA';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <LandingNavbar />
      <Hero />
      <About />
      <BrandCarousel />
      <PurchaseCTA />
      <Footer />
    </div>
  );
};

export default Landing;
