import axios from "axios";
import { useEffect, useState } from "react";

export default function AdvertisementBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [adList, setAdList] = useState([]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % adList.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [paused, adList.length]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/promo/active/")
      .then((res) => {
        const visibleAds = res.data.filter((ad) => ad.isVisible);
        setAdList(visibleAds);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
        {adList.map((ad, index) => (
          <div key={ad._id} className="min-w-full aspect-auto relative">
            <a href={ad.link} target="_blank" rel="noopener noreferrer">
              <img
                src={ad.image[0]}
                className="w-full h-full object-cover"
                alt={ad.title}
              />
            </a>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {adList.map((_, index) => (
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
