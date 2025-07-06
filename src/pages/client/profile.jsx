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
} from "react-icons/fa";
import ProfileSkeleton from "../../components/profileSkeleton";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

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

  useEffect(() => {
    if (!isLoading && user === null) {
      navigate("/login");
    }
  }, [isLoading, user, navigate]);

  if (isLoading) return <ProfileSkeleton />;

  if (!user)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-sm w-full bg-white p-6 rounded-xl shadow-lg border border-red-100 text-center animate-fade-in-down">
          <img src="/Login-amico.png" alt="login prompt" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Oops! Something went wrong 😢
          </h2>
          <p className="text-gray-600 mb-4">
            We couldn't load your profile. You may need to log in again.
          </p>
          <Link
            to="/login"
            className="inline-block bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 pb-8">
      {/* Header */}
      <div className="bg-secondary rounded-b-3xl text-white px-6 py-8 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center text-xl text-secondary">
              👤
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {user.firstName} {user.lastName}
              </h2>
              <span className="bg-primary text-secondary text-xs font-semibold px-2 py-1 rounded-full mt-1 inline-block">
                {user.isEmailVerified ? "✅ Verified" : "🔴 Not Verified"}
              </span>
            </div>
          </div>
          <Link to="/settings">
            <FaCog className="text-xl cursor-pointer hover:rotate-12 transition-transform" />
          </Link>
        </div>

        {/* Stats */}
        <div className="flex justify-around mt-6 text-center">
          {[
            { label: "Wishlist", count: wishlistCount },
            { label: "Orders", count: orderCount },
            { label: "Points", count: 55 },
          ].map(({ label, count }, i) => (
            <div key={i} className="flex flex-col items-center">
              <p className="text-lg font-bold">{count}</p>
              <p className="text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* My Orders */}
      <div className="bg-white rounded-lg p-4 shadow-md mt-6 mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">My Orders</h3>
          <Link to="/orders" className="text-sm text-accent hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-2 text-center text-sm">
          {[
            { icon: FaClipboardList, label: "Pending", status: "Pending" },
            { icon: FaTruck, label: "Processing", status: "Processing" },
            { icon: FaShippingFast, label: "Shipped", status: "Shipped" },
            { icon: FaStar, label: "Review", status: "Review" },
            { icon: FaShoppingBasket, label: "Wishlist", path: "/wishlist" },
          ].map(({ icon: Icon, label, status, path }, i) => (
            <Link
              to={path ?? `/orders?status=${status}`}
              key={i}
              className="flex flex-col items-center text-gray-700 hover:text-accent transition"
            >
              <Icon className="text-xl mb-1" />
              <p>{label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-lg p-4 shadow-md mt-4 mx-4">
        <h3 className="font-semibold text-lg mb-4">Services</h3>
        <div className="grid grid-cols-4 gap-4 text-center text-sm">
          {[
            { icon: FaHistory, label: "Browsing", path: "/browsing-history" },
            { icon: FaMapMarkerAlt, label: "Address", path: "/address-book" },
            { icon: FaHeadset, label: "Support", path: "/support" },
            { icon: FaInfoCircle, label: "About", path: "/about" },
          ].map(({ icon: Icon, label, path }, i) => (
            <Link
              to={path}
              key={i}
              className="flex flex-col items-center text-gray-700 hover:text-accent transition"
            >
              <Icon className="text-xl mb-1" />
              <p>{label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
