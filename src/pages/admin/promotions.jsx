import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import AdBannerForm from "./adBannerForm";
import AdBannerTable from "../../components/AdBannerTable";

export default function Promotions() {
  const [adList, setAdList] = useState([]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/promo/")
      .then((res) => setAdList(res.data))
      .catch((err) => {
        console.log(err);
        toast.error("Failed to load ad banners.");
      });
  }, []);

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gradient-to-br from-amber-100 to-amber-300 min-h-screen">
      <AdBannerTable adList={adList} setAdList={setAdList} />
    </div>
  );
}
