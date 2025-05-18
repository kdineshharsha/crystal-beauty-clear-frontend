import React, { useEffect, useState } from "react";
import getCart, {
  addToCart,
  getTotal,
  getTotalForLabeledPrice,
  removeFromCart,
} from "../../utils/cart";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const navigate = useNavigate();
  // const cart = getCart();

  useEffect(() => {
    if (!cartLoaded) {
      const cart = getCart();
      setCart(cart);
      setCartLoaded(true);
    }
  }, [cartLoaded]);

  return (
    <div className="w-full  bg-[#FFF5EA] py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {cart.map((item) => (
          <div
            key={item.id}
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
                  addToCart(item, -1);
                  setCartLoaded(false);
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
                  addToCart(item, 1);
                  setCartLoaded(false);
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
                  removeFromCart(item.productId);
                  setCartLoaded(false);
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
              <span className="text-accent">${getTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <button
            className="mt-4 bg-accent hover:bg-accent-hover text-white font-semibold py-2 px-6 rounded-xl transition"
            onClick={() => {
              navigate("/checkout", {
                state: {
                  items: cart,
                },
              });
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
