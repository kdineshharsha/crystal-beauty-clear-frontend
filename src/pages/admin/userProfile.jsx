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
                        ₹{order.total}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Order Details
                  </h2>
                  <p className="text-sm text-gray-600">
                    #{displayingOrder.orderId}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      displayingOrder.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : displayingOrder.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {displayingOrder.status}
                  </span>
                  <button
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    onClick={() => setModalIsDisplaying(false)}
                  >
                    <IoMdClose className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Order Items */}
              <div className="px-6 py-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {displayingOrder.billItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {item.productName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          ID: {item.productId}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="px-6 py-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Delivery Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      Delivery Address
                    </h4>
                    <p className="text-sm text-gray-800">
                      {displayingOrder.address}
                    </p>
                    <p className="text-sm text-gray-800 mt-1">
                      {displayingOrder.phoneNumber}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      Delivery Method
                    </h4>
                    <p className="text-sm text-gray-800">Standard Delivery</p>
                    <p className="text-sm text-gray-600">
                      Within 3-5 business days
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm font-medium text-gray-800">
                      ${displayingOrder.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Discount</span>
                    <span className="text-sm font-medium text-gray-800">
                      $0.00
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Delivery Fee</span>
                    <span className="text-sm font-medium text-gray-800">
                      Free
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-gray-800">
                        Total
                      </span>
                      <span className="text-lg font-bold text-gray-800">
                        ${displayingOrder.total.toFixed(2)}
                      </span>
                    </div>
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
