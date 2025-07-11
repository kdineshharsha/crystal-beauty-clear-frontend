import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, MapPin, User, Phone, Save, Home, Plus } from "lucide-react";
import { FaAddressBook, FaArrowLeft } from "react-icons/fa";

export default function AddAddress() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/add-address`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Address added successfully!");
      navigate("/address-book");
    } catch (err) {
      console.error("Error adding address:", err);
      toast.error("Failed to add address.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 relative overflow-hidden">
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
              <FaAddressBook className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Edit Address Book</h1>
              <p className="text-sm text-gray-300">
                Add your delivery addresses
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 px-4 py-8 max-w-md mx-auto">
        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 p-8 transform  transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Full Name
              </label>
              <div className="relative">
                <User
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    focusedField === "fullName"
                      ? "text-accent"
                      : "text-slate-400"
                  }`}
                />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("fullName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent focus:bg-white transition-all duration-300 text-slate-900 placeholder-slate-400 outline-none"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    focusedField === "phone" ? "text-accent" : "text-slate-400"
                  }`}
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your phone number"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent focus:bg-white transition-all duration-300 text-slate-900 placeholder-slate-400 outline-none"
                  required
                />
              </div>
            </div>

            {/* Address Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Address
              </label>
              <div className="relative">
                <Home
                  className={`absolute left-4 top-6 w-5 h-5 transition-colors duration-300 ${
                    focusedField === "address"
                      ? "text-accent"
                      : "text-slate-400"
                  }`}
                />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("address")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your complete address"
                  rows={3}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent focus:bg-white transition-all duration-300 text-slate-900 placeholder-slate-400 resize-none outline-none"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full py-4 bg-gradient-to-r from-accent to-accent-hover hover:bg-accent-hover  text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-103  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
            >
              <div className="relative flex items-center justify-center">
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Save Address
                  </>
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
