import { useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import {
  FiTrash2,
  FiPackage,
  FiCreditCard,
  FiUser,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
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
  const [saveAddress, setSaveAddress] = useState(false);

  function placeOrder() {
    if (!name || !address || !phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const orderData = {
      name: name,
      address: address,
      phoneNumber: phone,
      billItems: [],
      saveAddress: saveAddress,
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
      total += item.price * item.quantity;
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">
            Review your order and complete your purchase
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <FiPackage className="text-gray-700" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Items
                </h2>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                  {cart.length} items
                </span>
              </div>

              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={index}
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
                              Rs.{item.price.toFixed(2)}
                            </span>
                            {item.labeledPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through">
                                Rs.{item.labeledPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          onClick={() => {
                            const newCart = cart.filter(
                              (product) => product.productId !== item.productId
                            );
                            setCart(newCart);
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
                              const newCart = [...cart];
                              newCart[index].quantity -= 1;
                              if (newCart[index].quantity <= 0)
                                newCart[index].quantity = 1;
                              setCart(newCart);
                              setCartRefresh(!cartRefresh);
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
                              const newCart = [...cart];
                              newCart[index].quantity += 1;
                              setCart(newCart);
                              setCartRefresh(!cartRefresh);
                            }}
                          >
                            <AiOutlinePlus size={16} />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold text-accent">
                            Rs.{(item.price * item.quantity).toFixed(2)}
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
                            Rs.{item.price.toFixed(2)}
                          </span>
                          {item.labeledPrice > item.price && (
                            <span className="text-sm text-gray-500 line-through">
                              Rs.{item.labeledPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                          <button
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            onClick={() => {
                              const newCart = [...cart];
                              newCart[index].quantity -= 1;
                              if (newCart[index].quantity <= 0)
                                newCart[index].quantity = 1;
                              setCart(newCart);
                              setCartRefresh(!cartRefresh);
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
                              const newCart = [...cart];
                              newCart[index].quantity += 1;
                              setCart(newCart);
                              setCartRefresh(!cartRefresh);
                            }}
                          >
                            <AiOutlinePlus size={16} />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold text-accent">
                            Rs.{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>

                        <button
                          className="w-10 h-10 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => {
                            const newCart = cart.filter(
                              (product) => product.productId !== item.productId
                            );
                            setCart(newCart);
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

            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <FiUser className="text-gray-700" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Delivery Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiUser className="inline mr-2" size={16} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiPhone className="inline mr-2" size={16} />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="inline mr-2" size={16} />
                    Delivery Address *
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors resize-none"
                    rows="3"
                    placeholder="Enter your full delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="flex items-center mt-2">
                  <input
                    id="saveAddress"
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="mr-2 w-4 h-4 text-accent focus:ring-accent border-gray-300 rounded"
                  />
                  <label
                    htmlFor="saveAddress"
                    className="text-sm text-gray-700"
                  >
                    Save this address to my profile
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <FiCreditCard className="text-gray-700" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>Rs.{getTotalForLabeledPrice().toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>
                    -Rs.{(getTotalForLabeledPrice() - getTotal()).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>Rs.{getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={placeOrder}
              >
                Place Order
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  By placing this order, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
