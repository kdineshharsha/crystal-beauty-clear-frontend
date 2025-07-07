import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  FaEdit,
  FaFileImage,
} from "react-icons/fa";

export default function EditPopupAd() {
  const { state: adData } = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState(adData?.title || "");
  const [imageUrl, setImageUrl] = useState(adData?.imageUrl || []);
  const [newImage, setNewImage] = useState(null);
  const [description, setDescription] = useState(adData?.description || "");
  const [link, setLink] = useState(adData?.link || "");
  const [startDate, setStartDate] = useState(
    adData?.startDate?.slice(0, 10) || ""
  );
  const [endDate, setEndDate] = useState(adData?.endDate?.slice(0, 10) || "");
  const [showAsPopup, setShowAsPopup] = useState(adData?.showAsPopup || false);
  const [isActive, setIsActive] = useState(adData?.isActive || true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!adData) {
      toast.error("No popup ad data found");
      navigate("/admin/promotions");
    }
  }, [adData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrls = imageUrl;

      if (newImage) {
        const uploadPromises = Array.from(newImage).map((img) =>
          MediaUpload(img)
        );
        finalImageUrls = await Promise.all(uploadPromises);
      }

      const updatedAd = {
        title,
        imageUrl: finalImageUrls,
        description,
        link,
        startDate,
        endDate,
        showAsPopup,
        isActive,
      };

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/popup/${adData._id}`,
        updatedAd
      );

      toast.success("Popup ad updated!");
      navigate("/admin/promotions");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update popup ad");
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
              <FaEdit className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Edit Beauty Ad</h1>
              <p className="text-gray-300 text-sm">
                Update your promotional content
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
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaImage className="text-pink-500" />
                Beauty Images
              </label>

              {/* Current Images Display */}
              {imageUrl?.length > 0 && !newImage && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                  <div className="flex gap-4 flex-wrap">
                    {imageUrl.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={img}
                          alt="Current Ad"
                          className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Image Upload */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  id="popup-image-input"
                  className="hidden"
                  onChange={(e) => setNewImage(e.target.files)}
                  multiple
                />
                <label
                  htmlFor="popup-image-input"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-pink-500 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col items-center">
                    <FaFileImage className="text-3xl text-gray-400 group-hover:text-pink-500 transition-colors mb-2" />
                    <p className="text-sm text-gray-600 group-hover:text-pink-600 transition-colors">
                      Click to upload new images
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {newImage
                        ? `${newImage.length} new image(s) selected`
                        : "Leave empty to keep current images"}
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
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
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
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
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
                    Updating Campaign...
                  </>
                ) : (
                  <>
                    <FaEdit />
                    Update Beauty Campaign
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
