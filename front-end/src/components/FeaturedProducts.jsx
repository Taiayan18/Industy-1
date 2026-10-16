import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp, Sparkles, ShoppingBag, Heart, Eye } from 'lucide-react';

const allProducts = [
  // Slot 1 (Initial 4 Products)
  {
    id: 1,
    name: 'Velora Royal Leather Watch',
    category: 'Timepieces',
    price: '₹ 12,499',
    rating: 4.9,
    reviews: '142',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Monochrome Luxe Headphones',
    category: 'Audio',
    price: '₹ 18,999',
    rating: 4.8,
    reviews: '215',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Aesthetic Gold Sunglasses',
    category: 'Eyewear',
    price: '₹ 6,299',
    rating: 4.7,
    reviews: '98',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Italian Leather Duffle Bag',
    category: 'Travel Essentials',
    price: '₹ 14,999',
    rating: 4.9,
    reviews: '180',
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop',
  },

  // Slot 2
  {
    id: 5,
    name: 'Urban High-Top Sneakers',
    category: 'Footwear',
    price: '₹ 9,899',
    rating: 4.8,
    reviews: '156',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Minimalist Wireless Earbuds',
    category: 'Audio',
    price: '₹ 7,499',
    rating: 4.6,
    reviews: '124',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 7,
    name: 'Classic Automatic Watch',
    category: 'Timepieces',
    price: '₹ 22,999',
    rating: 5.0,
    reviews: '89',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 8,
    name: 'Handcrafted Designer Belt',
    category: 'Accessories',
    price: '₹ 3,499',
    rating: 4.7,
    reviews: '72',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop',
  },

  // Slot 3
  {
    id: 9,
    name: 'Minimalist Everyday Backpack',
    category: 'Bags',
    price: '₹ 5,899',
    rating: 4.7,
    reviews: '110',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 10,
    name: 'Vanguard Running Sneakers',
    category: 'Footwear',
    price: '₹ 11,299',
    rating: 4.8,
    reviews: '164',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop',
  },
];

const FeaturedProducts = () => {
  const [visibleCount, setVisibleCount] = useState(4);

  const hasMore = visibleCount < allProducts.length;

  const showMoreProducts = () => {
    setVisibleCount((prevCount) =>
      Math.min(prevCount + 4, allProducts.length)
    );
  };

  const showFewerProducts = () => {
    setVisibleCount(4);
  };

  return (
    <section className="w-full bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-slate-800/60 gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-md">
              <Sparkles size={13} className="text-amber-400" /> Trending Now
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Handpicked bestsellers chosen for their quality and timeless design
            </p>
          </div>

          <span className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold px-4 py-2 rounded-xl self-start sm:self-auto shadow-inner">
            {Math.min(visibleCount, allProducts.length)} / {allProducts.length} Products
          </span>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProducts.slice(0, visibleCount).map((product) => (
            <div
              key={product.id}
              className="group relative bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md hover:border-amber-400/40 hover:bg-slate-900 hover:shadow-2xl hover:shadow-amber-400/5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Product Image Container */}
              <div className="relative w-full h-64 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 p-3 group-hover:border-slate-700 transition-colors">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                  {product.category}
                </span>

                {/* Wishlist Action Button */}
                <button
                  type="button"
                  aria-label="Wishlist"
                  className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10 transition-all active:scale-95"
                >
                  <Heart size={16} />
                </button>
              </div>

              {/* Product Info */}
              <div className="pt-4 pb-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-lg">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-[11px] font-bold text-amber-300">
                      {product.rating}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({product.reviews})
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 tracking-wider block">Price</span>
                    <p className="text-base font-extrabold text-white">
                      {product.price}
                    </p>
                  </div>
                </div>

                {/* Action CTA Button */}
                <button
                  type="button"
                  className="w-full mt-2 bg-gradient-to-r from-amber-400 to-rose-500 hover:brightness-110 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10 active:scale-95"
                >
                  <Eye size={15} /> Quick View
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Load More Controls */}
        <div className="pt-6 text-center border-t border-slate-800/60">
          {hasMore ? (
            <button
              onClick={showMoreProducts}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-rose-500 hover:brightness-110 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-lg shadow-amber-400/10 active:scale-95"
            >
              <span>View More Products</span>
              <ChevronDown size={18} />
            </button>
          ) : (
            allProducts.length > 4 && (
              <button
                onClick={showFewerProducts}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold px-8 py-3.5 rounded-xl text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-md active:scale-95"
              >
                <span>Show Less</span>
                <ChevronUp size={18} />
              </button>
            )
          )}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;