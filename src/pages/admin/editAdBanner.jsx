import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import MediaUpload from "../../utils/mediaUpload";
import {
  FaBullhorn,
  FaImage,
  FaCalendarAlt,
  FaLink,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
  FaSave,
  FaFileImage,
  FaEye,
  FaEdit,
} from "react-icons/fa";

export default function EditProductForm() {
  const locationData = useLocation();
  const navigate = useNavigate();

  if (locationData.state == null) {
    toast("Banner not found");
    window.location.href = "/admin/promo";
  }

  // Declare state variables at the top level of the component
  const [adId, setAdId] = useState(locationData.state._id);
  const [title, setTitle] = useState(locationData.state.title);
  const [link, setLink] = useState(locationData.state.link);
  const [isVisible, setIsVisible] = useState(locationData.state.isVisible);
  const [startDate, setStartDate] = useState(
    locationData.state.startDate
      ? locationData.state.startDate.split("T")[0]
      : ""
  );
  const [endDate, setEndDate] = useState(
    locationData.state.endDate ? locationData.state.endDate.split("T")[0] : ""
  );
  const [previewImage, setPreviewImage] = useState(
    locationData.state.image ? locationData.state.image[0] : ""
  );
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const promisesArray = [];
    for (let i = 0; i < images.length; i++) {
      const promise = MediaUpload(images[i]);
      promisesArray[i] = promise;
    }

    try {
      let result = await Promise.all(promisesArray);
      if (images.length == 0) {
        result = locationData.state.image;
      }

      const token = localStorage.getItem("token");
      const ad = {
        title: title,
        link: link,
        adId: adId,
        isVisible: isVisible,
        startDate: startDate,
        endDate: endDate,
        image: result,
      };

      await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/promo/" + adId,
        ad,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Banner updated successfully");
      navigate("/admin/promo");
    } catch (err) {
      console.log(err);
      toast.error("Banner not updated");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <FaEdit className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Edit Ad Banner</h1>
              <p className="text-blue-100 text-sm">
                Update your promotional banner settings
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Banner ID */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaBullhorn className="text-blue-500" />
                Banner ID
              </label>
              <input
                type="text"
                value={adId}
                disabled
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaBullhorn className="text-blue-500" />
                Banner Title
              </label>
              <input
                type="text"
                placeholder="Enter your banner title..."
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Link Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaLink className="text-blue-500" />
                Redirect Link (Optional)
              </label>
              <input
                type="url"
                placeholder="https://your-promotion-link.com"
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaImage className="text-blue-500" />
                Banner Images
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  id="banner-image-input"
                  className="hidden"
                  onChange={(e) => {
                    setImages(e.target.files);
                    if (e.target.files && e.target.files[0]) {
                      setPreviewImage(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  multiple
                />
                <label
                  htmlFor="banner-image-input"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col items-center">
                    <FaFileImage className="text-3xl text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                    <p className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                      Click to upload new banner images
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {images && images.length > 0
                        ? `${images.length} new image(s) selected`
                        : "Keep existing or upload new images"}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Image Preview */}
            {previewImage && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Current Banner Preview
                </label>
                <div className="relative w-full h-64 border-2 border-gray-200 rounded-xl overflow-hidden">
                  <img
                    src={previewImage}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Date Range */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-500" />
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
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200"
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
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200"
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
                    <FaEye className="text-blue-500" />
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
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Updating Banner...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Update Banner
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/promo")}
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
