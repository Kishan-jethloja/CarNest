import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  vehicleName: string;
}

const DeleteModal: React.FC<Props> = ({ isOpen, onClose, onDelete, vehicleName }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
      onClose();
    } catch (error) {
      // Handle error in store
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#111] border border-red-500/20 rounded-2xl p-6 z-50 shadow-2xl shadow-red-500/10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[40px] pointer-events-none" />

            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete Vehicle?</h3>
                <p className="text-gray-400 text-sm">This action cannot be reversed.</p>
              </div>
            </div>

            <div className="mb-8 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
              <p className="text-gray-300 text-sm">
                Are you sure you want to permanently delete{' '}
                <strong className="text-white">{vehicleName}</strong> from the inventory system?
              </p>
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
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-red-500/20 flex justify-center items-center text-white"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Delete Vehicle'
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
