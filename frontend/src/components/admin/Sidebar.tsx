import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, Plus, Database, BarChart3, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Vehicles', path: '/admin/vehicles', icon: Car },
    { name: 'Add Vehicle', path: '/admin/add-vehicle', icon: Plus },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#050505]/90 backdrop-blur-md z-50 flex items-center justify-between px-6 border-b border-white/10">
        <div className="text-xl font-bold tracking-tighter">
          <span className="text-white">Car</span>
          <span className="text-blue-500">Nest</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a]/80 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 transform flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Logo Area */}
        <div className="h-24 flex flex-col justify-center px-8 border-b border-white/5 mt-16 md:mt-0">
          <h2 className="text-2xl font-bold tracking-tighter block mb-1">
            <span className="text-white">Car</span>
            <span className="text-gradient-accent">Nest</span>
          </h2>
          <span className="text-xs text-gray-500 tracking-widest uppercase font-semibold">
            Admin Control
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-grow py-8 px-4 space-y-2 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
