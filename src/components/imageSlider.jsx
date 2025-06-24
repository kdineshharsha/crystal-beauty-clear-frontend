import React, { useState } from "react";

export default function ImageSlider({ images }) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-white py-8 px-4">
      <div className="flex flex-col-reverse md:flex-row items-center gap-6 bg-white p-6 rounded-2xl shadow-2xl max-w-5xl">
        {/* Thumbnails */}
        <div className="flex flex-row md:flex-col gap-4 bg-pink-100 p-4 rounded-lg shadow-lg">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => setActiveImage(image)}
              className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                activeImage === image
                  ? "border-accent scale-105 shadow-md"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-20 h-16 md:w-24 md:h-20 object-cover"
              />
            </div>
          ))}
        </div>

        {/* Main Image */}
        <div className="w-full sm:w-[70%] max-h-[400px] aspect-square rounded-xl bg-secondary p-1 shadow-xl">
          <img
            src={activeImage}
            alt="Main product"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
