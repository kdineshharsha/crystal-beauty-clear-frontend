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
    <div className="group relative w-full min-w-42 sm:min-w-48 max-w-80 h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col">
      {/* Wishlist Button */}
      {wishlistMode && (
        <button
          className="absolute top-2 right-2 z-10 text-red-500 text-lg sm:text-xl bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 hover:scale-110 hover:bg-white transition-all duration-300 shadow-lg"
          onClick={() => removeFromWishlist(product.wishlistId)}
          title="Remove from wishlist"
        >
          <IoMdHeartDislike />
        </button>
      )}

      {/* Discount Badge */}
      {product.labeledPrice > product.price && (
        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full shadow-lg">
          {Math.round(
            ((product.labeledPrice - product.price) / product.labeledPrice) *
              100
          )}
          % OFF
        </div>
      )}

      <Link to={`/overview/${product.productId}`} className="block">
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          {/* Product Name - Fixed height */}
          <h2 className="text-sm sm:text-lg font-bold text-gray-800 line-clamp-1 leading-tight group-hover:text-accent-hover transition-colors duration-300 ">
            {product.name}
          </h2>

          {/* Rating - Fixed height */}
          <div className="flex items-center gap-1 sm:gap-2 h-5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xs sm:text-sm ${
                    i < Math.round(average)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              {average.toFixed(1)} ({total})
            </span>
          </div>

          {/* Description - Fixed height */}
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2  my-1 h-8 sm:h-10">
            {product.description}
          </p>

          {/* Spacer to push price and button to bottom */}
          <div className="flex-1"></div>

          {/* Price Section - Fixed height */}
          <div className="flex items-center  justify-between  my-1">
            <div className="flex items-center  justify-between w-full gap-x-0.5">
              <span className="text-md sm:text-xl font-bold text-gray-900">
                Rs. {product.price.toFixed(2)}
              </span>
              {product.labeledPrice > product.price && (
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  Rs. {product.labeledPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button - Fixed position */}
          <button
            className="w-full mt-2 sm:mt-4 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-103 shadow-lg hover:shadow-xl text-sm sm:text-base"
            style={{
              background: "linear-gradient(to right, #f6339a, #e60076)",
              "--hover-bg": "linear-gradient(to right, #e60076, #d1006b)",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background =
                "linear-gradient(to right, #e60076, #d1006b)")
            }
            onMouseLeave={(e) =>
              (e.target.style.background =
                "linear-gradient(to right, #f6339a, #e60076)")
            }
          >
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  );
}
