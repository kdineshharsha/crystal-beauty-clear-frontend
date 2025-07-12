import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FaStar,
  FaCog,
  FaTruck,
  FaClipboardList,
  FaShippingFast,
  FaShoppingBasket,
  FaHistory,
  FaMapMarkerAlt,
  FaHeadset,
  FaInfoCircle,
  FaHeart,
  FaGem,
  FaMagic,
} from "react-icons/fa";
import ProfileSkeleton from "../../components/profileSkeleton";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [beautyPoints, setBeautyPoints] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return setIsLoading(false);

      try {
        const userRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/current`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUser(userRes.data.user);

        const [wishlistRes, ordersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/wishlist`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/order/${
              userRes.data.user.email
            }`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        setWishlistCount(wishlistRes.data.length);
        setOrderCount(ordersRes.data.length);
        setBeautyPoints(ordersRes.data.length * 10);
      } catch (err) {
        console.error("❌ Error fetching profile data:", err);
        setUser(null);
        setWishlistCount(0);
        setOrderCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <ProfileSkeleton />;

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-sm w-full bg-white p-8 rounded-2xl shadow-xl border text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center">
            <FaMagic className="text-3xl text-pink-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Welcome Back, Beauty!
          </h2>
          <p className="text-gray-600 mb-6">
            Sign in to access your beauty profile and discover amazing
            cosmetics.
          </p>
          <Link
            to="/login"
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Sign In
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white px-6 py-8 relative overflow-hidden rounded-b-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-2xl shadow-lg font-bold ">
                {user.firstName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      user.isEmailVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isEmailVerified
                      ? "✨ Verified Beauty"
                      : "🔴 Pending Verification"}
                  </span>
                </div>
              </div>
            </div>
            <Link to="/settings">
              <FaCog className="text-2xl cursor-pointer hover:rotate-90 transition-transform duration-300" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              {
                label: "Wishlist",
                count: wishlistCount,
                icon: FaHeart,
                color: "from-pink-400 to-pink-600",
              },
              {
                label: "Orders",
                count: orderCount,
                icon: FaGem,
                color: "from-purple-400 to-purple-600",
              },
              {
                label: "Beauty Points",
                count: beautyPoints || 0,
                icon: FaMagic,
                color: "from-yellow-400 to-yellow-600",
              },
            ].map(({ label, count, icon: Icon, color }, i) => (
              <div
                key={i}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
              >
                <div
                  className={`w-12 h-12 mx-auto mb-2 bg-gradient-to-br ${color} rounded-full flex items-center justify-center`}
                >
                  <Icon className="text-white text-lg" />
                </div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm opacity-90">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Orders */}
      <div className="bg-white rounded-2xl sm:p-6 p-4 shadow-lg mt-6 mx-4 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
            <FaClipboardList className="text-pink-500" />
            My Beauty Orders
          </h3>
          <Link
            to="/orders"
            className="text-sm text-pink-500 hover:text-pink-600 font-semibold flex items-center gap-1"
          >
            View All <span>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-3 text-center text-sm">
          {[
            {
              icon: FaClipboardList,
              label: "Pending",
              status: "Pending",
              color: "text-yellow-600",
            },
            {
              icon: FaTruck,
              label: "Processing",
              status: "Processing",
              color: "text-blue-600",
            },
            {
              icon: FaShippingFast,
              label: "Shipped",
              status: "Shipped",
              color: "text-green-600",
            },
            {
              icon: FaStar,
              label: "Review",
              path: "/reviews",
              color: "text-pink-600",
            },
            {
              icon: FaHeart,
              label: "Wishlist",
              path: "/wishlist",
              color: "text-red-500",
            },
          ].map(({ icon: Icon, label, status, path, color }, i) => (
            <Link
              to={path ?? `/orders?status=${status}`}
              key={i}
              className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-pink-50 transition-colors">
                <Icon
                  className={`text-lg ${color} group-hover:scale-110 transition-transform`}
                />
              </div>
              <p className="text-gray-700 font-medium">{label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-2xl sm:p-6 p-4 shadow-lg mt-4 mx-4 border border-gray-100">
        <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
          <FaMagic className="text-pink-500" />
          Beauty Services
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            {
              icon: FaHistory,
              label: "Browsing History",
              path: "/history",
              desc: "View your recent products",
            },
            {
              icon: FaMapMarkerAlt,
              label: "Address Book",
              path: "/address-book",
              desc: "Manage delivery addresses",
            },
            {
              icon: FaHeadset,
              label: "Beauty Support",
              path: "/contacts",
              desc: "Get help with products",
            },
            {
              icon: FaInfoCircle,
              label: "About Us",
              path: "/about",
              desc: "Learn about our brand",
            },
          ].map(({ icon: Icon, label, path, desc }, i) => (
            <Link
              to={path}
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group border border-gray-100"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center group-hover:from-pink-200 group-hover:to-pink-300 transition-all">
                <Icon className="text-pink-600 text-lg" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{label}</p>
                <p className="text-gray-600 text-xs mt-1">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
