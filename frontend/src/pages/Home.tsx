import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VehicleCard from '../components/VehicleCard';

const Home = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedVehicles();

    // Handle hash navigation
    if (window.location.hash === '#about-us') {
      setTimeout(() => {
        const el = document.getElementById('about-us');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, []);

  const fetchFeaturedVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/vehicles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data =
        response.data.data?.vehicles ||
        response.data.vehicles ||
        response.data.data ||
        response.data ||
        [];
      // Only take the first 3 cars for the Home page
      const allVehicles = Array.isArray(data) ? data : [];
      setVehicles(allVehicles.slice(0, 3));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load featured vehicles');
    } finally {
      setLoading(false);
    }
  };

  const scrollToVehicles = () => {
    const el = document.getElementById('featured-vehicles');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      <Navbar />

      {/* Hero Section (100vh) */}
      <section className="relative w-full h-screen flex items-center overflow-hidden">
        {/* Cinematic Background */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, ease: 'easeOut' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/home-hero.png')" }}
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-10" />
          <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay z-10" />
        </motion.div>

        {/* Particles */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"
          />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-20">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight text-white drop-shadow-2xl"
            >
              Find Your <br />
              <span className="text-gradient-accent">Dream Car</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed font-light drop-shadow-md"
            >
              Explore luxury vehicles, compare specifications, and experience premium cars from the
              comfort of your home.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button onClick={scrollToVehicles} className="btn-primary text-lg px-8 py-4">
                Explore Cars
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section (Exactly 3 cars) */}
      <section id="featured-vehicles" className="py-32 relative bg-[#050505]">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
              Featured Vehicles
            </h2>
            <p className="text-gray-400 text-lg">A curated selection of our most premium models.</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-12 h-12 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center max-w-2xl mx-auto">
              {error}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-24 text-gray-500">
              <p className="text-xl">No vehicles available at the moment.</p>
            </div>
          ) : (
            <>
              {/* Grid of exactly 3 cars */}
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {vehicles.map((vehicle, idx) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                  >
                    <VehicleCard
                      id={vehicle.id}
                      name={vehicle.name}
                      make={vehicle.make}
                      category={vehicle.category}
                      price={vehicle.price}
                      quantity={vehicle.quantity}
                      imageUrl={vehicle.image_url}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* See All Cars Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-20 text-center"
              >
                <button
                  onClick={() => navigate('/cars')}
                  className="btn-secondary text-lg px-12 py-4 border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/80 text-white"
                >
                  See All Cars
                </button>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about-us"
        className="py-32 relative bg-[#0a0a0a] border-t border-white/5 overflow-hidden"
      >
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
                Redefining the <span className="text-gradient-accent">Automotive</span> Experience
              </h2>

              <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
                <p>
                  At CarNest, we believe that purchasing a premium vehicle should be as exceptional
                  as the vehicle itself. Founded with a vision to modernize the dealership
                  experience, we blend cutting-edge technology with unparalleled customer service.
                </p>
                <p>
                  Our curated selection of luxury, sports, and electric vehicles represents the
                  pinnacle of automotive engineering. We meticulously inspect and verify every
                  vehicle in our inventory to ensure it meets our uncompromising standards.
                </p>
                <p>
                  Whether you are seeking the thrilling performance of a supercar or the refined
                  elegance of a luxury sedan, CarNest provides a seamless, transparent, and
                  sophisticated journey from discovery to delivery.
                </p>
              </div>

              <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16">
                <div>
                  <h4 className="text-3xl font-bold text-white mb-1">10+</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">
                    Premium Brands
                  </p>
                </div>
                <div className="hidden md:block w-px bg-white/10" />
                <div>
                  <h4 className="text-3xl font-bold text-white mb-1">100%</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">
                    Verified Cars
                  </p>
                </div>
                <div className="hidden md:block w-px bg-white/10" />
                <div>
                  <h4 className="text-3xl font-bold text-white mb-1">24/7</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">
                    Concierge
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
