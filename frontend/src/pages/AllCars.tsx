import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VehicleCard from '../components/VehicleCard';

const ITEMS_PER_PAGE = 9;

const AllCars = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter States
  const [make, setMake] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const categories = ['All', 'Sports', 'Luxury', 'SUV', 'Electric'];

  useEffect(() => {
    fetchVehicles();
  }, [make, category, minPrice, maxPrice]); // Refetch when filters change (we can debounce if needed, but this is okay for now)

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Build query string
      const params = new URLSearchParams();
      if (make) params.append('make', make);
      if (category && category !== 'All') params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const url = params.toString()
        ? `http://localhost:5000/api/vehicles/search?${params.toString()}`
        : 'http://localhost:5000/api/vehicles';

      const response = await axios.get(url, {
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
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(vehicles.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleVehicles = vehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col">
      <Navbar />

      {/* Dashboard Header (30vh) */}
      <section className="relative w-full h-[40vh] min-h-[350px] flex items-end pb-12 overflow-hidden mt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-[#050505]/50 to-[#050505] z-0" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white">
              The <span className="text-gradient-accent">Showroom</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl">
              Browse our premium collection of luxury automobiles, filter by category, and discover
              your next vehicle.
            </p>

            {/* Elegant Filter Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Make Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Brand / Make
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Porsche, BMW..."
                      value={make}
                      onChange={(e) => {
                        setMake(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Vehicle Type
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-sm appearance-none"
                  >
                    <option value="">All Types</option>
                    {categories
                      .filter((c) => c !== 'All')
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Min Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Min amount..."
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Max Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Max amount..."
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {(make || category || minPrice || maxPrice) && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setMake('');
                      setCategory('');
                      setMinPrice('');
                      setMaxPrice('');
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold uppercase tracking-wider transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vehicle Grid Section */}
      <section className="flex-grow bg-[#050505] pb-24">
        <div className="container mx-auto px-6 md:px-12">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-12 h-12 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center max-w-2xl mx-auto">
              {error}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-24 text-gray-500 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-xl">No vehicles found matching your criteria.</p>
              <button
                onClick={() => {
                  setMake('');
                  setCategory('');
                  setMinPrice('');
                  setMaxPrice('');
                }}
                className="mt-4 text-blue-400 hover:text-blue-300 underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Vehicle Grid */}
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleVehicles.map((vehicle, idx) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center space-x-6 border-t border-white/10 pt-8">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full border ${
                      currentPage === 1
                        ? 'border-white/5 text-gray-600 cursor-not-allowed'
                        : 'border-white/20 text-white hover:bg-white/5 hover:border-white/40 transition-all'
                    }`}
                  >
                    <span>Previous</span>
                  </button>

                  <span className="text-gray-400 font-medium tracking-widest text-sm">
                    PAGE {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full border ${
                      currentPage === totalPages
                        ? 'border-white/5 text-gray-600 cursor-not-allowed'
                        : 'border-white/20 text-white hover:bg-white/5 hover:border-white/40 transition-all'
                    }`}
                  >
                    <span>Next</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllCars;
