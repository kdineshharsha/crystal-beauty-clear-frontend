import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MediaUpload from "../../utils/mediaUpload";

export default function AdBannerForm() {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [images, setImages] = useState([]);

  const navigate = useNavigate();

  async function handleSubmit() {
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
    }
  }

  return (
    <div
      className="min-h-screen bg-amber-200 flex
      items-center justify-center "
    >
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-10 ">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Create Ad Banner
        </h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Banner Title"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Link (optional)
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Visible
            </label>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setImages(e.target.files)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Buttons */}
          <div className="pt-6 flex gap-4 justify-between">
            <button
              onClick={handleSubmit}
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
            >
              Create Banner
            </button>
            <button
              onClick={() => navigate("/admin/promotions")}
              className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
