import React, { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token != null) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/user/current", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data.user);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUser(null);
        });
    }
  }, []);

  return isLoading ? (
    <ProfileSkeleton />
  ) : (
    <div className="min-h-screen bg-gray-100 text-gray-800">
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
                👑 VIP Center
              </span>
            </div>
          </div>
          <FaCog className="text-xl" />
        </div>

        {/* Stats */}
        <div className="flex justify-around mt-6 text-center">
          {["Wishlist", "Coupons", "Points"].map((label, i) => (
            <div key={i}>
              <p className="text-lg font-bold">{[5, 10, 55][i]}</p>
              <p className="text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* My Orders */}
      <div className="bg-white rounded-lg p-4 shadow-md mt-6 mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">My Orders</h3>
          <Link to="/orders" className="text-sm text-accent">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-2 text-center text-sm">
          {[
            { icon: FaClipboardList, label: "Pending", status: "Pending" },
            { icon: FaTruck, label: "Processing", status: "Processing" },
            { icon: FaShippingFast, label: "Shipped", status: "Shipped" },
            { icon: FaStar, label: "Review", status: "Review" },
            { icon: FaShoppingBasket, label: "Preorder", status: "Preorder" },
          ].map(({ icon: Icon, label, status }, i) => (
            <Link
              to={`/orders?status=${status}`}
              className="flex flex-col items-center"
              key={i}
            >
              <Icon className="text-xl text-accent" />
              <p>{label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-lg p-4 shadow-md mt-4 mx-4 mb-6">
        <h3 className="font-semibold text-lg mb-4">Services</h3>
        <div className="grid grid-cols-4 gap-4 text-center text-sm">
          {[
            { icon: FaHistory, label: "Browsing", path: "/browsing-history" },
            { icon: FaMapMarkerAlt, label: "Address", path: "/address-book" },
            { icon: FaHeadset, label: "Support", path: "/support" },
            { icon: FaInfoCircle, label: "About", path: "/about" },
          ].map(({ icon: Icon, label, path }, i) => (
            <Link to={path} className="flex flex-col items-center" key={i}>
              <Icon className="text-xl text-accent" />
              <p>{label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
