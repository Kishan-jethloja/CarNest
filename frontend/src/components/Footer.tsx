import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#050505] py-8 border-t border-white/10">
      <div className="container mx-auto px-6 text-center">
        <Link to="/" className="text-2xl font-bold tracking-tighter block mb-2">
          <span className="text-white">Car</span>
          <span className="text-gradient-accent">Nest</span>
        </Link>
        <p className="text-gray-500 text-sm">&copy; 2026 CarNest. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
