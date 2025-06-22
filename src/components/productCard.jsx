import React from "react";
import { Link } from "react-router-dom";
import { IoMdHeartDislike } from "react-icons/io";

export default function ProductCard({
  product,
  wishlistMode,
  removeFromWishlist,
}) {
  const average = product.averageRating || 0;
  const total = product.totalReviews || 0;

  return (
    <div className="relative w-full min-w-41 sm:w-68 max-w-275 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-102">
      {wishlistMode && (
        <button
          className="absolute top-2 right-2 text-pink-500 text-xl bg-white rounded-full p-1 hover:scale-110 transition z-1"
          onClick={() => removeFromWishlist(product.wishlistId)}
          title="Remove from wishlist"
        >
          <IoMdHeartDislike />
        </button>
      )}

      <Link to={`/overview/${product.productId}`}>
        <div className="w-full aspect-square overflow-hidden">
          <img
            src={product.image[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="px-2 pt-2 flex-col justify-between h-[calc(100%-10rem)]">
          <h2 className="text-lg font-semibold text-secondary line-clamp-1">
            {product.name}
          </h2>

          <div className="flex items-center gap-1 text-sm text-orange-500 mt-1">
            {"★".repeat(Math.round(average)) +
              "☆".repeat(5 - Math.round(average))}
            <span className="text-xs text-gray-500 ml-1">({total})</span>
          </div>

          <p className="mt-2 text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-2">
            <p className="text-lg font-bold text-accent">
              Rs.{product.price.toFixed(2)}
            </p>
            {product.labeledPrice > product.price && (
              <p className="text-sm text-gray-400 line-through">
                Rs.{product.labeledPrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
