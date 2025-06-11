import axios from "axios";
import React, { useEffect, useState } from "react";

import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { GoTrash } from "react-icons/go";
import { MdOutlineModeEdit } from "react-icons/md";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/promo/")
        .then((res) => {
          setAds(res.data);
          console.log(res.data);
          setLoaded(true);
        });
    }
  }, [loaded]);

  async function deleteBanner(id) {
    const token = localStorage.getItem("token");
    if (token == null) {
      toast.error("You are not logged in");
      return;
    }
    try {
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + "/api/promo/" + id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoaded(false);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error deleting ad");
      return;
    }
  }

  return (
    <div className="w-full h-full rounded-lg ">
      {loaded && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ad Banners
            </h2>
            <button
              onClick={() => navigate("addBanner/")}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center cursor-pointer"
            >
              <FaPlus />
              Add Banner
            </button>
          </div>

          <table className="w-full table-auto border-collapse shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-600 text-white text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-left border-b">Ad Title</th>
                {/* <th className="px-4 py-3 text-left border-b">Name</th> */}
                <th className="px-4 py-3 text-left border-b">Link</th>
                <th className="px-4 py-3 text-left border-b">Visible Status</th>
                <th className="px-4 py-3 text-left border-b">Start Date</th>
                <th className="px-4 py-3 text-left border-b">End Date</th>
                <th className="px-4 py-3 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {ads.map((ad, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-200 transition duration-200 cursor-pointer"
                >
                  <td className="px-4 py-3 border-b">{ad.title}</td>
                  <td className="px-4 py-3 border-b">{ad.link}</td>
                  <td className="px-4 py-3 border-b">
                    {ad.status === "expired"
                      ? "Expired"
                      : ad.status === "visible"
                      ? "Visible"
                      : "Hidden"}
                  </td>

                  <td className="px-4 py-3 border-b">
                    {new Date(ad.startDate).toISOString().split("T")[0]}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {new Date(ad.endDate).toISOString().split("T")[0]}
                  </td>
                  <td className="px-4 py-3 border-b ">
                    <div className="flex items-center space-x-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md "
                        onClick={() => {
                          navigate("editBanner/", { state: ad });
                        }}
                      >
                        <MdOutlineModeEdit className="size-5" />
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md "
                        onClick={() => deleteBanner(ad._id)}
                      >
                        <GoTrash className="size-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {!loaded && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-gray-500 text-lg">Loading products...</div>
        </div>
      )}
    </div>
  );
}
