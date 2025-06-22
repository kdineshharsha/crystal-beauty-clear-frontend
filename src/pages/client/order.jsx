import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [modalIsDisplaying, setModalIsDisplaying] = useState(false);
  const [displayingOrder, setDisplayingOrder] = useState(null);
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
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [status]);

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        {status ? `${status} Orders` : "All Orders"}
      </h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No orders found.
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100 cursor-pointer"
              onClick={() => {
                setDisplayingOrder(order); // ✅ Fix here
                setModalIsDisplaying(true);
              }}
            >
              <div className="mb-4 space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Order ID
                </p>
                <p className="text-md font-semibold text-gray-800">
                  {order.orderId}
                </p>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-500">
                  Status
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "Processing"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "Shipped"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="text-sm text-gray-700 mb-1">
                <strong>Total:</strong> Rs.{order.total}
              </div>
              <div className="text-sm text-gray-500 mb-4">
                <strong>Date:</strong>{" "}
                {new Date(order.date).toLocaleDateString()}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Items
                </h3>
                <ul className="divide-y divide-gray-200">
                  {order.billItems.map((item, idx) => (
                    <li key={idx} className="py-3 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-14 h-14 rounded-md object-cover border border-gray-200"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/56?text=No+Image")
                        }
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">
                          {item.productName} × {item.quantity}
                        </span>
                        <span className="text-xs text-gray-500">
                          Rs.{item.price}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {modalIsDisplaying && displayingOrder && (
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
    </div>
  );
}
