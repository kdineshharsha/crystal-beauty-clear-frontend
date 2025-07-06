import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
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

  return (
    <div className="min-h-screen bg-white text-sm text-gray-800 font-inter">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 shadow-sm">
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      {/* Section List */}
      <div className="divide-y divide-gray-100 text-secondary mt-2">
        <Link
          to="/settings/edit-profile"
          className="block px-4 py-4 hover:bg-gray-50 transition"
        >
          Profile Details
        </Link>

        <div className="px-4 py-4 hover:bg-gray-50 transition cursor-pointer">
          Feedback
        </div>

        <div className="px-4 py-4 hover:bg-gray-50 transition cursor-pointer">
          Privacy Policy
        </div>

        <div className="px-4 py-4 hover:bg-gray-50 transition cursor-pointer">
          Legal Information
        </div>

        <div
          onClick={() => setShowModal(true)}
          className="px-4 py-4 text-red-500 hover:bg-red-50 transition cursor-pointer"
        >
          Delete Account
        </div>
      </div>

      {/* Sign Out */}
      <div className="mt-8 px-4">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg shadow-sm hover:bg-red-600 transition"
        >
          Sign out
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-xl p-6 shadow-xl animate-fade-in-down">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Account
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete your account? This action is
              permanent and cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
