import React from "react";

export default function Loading() {
  return (
    <div className="w-full my-5 flex  h-52 items-center overflow-hidden justify-center text-theme-yellow-dark">
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
