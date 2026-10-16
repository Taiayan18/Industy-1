import React, { useEffect, useState } from 'react';
import { ShoppingBag, User, LogOut, Menu, X, Heart, Sparkles, Compass } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getWishlist } from '../api/api';

// Main navigation entries
const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Product', to: '/product' },
  { label: 'About Us', to: '/about' },
  { label: 'Support', to: '/contact' },
  { label: 'Orders', to: '/my-orders' },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlistTotal, setWishlistTotal] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Sticky header shadow effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const syncWishlistTotal = async () => {
      if (!localStorage.getItem("token")) {
        setWishlistTotal(0);
        return;
      }

      try {
        const response = await getWishlist();
        const products = response?.products || [];
        setWishlistTotal(products.length);
      } catch (error) {
        console.log("Wishlist error:", error.message);
      }
    };

    syncWishlistTotal();

    window.addEventListener("wishlistUpdated", syncWishlistTotal);
    return () => {
      window.removeEventListener("wishlistUpdated", syncWishlistTotal);
    };
  }, [location.pathname]);

  const closeMenu = () => setMenuOpen(false);

  const onLogoutClick = () => {
    alert("Logout successfully!");
    localStorage.removeItem("token");
    closeMenu();
    navigate("/auth");
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-900/95 text-white shadow-xl backdrop-blur-md py-3 border-b border-slate-800' 
          : 'bg-slate-900 text-white py-4 border-b border-slate-800/80'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* 1. New Brand Logo & Name (VELORA) */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-600 text-white shadow-md shadow-rose-500/20 transition-transform duration-300 group-hover:scale-105">
            <Sparkles size={20} className="transition-transform group-hover:rotate-12" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-wider text-white uppercase font-sans">
              VELORA<span className="text-amber-400">.</span>
            </span>
            <span className="text-[9px] font-semibold tracking-widest text-slate-400 uppercase">
              Luxe Lifestyle
            </span>
          </div>
        </Link>

        {/* 2. Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-full bg-slate-800/80 p-1.5 border border-slate-700/60 backdrop-blur-sm">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.label}
                to={item.to}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 3. Right Action Icons & Profile */}
        <div className="flex items-center gap-2">

          {/* Wishlist Button */}
          <Link to={token ? "/wishlist" : "/auth"} onClick={closeMenu} className="relative">
            <button
              aria-label="Wishlist"
              title="Wishlist"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 text-slate-300 transition-all hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700/60 active:scale-95"
            >
              <Heart size={18} />
              {wishlistTotal > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-slate-900">
                  {wishlistTotal > 99 ? "99+" : wishlistTotal}
                </span>
              )}
            </button>
          </Link>

          {/* Cart Button */}
          <Link to={token ? "/cart" : "/auth"} onClick={closeMenu} className="relative">
            <button
              aria-label="Shopping Cart"
              title="Cart"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 text-slate-300 transition-all hover:bg-amber-400/20 hover:text-amber-400 border border-slate-700/60 active:scale-95"
            >
              <ShoppingBag size={18} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-slate-900"></span>
            </button>
          </Link>

          <div className="mx-1 h-5 w-[1px] bg-slate-800 hidden sm:block" />

          {/* Auth Action */}
          {token ? (
            <button
              onClick={onLogoutClick}
              aria-label="Logout"
              title="Logout"
              className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2 border border-slate-700/60 text-xs font-semibold text-slate-300 transition-all hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40 active:scale-95"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link to="/auth" onClick={closeMenu} className="hidden sm:block">
              <button
                aria-label="Sign In"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:brightness-110 active:scale-95 shadow-md shadow-rose-500/10"
              >
                <User size={15} />
                <span>Account</span>
              </button>
            </Link>
          )}

          {/* Mobile Drawer Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-200 border border-slate-700/60 md:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="border-t border-slate-800 bg-slate-900/98 px-6 py-6 backdrop-blur-xl md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={closeMenu}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                  <Compass size={16} className={isActive ? 'text-slate-950' : 'text-slate-500'} />
                </Link>
              );
            })}
          </div>

          <div className="mt-5 border-t border-slate-800 pt-5">
            {token ? (
              <button
                onClick={onLogoutClick}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm font-semibold text-rose-400 active:scale-98"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link to="/auth" onClick={closeMenu}>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 px-4 py-3 text-sm font-bold text-slate-950 active:scale-98 shadow-md">
                  <User size={16} />
                  <span>Sign In / Register</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;