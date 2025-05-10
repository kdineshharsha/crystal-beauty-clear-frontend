import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/loader";
import ProductCard from "../../components/productCard";
function ProductPage() {
  const [productList, setProductList] = useState([]);
  const [productLoaded, setProductLoaded] = useState(false);

  useEffect(() => {
    if (!productLoaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/product")
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
    <div className="w-full h-full ">
      {productLoaded ? (
        <div className="w-full h-full flex flex-wrap gap-4 p-2">
          {productList.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default ProductPage;
