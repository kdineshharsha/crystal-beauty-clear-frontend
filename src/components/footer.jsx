import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaHeart,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/subscribe",
        { email }
      );
      toast.success("Subscription successful! 🎉");
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error("Subscription failed. Please try again.");
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="pt-16 pb-8 px-6 sm:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Newsletter Section */}
            <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Stay Beautiful with Us
                </h3>
                <p className="text-gray-300">
                  Subscribe to our newsletter for beauty tips and exclusive
                  offers
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-400 text-white backdrop-blur-sm"
                  />
                </div>
                <button
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
                  onClick={handleSubscribe}
                >
                  Subscribe
                </button>
              </div>
            </div>

            {/* Main Footer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {/* Brand & About */}
              <div className="lg:col-span-1">
                <div className="mb-6">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-40 mb-4 object-cover"
                  />
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Embrace your natural beauty with our curated cosmetic products
                  made just for you. 🌸
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-300">
                    <FaMapMarkerAlt className="text-pink-400" />
                    <span>123 Beauty Street, Galle City</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <FaPhone className="text-pink-400" />
                    <span>+94 001234567</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <FaEnvelope className="text-pink-400" />
                    <span>crystalbeauty@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white relative">
                  Quick Links
                  <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400"></div>
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      to="/"
                      className="text-gray-300 hover:text-pink-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products"
                      className="text-gray-300 hover:text-pink-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-gray-300 hover:text-pink-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-gray-300 hover:text-pink-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Customer Service */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white relative">
                  Customer Service
                  <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400"></div>
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      to="/faq"
                      className="text-gray-300 hover:text-pink-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shipping"
                      className="text-gray-300 hover:text-pink-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Shipping & Returns
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy"
                      className="text-gray-300 hover:text-pink-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="text-gray-300 hover:text-pink-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Terms & Conditions
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white relative">
                  Follow Us
                  <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400"></div>
                </h4>
                <div className="flex space-x-4 mb-6">
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-blue-500/25"
                  >
                    <FaFacebookF className="text-white text-sm" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-pink-500/25"
                  >
                    <FaInstagram className="text-white text-sm" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-blue-400/25"
                  >
                    <FaTwitter className="text-white text-sm" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-red-500/25"
                  >
                    <FaYoutube className="text-white text-sm" />
                  </a>
                </div>
                <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg p-4 border border-white/10">
                  <p className="text-sm text-gray-300 mb-2">Share the love!</p>
                  <div className="flex items-center gap-2 text-pink-400">
                    <FaHeart className="animate-pulse" />
                    <span className="text-sm">Join our beauty community</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-gray-400 text-sm">
                  &copy; {new Date().getFullYear()} Your Cosmetic Brand. All
                  rights reserved.
                </p>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span>Made with</span>
                <FaHeart className="text-pink-400 animate-pulse" />
                <span>for beautiful people</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
