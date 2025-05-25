import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white pt-12 pb-8 px-6 sm:px-12 mt-10 border-t">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand & About */}
        <div>
          <div className="">
            <img
              src="/logo.png"
              alt="Logo"
              className=" w-40 mb-4  object-cover"
            />
          </div>
          <p className="text-sm">
            Embrace your natural beauty with our curated cosmetic products made
            just for you. 🌸
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-pink-500 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-pink-500 transition">
                Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-pink-500 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-pink-500 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/faq" className="hover:text-pink-500 transition">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:text-pink-500 transition">
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-pink-500 transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-pink-500 transition">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4 text-xl text-pink-500">
            <a href="#" className="hover:text-pink-400 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-pink-400 transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-pink-400 transition">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-pink-400 transition">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-sm text-gray-500 mt-10">
        &copy; {new Date().getFullYear()} Your Cosmetic Brand. All rights
        reserved.
      </div>
    </footer>
  );
}
