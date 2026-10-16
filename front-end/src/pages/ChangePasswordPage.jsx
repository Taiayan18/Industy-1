import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const ChangePasswordPage = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const onPasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New Password and Confirm Password do not match!');
      return;
    }
    console.log('Password updated successfully:', passwords);
    alert('Password updated successfully!');
  };

  return (
    <div className="w-full min-h-screen bg-surface flex items-center justify-center p-4 font-sans">
      
      {/* Center Change Password Card */}
      <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-soft border border-slate-100 text-center">
        
        {/* Top Lock Badge Icon */}
        <div className="w-16 h-16 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-6 text-slate-800">
          <Lock size={26} strokeWidth={2.2} />
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Change Password
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto mb-8 leading-relaxed">
          Choose a new password to keep your account safe.
        </p>

        {/* Form Fields */}
        <form onSubmit={onPasswordSubmit} className="space-y-5 text-left">
          
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                name="currentPassword"
                placeholder="Enter current password"
                value={passwords.currentPassword}
                onChange={onFieldChange}
                required
                className="w-full text-xs font-medium p-3.5 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors bg-white text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                name="newPassword"
                placeholder="Enter new password"
                value={passwords.newPassword}
                onChange={onFieldChange}
                required
                className="w-full text-xs font-medium p-3.5 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors bg-white text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Re-enter new password"
                value={passwords.confirmPassword}
                onChange={onFieldChange}
                required
                className="w-full text-xs font-medium p-3.5 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors bg-white text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 rounded-lg text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-[0.99] mt-3"
          >
            Update Password
          </button>
        </form>

      </div>

    </div>
  );
};

export default ChangePasswordPage;