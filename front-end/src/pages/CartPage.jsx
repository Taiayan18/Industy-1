import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, X, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingItem, setUpdatingItem] = useState(null);
    const [error, setError] = useState('');

    // Fetch cart data from MongoDB
    const fetchCart = useCallback(async (showLoading = true) => {
        const token = localStorage.getItem('token');

        if (!token) {
            setCartItems([]);
            setError('Please login to view your cart.');
            setLoading(false);
            return;
        }

        try {
            if (showLoading) setLoading(true);
            setError('');

            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to load cart.');
            }

            setCartItems(Array.isArray(data.items) ? data.items : []);
        } catch (err) {
            console.error('Fetch cart error:', err);
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Update product quantity in MongoDB
    const onQuantityUpdate = async (item, delta) => {
        const newQuantity = item.quantity + delta;

        if (newQuantity < 1) return;

        if (item.stock != null && newQuantity > item.stock) {
            alert(`Only ${item.stock} items are available in stock.`);
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            alert('Please login first.');
            return;
        }

        try {
            setUpdatingItem(item.id);

            const response = await fetch(
                `${API_BASE_URL}/cart/${item.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        quantity: newQuantity,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to update quantity.');
            }

            await fetchCart(false);
        } catch (err) {
            console.error('Quantity update error:', err);
            alert(err.message || 'Unable to update quantity.');
        } finally {
            setUpdatingItem(null);
        }
    };

    // Remove product from MongoDB cart
    const onRemoveClick = async (itemId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Please login first.');
            return;
        }

        try {
            setUpdatingItem(itemId);

            const response = await fetch(
                `${API_BASE_URL}/cart/${itemId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to remove product.');
            }

            await fetchCart(false);
        } catch (err) {
            console.error('Remove cart item error:', err);
            alert(err.message || 'Unable to remove product.');
        } finally {
            setUpdatingItem(null);
        }
    };

    // Price calculations
    const subtotal = cartItems.reduce(
        (acc, item) => acc + Number(item.price || 0) * item.quantity,
        0
    );

    const shipping = 0;
    const total = subtotal + shipping;

    const toRupees = (price) =>
        Number(price || 0).toLocaleString('en-IN');

    // Loading state
    if (loading) {
        return (
            <div className="w-full bg-slate-950 min-h-screen py-20 px-4 text-slate-100 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                        Loading your cart...
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full bg-slate-950 min-h-screen py-10 px-4 text-slate-100 flex items-center justify-center">
                <div className="max-w-md w-auto mx-auto">
                    <div className="bg-slate-900/60 rounded-2xl p-8 text-center border border-slate-800/80 backdrop-blur-md space-y-4 shadow-xl">
                        <ShoppingBag
                            size={32}
                            className="mx-auto text-amber-400"
                        />
                        <p className="text-rose-400 text-xs font-semibold">
                            {error}
                        </p>

                        {!localStorage.getItem('token') ? (
                            <Link
                                to="/auth"
                                className="inline-block bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-extrabold shadow-lg hover:brightness-110 transition-all"
                            >
                                Login
                            </Link>
                        ) : (
                            <button
                                onClick={() => fetchCart()}
                                className="bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-extrabold shadow-lg hover:brightness-110 transition-all"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-100">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Cart Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
                            Your Bag
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 font-medium">
                            {cartItems.length} luxury item(s) selected
                        </p>
                    </div>

                    <span className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold px-3.5 py-1.5 rounded-xl backdrop-blur-md">
                        <Sparkles size={13} className="text-amber-400" />
                        Bag
                    </span>
                </div>

                {/* Cart Items List */}
                {cartItems.length > 0 ? (
                    <div className="space-y-4">

                        {cartItems.map((item) => {
                            const variant = [
                                item.size ? `Size: ${item.size}` : '',
                                item.color ? `Color: ${item.color}` : '',
                            ]
                                .filter(Boolean)
                                .join(' | ');

                            return (
                                <div
                                    key={item.id}
                                    className="bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-slate-800/80 backdrop-blur-md flex items-center justify-between gap-4 relative hover:border-amber-400/30 transition-all shadow-xl"
                                >
                                    {/* Product Image */}
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center p-2">
                                        <img
                                            src={
                                                item.image ||
                                                'https://placehold.co/300x300?text=Product'
                                            }
                                            alt={item.name || 'Product'}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <h3 className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
                                                    {item.name}
                                                </h3>

                                                {variant && (
                                                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                                        {variant}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Remove X Button */}
                                            <button
                                                onClick={() =>
                                                    onRemoveClick(item.id)
                                                }
                                                disabled={updatingItem === item.id}
                                                className="text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-40 p-1"
                                                aria-label="Remove product"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>

                                        {/* Price and Quantity */}
                                        <div className="flex items-center justify-between gap-2 pt-2 flex-wrap">
                                            <span className="text-sm sm:text-base font-extrabold text-white font-mono">
                                                ₹ {toRupees(item.price)}
                                            </span>

                                            <div className="flex items-center gap-3">
                                                {/* Quantity Selector */}
                                                <div className="flex items-center gap-3 border border-slate-700/80 rounded-xl px-2.5 py-1 bg-slate-950">
                                                    <button
                                                        onClick={() =>
                                                            onQuantityUpdate(
                                                                item,
                                                                -1
                                                            )
                                                        }
                                                        disabled={
                                                            updatingItem === item.id ||
                                                            item.quantity <= 1
                                                        }
                                                        className="text-slate-400 font-bold hover:text-amber-400 text-sm disabled:opacity-30 transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        -
                                                    </button>

                                                    <span className="text-xs font-bold text-white min-w-[12px] text-center font-mono">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            onQuantityUpdate(
                                                                item,
                                                                1
                                                            )
                                                        }
                                                        disabled={
                                                            updatingItem === item.id
                                                        }
                                                        className="text-slate-400 font-bold hover:text-amber-400 text-sm disabled:opacity-30 transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Delete Icon */}
                                                <button
                                                    onClick={() =>
                                                        onRemoveClick(item.id)
                                                    }
                                                    disabled={updatingItem === item.id}
                                                    className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg bg-slate-950 border border-slate-800 transition-colors disabled:opacity-40"
                                                    aria-label="Delete product"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>

                                        {updatingItem === item.id && (
                                            <p className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase animate-pulse">
                                                Updating...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Price Details */}
                        <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800/80 backdrop-blur-md space-y-3.5 mt-6 shadow-xl">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-800/80 pb-3">
                                Price Details
                            </h2>

                            <div className="flex justify-between text-xs sm:text-sm text-slate-300 font-medium">
                                <span>Subtotal</span>
                                <span className="text-white font-mono font-semibold">
                                    ₹ {toRupees(subtotal)}
                                </span>
                            </div>

                            <div className="flex justify-between text-xs sm:text-sm text-slate-300 font-medium">
                                <span>Shipping</span>
                                <span className="text-emerald-400 font-semibold">
                                    Free Delivery
                                </span>
                            </div>

                            <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center text-base sm:text-lg font-extrabold text-white">
                                <span>Total Amount</span>
                                <span className="text-amber-400 font-mono">₹ {toRupees(total)}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <Link
                            to="/check-out"
                            className="w-full bg-gradient-to-r from-amber-400 to-rose-500 hover:brightness-110 text-slate-950 font-extrabold py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-400/10 active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
                        >
                            <span>Proceed to Checkout</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    /* Empty Cart */
                    <div className="bg-slate-900/60 rounded-2xl p-16 text-center border border-slate-800/80 backdrop-blur-md space-y-4 shadow-xl">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 text-amber-400 border border-slate-700 flex items-center justify-center mx-auto shadow-lg">
                            <ShoppingBag size={28} />
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-bold text-white text-base">
                                Your Bag is Empty
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                                Discover our luxury collections and add your favorite items to bag.
                            </p>
                        </div>

                        <Link
                            to="/product"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all mt-2"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;