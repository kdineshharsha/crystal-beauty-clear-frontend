import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    image: "/src/assets/img1.webp",
  },
  {
    id: 2,
    image: "/src/assets/img2.webp",
  },
  {
    id: 3,
    image: "/src/assets/img3.webp",
  },
];

export default function AdvertisementBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="relative bg-blue-300 w-full -xl mx-auto overflow-hidden rounded-2xl shadow-lg lg:mt-10 mt-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full aspect-auto relative">
            <img
              src={slide.image}
              className="w-full h-full object-cover"
              alt={slide.caption}
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      {/* Indicators (Bars) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              current === index ? "w-12 bg-white" : "w-6 bg-gray-400"
            }`}
            onClick={() => setCurrent(index)}
          ></button>
        ))}
      </div>
    </div>
  );
}
