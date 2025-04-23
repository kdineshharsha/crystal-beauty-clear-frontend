import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="w-full h-16 bg-gray-300 flex justify-center items-center">
      <div className=" flex space-x-4 justify-evenly items-center">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/contacts">Contacts</Link>
        <Link to="/reviews">Reviews</Link>
      </div>
    </div>
  );
}
