import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PurchaseCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 overflow-hidden w-full">
      {/* Background Image with Parallax effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: "url('/images/cta-bg.png')" }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a] z-10" />

      <div className="container mx-auto px-6 relative z-20 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="glass-card max-w-4xl w-full p-10 md:p-16 rounded-3xl text-center relative overflow-hidden group"
        >
          {/* Soft glow effects inside the card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Find Your Dream Car Today
          </h2>

          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Browse our premium vehicle collection, explore specifications, check availability, and
            take the first step toward owning your perfect vehicle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/login')} className="btn-primary text-lg px-10 py-4">
              Explore Cars
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PurchaseCTA;
