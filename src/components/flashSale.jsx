import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./loader";
import ProductCard from "./productCard";
import ProductSkeleton from "./productSkeletion";

export default function FlashSale() {
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
    <div className="w-full py-10 px-4 bg-gradient-to-r from-[#ff0080] to-[#ff4d4d] text-white">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className=" ">
          <h2 className="text-xl sm:text-2xl font-semibold">Crystal Beauty</h2>
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-yellow-300">Flash Sale</span>
          </h1>
        </div>
        <button className="text-white text-sm sm:text-base font-medium hover:underline">
          View All &gt;
        </button>
      </div>
      <div className="w-full   py-6 ">
        <div className="flex flex-nowrap justify-between  items-center mb-6"></div>
        {productLoaded ? (
          <div className="w-full h-full flex flex-nowrap overflow-x-scroll gap-4 p-2 scrollbar-hide items-center lg:justify-center">
            {productList.slice(0, 6).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex flex-nowrap gap-4 overflow-x-scroll scrollbar-hide lg:justify-center ">
            {[...Array(5)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
