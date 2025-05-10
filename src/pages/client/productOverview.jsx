import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader";
import ImageSlider from "../../components/imageSlider";
import { addToCart } from "../../utils/cart";

export default function ProductOverview() {
  const params = useParams();
  if (params.id == null) {
    window.location.href = "/products";
  }

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loaded, error
  const navigate = useNavigate();
  useEffect(() => {
    console.log(import.meta.env.VITE_BACKEND_URL + "/api/product/" + params.id);
    if (status == "loading") {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/product/" + params.id)
        .then((res) => {
          console.log(res);
          setProduct(res.data.product);
          setStatus("loaded");
        })
        .catch(() => {
          toast.error("Product is not available!");
          setStatus("error");
        });
    }
  }, [status]);

  return (
    <div className="w-full h-full bg-amber-100 ">
      {status == "loading" && <Loader />}
      {status == "loaded" && (
        <div className="w-full h-full flex ">
          <div className="w-1/2 h-full bg-red-500">
            <ImageSlider images={product.image} />
          </div>
          {/* Product details */}
          <div className="w-1/2 p-10 bg-white rounded-2xl shadow-xl flex flex-col gap-6">
            {/* Product Title & Alternate Names */}
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
                {product.name}
              </h1>
              <p className="text-sm text-gray-400">
                {product.altNames.join(" · ")}
              </p>
            </div>

            {/* Price Block */}
            <div className="flex items-center gap-4">
              {product.labeledPrice > product.price ? (
                <>
                  <span className="text-2xl font-medium text-gray-400 line-through">
                    ${product.labeledPrice.toFixed(2)}
                  </span>
                  <span className="text-3xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
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
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Description Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Product Description
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features Section (Optional) */}
            {/* You can map product.features here if available */}
            {/* 
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-2">Features</h2>
    <ul className="list-disc ml-5 text-gray-600 text-sm space-y-1">
      <li>High quality build</li>
      <li>Energy efficient</li>
      <li>1-year warranty</li>
    </ul>
  </div> 
  */}

            {/* Add to Cart / Buy Now Button */}
            <div className="flex gap-4 mt-4">
              <button
                className="bg-black text-white text-sm px-6 py-3 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                onClick={() => {
                  addToCart(product, 1);
                  toast.success("Added to cart");
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
            </div>
          </div>
        </div>
      )}
      {status == "error" && <div>ERROR</div>}
    </div>
  );
}
