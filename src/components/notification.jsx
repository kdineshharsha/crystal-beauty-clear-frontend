import React from "react";

export default function Notification() {
  return (
    <div className="flex mb-4 w-full items-center justify-start">
      <img src="/user.png" alt="" className="size-12" />
      <div className="ml-2 overflow-y-hidden">
        <p className="text-gray-500 text-sm">Welcome back,</p>
        <p className="font-semibold overflow-">{user.firstName}</p>
      </div>
    </div>
  );
}
