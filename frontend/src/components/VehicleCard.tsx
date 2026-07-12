import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface VehicleCardProps {
  id: string | number;
  name: string;
  make: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  id,
  name,
  make,
  category,
  price,
  quantity,
  imageUrl = '/images/vehicle-placeholder.png',
}) => {
  let badgeText = '';
  let badgeColor = '';
  if (quantity <= 0) {
    badgeText = 'Out of Stock';
    badgeColor = 'bg-red-500/10 border-red-500/20 text-red-400 backdrop-blur-md';
  } else if (quantity <= 3) {
    badgeText = 'Limited Available';
    badgeColor = 'bg-amber-500/10 border-amber-500/20 text-amber-400 backdrop-blur-md';
  } else {
    badgeText = 'Available';
    badgeColor = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 backdrop-blur-md';
  }

  // Format price as INR
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 20px 40px -10px rgba(0,210,255,0.15)' }}
      className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group relative transition-all duration-300"
    >
      {/* Background Hover Glow Effect */}
      <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-500 pointer-events-none" />

      <Link to={`/vehicle/${id}`} className="flex flex-col flex-grow relative z-10">
        {/* Image Container */}
        <div className="relative w-full h-56 md:h-64 overflow-hidden bg-black/40 flex items-center justify-center p-6 border-b border-white/5">
          <motion.img
            src={imageUrl}
            alt={`${make} ${name}`}
            className="w-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Availability Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${badgeColor}`}>
              {badgeText}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-1 block">
                {make} • {category}
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">{name}</h3>
            </div>
          </div>

          <div className="mt-4 mb-6">
            <p className="text-2xl font-light text-gray-200">{formattedPrice}</p>
          </div>

          <div className="mt-auto">
            <button className="w-full btn-secondary glass group-hover:bg-white/10 group-hover:border-white/40 group-hover:text-white transition-all duration-300 flex items-center justify-center space-x-2">
              <span>View More</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default VehicleCard;
