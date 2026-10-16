import React, { useState } from 'react';
import { Lock, ArrowLeft, CheckCircle2, Sparkles, Send } from 'lucide-react';

const ForgotPasswordPage = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onResetSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Sending password reset link to:', email);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 relative flex items-center justify-center p-4 font-sans text-slate-100 overflow-hidden">
      
      {/* Background Decorative Image / Overlay */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none filter grayscale">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop"
          alt="VELORA background"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* Center Forgot Password Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/80 rounded-2xl p-8 sm:p-10 shadow-2xl border border-slate-800/80 backdrop-blur-xl text-center">
        
        {/* Lock Icon Circle Badge */}
        <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto mb-6 text-amber-400 shadow-lg">
          <Lock size={26} strokeWidth={2.2} />
        </div>

        {!isSubmitted ? (
          <>
            {/* Heading & Subtitle */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-md mb-3">
              <Sparkles size={13} className="text-amber-400" /> Security Recovery
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase mb-2">
              Forgot Password?
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto mb-8 leading-relaxed font-medium">
              Enter your email address and we'll send you a secure link to reset your password.
            </p>

            {/* Form */}
            <form onSubmit={onResetSubmit} className="space-y-5 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full text-xs sm:text-sm font-medium p-3.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 bg-slate-950 text-white placeholder-slate-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-rose-500 hover:brightness-110 text-slate-950 font-extrabold py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-400/10 active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
              >
                <span>Send Reset Link</span>
                <Send size={15} />
              </button>
            </form>
          </>
        ) : (
          /* Success Message State */
          <div className="space-y-4 py-2">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 size={28} />
            </div>
            <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">
              Reset Link Sent!
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs mx-auto font-medium">
              We have securely transmitted a password reset link to <span className="font-semibold text-white">{email}</span>. Please check your inbox.
            </p>
          </div>
        )}

        {/* Back to Login Link */}
        <div className="mt-8 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onBackToLogin}
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Login
          </button>
        </div>

      </div>

    </div>
  );
};

export default ForgotPasswordPage;