import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import Loader from "../../components/loader";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [modalIsDisplaying, setModalIsDisplaying] = useState(false);
  const [displayingOrder, setDisplayingOrder] = useState(null);

  // Pagination and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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
    if (!searchTerm.trim()) return orders;
    return orders.filter((order) => {
      const term = searchTerm.toLowerCase();
      return (
        order.name.toLowerCase().includes(term) ||
        order.orderId.toLowerCase().includes(term) ||
        order.email.toLowerCase().includes(term)
      );
    });
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
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="w-full h-full p-6">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        {/* Left: Title */}
        <h2 className="text-3xl font-bold text-gray-800 flex-shrink-0">
          Order Management
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          {" "}
          {/* Middle: Search Input */}
          <input
            type="text"
            placeholder="Search by Name, Order ID, or Email"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-grow max-w-md border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Right: Export Button */}
          <button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm text-sm flex-shrink-0"
            title="Export filtered orders to CSV"
          >
            Export CSV
          </button>
        </div>
      </div>

      {loaded ? (
        <>
          <div className="overflow-x-auto rounded-xl shadow ring-1 ring-gray-200 bg-white">
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
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-800">
                {paginatedOrders.map((order, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4">{order.name}</td>
                    <td className="px-6 py-4">{order.email}</td>
                    <td className="px-6 py-4">{order.phoneNumber}</td>
                    <td className="px-6 py-4 max-w-xs truncate">
                      {order.address}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          changeOrderStatus(order.orderId, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm"
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
                    </td>
                    <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm shadow"
                        onClick={() => {
                          setModalIsDisplaying(true);
                          setDisplayingOrder(order);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center gap-2 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(pageCount).keys()].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === page + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {page + 1}
              </button>
            ))}
            <button
              disabled={currentPage === pageCount || pageCount === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Modal */}
          {modalIsDisplaying && (
            <div className="fixed top-0 left-0 bg-[#00000080]  w-full h-full  flex justify-center items-center ">
              <div className="w-100 max-h-150 bg-white rounded-xl p-4 relative">
                <button
                  className="absolute size-8 rounded-full shadow-lg   flex justify-center items-center -top-4 -right-4 bg-white "
                  onClick={() => {
                    setModalIsDisplaying(false);
                  }}
                >
                  <IoMdClose />
                </button>
                <div className="w-full h-15 border-b-1 border-gray-200 flex justify-between border-gray-1 flex items-center ">
                  <h1 className="text-sm font-semibold">
                    Order ID: {displayingOrder.orderId}
                  </h1>
                  <span className="text-[12px] text-green-600 bg-gray-100 px-2 py-0.5 rounded-xl ">
                    {displayingOrder.status}
                  </span>
                </div>
                <div className="w-full   border-b-1 border-gray-200 overflow-y-auto max-h-60 ">
                  {displayingOrder.billItems.map((item, index) => {
                    return (
                      // Order Raw Box
                      <div
                        key={index}
                        className="w-full h-[100px]   my-[5px] flex items-center justify-start  "
                      >
                        {/* Order Raw Box Image Box */}
                        <div className=" items-center p-2 max-w-24  ">
                          <img
                            src={item.image}
                            className=" aspect-square object-cover rounded-md "
                          />
                        </div>
                        {/* Order Raw Box Text Box */}
                        <div className=" h-full w-full  px-2 pt-4">
                          <div className="h-auto w-full flex items-center justify-between overflow-hidden ">
                            <h1 className="text-[12px] font-semibold">
                              {item.productName}
                            </h1>
                            <h1 className="text-[12px] font-semibold">
                              $ {item.price * item.quantity}
                            </h1>
                          </div>
                          <div className="h-auto w-full flex items-center justify-between overflow-hidden ">
                            <h1 className="text-[12px] font-semibold text-gray-500">
                              {item.productId}
                            </h1>
                            <h1 className="text-[12px] font-semibold text-gray-500">
                              Qty: {item.quantity}
                            </h1>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className=" w-full h-auto p-2 ">
                  <div className=" ">
                    <h1 className="text-[14px] font-semibold">Delivery</h1>
                    <div className="flex  py-2 border-b-1 border-gray-200">
                      <div className="w-1/2  h-auto">
                        <h1 className="text-[12px] font-semibold text-gray-500">
                          Address
                        </h1>
                        <p className="text-[12px] font-sm text-gray-700 w-[90%] mt-1">
                          {displayingOrder.address}
                          <br></br>
                          {displayingOrder.phoneNumber}
                        </p>
                      </div>
                      <div className="w-1/2  h-auto">
                        <h1 className="text-[12px] font-semibold text-gray-500">
                          Delivery method
                        </h1>
                        <p className="text-[12px] font-sm text-gray-700 mt-1">
                          {/* {displayingOrder.phoneNumber} */}
                          Within 3-5 days
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <h1 className="text-[14px] font-semibold mt-2">
                      Order Summary
                    </h1>
                    <div className="flex justify-between mt-2 ">
                      <h1 className="text-[12px] font-semibold text-gray-500">
                        Total
                      </h1>
                      <h1 className="text-[12px] font-semibold text-gray-500 ">
                        $ {displayingOrder.total.toFixed(2)}
                      </h1>
                    </div>
                    <div className="flex justify-between mt-2 ">
                      <h1 className="text-[12px] font-semibold text-gray-500">
                        Discount
                      </h1>
                      <h1 className="text-[12px] font-semibold text-gray-500 ">
                        $ {displayingOrder.total.toFixed(2)}
                      </h1>
                    </div>
                    <div className="flex justify-between mt-2 ">
                      <h1 className="text-[12px] font-semibold text-gray-500">
                        Net total
                      </h1>
                      <h1 className="text-[12px] font-semibold text-gray-500 ">
                        $ {displayingOrder.total.toFixed(2)}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
