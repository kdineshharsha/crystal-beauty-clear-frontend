export default function ProductSkeleton() {
  return (
    <div className="w-full min-w-40 sm:w-64 h-[360px] rounded-2xl bg-white shadow-lg overflow-hidden relative animate-pulse flex flex-col gap-3 p-4">
      {/* Image */}
      <div className="h-36 bg-pink-100 rounded-lg"></div>

      {/* Title */}
      <div className="h-4 bg-pink-200 rounded w-4/5"></div>

      {/* Description */}
      <div className="h-3 bg-pink-100 rounded w-full"></div>
      <div className="h-3 bg-pink-100 rounded w-5/6"></div>

      {/* Price */}
      <div className="mt-auto h-5 bg-pink-300 rounded w-1/3"></div>

      {/* Shimmer */}
      <div className="absolute inset-0 animate-shimmer z-10 opacity-20 pointer-events-none rounded-2xl" />
    </div>
  );
}
