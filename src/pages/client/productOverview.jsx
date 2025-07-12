import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader";
import ImageSlider from "../../components/imageSlider";
import { addToCart } from "../../utils/cart";
import Review from "../../components/review";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";

export default function ProductOverview() {
  const params = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loaded, error
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!params.id) window.location.href = "/products";

    if (status === "loading") {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/product/" + params.id)
        .then((res) => {
          setProduct(res.data.product);
          setStatus("loaded");
        })
        .catch(() => {
          toast.error("Product is not available!");
          setStatus("error");
        });
    }
  }, [status]);

  const handleAddToWishlist = async () => {
    if (!token) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist`,
        { productId: product.productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Added to wishlist 💖");
      setIsWishlisted(true); // ✅ Change heart icon
    } catch (err) {
      console.error("❌ Failed to add to wishlist:", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="w-full h-full bg-primary">
      {status === "loading" && <Loader />}

      {status === "loaded" && (
        <>
          <div className="w-full h-auto sm:flex flex-row">
            <div className="sm:w-1/2 w-full h-full bg-red-500 flex items-center justify-center">
              <ImageSlider images={product.image} />
            </div>

            {/* Product details */}
            <div className="sm:w-1/2 w-full p-10 bg-white  flex flex-col gap-6">
              <div>
                <h1 className="sm:text-5xl text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-400">
                  {product.altNames.join(" · ")}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {product.labeledPrice > product.price ? (
                  <>
                    <span className="sm:text-2xl text-xl font-medium text-gray-400 line-through">
                      Rs.{product.labeledPrice.toFixed(2)}
                    </span>
                    <span className="sm:text-3xl text-2xl font-bold text-green-600">
                      Rs.{product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-red-500 bg-red-100 px-2 py-1 rounded-full font-semibold">
                      {Math.round(
                        ((product.labeledPrice - product.price) /
                          product.labeledPrice) *
                          100
                      )}
                      % OFF
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    Rs.{product.price.toFixed(2)}
                  </span>
                )}
              </div>

              <hr className="border-gray-200" />

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Product Description
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex gap-4 mt-4 items-center">
                <button
                  className="bg-black text-white text-sm px-6 py-3 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                  onClick={() => {
                    addToCart(product, 1);
                    toast.success("Added to cart 🛒");
                  }}
                >
                  Add to Cart
                </button>
                <button
                  className="bg-white text-black border border-gray-300 text-sm px-6 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => {
                    navigate("/checkout", {
                      state: {
                        items: [
                          {
                            productId: product.productId,
                            name: product.name,
                            altNames: product.altNames,
                            price: product.price,
                            labeledPrice: product.labeledPrice,
                            image: product.image[0],
                            quantity: 1,
                          },
                        ],
                      },
                    });
                  }}
                >
                  Buy Now
                </button>
                <button
                  title="Add to Wishlist"
                  className="p-2 rounded-full hover:bg-pink-100 transition"
                  onClick={handleAddToWishlist}
                >
                  {isWishlisted ? (
                    <IoMdHeart className="text-2xl text-pink-500" />
                  ) : (
                    <IoMdHeartEmpty className="text-2xl text-gray-600 hover:text-pink-500" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <Review />
        </>
      )}

      {status === "error" && <div>ERROR</div>}
    </div>
  );
}
