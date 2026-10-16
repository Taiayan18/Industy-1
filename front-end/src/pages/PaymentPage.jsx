import React, { useState } from "react";
import { Lock, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import OrderCompletePage from "./OrderCompletePage";
import { createOrder, verifyResponse } from "../api/api";
import { useNavigate } from "react-router-dom";

const PaymentPage = ({
  selectedAddress,
  orderItems = [],
  subtotal = 0,
  shipping = 0,
  total,
}) => {
  const [loading, setLoading] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const navigate = useNavigate();

  // Actual amount from CheckoutPage
  const totalAmount = Number(total ?? subtotal + shipping);

  const onPayNowClick = async () => {
    if (loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh the page.");
      return;
    }

    if (totalAmount <= 0) {
      alert("Invalid payment amount.");
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      alert("Razorpay Key ID missing. Check frontend .env");
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      // 1. Create order on backend
      const data = await createOrder(totalAmount);

      if (!data.success || !data.order?.id) {
        throw new Error(data.message || "Unable to create order.");
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: razorpayKey,
        amount: data.order.amount,
        currency: data.order.currency || "INR",
        name: "VELORA Luxe",
        description: "Luxury Boutique Order",
        order_id: data.order.id,

        prefill: {
          name: selectedAddress?.name || "",
          contact: selectedAddress?.phone || "",
        },

        theme: {
          color: "#F59E0B",
        },

        // 3. Verify payment on backend
        handler: async (paymentResponse) => {
          try {
            const addressText = selectedAddress
              ? [
                  selectedAddress.name,
                  selectedAddress.street || selectedAddress.address,
                  selectedAddress.city,
                  selectedAddress.state,
                  selectedAddress.pincode || selectedAddress.zipCode,
                  selectedAddress.phone || selectedAddress.mobile,
                ]
                  .filter(Boolean)
                  .join(", ")
              : "";

            if (!addressText) {
              throw new Error("Please select a valid shipping address.");
            }

            // Backend payment verify + MongoDB order create + cart clear
            const result = await verifyResponse(
              paymentResponse,
              [
                selectedAddress?.name,
                selectedAddress?.street || selectedAddress?.address,
                selectedAddress?.city,
                selectedAddress?.state,
                selectedAddress?.pincode || selectedAddress?.zipCode,
                selectedAddress?.phone || selectedAddress?.mobile,
              ].filter(Boolean).join(", ")
            );

            if (!result.success || !result.order) {
              throw new Error(
                result.message || "Unable to save order in database."
              );
            }

            localStorage.setItem(
              "lastOrder",
              JSON.stringify(result.order)
            );

            navigate("/order-complete", {
              state: { order: result.order },
              replace: true,
            });
          } catch (error) {
            console.error("Order placement error:", error);
            alert(error.message || "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        alert(
          response.error?.description || "Payment failed. Try again."
        );
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      alert(error.message || "Unable to start payment.");
      setLoading(false);
    }
  };

  // Successful payment screen
  if (isOrderPlaced) {
    return (
      <OrderCompletePage
        onGoHome={() => {
          window.location.href = "/";
        }}
      />
    );
  }

  return (
    <div className="w-full bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-100">
      <div className="max-w-xl mx-auto space-y-8">

        {/* Header Badge */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-300">
            <Sparkles size={13} className="text-amber-400" /> Secure Checkout
          </span>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white">
            Payment Method
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="grid grid-cols-3 gap-2 px-2">
          {["Shipping", "Payment", "Complete"].map(
            (step, index) => (
              <div key={step} className="text-center">
                <div
                  className={`mx-auto w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    index <= 1
                      ? "bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 shadow-lg shadow-amber-400/10"
                      : "bg-slate-900 border border-slate-800 text-slate-400"
                  }`}
                >
                  {index < 1 ? "✓" : index + 1}
                </div>
                <p className={`text-[11px] font-semibold mt-2 tracking-wider uppercase ${index <= 1 ? "text-amber-400" : "text-slate-400"}`}>{step}</p>
              </div>
            )
          )}
        </div>

        {/* Payment Gateway */}
        <section className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/80 space-y-4 shadow-xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Select Payment Method
          </h2>

          <div className="border border-amber-400/40 bg-slate-900 rounded-xl p-4 flex items-center gap-4 shadow-lg shadow-amber-400/5">
            <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck size={26} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight">
                Razorpay Secure Checkout
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                UPI, Google Pay, PhonePe, Cards and Net Banking
              </p>
            </div>

            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">
              Secure
            </span>
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/80 space-y-4 shadow-xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Order Summary ({orderItems.length})
          </h2>

          <div className="space-y-3 divide-y divide-slate-800/80">
            {orderItems.map((item) => {
              const name =
                item.name || item.product?.name || "Product";

              const price = Number(
                item.price || item.product?.price || 0
              );

              const quantity = Number(item.quantity || 1);

              return (
                <div
                  key={item.id || item._id}
                  className="flex justify-between gap-3 text-xs sm:text-sm pt-3 first:pt-0"
                >
                  <span className="text-slate-300 font-medium">
                    {name} <span className="text-amber-400 font-mono">× {quantity}</span>
                  </span>

                  <span className="font-extrabold text-white whitespace-nowrap font-mono">
                    ₹{(price * quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-800/80 pt-3 flex justify-between text-xs sm:text-sm text-slate-300 font-medium">
            <span>Subtotal</span>
            <span className="font-mono font-semibold text-white">
              ₹{Number(subtotal).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between text-xs sm:text-sm text-slate-300 font-medium">
            <span>Shipping</span>
            <span className="text-emerald-400 font-semibold">
              {shipping === 0
                ? "Free Delivery"
                : `₹${Number(shipping).toLocaleString("en-IN")}`}
            </span>
          </div>

          <div className="border-t border-slate-800/80 pt-4 flex justify-between items-center font-extrabold text-white">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Total Payable</span>
            <span className="text-lg font-mono text-amber-400">
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Lock size={14} />
            <span>Encrypted & secure payment through Razorpay</span>
          </div>
        </section>

        {/* Pay Button */}
        <button
          type="button"
          onClick={onPayNowClick}
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-400 to-rose-500 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-extrabold py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-400/10 active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <span>
            {loading
              ? "Processing Payment..."
              : `Pay ₹${totalAmount.toLocaleString("en-IN")} with Razorpay`}
          </span>
          <ArrowRight size={16} />
        </button>

      </div>
    </div>
  );
};

export default PaymentPage;