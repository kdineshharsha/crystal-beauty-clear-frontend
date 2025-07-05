import React, { useEffect, useState } from "react";
import getCart, {
  addToCart,
  getTotal,
  getTotalForLabeledPrice,
  removeFromCart,
} from "../../utils/cart";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FiTrash2, FiShoppingCart, FiCreditCard } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartLoaded) {
      const cart = getCart();
      setCart(cart);
      setCartLoaded(true);
    }
  }, [cartLoaded]);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
            <FiShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">Add some items to get started</p>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            Review your items and proceed to checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <FiShoppingCart className="text-gray-700" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Cart Items
                </h2>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                  {cart.length} items
                </span>
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    {/* Mobile Layout */}
                    <div className="flex flex-col sm:hidden gap-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">
                            {item.name}
                          </h3>

                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-bold text-gray-900">
                              ${item.price.toFixed(2)}
                            </span>
                            {item.labeledPrice &&
                              item.labeledPrice > item.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${item.labeledPrice.toFixed(2)}
                                </span>
                              )}
                          </div>
                        </div>
                        <button
                          className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          onClick={() => {
                            removeFromCart(item.productId);
                            setCartLoaded(false);
                          }}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                          <button
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            onClick={() => {
                              addToCart(item, -1);
                              setCartLoaded(false);
                            }}
                          >
                            <AiOutlineMinus size={16} />
                          </button>
                          <span className="text-sm font-medium text-gray-900 px-2 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            onClick={() => {
                              addToCart(item, 1);
                              setCartLoaded(false);
                            }}
                          >
                            <AiOutlinePlus size={16} />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold text-accent">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold text-gray-900">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.labeledPrice &&
                            item.labeledPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ${item.labeledPrice.toFixed(2)}
                              </span>
                            )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                          <button
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            onClick={() => {
                              addToCart(item, -1);
                              setCartLoaded(false);
                            }}
                          >
                            <AiOutlineMinus size={16} />
                          </button>
                          <span className="text-sm font-medium text-gray-900 px-2 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            onClick={() => {
                              addToCart(item, 1);
                              setCartLoaded(false);
                            }}
                          >
                            <AiOutlinePlus size={16} />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold text-accent">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>

                        <button
                          className="w-10 h-10 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => {
                            removeFromCart(item.productId);
                            setCartLoaded(false);
                          }}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <FiCreditCard className="text-gray-700" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Cart Summary
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${getTotalForLabeledPrice().toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>
                    -${(getTotalForLabeledPrice() - getTotal()).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-accent">
                      ${getTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={() => {
                  navigate("/checkout", {
                    state: {
                      items: cart,
                    },
                  });
                }}
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                {/* <p className="text-sm text-gray-500">
                  Secure checkout powered by SSL encryption
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
