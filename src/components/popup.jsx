import { useEffect, useState } from "react";
import axios from "axios";

export default function AdPopupModal() {
  const [ad, setAd] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("popup_ad_shown");

    if (!alreadyShown) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/popup/popup")
        .then((res) => {
          if (res.data && res.data.imageUrl) {
            setAd(res.data);
            setShow(true);
            sessionStorage.setItem("popup_ad_shown", "true");
          }
        })
        .catch((err) => console.log("Ad popup fetch failed", err));
    }
  }, []);

  if (!show || !ad) return null;

  return (
    <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-sm w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          onClick={() => setShow(false)}
        >
          ✖
        </button>
        <img src={ad.imageUrl} alt={ad.title} className="w-full object-cover" />
        <div className="p-4 text-center">
          <h2 className="text-xl font-bold">{ad.title}</h2>
          <p className="text-gray-600 text-sm mt-2">{ad.description}</p>
        </div>
      </div>
    </div>
  );
}
