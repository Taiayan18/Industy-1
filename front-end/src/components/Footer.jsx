import React from 'react';
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#facebook', icon: FaFacebookF },
  { label: 'Instagram', href: '#instagram', icon: FaInstagram },
  { label: 'Twitter', href: '#twitter', icon: FaTwitter },
];

const QUICK_LINKS = [
  { label: 'Discover', to: '/' },
  { label: 'Shop Catalog', to: '/product' },
  { label: 'Our Story', to: '/about' },
  { label: 'Contact Support', to: '/contact' },
  { label: 'My Orders', to: '/my-orders' },
];

const CARE_LINKS = [
  { label: 'FAQ & Help Center', href: '#faq' },
  { label: 'Shipping & Returns', href: '#returns' },
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms of Service', href: '#terms' },
  { label: 'Track Shipment', to: '/my-orders' },
];

const linkStyle = 'inline-block text-slate-400 transition-all duration-200 hover:translate-x-1 hover:text-amber-300';
const columnTitle = 'mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white before:h-3 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-amber-400 before:to-rose-500';

const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden bg-slate-950 px-4 pb-8 pt-16 text-slate-300 sm:px-6 lg:px-8 border-t border-slate-800">
      
      {/* Top Amber-Rose Accent Gradient Line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400"></div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 border-b border-slate-800/80 pb-12 md:grid-cols-2 lg:grid-cols-5">

        {/* 1. Brand Info */}
        <div className="space-y-5 lg:col-span-2">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-600 text-white shadow-md shadow-rose-500/20">
              <Sparkles size={20} />
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

          <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-slate-400">
            Your destination for luxury fashion, lifestyle essentials, and modern curated collections. Discover timeless elegance with seamless shopping.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3 pt-1">
            {SOCIAL_LINKS.map((social) => {
              const SocialIcon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:bg-gradient-to-tr hover:from-amber-400 hover:to-rose-500 hover:text-slate-950 shadow-md"
                >
                  <SocialIcon size={15} />
                </a>
              );
            })}
          </div>
        </div>

        {/* 2. Quick Links */}
        <div>
          <h4 className={columnTitle}>Quick Links</h4>
          <ul className="space-y-3 text-xs sm:text-sm">
            {QUICK_LINKS.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className={linkStyle}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Customer Care */}
        <div>
          <h4 className={columnTitle}>Customer Care</h4>
          <ul className="space-y-3 text-xs sm:text-sm">
            {CARE_LINKS.map((item) => (
              <li key={item.label}>
                {item.to ? (
                  <Link to={item.to} className={linkStyle}>{item.label}</Link>
                ) : (
                  <a href={item.href} className={linkStyle}>{item.label}</a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Contact Info */}
        <div>
          <h4 className={columnTitle}>Headquarters</h4>
          <div className="space-y-4 text-xs sm:text-sm text-slate-400">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-amber-400">
                <MapPin size={15} />
              </span>
              <span className="pt-1">123 Fashion Street, Ahmedabad, Gujarat, India</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-amber-400">
                <Phone size={15} />
              </span>
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-amber-400">
                <Mail size={15} />
              </span>
              <span>support@velora.com</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 pt-6 text-xs text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} VELORA Luxe Boutique. All rights reserved.</p>
        <p className="flex items-center gap-1.5 text-slate-400">
          <Sparkles size={13} className="text-amber-400" /> Crafted for Premium Shopping Experience
        </p>
      </div>
    </footer>
  );
};

export default Footer;