import React from "react";
import { NavLink, Link, Routes, Route } from "react-router-dom";
import { FaHome, FaUsers, FaBoxOpen, FaClipboardList } from "react-icons/fa"; // Import the icons
import AdminProductsPage from "./admin/products";
import AddProductForm from "./admin/addProductForm";
import EditProductForm from "./admin/editProduct";
import AdminOrders from "./admin/adminOrders";

export default function AdminPage() {
  const navItems = [
    { name: "Dashboard", icon: <FaHome />, to: "/admin/dashboard" },
    { name: "Users", icon: <FaUsers />, to: "/admin/users" },
    { name: "Products", icon: <FaBoxOpen />, to: "/admin/products" },
    { name: "Orders", icon: <FaClipboardList />, to: "/admin/orders" },
  ];

  return (
    <div className="w-full h-screen bg-gray-300 flex poppins-regular">
      {/* <div className="h-full w-64 bg-gray-800 flex flex-col p-4 ">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `text-white flex items-center  p-2  rounded-md  ${
              isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          <FaUsers className="text-xl " />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `text-white flex items-center p-2 rounded-md ${
              isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          <FaBoxOpen className="text-xl" />
          <span>Products</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `text-white flex items-center p-2 rounded-md ${
              isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          <FaClipboardList className="text-xl" />
          <span>Orders</span>
        </NavLink>
      </div> */}

      <div className="w-64 h-full bg-gray-300">
        <div className="w-full h-18   flex items-center justify-center">
          <img src="/public/logo.png" alt="logo" />
        </div>
        <div className="w-full h-[calc(100%-18rem)]">
          {/* Navigation */}
          <nav className="flex flex-col p-2 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="h-full w-full bg-white rounded-md p-2 overflow-auto">
        <div className="w-full h-15 bg-amber-400 flex"></div>
        <Routes>
          <Route path="users" element={<h1>Users</h1>} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrders />} />

          <Route path="/products/addProduct" element={<AddProductForm />} />
          <Route path="/products/editProduct" element={<EditProductForm />} />

          <Route path="orders" element={<h1>Orders</h1>} />
        </Routes>
      </div>
    </div>
  );
}
