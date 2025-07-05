import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import MediaUpload from "../../utils/mediaUpload";

export default function EditProductForm() {
  const locationData = useLocation();
  const navigate = useNavigate();
  console.log(locationData);

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
  console.log("images:", images);
  async function handleSubmit() {
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

      console.log(result);
      // return;

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
      setLoading(false);
      toast.error("Banner not updated");
    }
  }

  return (
    <div className="w-full bg-amber-200 flex justify-center">
      <div className="h-full w-100 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md ">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          Edit Banner
        </h2>

        <div className="space-y-4">
          {/* Banner ID */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Banner ID
            </label>
            <input
              disabled
              onChange={(e) => setAdId(e.target.value)}
              type="text"
              value={adId}
              placeholder="Enter Banner ID"
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              value={title}
              placeholder="Enter Banner Name"
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
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

          {/* Image */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Add Image
            </label>
            <input
              onChange={(e) => {
                setImages(e.target.files);
                setPreviewImage(URL.createObjectURL(e.target.files[0])); // Preview the first image
              }}
              multiple
              type="file"
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
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

          <div className="w-full h-auto ">
            <img src={previewImage} alt="" />
          </div>

          {/* Stock */}

          {/* Buttons */}
          <div className="pt-4 flex justify-between space-x-4">
            <button
              onClick={handleSubmit}
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
            >
              {loading ? (
                <div className="flex items-center space-x-2 justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving</span>
                </div>
              ) : (
                "Save"
              )}
            </button>
            <button
              className="w-1/2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition"
              onClick={() => navigate("/admin/promo")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
