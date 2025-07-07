import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MediaUpload from "../../utils/mediaUpload";
import {
  FaBullhorn,
  FaImage,
  FaCalendarAlt,
  FaLink,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
  FaPlus,
  FaFileImage,
  FaEye,
} from "react-icons/fa";

export default function AdBannerForm() {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!images || images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const uploadPromises = Array.from(images).map((img) => MediaUpload(img));
      const uploadedImageUrls = await Promise.all(uploadPromises);

      const adData = {
        title,
        link,
        isVisible,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        image: uploadedImageUrls,
      };

      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/promo",
        adData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Ad Banner Created Successfully!");
      navigate("/admin/promotions");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create Ad Banner");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <FaBullhorn className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Create Ad Banner</h1>
              <p className="text-orange-100 text-sm">
                Design eye-catching promotional banners
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaBullhorn className="text-orange-500" />
                Banner Title
              </label>
              <input
                type="text"
                placeholder="Enter your banner title..."
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-orange-500 focus:outline-none transition-all duration-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Link Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaLink className="text-orange-500" />
                Redirect Link (Optional)
              </label>
              <input
                type="url"
                placeholder="https://your-promotion-link.com"
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-orange-500 focus:outline-none transition-all duration-200"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaImage className="text-orange-500" />
                Banner Images
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  id="banner-image-input"
                  className="hidden"
                  onChange={(e) => setImages(e.target.files)}
                  multiple
                  required
                />
                <label
                  htmlFor="banner-image-input"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col items-center">
                    <FaFileImage className="text-3xl text-gray-400 group-hover:text-orange-500 transition-colors mb-2" />
                    <p className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors">
                      Click to upload banner images
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {images && images.length > 0
                        ? `${images.length} image(s) selected`
                        : "Support multiple images"}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaCalendarAlt className="text-orange-500" />
                Campaign Duration (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-orange-500 focus:outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-orange-500 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Visibility Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Banner Settings
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaEye className="text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-700">Visibility</p>
                      <p className="text-sm text-gray-600">
                        Make banner visible to users
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="text-2xl transition-colors"
                  >
                    {isVisible ? (
                      <FaToggleOn className="text-green-500" />
                    ) : (
                      <FaToggleOff className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-6 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Creating Banner...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Create Banner
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/promotions")}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
