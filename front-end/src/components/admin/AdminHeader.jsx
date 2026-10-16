import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';

const AdminHeader = ({ setIsMobileOpen }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-soft">
      
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden sm:block w-64 lg:w-80">
          <input
            type="text"
            placeholder="Search orders, products, customers..."
            className="w-full text-xs font-medium pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-surface focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors"
          />
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Right: Notifications & Admin Profile */}
      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-bold text-xs shadow-soft">
            A
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-extrabold text-slate-900 block leading-tight">Admin User</span>
            <span className="text-[10px] text-slate-400 font-semibold">Manager</span>
          </div>
        </div>
      </div>

    </header>
  );
};

export default AdminHeader;