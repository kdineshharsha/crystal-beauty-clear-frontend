import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import MediaUpload from "../../utils/mediaUpload";

export default function EditPopupAd() {
  const { state: adData } = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState(adData?.title || "");
  const [imageUrl, setImageUrl] = useState(adData?.imageUrl || "");
  const [newImage, setNewImage] = useState(null);
  const [description, setDescription] = useState(adData?.description || "");
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
      let finalImage = imageUrl;

      if (newImage) {
        const uploaded = await MediaUpload(newImage[0]);
        finalImage = uploaded;
      }

      const updatedAd = {
        title,
        imageUrl: finalImage,
        description,
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
    <div className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Popup Ad</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border px-4 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          className="w-full border px-4 py-2 rounded"
          onChange={(e) => setNewImage(e.target.files)}
        />

        {imageUrl && !newImage && (
          <div className="w-full">
            <img
              src={imageUrl}
              alt="Current Ad"
              className="w-full max-w-xs h-auto object-cover rounded-md shadow"
            />
          </div>
        )}

        <textarea
          placeholder="Description"
          className="w-full border px-4 py-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showAsPopup}
              onChange={() => setShowAsPopup(!showAsPopup)}
            />
            Show as Popup
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
            Active
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Ad"}
        </button>
      </form>
    </div>
  );
}
