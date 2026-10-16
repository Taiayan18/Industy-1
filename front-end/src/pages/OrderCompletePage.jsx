import React from "react";
import { CheckCircle2, Package, Home, Sparkles, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderCompletePage = ({ order: orderProp, onGoHome }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Actual order data: props or React Router state
  const order =
    orderProp ||
    location.state?.order ||
    JSON.parse(localStorage.getItem("lastOrder") || "null");

  const onBackToHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      navigate("/");
    }
  };

  // No dummy products: show only the products actually ordered
  const rawItems =
    order?.items ||
    order?.products ||
    order?.cartItems ||
    order?.orderItems ||
    [];

  const items = rawItems.map((item, index) => {
    const product = item.product || item.productId || item;

    const price = Number(
      item.price ?? product.price ?? item.unitPrice ?? 0
    );

    const quantity = Number(item.quantity ?? item.qty ?? 1);

    const image =
      item.image ||
      item.images?.[0] ||
      product.image ||
      product.images?.[0] ||
      "";

    const attributes = [
      item.size && `Size: ${item.size}`,
      item.color && `Color: ${item.color}`,
      item.selectedSize && `Size: ${item.selectedSize}`,
      item.selectedColor && `Color: ${item.selectedColor}`,
    ].filter(Boolean);

    return {
      id: item._id || item.id || product._id || index,
      name: item.name || product.name || "Product",
      image,
      variant: attributes.join(" | "),
      price,
      quantity,
      subtotal: Number(item.subtotal ?? price * quantity),
    };
  });

  const totalAmount = Number(
    order?.totalAmount ??
    order?.amount ??
    items.reduce((total, item) => total + item.subtotal, 0)
  );

  const orderId = order?.orderId || order?._id || order?.id;
  const paymentId = order?.paymentId;

  // Don't show a success page without a confirmed order.
  if (!order || items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 font-sans">
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800/80 p-8 sm:p-10 text-center max-w-md shadow-2xl backdrop-blur-xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
            <Package size={32} />
          </div>
          <h1 className="text-xl font-extrabold text-white uppercase tracking-tight">
            Order Details Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
            Please return to your cart and try again. Your order details
            haven't been passed to this page.
          </p>
          <button
            onClick={onBackToHome}
            className="mt-2 w-full bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 px-6 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-100">
      <div className="max-w-xl mx-auto space-y-8">

        {/* Progress Tracker */}
        <div className="grid grid-cols-3 gap-2 px-2">
          {["Shipping", "Payment", "Complete"].map((step, index) => (
            <div key={step} className="text-center">
              <div
                className="mx-auto w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 shadow-lg shadow-amber-400/10"
              >
                ✓
              </div>
              <p className="text-[11px] font-semibold mt-2 tracking-wider uppercase text-amber-400">
                {step}
              </p>
            </div>
          ))}
        </div>

        {/* Confirmation Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-amber-300">
              <Sparkles size={11} className="text-amber-400" /> Confirmed
            </span>
            <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">
              Order Placed Successfully!
            </h1>

            {orderId && (
              <p className="text-xs font-semibold text-slate-400 mt-2">
                Order ID:{" "}
                <span className="font-mono text-amber-400 font-bold">{orderId}</span>
              </p>
            )}
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Package size={16} className="text-amber-400" />
              <span>
                {order?.estimatedDelivery || "Estimated Delivery: 3 - 5 Business Days"}
              </span>
            </div>

            {paymentId && (
              <p className="text-xs text-slate-400 font-mono break-all">
                Payment ID: {paymentId}
              </p>
            )}

            {order?.paymentStatus && (
              <p className="text-xs text-slate-400 font-medium">
                Payment Status: <span className="text-emerald-400 font-semibold uppercase">{order.paymentStatus}</span>
              </p>
            )}
          </div>
        </div>

        {/* Actual Ordered Products */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Order Items Summary
          </h2>

          <div className="space-y-3.5 divide-y divide-slate-800/80">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3.5 pt-3.5 first:pt-0"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center p-1">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Package size={22} className="text-slate-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    {item.name}
                  </h4>

                  {item.variant && (
                    <p className="text-[11px] text-slate-400 font-medium">
                      {item.variant}
                    </p>
                  )}

                  <p className="text-[11px] text-slate-500 font-medium">
                    Qty: {item.quantity}
                  </p>
                </div>

                <span className="text-xs font-extrabold text-white whitespace-nowrap font-mono">
                  ₹ {item.subtotal.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center text-sm font-extrabold text-white">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Total Paid</span>
            <span className="text-base font-mono text-amber-400">₹ {totalAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={onBackToHome}
          className="w-full bg-gradient-to-r from-amber-400 to-rose-500 hover:brightness-110 text-slate-950 font-extrabold py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-400/10 active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <Home size={18} />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};

export default OrderCompletePage;