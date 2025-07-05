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
  FaSignOutAlt,
  FaBars,
  FaTimes,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      to: "/admin/dashboard",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Users",
      icon: <FaUsers />,
      to: "/admin/users",
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "Products",
      icon: <FaBoxOpen />,
      to: "/admin/products",
      color: "from-green-500 to-green-600",
    },
    {
      name: "Orders",
      icon: <FaClipboardList />,
      to: "/admin/orders",
      color: "from-orange-500 to-orange-600",
    },
    {
      name: "Sales",
      icon: <FaTags />,
      to: "/admin/sales",
      color: "from-pink-500 to-pink-600",
    },
    {
      name: "Promotions",
      icon: <FaBullhorn />,
      to: "/admin/promo",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

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

            setUser(res.data.user);
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
    <div className="flex h-screen w-full poppins-regular bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative z-50 w-72 h-full bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <img src="/logo.png" alt="logo" className="w-40 h-auto" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100/80 transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Admin Profile Card */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.firstName
                    ? user.firstName.charAt(0).toUpperCase()
                    : "A"}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {user?.firstName || "Admin"}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item, index) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 shadow-lg shadow-blue-200/50 border border-blue-200/50"
                    : "text-gray-700 hover:bg-gray-100/80 hover:shadow-md hover:scale-105"
                }`
              }
            >
              <div
                className={`p-2 rounded-lg bg-gradient-to-r ${item.color} text-white shadow-lg`}
              >
                <span className="text-sm">{item.icon}</span>
              </div>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors group"
          >
            <FaSignOutAlt className="text-lg group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
          <div className="mt-3 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Admin Panel
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100/80 transition-colors"
            >
              <FaBars className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Welcome back, {user?.name || "Administrator"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">Online</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-full">
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
              <Route
                path="/products/editProduct"
                element={<EditProductForm />}
              />
              <Route path="/promo/addBanner" element={<AdBannerForm />} />
              <Route path="/promo/editBanner" element={<EditAdBanner />} />
              <Route path="users/:userEmail" element={<UserProfile />} />
              <Route path="promo/addpopup" element={<AddPopupAd />} />
              <Route path="promo/editpopup" element={<EditPopupAd />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-semibold text-gray-700 text-center">
          Validating admin access...
        </p>
      </div>
    </div>
  );
}
