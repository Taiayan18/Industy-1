import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  ChevronDown,
  Filter,
  Layers,
  Heart,
  Sparkles,
  PackageX,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductDetailPage from "./ProductDetailPage";
import {
  getCategorydata,
  getProductdata,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/api";

const priceRanges = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-1000", label: "Under ₹1,000", min: 0, max: 1000 },
  { id: "1000-2000", label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { id: "2000-5000", label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
  { id: "above-5000", label: "Above ₹5,000", min: 5000, max: Infinity },
];

const ShopPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handledProductId = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.categoryName || "Men"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    location.state?.categoryId || ""
  );
  const [product, setProduct] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Database wishlist state
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistUpdating, setWishlistUpdating] = useState({});

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.key]);

  // Get category name
  const readCategoryName = (value) => {
    if (!value) return "";
    if (typeof value === "object") {
      return value.name || value.title || "";
    }
    return String(value);
  };

  // Get category ID
  const readCategoryId = (value) => {
    if (!value) return "";
    if (typeof value === "object") {
      return String(value._id || value.id || "");
    }
    return String(value);
  };

  // Get product ID
  const readProductId = (item) =>
    String(item?._id || item?.id || item?.sku || "");

  // Load wishlist from database
  useEffect(() => {
    let active = true;

    const syncWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          if (active) setWishlist([]);
          return;
        }

        const response = await getWishlist();
        if (active) {
          setWishlist(
            Array.isArray(response?.products) ? response.products : []
          );
        }
      } catch (error) {
        console.error("Wishlist load failed:", error.message);
      } finally {
        if (active) setWishlistLoading(false);
      }
    };

    syncWishlist();

    return () => {
      active = false;
    };
  }, []);

  // Add/remove product from database wishlist
  const flipWishlist = async (item) => {
    const productId = readProductId(item);

    if (!productId) {
      alert("Product ID nahi mili.");
      return;
    }

    if (!localStorage.getItem("token")) {
      alert("Wishlist use karne ke liye pehle login karo.");
      navigate("/auth");
      return;
    }

    if (wishlistUpdating[productId]) return;

    const alreadyExists = wishlist.some(
      (wishlistItem) => readProductId(wishlistItem) === productId
    );

    setWishlistUpdating((previous) => ({
      ...previous,
      [productId]: true,
    }));

    try {
      const response = alreadyExists
        ? await removeFromWishlist(productId)
        : await addToWishlist(productId);

      if (Array.isArray(response?.products)) {
        setWishlist(response.products);
      } else {
        setWishlist((previous) =>
          alreadyExists
            ? previous.filter(
                (wishlistItem) => readProductId(wishlistItem) !== productId
              )
            : [...previous, item]
        );
      }

      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Wishlist update failed:", error.message);
      alert(error.message || "Wishlist update nahi hui.");
    } finally {
      setWishlistUpdating((previous) => ({
        ...previous,
        [productId]: false,
      }));
    }
  };

  // Current selected category
  const currentCategoryObj = categoriesData.find(
    (category) => category.name === selectedCategory
  );

  // Change main category
  const onCategorySelect = (categoryName) => {
    const category = categoriesData.find(
      (item) => item.name === categoryName
    );

    setSelectedCategory(categoryName);
    setSelectedCategoryId(String(category?._id || ""));
    setSelectedSubCategory("All");
  };

  // Fetch products and categories
  useEffect(() => {
    let active = true;

    const loadShopData = async () => {
      try {
        setLoading(true);

        const [productRes, categoryRes] = await Promise.all([
          getProductdata(),
          getCategorydata(),
        ]);

        const products =
          productRes?.data?.data || productRes?.data || [];
        const categories =
          categoryRes?.data?.data || categoryRes?.data || [];

        const safeProducts = Array.isArray(products) ? products : [];
        const safeCategories = Array.isArray(categories) ? categories : [];

        if (!active) return;

        setProduct(safeProducts);
        setAllCategories(safeCategories);

        const parentCategories = safeCategories
          .filter((category) => {
            const parentId = readCategoryId(category.parentCategory);
            return (
              !parentId ||
              parentId === "null" ||
              parentId === "undefined"
            );
          })
          .map((category) => ({
            ...category,
            subCategories: [
              "All",
              ...safeCategories
                .filter(
                  (subCategory) =>
                    readCategoryId(subCategory.parentCategory) ===
                    String(category._id)
                )
                .map((subCategory) => subCategory.name),
            ],
          }));

        setCategoriesData(parentCategories);

        const passedCategoryId = location.state?.categoryId;
        const passedCategoryName = location.state?.categoryName;

        const matchedCategory = parentCategories.find((category) => {
          const idMatches =
            passedCategoryId &&
            String(category._id) === String(passedCategoryId);

          const nameMatches =
            passedCategoryName &&
            category.name?.toLowerCase() ===
            passedCategoryName.toLowerCase();

          return idMatches || nameMatches;
        });

        const defaultCategory =
          matchedCategory ||
          parentCategories.find((category) => category.name === "Men") ||
          parentCategories[0];

        if (defaultCategory) {
          setSelectedCategory(defaultCategory.name);
          setSelectedCategoryId(String(defaultCategory._id));
          setSelectedSubCategory("All");
        }
      } catch (error) {
        console.error(
          "Shop data fetch failed:",
          error.response?.data || error.message
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadShopData();

    return () => {
      active = false;
    };
  }, []);

  // Open a product passed from My Orders
  useEffect(() => {
    const requestedProductId = location.state?.productId;

    if (!requestedProductId || product.length === 0) return;
    if (handledProductId.current === String(requestedProductId)) return;

    const matchedProduct = product.find(
      (item) =>
        String(item._id || item.id) === String(requestedProductId)
    );

    if (!matchedProduct) return;

    handledProductId.current = String(requestedProductId);
    setSelectedProduct(matchedProduct);

    navigate(location.pathname, {
      replace: true,
      state: {
        categoryName: location.state?.categoryName || "Men",
        categoryId: location.state?.categoryId || "",
      },
    });
  }, [product, location.state?.productId, location.pathname, navigate]);

  // Check whether product belongs to a parent category
  const isUnderParentCategory = (category, parentId) => {
    let currentCategory = category;
    const visited = new Set();

    while (currentCategory) {
      const currentId = readCategoryId(currentCategory);
      if (!currentId || visited.has(currentId)) break;
      visited.add(currentId);

      const foundCategory = allCategories.find(
        (item) => String(item._id) === currentId
      );

      if (!foundCategory) return false;

      const foundParentId = readCategoryId(foundCategory.parentCategory);

      if (foundParentId === String(parentId)) return true;
      if (!foundParentId) return false;

      currentCategory = foundParentId;
    }

    return false;
  };

  // Filter products
  const filteredProducts = product.filter((item) => {
    const categoryValue = item.category || item.categoryId;
    const categoryId = readCategoryId(categoryValue);

    const productCategory = allCategories.find(
      (category) => String(category._id) === categoryId
    );

    const productCategoryName =
      productCategory?.name || readCategoryName(categoryValue);

    const activeCategoryId = String(
      selectedCategoryId || currentCategoryObj?._id || ""
    );

    const isMainCategoryMatch =
      productCategoryName.toLowerCase() === selectedCategory.toLowerCase() ||
      (activeCategoryId !== "" &&
        isUnderParentCategory(categoryId, activeCategoryId));

    const isSubCategoryMatch =
      selectedSubCategory === "All" ||
      productCategoryName.toLowerCase() ===
      selectedSubCategory.toLowerCase();

    const activePriceRange = priceRanges.find(
      (range) => range.id === selectedPriceRange
    );

    const price = Number(item.price || 0);

    const isPriceMatch =
      activePriceRange &&
      price >= activePriceRange.min &&
      price <= activePriceRange.max;

    return isMainCategoryMatch && isSubCategoryMatch && isPriceMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "low-high") {
      return Number(a.price || 0) - Number(b.price || 0);
    }
    if (sortBy === "high-low") {
      return Number(b.price || 0) - Number(a.price || 0);
    }
    return Number(b.reviews || 0) - Number(a.reviews || 0);
  });

  // Product detail page
  if (selectedProduct) {
    return (
      <ProductDetailPage
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <div className="w-full bg-slate-950 min-h-screen pb-16 font-sans text-slate-100">
      
      {/* Top Luxe Banner */}
      <div className="relative w-full h-48 sm:h-64 bg-slate-950 overflow-hidden flex items-center justify-center text-center px-4 border-b border-slate-800">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
          alt="Category Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-25 filter grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-md">
            <Sparkles size={13} className="text-amber-400" /> Velvet Catalog
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
            {selectedCategory}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium">
            Explore our curated luxury collection in {selectedCategory.toLowerCase()}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filters */}
          <aside className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md h-fit space-y-6 shadow-xl">
            
            {/* Primary Category */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <Filter size={15} className="text-amber-400" />
                Primary Category
              </h3>

              <ul className="space-y-1.5">
                {categoriesData.map((cat) => {
                  const isActive = selectedCategory === cat.name;

                  return (
                    <li key={cat._id || cat.name}>
                      <button
                        onClick={() => onCategorySelect(cat.name)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                          isActive
                            ? "bg-amber-400/10 text-amber-300 border border-amber-400/30 shadow-inner"
                            : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                        }`}
                      >
                        <span>{cat.name}</span>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Subcategories */}
            {currentCategoryObj && (
              <div className="pt-5 border-t border-slate-800/80">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <Layers size={15} className="text-amber-400" />
                  Sub-Categories
                </h3>

                <div className="flex flex-wrap lg:flex-col gap-1.5">
                  {(currentCategoryObj.subCategories || ["All"]).map(
                    (subCat) => (
                      <button
                        key={subCat}
                        onClick={() => setSelectedSubCategory(subCat)}
                        className={`text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                          selectedSubCategory === subCat
                            ? "bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-bold shadow-md shadow-amber-400/10"
                            : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        {subCat}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="pt-5 border-t border-slate-800/80">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                Price Range
              </h3>

              <div className="space-y-2.5">
                {priceRanges.map((range) => (
                  <label
                    key={range.id}
                    className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 cursor-pointer hover:text-white font-medium"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={selectedPriceRange === range.id}
                      onChange={() => setSelectedPriceRange(range.id)}
                      className="w-4 h-4 text-amber-400 bg-slate-900 border-slate-700 focus:ring-amber-400 accent-amber-400 cursor-pointer"
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Main Products */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md shadow-lg">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>{selectedCategory}</span>
                  {selectedSubCategory !== "All" && (
                    <span className="text-amber-400 font-medium text-sm">
                      / {selectedSubCategory}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Showing {sortedProducts.length} items available
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <span>Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-white focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                  >
                    <option value="popular">Popularity</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Product Cards Grid */}
            {loading ? (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-16 text-center space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent mx-auto" />
                <p className="text-slate-400 font-semibold text-xs tracking-wider uppercase">
                  Loading Collections...
                </p>
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {sortedProducts.map((item) => {
                  const productCategoryId = readCategoryId(
                    item.category || item.categoryId
                  );

                  const categoryName =
                    allCategories.find(
                      (category) =>
                        String(category._id) === productCategoryId
                    )?.name ||
                    readCategoryName(item.category || item.categoryId);

                  const productImage = Array.isArray(item.images)
                    ? item.images[0]
                    : item.image;

                  const price = Number(item.price || 0);
                  const originalPrice = Number(item.originalPrice || 0);

                  const discount =
                    originalPrice > price && originalPrice > 0
                      ? Math.round(
                          ((originalPrice - price) / originalPrice) * 100
                        )
                      : 0;

                  const productId = readProductId(item);

                  const isWishlisted = wishlist.some(
                    (wishlistItem) =>
                      readProductId(wishlistItem) === productId
                  );

                  const isUpdating = Boolean(wishlistUpdating[productId]);

                  return (
                    <div
                      key={productId || item.name}
                      onClick={() => setSelectedProduct(item)}
                      className="group relative bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md hover:border-amber-400/40 hover:bg-slate-900 hover:shadow-2xl hover:shadow-amber-400/5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                    >
                      {/* Image & Discount Badge */}
                      <div className="relative w-full h-56 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-3 border border-slate-800 group-hover:border-slate-700 transition-colors">
                        <img
                          src={
                            productImage ||
                            "https://placehold.co/600x600/png?text=Product"
                          }
                          alt={item.name || "Product"}
                          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                        />

                        {discount > 0 && (
                          <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md">
                            {discount}% OFF
                          </span>
                        )}

                        {/* Wishlist Action Button */}
                        <button
                          type="button"
                          disabled={isUpdating || wishlistLoading}
                          onClick={(e) => {
                            e.stopPropagation();
                            flipWishlist(item);
                          }}
                          aria-label={
                            isWishlisted
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          className={`absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-md border transition-all duration-200 ${
                            isWishlisted
                              ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                              : "bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10"
                          } ${
                            isUpdating || wishlistLoading
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <Heart
                            size={16}
                            fill={isWishlisted ? "currentColor" : "none"}
                          />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="pt-4 pb-1 space-y-2">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">
                          {categoryName}
                        </span>

                        <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {item.name}
                        </h3>

                        {/* Price & Rating */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-base font-extrabold text-white">
                              ₹{price.toLocaleString("en-IN")}
                            </p>
                            {discount > 0 && (
                              <p className="text-xs text-slate-500 line-through">
                                ₹{originalPrice.toLocaleString("en-IN")}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-lg">
                            <Star size={11} className="text-amber-400 fill-amber-400" />
                            <span className="text-[11px] font-bold text-amber-300">
                              {Number(item.rating || 0).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-16 text-center space-y-4 backdrop-blur-md">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-amber-400 border border-slate-700 mx-auto shadow-lg">
                  <PackageX size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">No Products Found</h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                    Selected filter or sub-category me koi products available nahi hain.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedSubCategory("All");
                    setSelectedPriceRange("all");
                  }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};

export default ShopPage;