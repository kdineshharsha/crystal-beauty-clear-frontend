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
      <div className="text-center text-red-600 font-medium mt-6">
        User not found.
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* User Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-3xl font-bold text-gray-800">User Profile</h2>
      </div>

      {/* User Details Card */}
      <div className="bg-white shadow-md rounded-xl p-6 border ">
        <h3 className="text-xl font-semibold text-indigo-600 mb-4">
          👤 User Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
          <p>
            <span className="font-medium">Full Name:</span> {user.firstName}{" "}
            {user.lastName}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">Role:</span>{" "}
            <span className="uppercase">{user.role}</span>
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`font-semibold ${
                user.isDisabled ? "text-red-500" : "text-green-600"
              }`}
            >
              {user.isDisabled ? "Disabled" : "Active"}
            </span>
          </p>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white shadow-md rounded-xl p-6 border">
        <h3 className="text-xl font-semibold text-indigo-600 mb-4">
          🧾 User Orders
        </h3>
        {orders.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {orders.map((order, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow transition"
                onClick={() => {
                  setModalIsDisplaying(true);
                  setDisplayingOrder(order);
                }}
              >
                <p>
                  <span className="font-medium text-gray-600">Order ID:</span>{" "}
                  {order.orderId}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Status:</span>
                  <span
                    className={`ml-1 font-semibold ${
                      order.status === "Pending"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-600">Total:</span> ₹
                  {order.total}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Date:</span>{" "}
                  {new Date(order.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            This user has no orders yet 😢
          </p>
        )}
      </div>
      {modalIsDisplaying && (
        <div className="fixed top-0 left-0 bg-[#00000080]  w-full h-full  flex justify-center items-center ">
          {/* <div className="w-100 max-h-140 h-auto bg-white relative border rounded-2xl ">
                      <div className="w-full h-25 bg-blue-100">
                        <h1 className="text-sm font-bold  p-2">
                          Order ID: {displayingOrder.orderId}
                        </h1>
                        <h1 className="text-sm font-bold  p-2">
                          Order Date: {new Date(displayingOrder.date).toDateString()}
                        </h1>
                        <h1 className="text-sm font-bold  p-2">
                          Order Status: {displayingOrder.status}
                        </h1>
                        <h1 className="text-sm font-bold  p-2">
                          Order Total: {displayingOrder.total.toFixed(2)}
                        </h1>
                      </div>
                      <div className="w-full h-115 max-h-115 ">
                        {displayingOrder.billItems.map((item, index) => {
                          return (
                            <div
                              key={index}
                              className="w-full h-[100px] bg-white shadow-2xl my-[5px] flex justify-between items-center relative"
                            >
                              <img
                                src={item.image}
                                className="h-full aspect-square object-cover"
                              />
                              <div className="h-full max-w-[300px] w-[300px] overflow-hidden">
                                <h1 className="text-xl font-bold">
                                  {item.productName}
                                </h1>
                                <h2 className="text-lg text-gray-500">
                                  LKR: {item.price.toFixed(2)}
                                </h2>
                                <h2 className="text-lg text-gray-500">
                                  Quantity: {item.quantity}
                                </h2>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        className="absolute size-8 rounded-full border border-red-700  flex justify-center items-center -top-4 -right-4 bg-white "
                        onClick={() => {
                          setModalIsDisplaying(false);
                        }}
                      >
                        <IoMdClose />
                      </button>
                    </div> */}
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
