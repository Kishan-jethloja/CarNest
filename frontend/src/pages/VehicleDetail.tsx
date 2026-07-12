import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState('');

  useEffect(() => {
    fetchVehicleDetails();
  }, [id]);

  const fetchVehicleDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/vehicles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVehicle(response.data.data?.vehicle || response.data.vehicle);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    setPurchaseLoading(true);
    setError('');
    setPurchaseSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/vehicles/${id}/purchase`,
        { quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPurchaseSuccess('Vehicle purchased successfully!');
      // Update local vehicle state to reflect new quantity
      setVehicle(response.data.data?.vehicle || response.data.vehicle);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !vehicle) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center px-6">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-8 rounded-2xl max-w-lg text-center">
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate('/cars')}
              className="mt-6 text-blue-400 hover:underline"
            >
              Return to Showroom
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isAvailable = vehicle.quantity > 0;
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 relative min-h-screen">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050505] to-[#050505] z-0 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full glass-card border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col md:flex-row relative shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Subtle glow inside card */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Left Side - Details */}
            <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative z-10 border-b md:border-b-0 md:border-r border-white/5 bg-black/20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-2">
                  <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase block mb-2">
                    {vehicle.make} • {vehicle.category}
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 text-white">
                    {vehicle.name}
                  </h1>
                </div>

                <div className="mb-8">
                  <p className="text-3xl md:text-4xl font-light text-gray-200">{formattedPrice}</p>
                </div>

                <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                  <h3 className="text-lg font-semibold mb-3 text-white">Vehicle Overview</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {vehicle.description ||
                      'Experience the pinnacle of automotive engineering. This vehicle combines breathtaking performance with unparalleled luxury, offering an unforgettable driving experience tailored for the modern enthusiast.'}
                  </p>
                </div>

                {/* Availability */}
                <div className="mb-12">
                  <span
                    className={`px-4 py-2 text-sm font-semibold rounded-lg inline-block w-max ${
                      vehicle.quantity <= 0
                        ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                        : vehicle.quantity <= 3
                          ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {vehicle.quantity <= 0
                      ? 'Out of Stock'
                      : vehicle.quantity <= 3
                        ? 'Limited Availability'
                        : 'Available'}
                  </span>
                </div>

                {error && (
                  <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                {purchaseSuccess && (
                  <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm">
                    {purchaseSuccess}
                  </div>
                )}

                <button
                  onClick={handlePurchase}
                  disabled={!isAvailable || purchaseLoading}
                  className={`w-full md:w-auto text-lg px-12 py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    !isAvailable
                      ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]'
                  }`}
                >
                  {purchaseLoading ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Purchase Vehicle</span>
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </>
                  )}
                </button>

                <div className="mt-8 text-center md:text-left">
                  <button
                    onClick={() => navigate(-1)}
                    className="text-gray-500 hover:text-gray-300 text-sm underline transition-colors"
                  >
                    &larr; Back to showroom
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Image */}
            <div className="w-full md:w-1/2 relative flex items-center justify-center p-8 lg:p-16 bg-gradient-to-br from-white/5 to-transparent">
              {/* Decorative background circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

              <motion.img
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                src={vehicle.image_url || '/images/vehicle-placeholder.png'}
                alt={vehicle.name}
                className="w-full h-auto max-w-2xl object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10"
              />
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VehicleDetail;
