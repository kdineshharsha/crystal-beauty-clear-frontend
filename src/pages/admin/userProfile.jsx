import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../components/loader";

import { IoMdClose } from "react-icons/io";

export default function UserProfile() {
  const { userEmail } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [modalIsDisplaying, setModalIsDisplaying] = useState(false);

  const [displayingOrder, setDisplayingOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, orderRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/${userEmail}`
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/order/${userEmail}`
          ),
        ]);
        setUser(userRes.data);
        setOrders(orderRes.data);
        console.log("User Data:", userRes.data);
        console.log("Orders Data:", orderRes.data);
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoaded(true);
      }
    };

    fetchData();
  }, [userEmail]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!loaded) return <Loader />;
  if (!user)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            User Not Found
          </h2>
          <p className="text-gray-600">
            The requested user could not be found.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm  p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl text-white font-bold">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
            </div>
          </div>
        </div>

        {/* User Details Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">User Details</h2>
          </div>

          <div className="flex w-full justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Full Name
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Email
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {user.email}
              </p>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide ">
                Role
              </p>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full uppercase">
                {user.role}
              </span>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Status
              </p>
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  user.isDisabled
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {user.isDisabled ? "Disabled" : "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🛍️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Order History</h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
              {orders.length} orders
            </span>
          </div>

          {orders.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="group border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => {
                    setModalIsDisplaying(true);
                    setDisplayingOrder(order);
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500">
                      #{order.orderId}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total</span>
                      <span className="text-lg font-bold text-gray-800">
                        Rs.{order.total}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Date</span>
                      <span className="text-sm text-gray-800">
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-blue-600 font-medium group-hover:text-blue-700">
                      Click to view details →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No Orders Yet
              </h3>
              <p className="text-gray-600">
                This user hasn't placed any orders yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modern Order Modal */}
      {modalIsDisplaying && (
        <div className="fixed top-0 left-0 bg-black/50 backdrop-blur-sm w-full h-full flex justify-center items-center z-50">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl relative overflow-hidden mx-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
              <div className="flex justify-between items-center">
                <h1 className="text-lg font-bold">
                  Order ID: {displayingOrder.orderId}
                </h1>
                <div className="flex gap-2 items-center">
                  {" "}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      displayingOrder.status
                    )}`}
                  >
                    {displayingOrder.status}
                  </span>
                  <button
                    className=" size-8 rounded-full shadow-lg flex justify-center items-center  bg-white hover:bg-gray-100 transition-colors z-100"
                    onClick={() => setModalIsDisplaying(false)}
                  >
                    <IoMdClose className="text-gray-600 " />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Order Items */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                <div className="space-y-3">
                  {displayingOrder.billItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={item.image}
                          className="w-full h-full object-cover rounded-lg"
                          alt={item.productName}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900">
                            {item.productName}
                          </h3>
                          <span className="font-semibold text-green-600">
                            Rs.{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-500">
                            {item.productId}
                          </span>
                          <span className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mb-6 ">
                <h2 className="text-lg font-semibold mb-4">
                  Delivery Information
                </h2>
                <div className="flex  justify-center gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg w-1/2   ">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Address
                    </h3>
                    <p className="text-sm text-gray-600">
                      {displayingOrder.address}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {displayingOrder.phoneNumber}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg w-1/2  ">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Delivery Method
                    </h3>
                    <p className="text-sm text-gray-600">Within 3-5 days</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="font-semibold">
                      Rs.{displayingOrder.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold">Rs.0.00</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">
                      Net Total
                    </span>
                    <span className="font-bold text-green-600">
                      Rs.{displayingOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
