import React from "react";

export default function RatingSummary({ reviews = [] }) {
  const total = reviews.length;

  // Calculate average
  const average =
    total === 0
      ? 0
      : (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(2);

  // Count each star rating
  const counts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

  return (
    <div className="w-full lg:max-w-sm bg-white p-6 rounded-xl shadow-md">
      <div className="text-4xl font-bold text-orange-500">{average}</div>
      <div className="text-orange-500 mb-2 text-xl">
        {"★".repeat(Math.round(average)) + "☆".repeat(5 - Math.round(average))}
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Based on {total.toLocaleString()} reviews
      </p>

      {/* Star bars */}
      {counts.map((count, index) => {
        const star = 5 - index;
        const percent = total ? (count / total) * 100 : 0;

        return (
          <div key={star} className="flex items-center mb-1 gap-2">
            <span className="text-sm w-4">{star}</span>
            <span className="text-orange-500">★</span>
            <div className="flex-1 h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-orange-500 rounded"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500 w-10 text-right">
              {count}
            </span>
          </div>
        );
      })}

      <button className="mt-4 bg-orange-500 text-white py-1.5 px-4 rounded hover:bg-orange-600 text-sm">
        Top reviews
      </button>
    </div>
  );
}
