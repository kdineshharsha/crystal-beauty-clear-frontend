import React from "react";
import { Link } from "react-router-dom";
import { LuShoppingCart } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
export default function Header() {
  return (
    <header className="w-full bg-white shadow-md  top-0 left-0 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center h-full">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-30 object-cover absolute "
          />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 font-medium text-gray-600">
          <Link to="/" className="hover:text-pink-500 transition duration-300">
            Home
          </Link>
          <Link
            to="/products"
            className="hover:text-pink-500 transition duration-300"
          >
            Products
          </Link>
          <Link
            to="/contacts"
            className="hover:text-pink-500 transition duration-300"
          >
            Contacts
          </Link>
          <Link
            to="/reviews"
            className="hover:text-pink-500 transition duration-300"
          >
            Reviews
          </Link>
        </nav>

        {/* Cart Icon */}
        <div className="text-2xl text-gray-700 hover:text-pink-500 transition duration-300 relative  items-center hidden lg:flex ">
          <Link to="/cart">
            <LuShoppingCart />
            {/* Optional: Badge */}
            {/* <span className="absolute -top-1 -right-2 bg-pink-500 text-white text-xs px-1.5 rounded-full">3</span> */}
          </Link>
          <Link to="/cart" className="ml-4">
            <FiUser />
            {/* Optional: Badge */}
            {/* <span className="absolute -top-1 -right-2 bg-pink-500 text-white text-xs px-1.5 rounded-full">3</span> */}
          </Link>
        </div>
      </div>
    </header>
  );
}
