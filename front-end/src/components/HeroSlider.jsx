import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    tag: "Aesthetic Couture",
    title: "Elegance Redefined",
    subtitle: "Experience effortless luxury with our premium designer collection crafted for high fashion enthusiasts.",
    buttonText: "Explore Collection",
    buttonLink: "/product",
    // High-end luxury dark fashion aesthetic
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 2,
    tag: "Edition '26",
    title: "Monochrome Minimal",
    subtitle: "Sharp cuts, neutral palettes, and bold silhouettes engineered for timeless street elegance.",
    buttonText: "Shop Minimalist",
    buttonLink: "/product",
    // Sleek monochrome high-street fashion
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 3,
    tag: "Luxe Accessories",
    title: "Statement Pieces",
    subtitle: "Complete your look with hand-picked premium leather gear, watches, and statement essentials.",
    buttonText: "Discover Accessories",
    buttonLink: "/product",
    // Premium luxury fashion accessories
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop",
  },
];

const AUTOPLAY_MS = 6000;

const HeroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ticker = setInterval(() => {
      setActiveIndex((current) => (current === slides.length - 1 ? 0 : current + 1));
    }, AUTOPLAY_MS);

    return () => clearInterval(ticker);
  }, []);

  const handlePrev = () => {
    setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
  };

  const handleNext = () => {
    setActiveIndex((current) => (current === slides.length - 1 ? 0 : current + 1));
  };

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 text-white">
      <div className="relative h-[70vh] w-full sm:h-[80vh] lg:h-[85vh]">

        {/* Slides loop */}
        {slides.map((slide, position) => {
          const isActive = position === activeIndex;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Zoom effect */}
              <img
                src={slide.image}
                alt={slide.title}
                className={`h-full w-full object-cover object-center transition-transform duration-[7000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Premium Dark Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              {/* Slide Content Overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="max-w-xl space-y-6">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-md">
                      <Sparkles size={14} className="text-amber-400" />
                      <span className="tracking-wider uppercase text-[10px] sm:text-xs">
                        {slide.tag}
                      </span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.05]">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="max-w-lg text-sm text-slate-300 sm:text-base lg:text-lg leading-relaxed">
                      {slide.subtitle}
                    </p>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Link
                        to={slide.buttonLink}
                        className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 px-7 py-3.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-amber-400/10 transition-all duration-300 hover:brightness-110 active:scale-95"
                      >
                        <span>{slide.buttonText}</span>
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 right-4 sm:right-8 z-20 hidden sm:flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900/60 border border-slate-700/60 text-white backdrop-blur-md transition-all hover:bg-amber-400 hover:text-slate-950 active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900/60 border border-slate-700/60 text-white backdrop-blur-md transition-all hover:bg-amber-400 hover:text-slate-950 active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Bottom Control Bar */}
        <div className="absolute inset-x-0 bottom-6 sm:bottom-10 z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            
            {/* Counter Display */}
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold tracking-widest text-slate-400">
              <span className="text-amber-400">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-slate-600">/</span>
              <span>{String(slides.length).padStart(2, '0')}</span>
            </div>

            {/* Pagination Indicators */}
            <div className="flex items-center gap-2">
              {slides.map((_, position) => (
                <button
                  key={position}
                  onClick={() => setActiveIndex(position)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    position === activeIndex
                      ? 'w-8 bg-amber-400'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${position + 1}`}
                />
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSlider;