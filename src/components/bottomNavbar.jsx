import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiBox, FiPhone, FiUser, FiShoppingCart } from "react-icons/fi";

const navItems = [
  { to: "/", icon: <FiHome className="text-xl" />, label: "Home" },
  { to: "/products", icon: <FiBox className="text-xl" />, label: "Products" },
  { to: "/contacts", icon: <FiPhone className="text-xl" />, label: "Contacts" },
  { to: "/cart", icon: <FiShoppingCart className="text-xl" />, label: "Cart" },
  { to: "/profile", icon: <FiUser className="text-xl" />, label: "Profile" },
];

export default function BottomNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden ">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-white border  border-gray-200/50 rounded-t-xl  "></div>

      {/* Floating active indicator background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full flex items-center justify-center">
          <div className="w-full max-w-xs mx-auto px-2">
            <div className="h-12 bg-pink-500/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Navigation content */}
      <div className="relative">
        <div className="flex justify-between items-center px-4 py-2">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              end
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center min-w-0 flex-1 group transition-all duration-300 ${
                  isActive ? "transform scale-110" : ""
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active background glow */}
                  {isActive && (
                    <div className="absolute inset-0 -top-1 -bottom-1 flex items-center justify-center">
                      <div className="w-10 h-10 bg-pink-500/20 rounded-full blur-sm animate-pulse"></div>
                    </div>
                  )}

                  {/* Icon container */}
                  <div
                    className={`relative z-10 p-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-pink-500 shadow-lg shadow-pink-500/30"
                        : "bg-transparent group-hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`transition-colors duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    >
                      {item.icon}
                    </div>
                  </div>

                  {/* Label */}
                  <span
                    className={`text-xs mt-0.5 transition-all duration-300 font-medium ${
                      isActive
                        ? "text-pink-500 font-semibold"
                        : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom safe area for newer phones */}
        <div className="h-safe-bottom bg-transparent"></div>
      </div>
    </nav>
  );
}
