import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import MediaUpload from "../utils/mediaUpload";
import axios from "axios";

export default function Testing() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/product")
      .then((res) => {
        setProducts(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="w-full h-full flex p-2 flex-wrap gap-4 bg-gray-300">
      {products.map((product, index) => (
        <div
          key={index}
          className="w-64 h-72 shadow-md rounded-lg bg-white flex flex-col p-2"
        >
          <div className="w-full h-40  rounded-md overflow-hidden">
            <img
              src={product.image[0]}
              alt={product.name}
              className="w-full h-full object-fit rounded-md hover:scale-105 object-contain transition-transform duration-300 ease-in-out "
            />
          </div>
          <div className="mt-2">
            <h1 className="text-lg font-semibold">{product.name}</h1>
            <p className="text-sm text-gray-700 line-clamp-2 text-left">
              {product.description}
            </p>
            <p className="text-md font-bold text-gray-700 text-right mt-2">
              ${product.price}
            </p>
            <div className="flex mt-2 justify-between">
              <button
                className="py-2 px-4 bg-red-700 text-white font-bold rounded-full "
                type="button"
              >
                Buy Now
              </button>
              <button
                className="py-2 px-4 border-2 border-black text-black font-bold rounded-full "
                type="button"
              >
                Add to Cart{" "}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
