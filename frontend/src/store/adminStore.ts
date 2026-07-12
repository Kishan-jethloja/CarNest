import { create } from 'zustand';
import api from '../services/api';

interface AdminState {
  vehicles: any[];
  loading: boolean;
  error: string | null;

  fetchVehicles: () => Promise<void>;
  createVehicle: (data: any) => Promise<void>;
  updateVehicle: (id: string | number, data: any) => Promise<void>;
  deleteVehicle: (id: string | number) => Promise<void>;
  restockVehicle: (id: string | number, quantity: number) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  vehicles: [],
  loading: false,
  error: null,

  fetchVehicles: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/vehicles');
      const data =
        response.data.data?.vehicles ||
        response.data.vehicles ||
        response.data.data ||
        response.data ||
        [];
      set({ vehicles: Array.isArray(data) ? data : [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Unable to load vehicles.', loading: false });
    }
  },

  createVehicle: async (data: any) => {
    set({ loading: true, error: null });
    try {
      await api.post('/vehicles', data);
      await get().fetchVehicles(); // refresh list
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Vehicle creation failed.', loading: false });
      throw err; // throw to handle in UI component
    }
  },

  updateVehicle: async (id: string | number, data: any) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/vehicles/${id}`, data);
      await get().fetchVehicles();
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Vehicle update failed. Try again.',
        loading: false,
      });
      throw err;
    }
  },

  deleteVehicle: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/vehicles/${id}`);
      await get().fetchVehicles();
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Vehicle deletion failed.', loading: false });
      throw err;
    }
  },

  restockVehicle: async (id: string | number, quantity: number) => {
    set({ loading: true, error: null });
    try {
      await api.post(`/vehicles/${id}/restock`, { quantity });
      await get().fetchVehicles();
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Restock failed.', loading: false });
      throw err;
    }
  },
}));
