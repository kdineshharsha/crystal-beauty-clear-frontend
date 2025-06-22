import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./loader";
import ProductCard from "./productCard";
import ProductSkeleton from "./productSkeletion";

export default function Trending() {
  const [productList, setProductList] = useState([]);
  const [productLoaded, setProductLoaded] = useState(false);

  useEffect(() => {
    if (!productLoaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/product/")
        .then((res) => {
          setProductList(res.data);
          setProductLoaded(true);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [productLoaded]);

  return (
    <div className="w-full   py-10 md:px-4 px-3 bg-amber-200 ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-wide">Trending</h2>
        <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-all">
          Shop All <span>→</span>
        </button>
      </div>
      {productLoaded ? (
        <div className="w-full h-full flex flex-nowrap overflow-x-scroll gap-4 p-2 scrollbar-hide items-center bg-blue-200">
          {productList.slice(0, 5).map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex flex-nowrap gap-4 overflow-x-scroll scrollbar-hide  ">
          {[...Array(5)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
