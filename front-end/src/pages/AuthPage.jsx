import React, { useState } from 'react';
import { Tag, Zap, Package, Eye, EyeOff, Sparkles, ArrowRight, Compass } from 'lucide-react';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import ForgotPasswordPage from './ForgotPasswordPage';
import { loginData, registerData } from '../api/api';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const navigate = useNavigate();

    // Form State
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
    });

    const onFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const onAuthSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            const res = await loginData(form);

            if (res.status) {
                alert(res.message);
                localStorage.setItem("token", res.token);
                const role = res.role;
                if (role === "admin") {
                    navigate("/dashboard");
                } else {
                    navigate("/");
                }
                setForm({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    rememberMe: false,
                });
            } else {
                alert(res.message);
            }
        } else {
            const res = await registerData(form);

            if (res.status) {
                alert(res.message);
                setIsLogin(true);

                setForm({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });
            } else {
                alert(res.message);
            }
        }
    };

    if (showForgotPassword) {
        return <ForgotPasswordPage onBackToLogin={() => setShowForgotPassword(false)} />;
    }

    return (
        <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans text-slate-100">

            {/* Side-by-Side Main Luxury Container */}
            <div className="w-full max-w-5xl bg-slate-900/80 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-12 border border-slate-800/80 backdrop-blur-xl min-h-[600px]">

                {/* LEFT COLUMN: Luxury Dark Banner */}
                <div className="col-span-12 lg:col-span-5 bg-slate-950 relative flex flex-col justify-between p-6 sm:p-10 text-white overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80">

                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop"
                        alt="VELORA Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60" />

                    {/* Top Logo */}
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-600 text-white shadow-md shadow-rose-500/20">
                            <Sparkles size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-extrabold tracking-wider text-white uppercase font-sans">
                                VELORA<span className="text-amber-400">.</span>
                            </span>
                            <span className="text-[9px] font-semibold tracking-widest text-slate-400 uppercase">
                                Luxe Lifestyle
                            </span>
                        </div>
                    </div>

                    {/* Middle Content */}
                    <div className="relative z-10 my-auto py-8 space-y-6">
                        <div className="space-y-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-md">
                                <Sparkles size={13} className="text-amber-400" /> Exclusive Access
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight uppercase">
                                {isLogin ? 'Welcome Back' : 'Join VELORA Luxe'}
                            </h2>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                                {isLogin
                                    ? 'Access your saved wishlist, track orders, and experience seamless luxury shopping.'
                                    : 'Create your account to unlock curated collections and personalized concierge experiences.'}
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-3.5 pt-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-amber-400 shadow-md">
                                    <Tag size={15} />
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-slate-300">
                                    Curated luxury collections
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-amber-400 shadow-md">
                                    <Zap size={15} />
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-slate-300">
                                    Express & insured shipping
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-amber-400 shadow-md">
                                    <Package size={15} />
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-slate-300">
                                    Real-time shipment tracking
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Copyright */}
                    <div className="relative z-10 text-[10px] text-slate-500 font-medium">
                        © {new Date().getFullYear()} VELORA Luxe Boutique. All rights reserved.
                    </div>
                </div>

                {/* RIGHT COLUMN: Login / Register Form */}
                <div className="col-span-12 lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-slate-900/60 backdrop-blur-md">

                    {/* Tabs Header */}
                    <div className="flex border-b border-slate-800/80 mb-6">
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 text-center pb-3 text-xs sm:text-sm font-extrabold transition-all tracking-widest uppercase ${
                                isLogin
                                    ? 'text-white border-b-2 border-amber-400'
                                    : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 text-center pb-3 text-xs sm:text-sm font-extrabold transition-all tracking-widest uppercase ${
                                !isLogin
                                    ? 'text-white border-b-2 border-amber-400'
                                    : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={onAuthSubmit} className="space-y-4">

                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 block">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={form.name}
                                    onChange={onFieldChange}
                                    required
                                    className="w-full text-xs sm:text-sm font-medium p-3.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 bg-slate-950 text-white placeholder-slate-500 transition-colors"
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 block">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={form.email}
                                onChange={onFieldChange}
                                required
                                className="w-full text-xs sm:text-sm font-medium p-3.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 bg-slate-950 text-white placeholder-slate-500 transition-colors"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-slate-300 block">
                                    Password
                                </label>
                                {isLogin && (
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={onFieldChange}
                                    required
                                    className="w-full text-xs sm:text-sm font-medium p-3.5 pr-10 rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 bg-slate-950 text-white placeholder-slate-500 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 block">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Re-enter your password"
                                    value={form.confirmPassword}
                                    onChange={onFieldChange}
                                    required
                                    className="w-full text-xs sm:text-sm font-medium p-3.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 bg-slate-950 text-white placeholder-slate-500 transition-colors"
                                />
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex items-center gap-2.5 pt-1">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={form.rememberMe}
                                    onChange={onFieldChange}
                                    className="w-4 h-4 text-amber-400 bg-slate-950 border-slate-700 focus:ring-amber-400 accent-amber-400 rounded cursor-pointer"
                                />
                                <label
                                    htmlFor="rememberMe"
                                    className="text-xs font-semibold text-slate-300 cursor-pointer select-none"
                                >
                                    Remember me on this device
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-amber-400 to-rose-500 hover:brightness-110 text-slate-950 font-extrabold py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-400/10 active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
                        >
                            <span>{isLogin ? 'Login to Account' : 'Create Account'}</span>
                            <ArrowRight size={16} />
                        </button>
                    </form>

                    {/* Social Separator */}
                    <div className="relative my-6 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800/80" />
                        </div>
                        <span className="relative z-10 bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Or continue with
                        </span>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-700/80 hover:border-amber-400/40 text-xs font-bold text-slate-200 bg-slate-950 hover:bg-slate-800 transition-all shadow-md"
                        >
                            <FaGoogle className="text-red-500 text-sm" />
                            <span>Google</span>
                        </button>

                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-700/80 hover:border-amber-400/40 text-xs font-bold text-slate-200 bg-slate-950 hover:bg-slate-800 transition-all shadow-md"
                        >
                            <FaFacebookF className="text-blue-500 text-sm" />
                            <span>Facebook</span>
                        </button>
                    </div>

                    {/* Switch Link */}
                    <p className="text-center text-xs text-slate-400 font-medium mt-6">
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-extrabold text-amber-400 underline hover:text-amber-300 transition-colors"
                        >
                            {isLogin ? 'Register now' : 'Login here'}
                        </button>
                    </p>

                </div>

            </div>
        </div>
    );
};

export default AuthPage;