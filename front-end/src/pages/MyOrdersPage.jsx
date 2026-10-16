import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  MapPin,
  Truck,
  Calendar,
  Sparkles,
  Receipt,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../api/api";

const MyOrdersPage = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Order status resolver
  const resolveStatus = (status) => {
    if (status?.toLowerCase() === "delivered") return "Delivered";

    if (["cancelled", "canceled"].includes(status?.toLowerCase())) {
      return "Canceled";
    }

    return "Processing";
  };

  // Shape raw backend order data
  const shapeOrderForView = (order) => ({
    id: order.orderNumber || order.orderId || order._id,
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-IN")
      : "Date unavailable",

    status: resolveStatus(order.status),
    totalAmount: Number(order.totalAmount || order.amount || 0),

    shippingAddress:
      typeof order.shippingAddress === "string"
        ? order.shippingAddress
        : [
            order.shippingAddress?.name,
            order.shippingAddress?.phone,
            order.shippingAddress?.street,
            order.shippingAddress?.city,
            order.shippingAddress?.state,
            order.shippingAddress?.pincode,
          ]
            .filter(Boolean)
            .join(", ") || "Address unavailable",

    paymentMethod:
      order.paymentMethod || (order.paymentId ? "Razorpay" : "Not available"),

    items: (order.items || []).map((item) => {
      const product =
        typeof item.product === "object" ? item.product : null;

      return {
        productId: product?._id || item.productId || item.product,
        name: item.name || product?.name || "Product",
        image:
          item.image ||
          item.productImage ||
          product?.images?.[0] ||
          product?.image ||
          "",
        price: Number(item.price || product?.price || 0),
        quantity: Number(item.quantity || 1),
        variant: item.variant || item.size || item.color || "Standard",
      };
    }),
  });

  // Fetch orders
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyOrders();

      const data = Array.isArray(response)
        ? response
        : response?.orders || response?.data?.orders || [];

      setOrders(data.map(shapeOrderForView));
    } catch (err) {
      console.error(err);
      setError("Orders load nahi ho sake. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Navigate to product detail
  const goToProduct = (productId) => {
    if (!productId || typeof productId === "object") {
      alert("Product ID available nahi hai.");
      return;
    }

    navigate("/product", {
      state: { productId: String(productId) },
    });
  };

  // Status Badge Component
  const OrderStatusPill = ({ status }) => {
    const styles = {
      Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      Processing: "bg-amber-400/10 text-amber-300 border-amber-400/30",
      Canceled: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    };

    const Icon =
      status === "Delivered"
        ? CheckCircle2
        : status === "Processing"
          ? Clock
          : XCircle;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${
          styles[status] || styles.Processing
        }`}
      >
        <Icon size={13} />
        {status}
      </span>
    );
  };

  const filteredOrders = orders.filter(
    (order) => activeTab === "All" || order.status === activeTab
  );

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  // Single Order Details View
  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 font-sans text-slate-100">
        <div className="max-w-3xl mx-auto space-y-6">
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 transition-all active:scale-95 shadow-md"
          >
            <ChevronLeft size={16} />
            Back to My Orders
          </button>

          {/* Order Reference Card */}
          <div className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 backdrop-blur-md space-y-6 shadow-xl">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800/80 pb-5">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Order Reference</p>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-0.5">{selectedOrder.id}</h1>
              </div>
              <OrderStatusPill status={selectedOrder.status} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <p className="text-xs text-slate-400 flex gap-2 items-center font-medium">
                  <Calendar size={14} className="text-amber-400" /> Order Date
                </p>
                <p className="font-semibold text-white mt-1.5 text-sm">{selectedOrder.date}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <p className="text-xs text-slate-400 flex gap-2 items-center font-medium">
                  <Truck size={14} className="text-amber-400" /> Payment Mode
                </p>
                <p className="font-semibold text-white mt-1.5 text-sm">
                  {selectedOrder.paymentMethod}
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <p className="text-xs text-slate-400 flex gap-2 items-center mb-2 font-medium">
                <MapPin size={14} className="text-amber-400" /> Shipping Address
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-relaxed">
                {selectedOrder.shippingAddress}
              </p>
            </div>
          </div>

          {/* Items Breakdown Card */}
          <div className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 backdrop-blur-md space-y-5 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800/80 pb-3 flex items-center gap-2">
              <Receipt size={15} className="text-amber-400" />
              Items Purchased ({selectedOrder.items.length})
            </h2>

            {selectedOrder.items.map((item, index) => (
              <div
                key={`${item.productId || item.name}-${index}`}
                className="flex items-center justify-between gap-4 py-2 border-b border-slate-800/40 last:border-0"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <button
                    onClick={() => goToProduct(item.productId)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-950 border border-slate-800/80 p-2 shrink-0 overflow-hidden hover:border-amber-400/40 transition-colors"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="mx-auto text-slate-600 mt-3" />
                    )}
                  </button>

                  <div className="min-w-0 space-y-0.5">
                    <button
                      onClick={() => goToProduct(item.productId)}
                      className="text-left text-xs sm:text-sm font-bold text-white hover:text-amber-300 transition-colors truncate block"
                    >
                      {item.name}
                    </button>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Variant: {item.variant}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="font-extrabold text-sm sm:text-base text-white shrink-0">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            ))}

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-5">
              <span className="font-semibold text-xs sm:text-sm text-slate-300">Total Amount Paid</span>
              <span className="font-extrabold text-lg sm:text-xl text-amber-400 font-mono">
                ₹{selectedOrder.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Orders List View
  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-100">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              My Orders
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Check your recent orders and track their delivery status
            </p>
          </div>

          <span className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold px-4 py-2 rounded-xl self-start sm:self-auto backdrop-blur-md">
            <Sparkles size={14} className="text-amber-400" />
            {filteredOrders.length} Orders
          </span>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["All", "Delivered", "Processing", "Canceled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 shadow-md shadow-amber-400/10"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl space-y-2">
            <p className="font-semibold text-xs">{error}</p>
            <button onClick={loadOrders} className="underline text-xs font-bold hover:text-rose-300">
              Try Again
            </button>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:border-amber-400/30 transition-all duration-300 shadow-xl"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <button
                    onClick={() => goToProduct(order.items[0]?.productId)}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-950 border border-slate-800 p-2 shrink-0 overflow-hidden hover:border-amber-400/40 transition-colors"
                  >
                    {order.items[0]?.image ? (
                      <img
                        src={order.items[0].image}
                        alt={order.items[0].name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="mx-auto text-slate-600 mt-4" />
                    )}
                  </button>

                  <div className="min-w-0 space-y-2">
                    <p className="text-[11px] font-mono font-semibold text-amber-400/90">
                      {order.id}
                    </p>

                    <OrderStatusPill status={order.status} />

                    <button
                      onClick={() => goToProduct(order.items[0]?.productId)}
                      className="block text-left text-xs sm:text-sm font-bold text-white hover:text-amber-300 transition-colors truncate"
                    >
                      {order.items[0]?.name || "Order items"}
                      {order.items.length > 1
                        ? ` + ${order.items.length - 1} more item(s)`
                        : ""}
                    </button>

                    <p className="text-[11px] text-slate-400 font-medium">
                      Placed on {order.date}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-0 border-slate-800/80 pt-3 sm:pt-0">
                  <p className="text-base sm:text-lg font-extrabold text-white font-mono">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </p>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-16 text-center backdrop-blur-md space-y-3">
            <Package size={36} className="mx-auto text-slate-600 mb-2" />
            <h3 className="font-bold text-white text-base">
              {error ? "Unable to Load Orders" : "No Orders Found"}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {error
                ? "Please check your connection and try again."
                : `No orders found under "${activeTab}" filter.`}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrdersPage;