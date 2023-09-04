import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";

export default function MonthProgressCard({ userData }) {
  // console.log("user data in month progress card", userData);
  const [progress, setProgress] = useState(10);

  /* userData is like [
    {
        "Id": 1693313053204,
        "Date": 29,
        "Month": "Aug",
        "Year": 2023,
        "Type": "call",
        "Count": 10,
        "Connected":2
    },
   
    
    ...
]
    */
  const targetCountForMonth = 1875;
  const callsCount = userData
    .filter((item) => item.Type === "call")
    .reduce((acc, item) => acc + item.Count, 0);
  const chatsCount = userData
    .filter((item) => item.Type === "chat")
    .reduce((acc, item) => acc + item.Count, 0);
  const connectedCount = userData
    .filter((item) => item.Type === "call")
    .reduce((acc, item) => acc + item.Connected, 0);
  const currentCount = Number(connectedCount) + Number(chatsCount);

  return (
    <div className="h-full w-full p-5 rounded-lg bg-theme-light-gray">
      <h1 className=" text-center w-full font-bold text-2xl">
        Your Month's Progress
      </h1>

      {/* div for progress bar */}
      <div className="flex flex-col justify-center items-center w-full my-3">
        <div className="w-full sm:w-full md:w-2/3 lg:w-1/2 px-2">
          <CircularProgressbar
            value={currentCount}
            maxValue={targetCountForMonth}
            text={`${currentCount}`}
            strokeWidth={10}
            styles={{
              // Customize the path, i.e. the "completed progress"
              path: {
                // Path color
                stroke: `#ff8e00`,
                // Customize transition animation
                transition: "stroke-dashoffset 1.5s ease-out",

                // Rotate the path
              },
              // Customize the circle behind the path, i.e. the "total progress"
              trail: {
                // Trail color
                stroke: "#2e2c2d",
              },
              // Customize the text
              text: {
                // Text color
                fill: "#2e2c2d",
                // Text size
                fontSize: "16px",
                fontWeight: "bold",
              },
              // Customize background - only used when the `background` prop is true
              background: {
                fill: "#3e98c7",
              },
            }}
          />
        </div>
        <p className="my-2 font-bold text-lg">Out of {targetCountForMonth}</p>
      </div>

      {/* div for progress  */}
      <div className="flex flex-wrap w-full justify-evenly items-center my-6">
        {/* div for calls */}
        <div className="text-center">
          <div className=" text-theme-yellow-dark justify-center font-bold text-3xl">
            {callsCount}
          </div>
          <div className="font-semibold text-lg px-1 ">Total Calls</div>
        </div>
        {/* div for connected calls */}
        <div className="text-center">
          <div className=" text-theme-yellow-dark justify-center font-bold text-3xl">
            {connectedCount}
          </div>
          <div className="font-semibold text-lg px-1 ">Connected Calls</div>
        </div>

        {/* div for chats */}
        <div className="text-center">
          <div className="  text-theme-yellow-dark justify-center font-bold text-3xl">
            {chatsCount}
          </div>
          <div className="font-semibold text-lg px-1  ">Chats</div>
        </div>
      </div>
    </div>
  );
}
