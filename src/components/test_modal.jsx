import React from "react";

function TestModal(props) {
  return (
    <div className="w-100 h-140 bg-white rounded-xl p-4">
      <div className="w-full h-15 bg-amber-400 flex">
        <h1 className="text-sm font-semibold p-2">Order ID: {props.orderId}</h1>
      </div>
    </div>
  );
}

export default TestModal;
