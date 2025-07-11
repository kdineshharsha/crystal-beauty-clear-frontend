import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaCommentDots,
  FaShieldAlt,
  FaFileContract,
  FaTrashAlt,
  FaSignOutAlt,
  FaArrowLeft,
  FaMagic,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function Settings() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    try {
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + "/api/user/delete",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Account deleted successfully.");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Error deleting account:", err);
      toast.error("Failed to delete account. Please try again.");
    }
  };

  const settingsItems = [
    {
      icon: FaUser,
      title: "Profile Details",
      description: "Edit your personal information",
      path: "/settings/edit-profile",
      color: "text-pink-500",
    },
    {
      icon: FaCommentDots,
      title: "Feedback",
      description: "Share your thoughts with us",
      color: "text-blue-500",
    },
    {
      icon: FaShieldAlt,
      title: "Privacy Policy",
      description: "How we protect your data",
      color: "text-green-500",
    },
    {
      icon: FaFileContract,
      title: "Legal Information",
      description: "Terms and conditions",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white sm:p-6 p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
              <FaMagic className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Beauty Settings</h1>
              <p className="text-sm text-gray-300">
                Manage your account preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">
              Account Settings
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Customize your beauty experience
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {settingsItems.map((item, index) => (
              <Link
                key={index}
                to={item.path || "#"}
                className="flex items-center gap-4 p-6 hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                  <item.icon
                    className={`text-lg ${item.color} group-hover:scale-110 transition-transform`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
                <div className="w-6 h-6 text-gray-400 group-hover:text-pink-500 transition-colors">
                  →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-red-600 flex items-center gap-2">
              <FaExclamationTriangle />
              Danger Zone
            </h2>
            <p className="text-sm text-gray-600 mt-1">Irreversible actions</p>
          </div>

          <div
            onClick={() => setShowModal(true)}
            className="flex items-center gap-4 p-6 hover:bg-red-50 transition-all duration-200 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <FaTrashAlt className="text-lg text-red-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-600 group-hover:text-red-700 transition-colors">
                Delete Account
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Permanently remove your account and all data
              </p>
            </div>
            <div className="w-6 h-6 text-red-400 group-hover:text-red-500 transition-colors">
              →
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="mt-8">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="w-full py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-2xl shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 transform hover:scale-102 flex items-center justify-center gap-3"
          >
            <FaSignOutAlt className="text-lg" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl transform transition-all">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="text-red-500 text-xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Delete Account
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Are you sure you want to delete your beauty account? This will
                permanently remove:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Your profile and preferences
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Order history and wishlist
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Beauty points and rewards
                </li>
              </ul>
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-700 font-medium">
                  ⚠️ This action cannot be undone
                </p>
              </div>
            </div>

            <div className="p-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
