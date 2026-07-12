import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname === '/home') {
      const el = document.getElementById('about-us');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/home#about-us');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tighter">
          <span className="text-white">Car</span>
          <span className="text-gradient-accent">Nest</span>
        </Link>

        <div className="hidden md:flex space-x-8 items-center">
          <Link
            to="/cars"
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide"
          >
            Vehicles
          </Link>
          <a
            href="#about-us"
            onClick={handleAboutClick}
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide"
          >
            About Us
          </a>
        </div>

        <div className="hidden md:block">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="btn-secondary text-sm px-6 py-2 border-red-500/50 hover:bg-red-500/10 hover:border-red-500/80 hover:text-white text-gray-300"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="btn-secondary text-sm px-6 py-2">Sign In</button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
