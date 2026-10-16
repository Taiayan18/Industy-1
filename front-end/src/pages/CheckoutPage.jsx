import React, { useEffect, useState } from "react";
import { CheckCircle2, MapPin, Plus, Sparkles, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PaymentPage from "./PaymentPage";
import { getAddresses, getCart } from "../api/api";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Empty address form
const emptyAddress = {
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
};

const CheckoutPage = () => {
    const navigate = useNavigate();

    // States
    const [addresses, setAddresses] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [form, setForm] = useState(emptyAddress);
    const [showForm, setShowForm] = useState(false);
    const [payment, setPayment] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Token for API requests
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    // Load addresses and cart
    useEffect(() => {
        const fetchCheckoutData = async () => {
            if (!localStorage.getItem("token")) {
                navigate("/auth");
                return;
            }

            try {
                const addressData = await getAddresses();
                const cartData = await getCart();

                const savedAddresses = addressData.addresses || [];
                const savedCart = cartData.items || [];

                setAddresses(savedAddresses);
                setCartItems(savedCart);

                // Select default address, or first address
                const defaultAddress = savedAddresses.find(
                    (address) => address.isDefault
                );

                setSelectedAddress(
                    defaultAddress?._id || savedAddresses[0]?._id || ""
                );

                // Show form if no address exists
                if (savedAddresses.length === 0) {
                    setShowForm(true);
                }
            } catch (err) {
                setError(err.message || "Failed to load checkout data.");
            } finally {
                setLoading(false);
            }
        };

        fetchCheckoutData();
    }, [navigate]);

    // Update address form
    const onFieldChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    // Save new address
    const addAddress = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(`${API}/address`, {
                method: "POST",
                headers,
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Address save failed.");
            }

            let newAddress = data.address;

            // Refresh addresses if API does not return the saved address
            if (!newAddress?._id) {
                const refreshResponse = await fetch(`${API}/address`, {
                    headers,
                });

                const refreshData = await refreshResponse.json();

                if (!refreshResponse.ok) {
                    throw new Error("Failed to refresh addresses.");
                }

                const updatedAddresses = refreshData.addresses || [];

                setAddresses(updatedAddresses);
                newAddress = updatedAddresses[0];
            } else {
                setAddresses((oldAddresses) => [
                    newAddress,
                    ...oldAddresses,
                ]);
            }

            // Select the newly saved address
            if (newAddress?._id) {
                setSelectedAddress(newAddress._id);
            }

            setForm(emptyAddress);
            setShowForm(false);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        }
    };

    // Get selected address
    const selected = addresses.find(
        (address) => address._id === selectedAddress
    );

    // Calculate total price
    const subtotal = cartItems.reduce((total, item) => {
        const price = Number(item.price || item.product?.price || 0);
        const quantity = Number(item.quantity || 1);

        return total + price * quantity;
    }, 0);

    // Format price in Indian number format
    const money = (amount) =>
        Number(amount || 0).toLocaleString("en-IN");

    // Loading screen
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300 text-sm font-medium">
                Loading secure checkout...
            </div>
        );
    }

    // Payment page
    if (payment) {
        return (
            <PaymentPage
                selectedAddress={selected}
                orderItems={cartItems}
                subtotal={subtotal}
                shipping={0}
                total={subtotal}
            />
        );
    }

    return (
        <div className="w-full bg-slate-950 min-h-screen py-10 px-4 sm:px-6 font-sans text-slate-100">
            <div className="max-w-xl mx-auto space-y-8">

                {/* Header Badge */}
                <div className="text-center space-y-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-300">
                        <Sparkles size={13} className="text-amber-400" /> Secure Checkout
                    </span>
                    <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white">
                        Complete Your Order
                    </h1>
                </div>

                {/* Progress Steps */}
                <div className="grid grid-cols-3 gap-2 px-2">
                    {["Shipping", "Payment", "Complete"].map(
                        (step, index) => (
                            <div key={step} className="text-center">
                                <div
                                    className={`mx-auto w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                                        index === 0
                                            ? "bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 shadow-lg shadow-amber-400/10"
                                            : "bg-slate-900 border border-slate-800 text-slate-400"
                                    }`}
                                >
                                    {index + 1}
                                </div>
                                <p className="text-[11px] font-semibold mt-2 text-slate-300 tracking-wider uppercase">{step}</p>
                            </div>
                        )
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3.5 rounded-xl text-xs font-semibold">
                        {error}
                    </div>
                )}

                {/* Shipping Address */}
                <section className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">
                            Shipping Address
                        </h2>

                        <button
                            type="button"
                            onClick={() => setShowForm(!showForm)}
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"
                        >
                            <Plus size={14} />
                            <span>Add New Address</span>
                        </button>
                    </div>

                    {/* Saved Addresses */}
                    <div className="space-y-3">
                        {addresses.map((address) => (
                            <button
                                type="button"
                                key={address._id}
                                onClick={() =>
                                    setSelectedAddress(address._id)
                                }
                                className={`w-full text-left bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border transition-all ${
                                    selectedAddress === address._id
                                        ? "border-amber-400 ring-1 ring-amber-400/30 shadow-xl shadow-amber-400/5 bg-slate-900"
                                        : "border-slate-800/80 hover:border-slate-700"
                                }`}
                            >
                                <div className="flex gap-3.5 items-start">
                                    <CheckCircle2
                                        size={20}
                                        className={
                                            selectedAddress === address._id
                                                ? "text-amber-400 shrink-0 mt-0.5"
                                                : "text-slate-600 shrink-0 mt-0.5"
                                        }
                                    />

                                    <div className="text-xs space-y-1">
                                        <p className="font-extrabold text-white text-sm">
                                            {address.name}
                                        </p>

                                        <p className="text-slate-300 font-medium">
                                            {address.street}
                                        </p>

                                        <p className="text-slate-400 font-medium">
                                            {address.city}, {address.state} -{" "}
                                            {address.pincode}
                                        </p>

                                        <p className="text-slate-400 pt-1 font-semibold flex items-center gap-1.5">
                                            <MapPin size={13} className="text-amber-400" />
                                            {address.phone}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* New Address Form */}
                    {showForm && (
                        <form
                            onSubmit={addAddress}
                            className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 space-y-4 shadow-2xl"
                        >
                            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400">
                                New Address Details
                            </h3>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 block">Full Name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={onFieldChange}
                                    placeholder="Enter full name"
                                    required
                                    className="w-full bg-slate-950 border border-slate-700/85 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 block">Mobile Number</label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={onFieldChange}
                                    placeholder="10-digit mobile number"
                                    type="tel"
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    required
                                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 block">Street Address</label>
                                <input
                                    name="street"
                                    value={form.street}
                                    onChange={onFieldChange}
                                    placeholder="House No. / Street / Area"
                                    required
                                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300 block">City</label>
                                    <input
                                        name="city"
                                        value={form.city}
                                        onChange={onFieldChange}
                                        placeholder="City"
                                        required
                                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors font-medium"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300 block">State</label>
                                    <input
                                        name="state"
                                        value={form.state}
                                        onChange={onFieldChange}
                                        placeholder="State"
                                        required
                                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 block">PIN Code</label>
                                <input
                                    name="pincode"
                                    value={form.pincode}
                                    onChange={onFieldChange}
                                    placeholder="6-digit PIN Code"
                                    inputMode="numeric"
                                    pattern="[0-9]{6}"
                                    maxLength={6}
                                    required
                                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors font-medium font-mono"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-amber-400 to-rose-500 hover:brightness-110 text-slate-950 font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-400/10 active:scale-[0.99]"
                            >
                                Save Address
                            </button>
                        </form>
                    )}
                </section>

                {/* Order Summary */}
                <section className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/80 space-y-4 shadow-xl">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">
                        Order Summary ({cartItems.length})
                    </h2>

                    {cartItems.length === 0 ? (
                        <div className="text-center py-6">
                            <p className="text-xs text-slate-400">
                                Your bag is empty.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate("/shop")}
                                className="underline mt-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3.5 divide-y divide-slate-800/80">
                            {cartItems.map((item) => {
                                const name =
                                    item.name || item.product?.name || "Product";

                                const image =
                                    item.image ||
                                    item.product?.images?.[0] ||
                                    "https://placehold.co/100";

                                const price = Number(
                                    item.price || item.product?.price || 0
                                );

                                const quantity = Number(item.quantity || 1);

                                return (
                                    <div
                                        key={item.id || item._id}
                                        className="flex items-center gap-3.5 pt-3.5 first:pt-0"
                                    >
                                        <img
                                            src={image}
                                            alt={name}
                                            className="w-14 h-14 rounded-xl object-cover bg-slate-950 border border-slate-800 p-1 shrink-0"
                                        />

                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-white truncate">
                                                {name}
                                            </p>

                                            <p className="text-[11px] text-slate-400 font-medium">
                                                {item.size &&
                                                    `Size: ${item.size}`}
                                                {item.size && item.color && " | "}
                                                {item.color &&
                                                    `Color: ${item.color}`}
                                            </p>

                                            <p className="text-[11px] text-slate-500 font-medium">
                                                Qty: {quantity}
                                            </p>
                                        </div>

                                        <p className="text-xs font-extrabold text-white whitespace-nowrap font-mono">
                                            ₹{money(price * quantity)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Total Price */}
                    <div className="border-t border-slate-800/80 pt-4 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Total Amount</span>
                        <span className="text-lg font-extrabold text-amber-400 font-mono">₹{money(subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-1">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                            <Truck size={14} /> Insured Free Shipping
                        </span>
                        <span className="flex items-center gap-1.5 text-amber-400">
                            <ShieldCheck size={14} /> VIP Secure
                        </span>
                    </div>
                </section>

                {/* Continue to Payment */}
                <button
                    type="button"
                    disabled={!selected || cartItems.length === 0}
                    onClick={() => {
                        if (!selected) {
                            setError(
                                "Please add or select a shipping address."
                            );
                            setShowForm(true);
                            return;
                        }

                        if (cartItems.length === 0) {
                            setError("Your bag is empty.");
                            return;
                        }

                        setError("");
                        setPayment(true);
                    }}
                    className="w-full bg-gradient-to-r from-amber-400 to-rose-500 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-extrabold py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-400/10 active:scale-[0.99] flex items-center justify-center gap-2"
                >
                    <span>{!selected ? "Select Address to Continue" : "Proceed to Payment"}</span>
                    <ArrowRight size={16} />
                </button>

            </div>
        </div>
    );
};

export default CheckoutPage;