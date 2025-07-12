import axios from "axios";
import React, { useEffect, useState, useMemo, useRef } from "react";
import Loader from "../../components/loader";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import {
  FaShoppingCart,
  FaSearch,
  FaDownload,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaTimesCircle,
} from "react-icons/fa";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [modalIsDisplaying, setModalIsDisplaying] = useState(false);
  const [displayingOrder, setDisplayingOrder] = useState(null);

  // Pagination and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const downloadRef = useRef(null);

  useEffect(() => {
    if (!loaded) {
      const token = localStorage.getItem("token");
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/order", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setOrders(res.data);
          setLoaded(true);
        })
        .catch(() => toast.error("Failed to load orders"));
    }
  }, [loaded]);

  function changeOrderStatus(orderId, status) {
    const token = localStorage.getItem("token");
    axios
      .put(
        import.meta.env.VITE_BACKEND_URL + "/api/order/" + orderId,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("Order status updated successfully");
        setLoaded(false);
      })
      .catch(() => toast.error("Failed to update status"));
  }

  // Filter orders by name, orderId, or email
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = orders.filter((order) => {
        return (
          order.name.toLowerCase().includes(term) ||
          order.orderId.toLowerCase().includes(term) ||
          order.email.toLowerCase().includes(term)
        );
      });
    }

    // Sort by created time (date) - newest first
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [orders, searchTerm]);

  // Pagination logic
  const pageCount = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage]);

  // Export filtered orders to CSV
  function exportToCSV() {
    const headers = [
      "Order ID",
      "Customer",
      "Email",
      "Phone",
      "Address",
      "Status",
      "Total",
      "Date",
    ];
    const rows = filteredOrders.map((o) => [
      o.orderId,
      o.name,
      o.email,
      o.phoneNumber,
      o.address,
      o.status,
      o.total,
      new Date(o.date).toLocaleDateString(),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) => row.map((v) => `"${v}"`).join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    downloadRef.current.href = encodedUri;
    downloadRef.current.download = "orders.csv";
    downloadRef.current.click();
  }

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <FaShoppingCart className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Order Management</h1>
              <p className="text-orange-100 text-sm">
                Track and manage customer orders
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Name, Order ID, or Email"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <FaDownload className="text-sm" />
                Export CSV
              </button>
              <a ref={downloadRef} style={{ display: "none" }} />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-b-3xl shadow-2xl overflow-hidden">
          {loaded ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-6 border-b border-gray-200">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaShoppingCart className="text-2xl" />
                    <div>
                      <p className="text-sm opacity-90">Total Orders</p>
                      <p className="text-2xl font-bold">
                        {filteredOrders.length}
                      </p>
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

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Order ID",
                        "Customer",
                        "Email",
                        "Phone",
                        "Address",
                        "Status",
                        "Total",
                        "Date",
                        "Action",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedOrders.map((order, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-gray-50 transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono font-semibold text-gray-900">
                            {order.orderId}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {order.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {order.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {order.phoneNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className="text-sm text-gray-600 truncate">
                            {order.address}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                changeOrderStatus(order.orderId, e.target.value)
                              }
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-orange-500 ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {[
                                "Pending",
                                "Processing",
                                "Cancelled",
                                "Shipped",
                                "Delivered",
                              ].map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">
                            ${order.total.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105 shadow-sm"
                            onClick={() => {
                              setModalIsDisplaying(true);
                              setDisplayingOrder(order);
                            }}
                          >
                            <FaEye />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, filteredOrders.length)} of{" "}
                    {filteredOrders.length} orders
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="flex items-center gap-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      <FaChevronLeft />
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {[...Array(pageCount).keys()].map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page + 1)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === page + 1
                              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                        >
                          {page + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={currentPage === pageCount || pageCount === 0}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="flex items-center gap-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      Next
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 flex justify-center">
              <Loader />
            </div>
          )}
        </div>

        {/* Modal */}
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
                              ${(item.price * item.quantity).toFixed(2)}
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
                        ${displayingOrder.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-semibold">$0.00</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-semibold text-gray-900">
                        Net Total
                      </span>
                      <span className="font-bold text-green-600">
                        ${displayingOrder.total.toFixed(2)}
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
