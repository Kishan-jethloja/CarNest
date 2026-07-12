import { create } from 'zustand';

interface User {
  id: string | number;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Check initial state from localStorage
const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

let initialUser = null;
if (storedUser) {
  try {
    initialUser = JSON.parse(storedUser);
  } catch (e) {
    console.error('Failed to parse user from local storage');
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: storedToken,
  isAuthenticated: !!storedToken,

  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
