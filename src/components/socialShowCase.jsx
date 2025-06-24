import React from "react";

const mediaItems = [
  {
    id: 1,
    type: "image",
    src: "/assets/showcase1.jpg",
  },
  {
    id: 2,
    type: "video",
    src: "/assets/showcase2.jpg",
    thumbnail: "/assets/showcase2.jpg",
  },
  {
    id: 3,
    type: "image",
    src: "/assets/showcase3.jpg",
  },
  {
    id: 4,
    type: "video",
    src: "/assets/showcase4.mp4",
    thumbnail: "/assets/showcase4.jpg",
  },
  {
    id: 5,
    type: "image",
    src: "/assets/showcase5.jpg",
  },
  {
    id: 6,
    type: "video",
    src: "/assets/showcase6.mp4",
    thumbnail: "/assets/showcase6.jpg",
  },
  {
    id: 7,
    type: "image",
    src: "/assets/showcase7.jpg",
  },
  {
    id: 8,
    type: "video",
    src: "/assets/showcase8.mp4",
    thumbnail: "/assets/showcase8.jpg",
  },
];

export default function SocialShowcase() {
  return (
    <div className="w-full bg-white py-10 px-4 text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
        #CRYSTALBEAUTYCLEAR
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-8">
        Tag us @crystalbeautyclear with #crystalbeautyclear for a chance to be
        featured!
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="relative group overflow-hidden rounded-md cursor-pointer"
          >
            {item.type === "image" ? (
              <img
                src={item.src}
                alt=""
                className="w-full h-full object-cover aspect-square transition-transform group-hover:scale-105"
              />
            ) : (
              <>
                <img
                  src={item.thumbnail}
                  alt=""
                  className="w-full h-full object-cover aspect-square transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
