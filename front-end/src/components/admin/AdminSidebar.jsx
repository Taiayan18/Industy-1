import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Users, 
  CreditCard, 
  Settings, 
  Store, 
  LogOut,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const adminNavLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/dashboard/products', icon: ShoppingBag },
    { name: 'Categories', path: '/dashboard/categories', icon: Layers },
    { name: 'Orders', path: '/dashboard/orders', icon: CreditCard },
    { name: 'Customers', path: '/dashboard/customers', icon: Users },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-ink text-slate-300 border-r border-white/5 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 space-y-8">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shrink-0 shadow-lift">
                <Store size={18} />
              </div>
              <div>
                <span className="font-display text-lg font-bold text-white tracking-tight block leading-none">
                  ShopNest
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-300">
                  Admin Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-2">
              Main Menu
            </span>
            {adminNavLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/admin'}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-lift font-semibold'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-white/10 space-y-3">
          {/* <Link
            to="/"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-brand-200 transition-colors text-xs font-semibold"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft size={15} /> Back to Store
            </span>
            <Sparkles size={13} className="text-brand-600" />
          </Link> */}

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/auth";
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;