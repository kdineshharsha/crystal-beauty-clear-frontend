import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import MediaUpload from "../../utils/mediaUpload";
import {
  FaMagic,
  FaImage,
  FaCalendarAlt,
  FaLink,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
  FaPlus,
  FaFileImage,
} from "react-icons/fa";

export default function AddPopupAd() {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState(null);
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAsPopup, setShowAsPopup] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!images || images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      setLoading(true);

      const uploadPromises = Array.from(images).map((img) => MediaUpload(img));
      const uploadedImageUrls = await Promise.all(uploadPromises);

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/popup`, {
        title,
        imageUrl: uploadedImageUrls,
        description,
        link,
        startDate,
        endDate,
        showAsPopup,
        isActive,
      });

      toast.success("Popup Ad created!");

      setTitle("");
      setImages(null);
      setDescription("");
      setLink("");
      setStartDate("");
      setEndDate("");
      setShowAsPopup(true);
      setIsActive(true);
      document.getElementById("popup-image-input").value = "";
    } catch (error) {
      console.error("Error adding popup ad:", error);
      toast.error("Failed to create popup ad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
              <FaMagic className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Create Beauty Ad</h1>
              <p className="text-gray-300 text-sm">
                Design stunning promotional content
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label className=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaMagic className="text-pink-500" />
                Campaign Title
              </label>
              <input
                type="text"
                placeholder="Enter your beauty campaign title..."
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-pink-500 focus:outline-none transition-all duration-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaImage className="text-pink-500" />
                Beauty Images
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  id="popup-image-input"
                  className="hidden"
                  onChange={(e) => setImages(e.target.files)}
                  multiple
                  required
                />
                <label
                  htmlFor="popup-image-input"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-pink-500 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col items-center">
                    <FaFileImage className="text-3xl text-gray-400 group-hover:text-pink-500 transition-colors mb-2" />
                    <p className="text-sm text-gray-600 group-hover:text-pink-600 transition-colors">
                      Click to upload beauty images
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {images
                        ? `${images.length} image(s) selected`
                        : "Support multiple images"}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Campaign Description
              </label>
              <textarea
                placeholder="Describe your beauty campaign..."
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-pink-500 focus:outline-none transition-all duration-200 resize-none"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Link */}
            <div className="space-y-2">
              <label className=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaLink className="text-pink-500" />
                Redirect Link (Optional)
              </label>
              <input
                type="url"
                placeholder="https://your-beauty-offer.com"
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-pink-500 focus:outline-none transition-all duration-200"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaCalendarAlt className="text-pink-500" />
                Campaign Duration
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
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-pink-500 focus:outline-none transition-all duration-200"
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
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-pink-500 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Campaign Settings
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Show as Popup</p>
                    <p className="text-sm text-gray-600">
                      Display as a modal popup to users
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAsPopup(!showAsPopup)}
                    className="text-2xl transition-colors"
                  >
                    {showAsPopup ? (
                      <FaToggleOn className="text-pink-500" />
                    ) : (
                      <FaToggleOff className="text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Active Status</p>
                    <p className="text-sm text-gray-600">
                      Make campaign live immediately
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className="text-2xl transition-colors"
                  >
                    {isActive ? (
                      <FaToggleOn className="text-green-500" />
                    ) : (
                      <FaToggleOff className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Creating Campaign...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Create Beauty Campaign
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
