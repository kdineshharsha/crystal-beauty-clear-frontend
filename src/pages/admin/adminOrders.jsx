import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../../components/loader";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import TestModal from "../../components/test_modal";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [modalIsDisplaying, setModalIsDisplaying] = useState(false);
  const [displayingOrder, setDisplayingOrder] = useState(null);

  useEffect(() => {
    if (!loaded) {
      const token = localStorage.getItem("token");
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/order", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setOrders(res.data);
          console.log(res.data);
          setLoaded(true);
        });
    }
  }, [loaded]);

  function changeOrderStatus(orderId, status) {
    const token = localStorage.getItem("token");
    axios
      .put(
        import.meta.env.VITE_BACKEND_URL + "/api/order/" + orderId,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        // console.log(res.data);
        toast.success("Order status updated successfully");
        setLoaded(false);
      });
  }

  return (
    <div className="w-full h-full p-4 ">
      {loaded ? (
        <div className="w-full h-full rounded-lg overflow-x-auto ">
          <table className="w-full table-auto border-collapse shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-600 text-white text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-left border-b">Order ID</th>
                <th className="px-4 py-3 text-left border-b">Customer</th>
                <th className="px-4 py-3 text-left border-b">Email</th>
                <th className="px-4 py-3 text-left border-b">Phone</th>
                <th className="px-4 py-3 text-left border-b">Address</th>
                <th className="px-4 py-3 text-left border-b">Status</th>
                <th className="px-4 py-3 text-left border-b">Total</th>
                <th className="px-4 py-3 text-left border-b">Date</th>
                <th className="px-4 py-3 text-left border-b">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-200 transition duration-200 cursor-pointer"
                  // onClick={() => {
                  //   setModalIsDisplaying(true);
                  //   setDisplayingOrder(order);
                  // }}
                >
                  <td className="px-4 py-3 border-b">{order.orderId}</td>
                  <td className="px-4 py-3 border-b">{order.name}</td>
                  <td className="px-4 py-3 border-b">{order.email}</td>
                  <td className="px-4 py-3 border-b">{order.phoneNumber}</td>
                  <td className="px-4 py-3 border-b">{order.address}</td>
                  <td className="px-4 py-3 border-b">
                    <select
                      value={order.status}
                      onChange={(e) => {
                        changeOrderStatus(order.orderId, e.target.value);
                        console.log(e.target.value);
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 border-b">${order.total}</td>
                  <td className="px-4 py-3 border-b">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 border-b">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
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
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}

//974236659511-bfpauu76kb4hidieitjqqq7kmkuvfced.apps.googleusercontent.com
