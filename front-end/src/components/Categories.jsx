import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronDown, ChevronUp, Sparkles, Compass } from "lucide-react";
import { getCategorydata } from "../api/api";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const sectionRef = useRef(null);

  // Fetch parent categories
  const loadParentCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategorydata();

      const categories = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : [];

      // Filter parent categories only
      const parentCategories = categories.filter((cat) => !cat.parentCategory);
      setData(parentCategories);
    } catch (error) {
      console.error("Categories fetch failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParentCategories();
  }, []);

  const hasMore = visibleCount < data.length;

  // View More
  const showMoreCategories = () => {
    setIsCollapsing(false);
    setVisibleCount((prevCount) => Math.min(prevCount + 5, data.length));
  };

  // Show Less with smooth scroll
  const showFewerCategories = () => {
    setIsCollapsing(true);

    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      setVisibleCount(5);
      setIsCollapsing(false);
    }, 350);
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 scroll-mt-6 border-b border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-2 gap-4 border-b border-slate-800/60 pb-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-md">
              <Sparkles size={13} className="text-amber-400" /> Curated Collections
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Explore our wide variety of premium handpicked luxury categories
            </p>
          </div>

          <span className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold px-4 py-2 rounded-xl self-start sm:self-auto shadow-inner flex items-center gap-2">
            <Compass size={14} className="text-amber-400" />
            <span>{Math.min(visibleCount, data.length)} / {data.length} Categories</span>
          </span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            <p className="text-xs font-medium tracking-wide">Loading Collections...</p>
          </div>
        ) : data.length === 0 ? (
          /* Empty State - Jab koi category Na ho */
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md max-w-xl mx-auto space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 text-amber-400 border border-slate-700/60 shadow-lg">
           
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No Categories Available</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                Categories are currently being curated or haven't been created yet. Please check back shortly!
              </p>
            </div>
          </div>
        ) : (
          /* Categories Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-8 gap-x-5">
            {data.slice(0, visibleCount).map((cat, index) => {
              return (
                <div
                  key={cat._id}
                  onClick={() =>
                    navigate("/product", {
                      state: {
                        categoryId: cat._id,
                        categoryName: cat.name,
                      },
                    })
                  }
                  style={{
                    animation: "categoryFadeIn 450ms ease both",
                    animationDelay: `${(index % 5) * 60}ms`,
                  }}
                  className="group relative flex flex-col items-center text-center p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-amber-400/40 hover:bg-slate-900 hover:shadow-2xl hover:shadow-amber-400/5 transition-all duration-300 cursor-pointer"
                >
                  {/* Circular Image Container with Amber Accent Ring */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-slate-950 mb-4 flex items-center justify-center border-2 border-slate-800 group-hover:border-amber-400 transition-all duration-300 p-1.5 relative group-hover:scale-105 shadow-md">
                    <img
                      src={cat.image || "https://placehold.co/400x400/png?text=Category"}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center rounded-full group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Category Name */}
                  <h3 className="text-sm md:text-base font-bold text-white group-hover:text-amber-300 transition-colors truncate w-full px-1">
                    {cat.name}
                  </h3>

                  {/* Shop Now Action */}
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 mt-2.5 group-hover:text-amber-400 transition-colors">
                    <span>Explore</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View More / Show Less Action Buttons */}
        {data.length > 0 && (
          <div className="pt-6 text-center border-t border-slate-800/60">
            {hasMore ? (
              <button
                type="button"
                onClick={showMoreCategories}
                disabled={isCollapsing}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-rose-500 hover:brightness-110 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-lg shadow-amber-400/10 active:scale-95 disabled:opacity-60"
              >
                <span>View More Categories</span>
                <ChevronDown size={18} />
              </button>
            ) : (
              data.length > 5 && (
                <button
                  type="button"
                  onClick={showFewerCategories}
                  disabled={isCollapsing}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold px-8 py-3.5 rounded-xl text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-md active:scale-95 disabled:opacity-60"
                >
                  <span>
                    {isCollapsing ? "Please wait..." : "Show Less"}
                  </span>
                  <ChevronUp size={18} />
                </button>
              )
            )}
          </div>
        )}

      </div>
    </section>
  );
};

export default Categories;