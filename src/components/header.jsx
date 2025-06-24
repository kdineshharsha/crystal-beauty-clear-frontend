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
    <div className="w-full flex justify-center items-center top-0 sticky z-10 bg-white">
      <header className="w-full bg-white shadow-lg md:h-16 h-12 backdrop-blur-md border border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:h-16 h-12 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center h-full">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-30 object-cover absolute"
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6 font-medium text-gray-600">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                end
                className={({ isActive }) =>
                  `transition duration-300 ${
                    isActive
                      ? "text-pink-500 font-semibold border-b-2 border-pink-500"
                      : "hover:text-pink-400"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Cart & Icons */}
          <div className="text-2xl text-gray-700 flex lg:flex items-center space-x-4">
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `transition duration-300 ${
                  isActive ? "text-pink-500" : "hover:text-pink-400"
                }`
              }
            >
              <LuShoppingCart />
            </NavLink>

            <span
              onClick={() => setNotificationOpen(!notificationOpen)}
              className={`relative cursor-pointer transition duration-300 ${
                notificationOpen ? "text-pink-500" : "hover:text-pink-400"
              }`}
            >
              <MdOutlineNotificationsNone />

              {/* 🔴 Red Dot Indicator */}
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
              )}
            </span>

            <NavLink
              onClick={() => setDropdown(!Dropdown)}
              className={() =>
                `transition duration-300 lg:block hidden ${
                  Dropdown ? "text-pink-500" : "hover:text-pink-400"
                }`
              }
            >
              <FiUser />
            </NavLink>
          </div>
        </div>

        {/* User Dropdown */}
        <div
          ref={dropdownRef}
          className={`w-60 h-auto bg-white rounded-2xl absolute top-16 right-0 flex flex-col items-center p-4 shadow-lg transform transition-all duration-300 ease-out origin-top-right ${
            Dropdown
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
          }`}
        >
          <UserData />
          <hr className="bg-accent w-full mt-4" />
          <div className="w-full mt-2 space-y-2">
            <Link
              to="/orders"
              className="hover:text-pink-500 text-secondary transition duration-300 flex items-center space-x-2"
            >
              <RiShoppingBag4Line />
              <span>My Orders</span>
            </Link>
            <Link
              to="/wishlist"
              className="hover:text-pink-500 text-secondary transition duration-300 flex items-center space-x-2"
            >
              <PiHeartBold />
              <span>Wishlist</span>
            </Link>
            <Link
              to="/"
              className="hover:text-pink-500 text-secondary transition duration-300 flex items-center space-x-2"
            >
              <FiMessageSquare />
              <span>Message Center</span>
            </Link>
          </div>
        </div>

        {/* Notification Dropdown */}
        <div
          ref={notificationRef}
          className={`max-w-78 max-h-100 bg-white rounded-2xl absolute top-16 right-4 flex flex-col shadow-lg transform transition-all duration-300 ease-out origin-top-right z-50  ${
            notificationOpen
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
          }`}
        >
          <Notification onNotificationCount={setNotificationCount} />
        </div>
      </header>
    </div>
  );
}
