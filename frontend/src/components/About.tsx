import React from 'react';
import { motion } from 'framer-motion';
import { Car, Cpu, CreditCard } from 'lucide-react';

const features = [
  {
    title: 'Premium Collection',
    description: 'Explore luxury, sports, SUV, and sedan vehicles from world-leading brands.',
    icon: <Car className="w-6 h-6 text-blue-400" />,
  },
  {
    title: 'Smart Experience',
    description:
      'Discover detailed specifications and vehicle information through an interactive platform.',
    icon: <Cpu className="w-6 h-6 text-blue-400" />,
  },
  {
    title: 'Easy Purchase',
    description: 'Find your perfect vehicle and complete your buying journey smoothly.',
    icon: <CreditCard className="w-6 h-6 text-blue-400" />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const About = () => {
  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
              <span className="text-white">Redefining The Way You </span>
              <span className="text-gradient-accent block mt-2">Experience Cars</span>
            </h2>
          </motion.div>

          {/* Right Side */}
          <motion.div
            className="w-full lg:w-1/2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div
              variants={itemVariants}
              className="glass-card p-8 rounded-2xl mb-8 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <p className="text-gray-300 text-lg leading-relaxed relative z-10">
                CarNest is a next-generation automotive platform designed to bring luxury vehicles
                closer to customers through technology. Explore vehicles, compare specifications,
                check availability, and experience cars digitally before making your decision.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="glass p-6 rounded-xl hover:bg-white/5 transition-colors border border-white/5"
                >
                  <div className="bg-blue-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
