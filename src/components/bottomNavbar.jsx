import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiBox, FiPhone, FiUser, FiShoppingCart } from "react-icons/fi";

const navItems = [
  { to: "/", icon: <FiHome className="text-2xl" />, label: "Home" },
  { to: "/products", icon: <FiBox className="text-2xl" />, label: "Products" },
  {
    to: "/contacts",
    icon: <FiPhone className="text-2xl" />,
    label: "Contacts",
  },
  { to: "/cart", icon: <FiShoppingCart className="text-2xl" />, label: "Cart" },
  { to: "/profile", icon: <FiUser className="text-2xl" />, label: "Profile" },
];

export default function BottomNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md  md:hidden z-10">
      <div className="flex justify-between items-center px-6 py-2 text-gray-600">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex flex-col items-center text-sm transition duration-300 ${
                isActive ? "text-pink-500 font-semibold" : "hover:text-pink-400"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
