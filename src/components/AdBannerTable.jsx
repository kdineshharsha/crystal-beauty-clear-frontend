import axios from "axios";
import React, { useState } from "react";

import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { GoTrash } from "react-icons/go";
import { MdOutlineModeEdit } from "react-icons/md";
import toast from "react-hot-toast";

export default function AdBannerTable({ adList, setAdList }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function deleteBanner(id) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in");
      return;
    }
    setLoading(true);
    try {
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + "/api/promo/" + id,
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
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg bg-gray-50 shadow ring-1 ring-gray-200 overflow-x-auto">
      <div className="flex justify-between items-center px-6 py-4">
        <Link
          to="addBanner/"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow text-sm"
        >
          <FaPlus /> Add Banner
        </Link>
      </div>

      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Ad Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Link
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Start Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              End Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-800 text-sm">
          {adList.map((ad) => (
            <tr
              key={ad._id}
              className="hover:bg-gray-100 cursor-pointer transition duration-150"
            >
              <td className="px-6 py-4">{ad.title}</td>
              <td className="px-6 py-4 break-words max-w-xs">{ad.link}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold  ${
                    ad.status === "visible"
                      ? "bg-green-100 text-green-700"
                      : ad.status === "expired"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4  ">
                {new Date(ad.startDate).toISOString().split("T")[0]}
              </td>
              <td className="px-6 py-4">
                {new Date(ad.endDate).toISOString().split("T")[0]}
              </td>
              <td className="px-6 py-4 flex gap-2 flex-wrap">
                <button
                  onClick={() => navigate("editBanner/", { state: ad })}
                  className="px-3 py-1 rounded-md bg-blue-500 text-white shadow hover:bg-blue-600 text-sm"
                  title="Edit Banner"
                >
                  <MdOutlineModeEdit size={18} />
                </button>
                <button
                  onClick={() => deleteBanner(ad._id)}
                  className="px-3 py-1 rounded-md bg-red-500 text-white shadow hover:bg-red-600 text-sm"
                  title="Delete Banner"
                >
                  <GoTrash size={18} />
                </button>
              </td>
            </tr>
          ))}
          {adList.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-500">
                No Ad Banners found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
