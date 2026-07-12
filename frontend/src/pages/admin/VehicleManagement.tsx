import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Edit2,
  Trash2,
  PlusCircle,
  PackagePlus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import { useAdminStore } from '../../store/adminStore';
import EditVehicleModal from '../../components/admin/EditVehicleModal';
import DeleteModal from '../../components/admin/DeleteModal';
import RestockModal from '../../components/admin/RestockModal';

const ITEMS_PER_PAGE = 10;

const VehicleManagement = () => {
  const navigate = useNavigate();
  const { vehicles, loading, error, fetchVehicles, updateVehicle, deleteVehicle, restockVehicle } =
    useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<any>(null);
  const [restockingVehicle, setRestockingVehicle] = useState<any>(null);

  const filters = ['All', 'Sports', 'SUV', 'Sedan', 'Luxury', 'Electric'];
  const availabilityFilters = ['All', 'Available', 'Out of Stock'];

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Filter logic
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.make.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeFilter === 'All' || v.category?.toLowerCase() === activeFilter.toLowerCase();

    let matchesAvailability = true;
    if (availabilityFilter === 'Available') matchesAvailability = v.quantity > 0;
    if (availabilityFilter === 'Out of Stock') matchesAvailability = v.quantity === 0;

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleVehicles = filteredVehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-24 md:pt-10 overflow-y-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Vehicle Management</h1>
            <p className="text-gray-400 text-sm">View, edit, and manage your premium inventory.</p>
          </div>

          <button
            onClick={() => navigate('/admin/add-vehicle')}
            className="btn-primary px-6 py-2.5 rounded-xl flex items-center space-x-2 text-sm w-max shadow-lg shadow-blue-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl mb-6 flex flex-col xl:flex-row gap-4 justify-between items-center relative z-10">
          <div className="relative w-full xl:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full xl:w-auto">
            <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 overflow-x-auto hide-scrollbar">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setActiveFilter(f);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeFilter === f ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
              {availabilityFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setAvailabilityFilter(f);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${availabilityFilter === f ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative z-0">
          {error && (
            <div className="p-4 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Image</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Brand</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : visibleVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No vehicles found.
                    </td>
                  </tr>
                ) : (
                  visibleVehicles.map((vehicle, idx) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={vehicle.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="w-12 h-8 bg-white/5 rounded overflow-hidden flex items-center justify-center relative">
                          <img
                            src={vehicle.image_url || '/images/vehicle-placeholder.png'}
                            alt={vehicle.name}
                            className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-white">{vehicle.name}</td>
                      <td className="px-6 py-4 text-gray-400">{vehicle.make}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300">
                          {vehicle.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          maximumFractionDigits: 0,
                        }).format(vehicle.price)}
                      </td>
                      <td className="px-6 py-4 text-white font-medium">{vehicle.quantity}</td>
                      <td className="px-6 py-4">
                        {vehicle.quantity > 0 ? (
                          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                            Available
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-medium">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setRestockingVehicle(vehicle)}
                            className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                            title="Restock"
                          >
                            <PackagePlus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingVehicle(vehicle)}
                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingVehicle(vehicle)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Showing {startIndex + 1} to{' '}
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredVehicles.length)} of{' '}
                {filteredVehicles.length} vehicles
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <EditVehicleModal
        isOpen={!!editingVehicle}
        onClose={() => setEditingVehicle(null)}
        vehicle={editingVehicle}
        onUpdate={updateVehicle}
      />

      <DeleteModal
        isOpen={!!deletingVehicle}
        onClose={() => setDeletingVehicle(null)}
        vehicleName={deletingVehicle?.name || ''}
        onDelete={() => deleteVehicle(deletingVehicle?.id)}
      />

      <RestockModal
        isOpen={!!restockingVehicle}
        onClose={() => setRestockingVehicle(null)}
        vehicleName={restockingVehicle?.name || ''}
        currentStock={restockingVehicle?.quantity || 0}
        onRestock={(qty) => restockVehicle(restockingVehicle?.id, qty)}
      />
    </div>
  );
};

export default VehicleManagement;
