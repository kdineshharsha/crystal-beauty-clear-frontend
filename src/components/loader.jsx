import React from "react";
import { ThreeDot } from "react-loading-indicators";

function Loader() {
  return (
    <div className=" fixed top-1/2 left-1/2">
      <ThreeDot color="#32cd32" size="medium" text="" textColor="" />
    </div>
  );
}

export default Loader;
