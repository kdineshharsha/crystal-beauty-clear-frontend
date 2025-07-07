import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import {
  FaShoppingCart,
  FaSearch,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaTimesCircle,
  FaBox,
} from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [modalIsDisplaying, setModalIsDisplaying] = useState(false);
  const [displayingOrder, setDisplayingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const token = localStorage.getItem("token");

  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userRes = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/user/current",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const email = userRes.data.user.email;
        const url = status
          ? `${
              import.meta.env.VITE_BACKEND_URL
            }/api/order/${email}?status=${status}`
          : `${import.meta.env.VITE_BACKEND_URL}/api/order/${email}`;

        const ordersRes = await axios.get(url);
        setOrders(ordersRes.data);
        console.log("Orders Data:", ordersRes.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [status, token]);

  // Filter orders by orderId or product name
  const filteredOrders = orders.filter((order) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      order.orderId.toLowerCase().includes(term) ||
      order.billItems.some((item) =>
        item.productName.toLowerCase().includes(term)
      )
    );
  });

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FaClock className="text-sm" />;
      case "Processing":
        return <FaBox className="text-sm" />;
      case "Shipped":
        return <FaTruck className="text-sm" />;
      case "Delivered":
        return <FaCheckCircle className="text-sm" />;
      case "Cancelled":
        return <FaTimesCircle className="text-sm" />;
      default:
        return <FaClipboardList className="text-sm" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-secondary text-white p-6 rounded-b-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-hover rounded-full flex items-center justify-center">
              <FaShoppingCart className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {status ? `${status} Orders` : "My Orders"}
              </h1>
              <p className="text-orange-100 text-sm">
                Track your order history and status
              </p>
            </div>
          </div>
        </div>

        {/* Search Controls */}
        <div className="bg-white p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-4  justify-between items-center">
            <div className="relative flex-1 max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Order ID or Product Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Orders Content */}
        <div className="bg-white rounded-b-3xl shadow-2xl overflow-hidden">
          {/* Stats Cards */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 p-6 border-b border-gray-200">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <FaShoppingCart className="text-2xl" />
                <div>
                  <p className="text-sm opacity-90">Total Orders</p>
                  <p className="text-2xl font-bold">{filteredOrders.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <FaClock className="text-2xl" />
                <div>
                  <p className="text-sm opacity-90">Pending</p>
                  <p className="text-2xl font-bold">
                    {
                      filteredOrders.filter((o) => o.status === "Pending")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <FaTruck className="text-2xl" />
                <div>
                  <p className="text-sm opacity-90">Shipped</p>
                  <p className="text-2xl font-bold">
                    {
                      filteredOrders.filter((o) => o.status === "Shipped")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-2xl" />
                <div>
                  <p className="text-sm opacity-90">Delivered</p>
                  <p className="text-2xl font-bold">
                    {
                      filteredOrders.filter((o) => o.status === "Delivered")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <FaTimesCircle className="text-2xl" />
                <div>
                  <p className="text-sm opacity-90">Cancelled</p>
                  <p className="text-2xl font-bold">
                    {
                      filteredOrders.filter((o) => o.status === "Cancelled")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Stats - Compact horizontal scroll */}
          <div className="sm:hidden p-4 border-b border-gray-200">
            <div className="flex gap-3 overflow-x-auto pb-2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap">
                <FaShoppingCart className="text-lg" />
                <div>
                  <p className="text-xs opacity-90">Total</p>
                  <p className="text-lg font-bold">{filteredOrders.length}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap">
                <FaClock className="text-lg" />
                <div>
                  <p className="text-xs opacity-90">Pending</p>
                  <p className="text-lg font-bold">
                    {
                      filteredOrders.filter((o) => o.status === "Pending")
                        .length
                    }
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap">
                <FaTruck className="text-lg" />
                <div>
                  <p className="text-xs opacity-90">Shipped</p>
                  <p className="text-lg font-bold">
                    {
                      filteredOrders.filter((o) => o.status === "Shipped")
                        .length
                    }
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap">
                <FaCheckCircle className="text-lg" />
                <div>
                  <p className="text-xs opacity-90">Delivered</p>
                  <p className="text-lg font-bold">
                    {
                      filteredOrders.filter((o) => o.status === "Delivered")
                        .length
                    }
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap">
                <FaTimesCircle className="text-lg" />
                <div>
                  <p className="text-xs opacity-90">Cancelled</p>
                  <p className="text-lg font-bold">
                    {
                      filteredOrders.filter((o) => o.status === "Cancelled")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Grid */}
          <div className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingCart className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "You haven't placed any orders yet"}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer transform hover:scale-103"
                    onClick={() => {
                      setDisplayingOrder(order);
                      setModalIsDisplaying(true);
                    }}
                  >
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                            Order ID
                          </p>
                          <p className="text-lg font-bold text-gray-900 font-mono">
                            {order.orderId}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Total Amount
                          </p>
                          <p className="text-xl font-bold text-accent">
                            Rs.{order.total.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Order Date
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="p-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Items ({order.billItems.length})
                      </h3>
                      <div className="space-y-3">
                        {order.billItems.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-12 h-12 flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-full h-full rounded-lg object-cover border border-gray-200"
                                onError={(e) =>
                                  (e.target.src =
                                    "https://via.placeholder.com/48?text=No+Image")
                                }
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.productName}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                  Qty: {item.quantity}
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                  Rs.{(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {order.billItems.length > 2 && (
                          <div className="text-center">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              +{order.billItems.length - 2} more items
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <div className="px-6 pb-6 flex justify-end gap-3">
                      <button className="w-full bg-gradient-to-r from-accent to-accent-hover hover:bg-accent-hover text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-103 shadow-lg">
                        View Details
                      </button>
                      {order.status === "Pending" && (
                        <button className="w-auto bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-103 shadow-lg">
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        {modalIsDisplaying && displayingOrder && (
          <div className="fixed top-0 left-0 bg-black/50 backdrop-blur-sm w-full h-full flex justify-center items-center z-50">
            <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl relative overflow-hidden mx-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-lg font-bold">
                    Order ID: {displayingOrder.orderId}
                  </h1>
                  <div className="flex gap-2 items-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        displayingOrder.status
                      )}`}
                    >
                      {getStatusIcon(displayingOrder.status)}
                      {displayingOrder.status}
                    </span>
                    <button
                      className="w-8 h-8 rounded-full shadow-lg flex justify-center items-center bg-white hover:bg-gray-100 transition-colors"
                      onClick={() => setModalIsDisplaying(false)}
                    >
                      <IoMdClose className="text-gray-600" />
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
                            onError={(e) =>
                              (e.target.src =
                                "https://via.placeholder.com/64?text=No+Image")
                            }
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
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Delivery Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
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
                    <div className="bg-gray-50 p-4 rounded-lg">
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
                      <span className="font-semibold">
                        Rs.{displayingOrder.totalDiscount}
                      </span>
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
    </div>
  );
}
