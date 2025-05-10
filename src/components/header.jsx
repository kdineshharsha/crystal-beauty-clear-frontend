import React from "react";
import { Link } from "react-router-dom";
import { LuShoppingCart } from "react-icons/lu";

export default function Header() {
  return (
    // <div className="w-full h-16 bg-gray-300 flex justify-center items-center">
    //   <div className=" flex space-x-4 justify-evenly items-center">
    //     <Link to="/">Home</Link>
    //     <Link to="/products">Products</Link>
    //     <Link to="/contacts">Contacts</Link>
    //     <Link to="/reviews">Reviews</Link>
    //     <Link to="/cart" className="absolute text-2xl right-8">
    //       <LuShoppingCart />
    //     </Link>
    //   </div>
    // </div>

    <header className="w-full h-16 bg-white shadow flex justify-between items-center px-6">
      {/* Logo */}
      <div className="h-32 overflow-hidden flex items-center justify-center">
        <img src="/logo.png" alt="Logo" className="h-full  " />
      </div>

      {/* Navigation links */}
      <nav className="flex space-x-6 text-gray-700 font-medium">
        <Link
          to="/"
          className="hover:text-blue-600 transition-colors duration-200"
        >
          Home
        </Link>
        <Link
          to="/products"
          className="hover:text-blue-600 transition-colors duration-200"
        >
          Products
        </Link>
        <Link
          to="/contacts"
          className="hover:text-blue-600 transition-colors duration-200"
        >
          Contacts
        </Link>
        <Link
          to="/reviews"
          className="hover:text-blue-600 transition-colors duration-200"
        >
          Reviews
        </Link>
      </nav>

      {/* Cart icon */}
      <div className="text-2xl text-gray-700 hover:text-blue-600 transition-colors duration-200">
        <Link to="/cart">
          <LuShoppingCart />
        </Link>
      </div>
    </header>
  );
}
