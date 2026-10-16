import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headset, Sparkles } from 'lucide-react';

const perks = [
  {
    id: 1,
    icon: Truck,
    title: 'Complimentary Shipping',
    description: 'On all orders above ₹999',
    badge: 'Express',
  },
  {
    id: 2,
    icon: RotateCcw,
    title: 'Hassle-Free Returns',
    description: '7 Days easy return policy',
    badge: 'Guarantee',
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: '100% Encrypted Payment',
    description: 'Bank-grade secure checkout',
    badge: 'Verified',
  },
  {
    id: 4,
    icon: Headset,
    title: '24/7 VIP Concierge',
    description: 'Dedicated support specialists',
    badge: 'Live Support',
  },
];

const Services = () => {
  return (
    <section className="w-full bg-slate-950 border-y border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Perks Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk) => {
            const PerkIcon = perk.icon;
            return (
              <div
                key={perk.id}
                className="group relative flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:bg-slate-900 hover:shadow-xl hover:shadow-amber-400/5"
              >
                {/* Icon Container with Gradient Background */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 text-amber-400 border border-slate-700/60 transition-transform duration-300 group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-amber-400 group-hover:to-rose-500 group-hover:text-slate-950 group-hover:border-transparent">
                  <PerkIcon size={22} strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold tracking-wide text-white transition-colors group-hover:text-amber-300">
                      {perk.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {perk.description}
                  </p>
                </div>

                {/* Subtle Amber Glow Accent on Hover */}
                <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Sparkles size={12} className="text-amber-400" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Services;