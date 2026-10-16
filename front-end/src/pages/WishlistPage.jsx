import React, { useState, useEffect } from "react";
import {
  Star,
  Heart,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  getWishlist,
  removeFromWishlist,
} from "../api/api";

const WishlistPage = () => {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState({});

  // Product ID
  const readProductId = (product) =>
    String(product?._id || product?.id || product?.sku || "");

  // Product image
  const readProductImage = (product) => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      return typeof firstImage === "string"
        ? firstImage
        : firstImage?.url || "";
    }

    if (typeof product?.image === "string") {
      return product.image;
    }

    return product?.image?.url || "";
  };

  // Load wishlist from database
  const loadWishlistItems = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setWishlist([]);
        return;
      }

      const response = await getWishlist();

      setWishlist(
        Array.isArray(response?.products)
          ? response.products
          : []
      );
    } catch (error) {
      console.error("Wishlist fetch failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlistItems();
  }, []);

  // Remove product from database wishlist
  const onRemoveFromWishlist = async (product) => {
    const productId = readProductId(product);

    if (!productId || removing[productId]) return;

    setRemoving((previous) => ({
      ...previous,
      [productId]: true,
    }));

    try {
      const response = await removeFromWishlist(productId);

      if (Array.isArray(response?.products)) {
        setWishlist(response.products);
      } else {
        setWishlist((previous) =>
          previous.filter(
            (item) => readProductId(item) !== productId
          )
        );
      }
    } catch (error) {
      console.error("Wishlist remove failed:", error.message);
      alert(error.message || "Product remove nahi hua.");
    } finally {
      setRemoving((previous) => ({
        ...previous,
        [productId]: false,
      }));
    }
  };

  // Open product details
  const onProductOpen = (product) => {
    const productId = readProductId(product);

    navigate("/product", {
      state: {
        productId,
        categoryName:
          typeof product.category === "object"
            ? product.category?.name || "Men"
            : "Men",
        categoryId:
          typeof product.category === "object"
            ? product.category?._id || ""
            : "",
      },
    });
  };

  // Add to cart
  const onMoveToCart = async (product) => {
    const token = localStorage.getItem("token");
    const productId = String(product?._id || product?.id || "");

    if (!token) {
      alert("Cart mein product add karne ke liye pehle login karo.");
      navigate("/auth");
      return;
    }

    if (!productId) {
      alert("Product ID nahi mili.");
      return;
    }

    try {
      await addToCart({
        productId,
        quantity: 1,
      });

      navigate("/cart");
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert(error.message || "Product cart mein add nahi hua.");
    }
  };

  return (
    <div className="w-full bg-slate-950 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase flex items-center gap-2">
              Saved Items
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Your curated list of favorite luxury products
            </p>
          </div>

          <span className="bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 backdrop-blur-md">
            <Sparkles size={14} className="text-amber-400" />
            {wishlist.length} Items
          </span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-slate-900/60 rounded-2xl p-16 text-center border border-slate-800/80 backdrop-blur-md space-y-3">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider">
              Loading wishlist...
            </p>
          </div>
        ) : wishlist.length > 0 ? (

          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => {
              const productId = readProductId(product);
              const image = readProductImage(product);
              const price = Number(product.price || 0);
              const rating = Number(product.rating || 0);

              return (
                <div
                  key={productId}
                  className="group bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80 backdrop-blur-md hover:border-amber-400/40 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-xl"
                >
                  {/* Product Image */}
                  <div
                    onClick={() => onProductOpen(product)}
                    className="relative w-full h-56 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-4 border border-slate-800 cursor-pointer group-hover:border-slate-700 transition-colors"
                  >
                    <img
                      src={
                        image ||
                        "https://placehold.co/600x600/png?text=Product"
                      }
                      alt={product.name || "Product"}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Remove Heart Button */}
                    <button
                      type="button"
                      disabled={Boolean(removing[productId])}
                      onClick={(event) => {
                        event.stopPropagation();
                        onRemoveFromWishlist(product);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-md"
                      title="Remove from wishlist"
                      aria-label="Remove from wishlist"
                    >
                      <Heart size={16} fill="currentColor" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="pt-4 pb-1 space-y-2">
                    <h3
                      onClick={() => onProductOpen(product)}
                      className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate cursor-pointer"
                    >
                      {product.name || "Unnamed Product"}
                    </h3>

                    <div className="flex items-center justify-between">
                      <p className="text-base font-extrabold text-white font-mono">
                        ₹{price.toLocaleString("en-IN")}
                      </p>

                      <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-lg">
                        <Star
                          size={11}
                          className="text-amber-400 fill-amber-400"
                        />
                        <span className="text-[11px] font-bold text-amber-300">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart CTA */}
                    <button
                      type="button"
                      onClick={() => onMoveToCart(product)}
                      className="w-full mt-3 bg-gradient-to-r from-amber-400 to-rose-500 hover:brightness-110 text-slate-950 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10"
                    >
                      <ShoppingBag size={14} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (

          /* Empty State */
          <div className="bg-slate-900/60 rounded-2xl p-16 text-center border border-slate-800/80 backdrop-blur-md space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 text-amber-400 border border-slate-700 flex items-center justify-center mx-auto shadow-lg">
              <Heart size={28} />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">
                Your Wishlist is Empty
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                Save items you love by clicking the heart icon while browsing our luxury store.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/product")}
              className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
            >
              Explore Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;