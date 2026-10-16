import React, { useState } from 'react';
import { MapPin, Mail, Phone, Sparkles, Send, CheckCircle2, Clock } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSent, setIsSent] = useState(false);

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setIsSent(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    setTimeout(() => {
      setIsSent(false);
    }, 6000);
  };

  return (
    <div className="w-full bg-slate-950 min-h-screen pb-20 font-sans text-slate-100">
      
      {/* 1. Top Hero Banner */}
      <div className="relative w-full h-56 sm:h-72 bg-slate-950 border-b border-slate-800/80 overflow-hidden flex items-center justify-center text-center px-4">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop"
          alt="VELORA Contact Header Background"
          className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="relative z-10 max-w-xl mx-auto text-white space-y-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-md">
            <Sparkles size={13} className="text-amber-400" /> VIP Support
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
            Get In Touch
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed max-w-md mx-auto">
            Have a question or looking for bespoke assistance? Reach out to our concierge team.
          </p>
        </div>
      </div>

      {/* 2. Main Contact Grid Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-slate-900/80 rounded-2xl p-6 sm:p-12 backdrop-blur-xl border border-slate-800/80 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Contact Information */}
          <div className="md:col-span-5 space-y-8 md:pr-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                Customer Concierge
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
                Reach Out Directly
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                We aim to respond to all inquiries within 24 business hours.
              </p>
            </div>

            <div className="space-y-5">
              {/* Our Address */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-amber-400 shrink-0 shadow-md">
                  <MapPin size={20} />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Boutique Address
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed">
                    123, Green Park, Ahmedabad<br />
                    Gujarat, India - 382350
                  </p>
                </div>
              </div>

              {/* Email Us */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-amber-400 shrink-0 shadow-md">
                  <Mail size={20} />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Email Support
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 font-semibold">
                    support@velora.com
                  </p>
                </div>
              </div>

              {/* Call Us */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-amber-400 shrink-0 shadow-md">
                  <Phone size={20} />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Phone Concierge
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 font-semibold">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-amber-400 shrink-0 shadow-md">
                  <Clock size={20} />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Working Hours
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 font-semibold">
                    Mon - Sat: 9:00 AM - 8:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Social Icons Row */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5">
                {[
                  { icon: FaFacebookF, label: 'Facebook', href: '#facebook' },
                  { icon: FaInstagram, label: 'Instagram', href: '#instagram' },
                  { icon: FaTwitter, label: 'Twitter', href: '#twitter' },
                  { icon: FaLinkedinIn, label: 'LinkedIn', href: '#linkedin' },
                ].map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      aria-label={social.label}
                      className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 flex items-center justify-center hover:bg-gradient-to-tr hover:from-amber-400 hover:to-rose-500 hover:text-slate-950 hover:border-transparent transition-all text-xs active:scale-95 shadow-md"
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="md:col-span-7 space-y-5 md:border-l md:border-slate-800/80 md:pl-10">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Fill out the details below and we will get back to you promptly.
              </p>
            </div>

            {isSent && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold p-4 rounded-xl flex items-center gap-2.5 shadow-lg">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span>Thank you! Your inquiry has been transmitted successfully.</span>
              </div>
            )}

            <form onSubmit={onMessageSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={onFieldChange}
                  required
                  className="w-full text-xs sm:text-sm font-medium p-3.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 bg-slate-950 text-white placeholder-slate-500 transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={onFieldChange}
                  required
                  className="w-full text-xs sm:text-sm font-medium p-3.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 bg-slate-950 text-white placeholder-slate-500 transition-colors"
                />
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="How can we assist you?"
                  value={formData.subject}
                  onChange={onFieldChange}
                  required
                  className="w-full text-xs sm:text-sm font-medium p-3.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 bg-slate-950 text-white placeholder-slate-500 transition-colors"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Message</label>
                <textarea
                  name="message"
                  placeholder="Write your message here..."
                  rows={4}
                  value={formData.message}
                  onChange={onFieldChange}
                  required
                  className="w-full text-xs sm:text-sm font-medium p-3.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 bg-slate-950 text-white placeholder-slate-500 resize-none transition-colors"
                />
              </div>

              {/* Send Message Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-rose-500 hover:brightness-110 text-slate-950 font-extrabold py-4 rounded-xl text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-amber-400/10 active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
              >
                <span>Send Message</span>
                <Send size={15} />
              </button>
            </form>

          </div>

        </div>
      </div>

    </div>
  );
};

export default ContactPage;