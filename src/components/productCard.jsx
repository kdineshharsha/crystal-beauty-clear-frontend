import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard(props) {
  const product = props.product;
  return (
    <Link
      to={"/overview/" + product.productId}
      className="w-64 h-72 shadow-md rounded-lg bg-white flex flex-col p-2"
    >
      <img
        src={product.image[0]}
        alt={product.name}
        className="aspect-3/2 object-cover  rounded-md overflow-hidden"
      />
      <div className="mt-2">
        <h2 className="text-lg font-semibold">{product.name}</h2>
      </div>
      <div className="mt-2 flex justify-between">
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
        <p className="text-gray-600 line-through">
          ${product.labeledPrice.toFixed(2)}
        </p>
      </div>
      <div className="mt-2">
        {/* <p className="text-gray-600">{product.description}</p> */}
      </div>
    </Link>
  );
}
