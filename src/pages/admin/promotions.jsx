import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/loader";
import PopupAdList from "../../components/popupAdvertisement";

export default function Promotions() {
  const [adList, setAdList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdBanners();
  }, []);

  const fetchAdBanners = () => {
    setLoading(true);
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/promo/")
      .then((res) => setAdList(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load ad banners.");
      })
      .finally(() => setLoading(false));
  };

  const deleteBanner = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/promo/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdList((prev) => prev.filter((ad) => ad._id !== id));
      toast.success("Banner deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting banner");
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen p-6 space-y-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Title and Add Button */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800 flex-shrink-0">
            Ad Banners
          </h2>
          <Link
            to="addBanner/"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow text-sm"
          >
            <FaPlus /> Add Banner
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow ring-1 ring-gray-200 bg-white">
          {loading ? (
            <div className="w-full flex justify-center items-center py-10">
              <Loader />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 ">
                <tr>
                  {[
                    "Ad Title",
                    "Link",
                    "Status",
                    "Start Date",
                    "End Date",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-800">
                {adList.length > 0 ? (
                  adList.map((ad) => (
                    <tr
                      key={ad._id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap ">
                        {ad.title}
                      </td>
                      <td className="px-6 py-4 break-words max-w-xs">
                        {ad.link}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            ad.status === "visible"
                              ? "bg-green-100 text-green-600"
                              : ad.status === "expired"
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {ad.status.charAt(0).toUpperCase() +
                            ad.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text whitespace-nowrap">
                        {new Date(ad.startDate).toISOString().split("T")[0]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(ad.endDate).toISOString().split("T")[0]}
                      </td>
                      <td className="px-6 py-4 flex gap-2 ">
                        <button
                          onClick={() => navigate("editBanner/", { state: ad })}
                          className="p-2 rounded-md bg-blue-500 text-white shadow hover:bg-blue-600 text-sm"
                          title="Edit Banner"
                        >
                          <MdOutlineModeEdit size={18} />
                        </button>
                        <button
                          onClick={() => deleteBanner(ad._id)}
                          className="p-2 rounded-md bg-red-500 text-white shadow hover:bg-red-600 text-sm"
                          title="Delete Banner"
                        >
                          <GoTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No Ad Banners found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>{" "}
      <PopupAdList />
    </div>
  );
}
