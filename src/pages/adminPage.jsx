import React, { useState, useEffect } from "react";
import {
  NavLink,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaBoxOpen,
  FaClipboardList,
  FaBullhorn,
} from "react-icons/fa";
import { FaTags } from "react-icons/fa6";
import AdminProductsPage from "./admin/products";
import AddProductForm from "./admin/addProductForm";
import EditProductForm from "./admin/editProduct";
import AdminOrders from "./admin/adminOrders";
import Promotions from "./admin/promotions";
import AdBannerForm from "./admin/adBannerForm";
import EditAdBanner from "./admin/editAdBanner";
import FlashSaleAdmin from "../components/flashSaleAdmin";
import Users from "./admin/users";
import UserProfile from "./admin/userProfile";
import toast from "react-hot-toast";
import axios from "axios";
import AdminDashboard from "./admin/dashboard";
import Sales from "./admin/sales";
import AddPopupAd from "./admin/addPopupAdForm";
import EditPopupAd from "./admin/editPopupAd";

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
        .get(import.meta.env.VITE_BACKEND_URL + "/api/user/current", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.user.role === "admin") {
            setUserValidated(true);
          } else {
            toast.error("Unauthorized access");
            navigate("/login");
          }
        })
        .catch((err) => {
          console.log("Error validating user", err);
          toast.error("Error validating user");
          navigate("/login");
        });
    }
  }, []);

  return userValidated ? (
    <div className="flex h-screen w-full poppins-regular bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col justify-between">
        <div>
          <div className="text-center  border-b">
            <img src="/logo.png" alt="logo" className=" w-48 mx-auto" />
          </div>
          <nav className="mt-6 px-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-semibold"
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
        <div className="text-center text-xs text-gray-400 py-4">
          © {new Date().getFullYear()} Admin Panel
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-gradient-to-r from-amber-400 to-yellow-300 p-4 rounded-lg shadow text-white font-bold text-xl mb-6">
          Admin Dashboard
        </div>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="sales" element={<Sales />} />
          <Route path="promo" element={<Promotions />} />
          <Route path="/products/addProduct" element={<AddProductForm />} />
          <Route path="/products/editProduct" element={<EditProductForm />} />
          <Route path="/promo/addBanner" element={<AdBannerForm />} />
          <Route path="/promo/editBanner" element={<EditAdBanner />} />
          <Route path="users/:userEmail" element={<UserProfile />} />
          <Route path="promo/addpopup" element={<AddPopupAd />} />
          <Route path="promo/editpopup" element={<EditPopupAd />} />
        </Routes>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen text-lg font-semibold">
      Validating admin access...
    </div>
  );
}
