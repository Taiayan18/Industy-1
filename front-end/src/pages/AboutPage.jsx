import React from 'react';
import { Target, HeartHandshake, Eye, Sparkles, ShieldCheck, Award, Users2, Truck, Compass } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { label: 'Happy Clients', value: '50K+' },
    { label: 'Curated Products', value: '10K+' },
    { label: 'Global Luxury Brands', value: '250+' },
    { label: 'Customer Rating', value: '4.9 ★' },
  ];

  const features = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To curate premium fashion & lifestyle collections that seamlessly deliver luxury, elegance, and unmatched value.',
    },
    {
      icon: HeartHandshake,
      title: 'Our Values',
      description: 'Built on absolute transparency, uncompromising product quality, and a deeply customer-centric approach.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To set the global benchmark for modern, seamless, and trustworthy luxury e-commerce experiences.',
    },
  ];

  const highlights = [
    { icon: ShieldCheck, title: '100% Authentic', desc: 'Guaranteed original products direct from verified brands.' },
    { icon: Truck, title: 'Express Delivery', desc: 'Swift, insured, and seamless shipping right to your doorstep.' },
    { icon: Award, title: 'Premium Quality', desc: 'Handpicked items subjected to rigorous quality checks.' },
    { icon: Users2, title: '24/7 VIP Concierge', desc: 'Dedicated customer support tailored to your every need.' },
  ];

  return (
    <div className="w-full bg-slate-950 min-h-screen pb-20 font-sans text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* 1. Luxury Hero Banner */}
        <div className="relative w-full rounded-2xl bg-slate-900 border border-slate-800/80 overflow-hidden min-h-[220px] sm:min-h-[280px] flex items-center justify-between p-6 sm:p-12 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop"
            alt="VELORA Luxury Boutique"
            className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

          {/* Banner Details */}
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-md">
              <Sparkles size={13} className="text-amber-400" /> Crafting Excellence
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
              About VELORA
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-md">
              We are more than just a boutique — we are your ultimate destination for elevated, mindful luxury lifestyle shopping.
            </p>
          </div>

          {/* Decorative Side Icon */}
          <div className="relative z-10 hidden lg:flex items-center justify-center w-36 h-36 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-2xl">
            <Compass size={64} className="text-amber-400/80 animate-pulse" />
          </div>
        </div>

        {/* 2. Stat Counter Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800/80 backdrop-blur-md text-center space-y-1 hover:border-amber-400/40 transition-all duration-300 shadow-lg"
            >
              <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-amber-400 to-rose-500 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* 3. Our Story Section */}
        <div className="bg-slate-900/60 rounded-2xl p-6 sm:p-12 border border-slate-800/80 backdrop-blur-md shadow-xl space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
              Behind The Brand
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Our Story & Philosophy
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium pt-1">
              VELORA was founded on a distinct premise — to eliminate the clutter of mass market e-commerce and replace it with a thoughtfully curated, premium shopping environment. From handpicked apparel to luxury accessories and essentials, we combine quality craftsmanship with seamless delivery right to your doorstep.
            </p>
          </div>

          {/* Mission, Values, Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-800/80">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-amber-400/40 hover:bg-slate-900 transition-all duration-300 space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-amber-400 group-hover:to-rose-500 group-hover:text-slate-950 transition-all duration-300">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Why Choose Us Highlights */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              The VELORA Advantage
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Why discerning shoppers trust us worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-md space-y-2 text-center flex flex-col items-center justify-center hover:border-amber-400/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 text-amber-400 flex items-center justify-center mb-1">
                    <Icon size={18} />
                  </div>
                  <h4 className="text-xs font-bold text-white">
                    {h.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-normal">
                    {h.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;