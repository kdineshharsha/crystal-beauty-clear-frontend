// components/productSkeleton.jsx
export default function ProductSkeleton() {
  return (
    <div className="w-full sm:flex animate-pulse bg-white">
      {/* Image Skeleton */}
      <div className="sm:w-1/2 w-full h-[400px] bg-gray-200 flex items-center justify-center">
        <div className="w-[80%] h-[80%] bg-gray-300 rounded-lg"></div>
      </div>

      {/* Details Skeleton */}
      <div className="sm:w-1/2 w-full p-10 flex flex-col gap-4">
        <div className="h-8 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-6 bg-gray-300 rounded w-1/4 mt-2"></div>

        <hr className="my-4" />

        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>

        <div className="flex gap-4 mt-6">
          <div className="h-10 w-28 bg-gray-300 rounded"></div>
          <div className="h-10 w-28 bg-gray-300 rounded"></div>
          <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
