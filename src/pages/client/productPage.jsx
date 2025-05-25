import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/loader";
import ProductCard from "../../components/productCard";
import CatalogMagic from "../testing";
import ProductSkeleton from "../testing";
function ProductPage() {
  const [productList, setProductList] = useState([]);
  const [productLoaded, setProductLoaded] = useState(false);
  const [search, setSearch] = useState("");

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

  function searchProduct() {
    if (search.length > 0) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/product/search/" + search)
        .then((res) => {
          setProductList(res.data.products);
        });
    }
  }

  return (
    <div className="w-full   p-4 ">
      <div className="w-full h-16 flex justify-center items-center ">
        <input
          value={search}
          type="text"
          placeholder="Search for products"
          className="w-1/2 h-10 rounded-full p-2 border-2 border-gray-300 focus:outline-none focus:border-pink-500"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button
          className="ml-2 bg-accent text-white rounded-full px-4 py-2 hover:bg-accent-hover transition"
          onClick={() => {
            searchProduct();
          }}
        >
          Search
        </button>
        <button
          className="ml-2 bg-accent text-white rounded-full px-4 py-2 hover:bg-accent-hover transition"
          onClick={() => setProductLoaded(false)}
        >
          Reset
        </button>
      </div>
      {productLoaded ? (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-4">
          {productList.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductPage;
