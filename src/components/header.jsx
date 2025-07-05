import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { LuShoppingCart } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { RiShoppingBag4Line } from "react-icons/ri";
import { PiHeartBold } from "react-icons/pi";
import { FiMessageSquare } from "react-icons/fi";
import { MdOutlineNotificationsNone } from "react-icons/md";

import UserData from "./userData";
import Notification from "./notification";

export default function Header() {
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/contacts", label: "Contacts" },
    { to: "/about", label: "About Us" },
  ];

  const [Dropdown, setDropdown] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center top-0 sticky z-100 bg-gradient-to-r from-slate-50 to-blue-50">
      <header className="w-full bg-white/80 backdrop-blur-xl shadow-xl border-b border-gray-200/50 md:h-16 h-14 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:h-16 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center h-full">
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-30 w-auto object-contain hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8 font-medium text-gray-700">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                end
                className={({ isActive }) =>
                  `relative px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-102 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-pink-500/30"
                      : "hover:text-pink-600 hover:bg-pink-50 hover:shadow-md"
                  }`
                }
              >
                {item.label}
                {/* Active indicator dot */}
                <span
                  className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-200 ${({
                    isActive,
                  }) => (isActive ? "bg-white" : "bg-transparent")}`}
                />
              </NavLink>
            ))}
          </nav>

          {/* Cart & Icons */}
          <div className="text-2xl text-gray-700 flex lg:flex items-center space-x-2">
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  isActive
                    ? "text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-pink-500/30"
                    : "hover:text-pink-600 hover:bg-pink-50 hover:shadow-md"
                }`
              }
            >
              <LuShoppingCart />
            </NavLink>

            <span
              onClick={() => setNotificationOpen(!notificationOpen)}
              className={`relative p-2 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 ${
                notificationOpen
                  ? "text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-pink-500/30"
                  : "hover:text-pink-600 hover:bg-pink-50 hover:shadow-md"
              }`}
            >
              <MdOutlineNotificationsNone />

              {/* Notification indicator */}
              {notificationCount > 0 && (
                <span className="absolute -top-0.25 -right-0.25 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white">
                  <span className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-ping"></span>
                </span>
              )}
            </span>

            <span
              onClick={() => setDropdown(!Dropdown)}
              className={`relative p-2 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 md:block hidden ${
                Dropdown
                  ? "text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-pink-500/30"
                  : "hover:text-pink-600 hover:bg-pink-50 hover:shadow-md"
              }`}
            >
              <FiUser />
            </span>
          </div>
        </div>

        {/* User Dropdown */}
        <div
          ref={dropdownRef}
          className={`w-64 h-auto bg-white/95 backdrop-blur-xl rounded-2xl absolute top-16 right-4 flex flex-col items-center p-4 shadow-2xl border border-gray-200/50 transform transition-all duration-300 ease-out origin-top-right ${
            Dropdown
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 pointer-events-none -translate-y-2"
          }`}
        >
          <UserData />
          <hr className="bg-gradient-to-r from-pink-300 to-purple-300 w-full mt-4 h-0.5 border-0" />
          <div className="w-full mt-4 space-y-2">
            <Link
              to="/orders"
              className="hover:text-pink-600 text-gray-700 transition-all duration-300 flex items-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:shadow-md transform hover:scale-105"
            >
              <RiShoppingBag4Line className="text-purple-500" />
              <span className="font-medium">My Orders</span>
            </Link>
            <Link
              to="/wishlist"
              className="hover:text-pink-600 text-gray-700 transition-all duration-300 flex items-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:shadow-md transform hover:scale-105"
            >
              <PiHeartBold className="text-red-500" />
              <span className="font-medium">Wishlist</span>
            </Link>
            <Link
              to="/"
              className="hover:text-pink-600 text-gray-700 transition-all duration-300 flex items-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:shadow-md transform hover:scale-105"
            >
              <FiMessageSquare className="text-blue-500" />
              <span className="font-medium">Message Center</span>
            </Link>
          </div>
        </div>

        {/* Notification Dropdown */}
        <div
          ref={notificationRef}
          className={`max-w-80 max-h-96 bg-white/95 backdrop-blur-xl rounded-2xl absolute top-16 right-4 flex flex-col shadow-2xl border border-gray-200/50 transform transition-all duration-300 ease-out origin-top-right z-50 ${
            notificationOpen
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 pointer-events-none -translate-y-2"
          }`}
        >
          <Notification onNotificationCount={setNotificationCount} />
        </div>
      </header>
    </div>
  );
}
