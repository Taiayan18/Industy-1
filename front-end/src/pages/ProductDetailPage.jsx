import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, RefreshCw, Truck, ArrowLeft, Sparkles, ShoppingBag, Zap } from 'lucide-react';
import { addToCart } from '../api/api';

const ProductDetailPage = ({ product, onBack }) => {
  const navigate = useNavigate();
  const [cartLoading, setCartLoading] = useState(false);

  const onCartButtonClick = async () => {
    try {
      const token = localStorage.getItem("token");

      // Login check
      if (!token) {
        alert("Please login first to add products to your cart.");
        navigate("/login");
        return;
      }

      // Product ID check
      if (!product?._id) {
        alert("Product ID missing. Please check your product data.");
        return;
      }

      // Stock check
      const stock = Number(product.stock) || 0;

      if (stock <= 0) {
        alert("This product is out of stock.");
        return;
      }

      if (quantity > stock) {
        alert(`Only ${stock} items are available in stock.`);
        return;
      }

      setCartLoading(true);

      // Add product to database cart using api.js
      await addToCart({
        productId: product._id,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor,
      });

      // Navigate after successful API call
      navigate("/cart");

    } catch (error) {
      console.error("Add to cart error:", error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  // Gallery images list matching the thumbnail preview
  const galleryImages =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : product?.image
        ? [product.image]
        : ["https://placehold.co/600x600/png?text=Product"];

  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);
  const sizes = Array.isArray(product?.sizes)
    ? product.sizes
    : [];
  const colors = Array.isArray(product?.colors)
    ? product.colors
    : [];
  const [selectedSize, setSelectedSize] = useState(
    sizes.length > 0 ? String(sizes[0]) : ""
  );
  const [selectedColor, setSelectedColor] = useState(() => {
    if (colors.length === 0) return "";

    const firstColor = colors[0];

    return typeof firstColor === "object"
      ? String(
          firstColor.name ||
          firstColor.value ||
          firstColor.color ||
          ""
        )
      : String(firstColor);
  });
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="w-full bg-slate-950 min-h-screen py-10 px-4 sm:px-8 lg:px-16 font-sans text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-amber-400 transition-colors bg-slate-900 border border-slate-800 hover:border-amber-400/40 px-4 py-2.5 rounded-xl shadow-md"
        >
          <ArrowLeft size={16} /> Back to Products
        </button>

        {/* Main Product Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Left: Thumbnail Column + Main Image Container */}
          <div className="md:col-span-6 flex gap-4">

            {/* Vertical Thumbnails */}
            <div className="flex flex-col gap-3">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-16 rounded-xl overflow-hidden border transition-all ${
                    selectedImage === img
                      ? 'border-amber-400 ring-1 ring-amber-400 shadow-md'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Product Image Container */}
            <div className="flex-1 h-[520px] rounded-2xl bg-slate-900/60 overflow-hidden border border-slate-800/80 backdrop-blur-md shadow-2xl relative flex items-center justify-center p-4">
              <img
                src={selectedImage}
                alt={product?.name || "Product Name"}
                className="w-full h-full object-cover rounded-xl transition-all duration-500 hover:scale-105"
              />
            </div>

          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div className="md:col-span-6 space-y-5 bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">

            {/* Category / Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-amber-300">
              <Sparkles size={12} className="text-amber-400" /> Luxury Collection
            </span>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
              {product?.name || "Product Name"}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-300">
                {product?.rating || "4.5"} <span className="text-slate-500">({product?.reviews || "104"} reviews)</span>
              </span>
            </div>

            {/* Price & Discount */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl font-extrabold text-white font-mono">
                ₹{Number(product?.price || 0).toLocaleString("en-IN")}
              </span>

              {Number(product?.originalPrice || 0) >
                Number(product?.price || 0) && (
                  <>
                    <span className="text-sm font-medium text-slate-500 line-through font-mono">
                      ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                    </span>

                    <span className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                      {product.discount != null
                        ? `${product.discount}% OFF`
                        : `${Math.round(
                            ((product.originalPrice - product.price) /
                              product.originalPrice) *
                            100
                          )}% OFF`}
                    </span>
                  </>
                )}
            </div>

            {/* Stock Indicator */}
            {(() => {
              const stock = Math.max(0, Number(product?.stock) || 0);

              if (stock === 0) {
                return (
                  <p className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" />
                    Out of Stock
                  </p>
                );
              }

              if (stock <= 10) {
                return (
                  <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
                    Only {stock} left in stock
                  </p>
                );
              }

              return (
                <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Available In Stock
                </p>
              );
            })()}

            {/* Size Options */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
                Size
              </label>

              {sizes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const sizeValue = String(size);

                    return (
                      <button
                        key={sizeValue}
                        type="button"
                        onClick={() => setSelectedSize(sizeValue)}
                        className={`h-10 px-4 rounded-xl text-xs font-bold transition-all border ${
                          selectedSize === sizeValue
                            ? "border-amber-400 bg-amber-400/10 text-amber-300 shadow-md"
                            : "border-slate-800 text-slate-400 bg-slate-950 hover:border-slate-600 hover:text-white"
                        }`}
                      >
                        {sizeValue}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  No sizes available
                </p>
              )}
            </div>

            {/* Color Options */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
                Color
              </label>

              {colors.length > 0 ? (
                <div className="flex flex-wrap items-center gap-3">
                  {colors.map((color) => {
                    const colorValue =
                      typeof color === "object"
                        ? String(color.name || color.value || color.color || "")
                        : String(color);

                    return (
                      <button
                        key={colorValue}
                        type="button"
                        title={colorValue}
                        aria-label={colorValue}
                        onClick={() => setSelectedColor(colorValue)}
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 transition-all ${
                          selectedColor === colorValue
                            ? "border-amber-400 bg-amber-400/10 text-amber-300 shadow-md"
                            : "border-slate-800 text-slate-400 bg-slate-950 hover:border-slate-600 hover:text-white"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-slate-700 shadow-sm"
                          style={{ backgroundColor: colorValue }}
                        />
                        <span className="text-xs font-semibold">
                          {colorValue}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  No colors available
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="pt-1 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
                Quantity
              </label>
              <div className="flex items-center justify-between w-32 border border-slate-800 rounded-xl p-1 bg-slate-950 shadow-inner">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 flex items-center justify-center font-bold text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-colors"
                >
                  -
                </button>
                <span className="text-xs font-extrabold text-white font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-8 h-8 flex items-center justify-center font-bold text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-3">
              <button
                type="button"
                onClick={onCartButtonClick}
                disabled={cartLoading || Number(product?.stock ?? 0) <= 0}
                className="w-full bg-gradient-to-r from-amber-400 to-rose-500 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-extrabold py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-400/10 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>{cartLoading ? 'Adding to Bag...' : 'Add to Bag'}</span>
              </button>

              <button
                type="button"
                onClick={onCartButtonClick}
                disabled={cartLoading || Number(product?.stock ?? 0) <= 0}
                className="w-full bg-slate-950 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700/80 hover:border-amber-400/40 text-white font-extrabold py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Zap size={16} className="text-amber-400" />
                <span>{cartLoading ? 'Please Wait...' : 'Buy Now'}</span>
              </button>
            </div>

            {/* Unique Selling Features */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2.5 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-amber-400" />
                <span>100% Original Luxury Product</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw size={16} className="text-amber-400" />
                <span>7 Days VIP Return Policy</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck size={16} className="text-amber-400" />
                <span>Insured Free Shipping</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Tabbed Content Area */}
        <div className="mt-16">
          <div className="flex gap-10 border-b border-slate-800/80 pb-3">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'reviews', label: 'Reviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs sm:text-sm font-extrabold uppercase tracking-wider pb-3 -mb-3 transition-all ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-amber-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6 bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 rounded-2xl backdrop-blur-xl shadow-xl">
            {activeTab === "description" && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Product Description
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                  {product?.description?.trim()
                    ? product.description
                    : "No description available."}
                </p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Product Specifications
                </h3>

                {(() => {
                  const specs = product?.specifications;

                  const entries =
                    specs instanceof Map
                      ? Array.from(specs.entries())
                      : Array.isArray(specs)
                        ? specs.map((item, index) => [
                            item.name || `Specification ${index + 1}`,
                            item.value ?? ""
                          ])
                        : specs && typeof specs === "object"
                          ? Object.entries(specs)
                          : [];

                  const filteredEntries = entries.filter(
                    ([, value]) =>
                      value !== null &&
                      value !== undefined &&
                      String(value).trim() !== ""
                  );

                  return (
                    <div className="space-y-2">
                      {product?.brand && (
                        <div className="flex justify-between gap-4 border-b border-slate-800/80 py-3 text-xs sm:text-sm">
                          <span className="font-semibold text-slate-400">Brand</span>
                          <span className="text-white font-medium text-right">
                            {product.brand}
                          </span>
                        </div>
                      )}

                      {product?.sku && (
                        <div className="flex justify-between gap-4 border-b border-slate-800/80 py-3 text-xs sm:text-sm">
                          <span className="font-semibold text-slate-400">SKU</span>
                          <span className="text-white font-medium text-right font-mono">
                            {product.sku}
                          </span>
                        </div>
                      )}

                      {filteredEntries.map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between gap-4 border-b border-slate-800/80 py-3 text-xs sm:text-sm"
                        >
                          <span className="font-semibold text-slate-400 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </span>

                          <span className="text-white font-medium text-right">
                            {Array.isArray(value)
                              ? value.join(", ")
                              : typeof value === "object"
                                ? JSON.stringify(value)
                                : String(value)}
                          </span>
                        </div>
                      ))}

                      {!product?.brand &&
                        !product?.sku &&
                        filteredEntries.length === 0 && (
                          <p className="text-xs sm:text-sm text-slate-400">
                            No specifications available.
                          </p>
                        )}
                    </div>
                  );
                })()}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Customer Reviews
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Customer reviews and detailed ratings will appear here.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;