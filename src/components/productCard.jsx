import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/overview/${product.productId}`}
      className=" w-full min-w-40   bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-102"
    >
      {/* Image */}
      <div className="w-full aspect-square overflow-hidden">
        <img
          src={product.image[0]}
          alt={product.name}
          className="w-full h-full object-cover "
        />
      </div>

      {/* Info */}
      <div className="px-2 pt-2  flex-col justify-between h-[calc(100%-10rem)]">
        <h2 className="text-lg font-semibold text-secondary line-clamp-1">
          {product.name}
        </h2>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>

        {/* Prices */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-bold text-accent">
            ${product.price.toFixed(2)}
          </p>
          {product.labeledPrice > product.price && (
            <p className="text-sm text-gray-400 line-through">
              ${product.labeledPrice.toFixed(2)}
            </p>
          )}
        </div>

        {/* Optional Description or Tag */}
        {/* <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p> */}
      </div>
    </Link>
  );
}
