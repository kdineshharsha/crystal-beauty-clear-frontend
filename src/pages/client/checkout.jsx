import { useState } from "react";

import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const location = useLocation();
  const [cart, setCart] = useState(location.state.items);
  const [cartRefresh, setCartRefresh] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  // const cart = getCart();

  function placeOrder() {
    const orderData = {
      name: name,
      address: address,
      phoneNumber: phone,
      billItems: [],
    };
    for (let i = 0; i < cart.length; i++) {
      orderData.billItems[i] = {
        productId: cart[i].productId,
        productName: cart[i].name,
        quantity: cart[i].quantity,
      };
    }
    const token = localStorage.getItem("token");
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/order", orderData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(() => {
        toast.success("Order placed successfully");
        console.log(orderData);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Order placement failed");
      });
  }

  function getTotal() {
    let total = 0;
    cart.forEach((item) => {
      total = item.price * item.quantity;
      0;
    });
    return total;
  }

  function getTotalForLabeledPrice() {
    let total = 0;
    cart.forEach((item) => {
      total += item.labeledPrice * item.quantity;
    });
    return total;
  }

  return (
    <div className="w-full h-full bg-[#FFF5EA] py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {cart.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-4 flex items-center justify-between hover:scale-101 transition-all"
          >
            {/* Product Image */}
            <img
              src={item.image}
              alt={item.name}
              className="size-24 rounded-lg object-cover border border-gray-200"
            />

            {/* Product Info */}
            <div className="flex flex-col flex-grow px-4">
              <span className="text-lg font-semibold text-gray-800">
                {item.name}
              </span>
              <span className="text-sm  text-gray-500 w-1/2 line-clamp-2">
                {item.description}
              </span>
              <span className="text-gray-700 pt-1 text-sm font-semibold">
                ${item.price.toFixed(2)}
              </span>
            </div>

            {/* Quantity Controller */}
            <div className="flex items-center gap-2">
              <button
                className="w-7 h-7 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
                onClick={() => {
                  const newCart = cart;
                  newCart[index].quantity -= 1;
                  if (newCart[index].quantity <= 0) newCart[index].quantity = 1;
                  setCart(newCart);
                  setCartRefresh(!cartRefresh);
                }}
              >
                <AiOutlineMinus size={18} />
              </button>
              <span className="text-lg font-medium text-gray-800 px-2">
                {item.quantity}
              </span>
              <button
                className="w-7 h-7 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-black transition"
                onClick={() => {
                  const newCart = cart;
                  newCart[index].quantity += 1;
                  setCart(newCart);
                  setCartRefresh(!cartRefresh);
                }}
              >
                <AiOutlinePlus size={18} />
              </button>

              <span className="text-lg ml-5">
                ${(item.price * item.quantity).toFixed(2)}
              </span>

              <button
                className="bg-red-500 p-2 rounded-lg text-white text-2xl ml-5"
                onClick={() => {
                  const newCart = cart.filter(
                    (product) => product.productId !== item.productId
                  );
                  setCart(newCart);
                }}
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
        <div className="w-full flex justify-end">
          <div className="bg-white rounded-xl shadow-md p-5 w-full sm:w-80 space-y-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Cart Summary
            </h2>

            <div className="flex justify-between text-gray-700">
              <span>Total</span>
              <span>${getTotalForLabeledPrice().toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Discount</span>
              <span className="text-green-600">
                - ${getTotalForLabeledPrice() - getTotal().toFixed(2)}
              </span>
            </div>

            <hr className="border-t border-gray-300" />

            <div className="flex justify-between text-xl font-bold text-gray-800">
              <span>Net Total</span>
              <span className="text-amber-600">${getTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <button
            className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-xl transition"
            onClick={placeOrder}
          >
            Place Order
          </button>
        </div>
        <div className="w-full  flex justify-end">
          <h1 className="w-[100px] text-xl  text-end pr-2">Name</h1>
          <input
            className="w-[200px] text-xl border-b-[2px] text-end pr-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="w-full  flex justify-end">
          <h1 className="w-[100px] text-xl  text-end pr-2">Phone</h1>
          <input
            className="w-[200px] text-xl border-b-[2px] text-end pr-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="w-full  flex justify-end">
          <h1 className="w-[100px] text-xl  text-end pr-2">Address</h1>
          <input
            className="w-[200px] text-xl border-b-[2px] text-end pr-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
