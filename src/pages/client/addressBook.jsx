import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiMapPin,
  FiPhone,
  FiUser,
  FiCheckCircle,
  FiPlus,
} from "react-icons/fi";
import { FaArrowLeft, FaAddressBook, FaHome } from "react-icons/fa";
import toast from "react-hot-toast";
import { GoTrash } from "react-icons/go";

export default function AddressBook() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAddressBook = async () => {
      if (!token) {
        console.warn("No token found. User not logged in.");
        return;
      }

      try {
        console.log("🔄 Fetching address book...");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/current`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const addressList = res.data.user.savedAddresses || [];
        // Sort addresses to show latest first (assuming they have createdAt or similar timestamp)
        const sortedAddresses = addressList.sort((a, b) => {
          // If addresses have createdAt field, sort by that
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          // Otherwise, reverse the array to show latest added first
          return addressList.indexOf(a) > addressList.indexOf(b) ? -1 : 1;
        });
        console.log(
          "✅ Address book fetched and sorted successfully:",
          sortedAddresses
        );
        setAddresses(sortedAddresses);
      } catch (err) {
        console.error("❌ Error fetching address book:", err);
      }
    };

    fetchAddressBook();
  }, [token]);

  const handleSetDefault = async (index) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update`,
        { defaultAddressIndex: index },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // ✅ Refresh address book to reflect changes
      setAddresses(res.data.user.savedAddresses || []);
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/address/${addressId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Address deleted!");
      setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete address.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white sm:p-6 p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
              <FaAddressBook className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Address Book</h1>
              <p className="text-sm text-gray-300">
                Manage your delivery addresses
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHome className="text-2xl text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No Saved Addresses
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't saved any addresses yet. Add your first address to
                make checkout faster.
              </p>
              <button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto">
                <FiPlus className="text-lg" />
                Add New Address
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Add New Address Button */}
            <div className="mb-6">
              <button
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-101 flex items-center justify-center gap-3"
                onClick={() => navigate("/add-address")}
              >
                <FiPlus className="text-lg" />
                Add New Address
              </button>
            </div>

            {/* Address Cards */}
            <div className="space-y-4 md:grid  md:grid-cols-2 gap-4 ">
              {addresses.map((addr, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl h-full ${
                    addr.isDefault ? "ring-2 ring-green-500" : ""
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            addr.isDefault ? "bg-green-100" : "bg-gray-100"
                          }`}
                        >
                          <FaHome
                            className={`text-lg ${
                              addr.isDefault
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {addr.fullName}
                          </h3>
                          {addr.isDefault && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full mt-1">
                              <FiCheckCircle size={12} />
                              Default Address
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <FiMapPin className="text-gray-400 mt-1 flex-shrink-0" />
                        <p className="text-gray-700 leading-relaxed">
                          {addr.address}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <FiPhone className="text-gray-400 flex-shrink-0" />
                        <p className="text-gray-700">{addr.phone}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                      <button
                        className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200"
                        onClick={() =>
                          navigate("/edit-address", {
                            state: { address: addr },
                          })
                        }
                      >
                        Edit
                      </button>
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(index)}
                          className="flex-1 py-2 px-4 bg-pink-100  text-pink-700 font-medium rounded-lg hover:bg-pink-200 transition-all duration-200"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(addr._id)}
                        className="px-3 py-1 rounded-lg bg-red-500 text-lg hover:bg-red-600 text-white transition-all duration-200 transform hover:scale-103"
                      >
                        <GoTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
