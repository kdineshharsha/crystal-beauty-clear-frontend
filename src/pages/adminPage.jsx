import React, { useState, useEffect } from "react";
import { NavLink, Link, Routes, Route, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaBoxOpen,
  FaClipboardList,
  FaBullhorn,
} from "react-icons/fa"; // Import the icons
import AdminProductsPage from "./admin/products";
import AddProductForm from "./admin/addProductForm";
import EditProductForm from "./admin/editProduct";
import AdminOrders from "./admin/adminOrders";
import toast from "react-hot-toast";
import axios from "axios";
import { FaTags } from "react-icons/fa6";
import Promotions from "./admin/promotions";
import AdBannerForm from "./admin/adBannerForm";
import EditAdBanner from "./admin/editAdBanner";
import FlashSaleAdmin from "../components/flashSaleAdmin";
import Users from "./admin/users";
import UserProfile from "./admin/userProfile";

export default function AdminPage() {
  const [userValidated, setUserValidated] = useState(false);
  const navigate = useNavigate();
  const navItems = [
    { name: "Dashboard", icon: <FaHome />, to: "/admin/dashboard" },
    { name: "Users", icon: <FaUsers />, to: "/admin/users" },
    { name: "Products", icon: <FaBoxOpen />, to: "/admin/products" },
    { name: "Orders", icon: <FaClipboardList />, to: "/admin/orders" },
    { name: "Sales", icon: <FaTags />, to: "/admin/sales" },
    { name: "Promotions", icon: <FaBullhorn />, to: "/admin/promo" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in");
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3000/api/user/current", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.user.role == "admin") {
            setUserValidated(true);
          } else {
            toast.error("You are not authorized to access this page");
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          toast.error("An error occurred while validating user");
          navigate("/login");
        });
    }
  }, []);

  return userValidated ? (
    <>
      <div className="w-full h-screen bg-gray-300 flex poppins-regular">
        <div className="w-64 h-full bg-gray-300">
          <div className="w-full h-18 flex items-center justify-center">
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
            <Route path="users" element={<Users />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="sales" element={<FlashSaleAdmin />} />
            <Route path="promo" element={<Promotions />} />

            <Route path="/products/addProduct" element={<AddProductForm />} />
            <Route path="/products/editProduct" element={<EditProductForm />} />
            <Route path="/promo/addBanner" element={<AdBannerForm />} />
            <Route path="/promo/editBanner/" element={<EditAdBanner />} />
            <Route path="users/:userEmail" element={<UserProfile />} />
            <Route path="orders" element={<h1>Orders</h1>} />
          </Routes>
        </div>
      </div>
    </>
  ) : (
    <h1>Unauthorized</h1>
  );
}
