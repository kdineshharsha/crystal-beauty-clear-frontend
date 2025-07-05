import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MdOutlineModeEdit } from "react-icons/md";
import { GoTrash } from "react-icons/go";

export default function PopupAdList() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/popup`)
      .then((res) => setAds(res.data))
      .catch((err) => {
        console.error("Error fetching popup ads:", err);
        toast.error("Failed to fetch popup ads");
      })
      .finally(() => setLoading(false));
  };

  const deleteAd = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this ad?");
    if (!confirm) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/popup/${id}`);
      setAds((prev) => prev.filter((ad) => ad._id !== id));
      toast.success("Popup ad deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete popup ad");
    }
  };

  return (
    <div className=" max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Popup Ads</h2>
        <Link
          to="addpopup/"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow text-sm"
        >
          Add Popup Ad
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-200 bg-white">
        {loading ? (
          <div className="p-6 text-center text-gray-500"></div>
        ) : ads.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-gray-700 text-sm ">
              <tr>
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-center">Popup</th>
                <th className="px-6 py-3 text-center">Active</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
              {ads.map((ad) => (
                <tr key={ad._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3">
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="h-16 w-28 object-cover rounded shadow"
                    />
                  </td>
                  <td className="px-6 py-3 font-medium">{ad.title}</td>
                  <td className="px-6 py-3 text-gray-600 max-w-xs">
                    {ad.description}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {ad.showAsPopup ? "✅" : "❌"}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {ad.isActive ? "✅" : "❌"}
                  </td>
                  <td className="px-6 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => navigate("editpopup", { state: ad })}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      title="Edit"
                    >
                      <MdOutlineModeEdit size={18} />
                    </button>
                    <button
                      onClick={() => deleteAd(ad._id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                      title="Delete"
                    >
                      <GoTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No popup ads found.
          </div>
        )}
      </div>
    </div>
  );
}
