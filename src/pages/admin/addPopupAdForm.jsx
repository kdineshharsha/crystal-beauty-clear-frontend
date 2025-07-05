import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import MediaUpload from "../../utils/mediaUpload";

export default function AddPopupAd() {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState(null); // file input doesn't use value=""
  const [description, setDescription] = useState("");
  const [showAsPopup, setShowAsPopup] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!images || images.length === 0) {
      toast.error("Please upload an image");
      return;
    }

    try {
      setLoading(true);

      const uploadPromises = Array.from(images).map((img) => MediaUpload(img));
      const uploadedImageUrls = await Promise.all(uploadPromises);

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/popup`, {
        title,
        imageUrl: uploadedImageUrls[0], // only using the first uploaded image
        description,
        showAsPopup,
        isActive,
      });

      toast.success("Popup Ad created!");

      // Reset form
      setTitle("");
      setImages(null);
      setDescription("");
      setShowAsPopup(true);
      setIsActive(true);
      document.getElementById("popup-image-input").value = ""; // reset file input
    } catch (error) {
      console.error("Error adding popup ad:", error);
      toast.error("Failed to create popup ad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto my-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Create Popup Ad</h2>
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
          id="popup-image-input"
          className="w-full border px-4 py-2 rounded"
          onChange={(e) => setImages(e.target.files)}
          required
        />

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
          {loading ? "Creating..." : "Create Ad"}
        </button>
      </form>
    </div>
  );
}
