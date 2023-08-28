import React from "react";

export default function Loading() {
  return (
    <div className="w-full h-ful my-5 flex items-center justify-center text-theme-yellow-dark">
      <div className="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
