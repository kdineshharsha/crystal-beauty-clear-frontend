import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./loader";
import ProductCard from "./productCard";
import ProductSkeleton from "./productSkeletion";

export default function ProductCategory({
  title = "New Arrivals",
  buttonText = "Shop All",
  buttonLink = "/products",
  category = null, // Optional
}) {
  const [productList, setProductList] = useState([]);
  const [productLoaded, setProductLoaded] = useState(false);

  useEffect(() => {
    if (!productLoaded) {
      let url = import.meta.env.VITE_BACKEND_URL + "/api/product";
      if (category) {
        url += `?category=${category}`;
      }

      axios
        .get(url)
        .then((res) => {
          setProductList(res.data);
          setProductLoaded(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [productLoaded, category]);

  return (
    <div className="w-full bg-primary py-10 md:px-4 px-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-wide">{title}</h2>
        <a
          href={buttonLink}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-all"
        >
          {buttonText} <span>→</span>
        </a>
      </div>

      {productLoaded ? (
        <div className="w-full h-full flex flex-nowrap overflow-x-scroll gap-4 p-2 scrollbar-hide items-center ">
          {productList.slice(0, 5).map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex flex-nowrap gap-4 overflow-x-scroll scrollbar-hide">
          {[...Array(5)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
