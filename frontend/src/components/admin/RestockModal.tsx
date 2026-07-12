import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRestock: (quantity: number) => Promise<void>;
  vehicleName: string;
  currentStock: number;
}

const RestockModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onRestock,
  vehicleName,
  currentStock,
}) => {
  const [quantity, setQuantity] = useState<number>(10);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;
    setLoading(true);
    try {
      await onRestock(quantity);
      setQuantity(10);
      onClose();
    } catch (error) {
      // error handled by store/parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 z-50 shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-1 text-white">Restock Vehicle</h3>
            <p className="text-gray-400 text-sm mb-6">Increase inventory for {vehicleName}</p>

            <div className="mb-6 p-4 bg-white/5 rounded-xl flex justify-between items-center border border-white/5">
              <span className="text-gray-400">Current Stock</span>
              <span className="text-xl font-bold text-white">{currentStock}</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quantity to Add
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20 flex justify-center items-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Confirm Restock'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RestockModal;
