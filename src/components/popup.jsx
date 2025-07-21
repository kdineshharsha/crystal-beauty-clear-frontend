import { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaMagic, FaGift } from "react-icons/fa";

export default function AdPopupModal() {
  const [ad, setAd] = useState(null);
  const [show, setShow] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("popup_ad_shown");

    if (!alreadyShown) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/popup/popup")
        .then((res) => {
          if (res.data && res.data.imageUrl) {
            setAd(res.data);
            // Add slight delay for better UX
            setTimeout(() => setShow(true), 500);
            sessionStorage.setItem("popup_ad_shown", "true");
          }
        })
        .catch((err) => console.log("Ad popup fetch failed", err));
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setShow(false), 200);
  };

  if (!show || !ad) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md   relative transform transition-all duration-300 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-200 group"
          onClick={handleClose}
        >
          <FaTimes className="text-sm group-hover:scale-110 transition-transform" />
        </button>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400"></div>

        {/* Image Container */}
        <div className="relative">
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-50 sm:h-64 object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="p-6 relative">
          {/* Special Offer Badge */}
          <div className="absolute -top-3 left-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <FaGift className="text-sm" />
            <span className="text-sm font-semibold">Special Offer</span>
          </div>

          <div className="text-center pt-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FaMagic className="text-pink-500 text-lg" />
              <h2 className="text-2xl font-bold text-gray-800">{ad.title}</h2>
              <FaMagic className="text-pink-500 text-lg" />
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">
              {ad.description}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  window.open(ad.link || "/", "_blank");
                  handleClose();
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-accent to-accent-hover text-white font-semibold rounded-xl hover:bg-accent-hover transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Border */}
        <div className="h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400"></div>
      </div>
    </div>
  );
}
