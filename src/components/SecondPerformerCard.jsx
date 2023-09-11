import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";

export default function SecondPerformerCard({ topThree }) {
  /*  userData is an object of the form
      { 
      userName: 'example@gmail.com',
      totalCount: 247,
      totalCallCount: 250,
      totalConnectedCount: 105,
      totalChatCount: 142 },
      
          
  */
  const userData = topThree[1];
  // destructuring userData
  const {
    userName,
    totalCount,
    totalCallCount,
    totalConnectedCount,
    totalChatCount,
  } = userData;

  const targetCountForMonth = 1875;

  return (
    <div className="h-full w-fit p-5 rounded-lg bg-theme-light-gray col-span-6 relative mt-40 scale-90 pt-10">
      <div className="absolute top-3 left-4 text-2xl font-bold text-theme-yellow-dark ">
        2nd
      </div>
      <h1 className=" text-center w-full font-bold text-2xl">{userName}</h1>

      {/* div for progress bar */}
      <div className="flex flex-col justify-center items-center font-bold w-full my-3">
        {/* div for progress bar */}
        <div className="w-full sm:w-full md:w-2/3 lg:w-1/2 px-2">
          <CircularProgressbar
            value={totalConnectedCount}
            maxValue={targetCountForMonth}
            text={`${totalConnectedCount}`}
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
                fontWeight: "semi-bold",
              },
              // Customize background - only used when the `background` prop is true
              background: {
                fill: "#3e98c7",
              },
            }}
          />
        </div>
      </div>

      {/* div for progress  stats*/}
      <div className="flex flex-wrap gap-10 w-full justify-evenly items-center font-bold my-6">
        {/* div for live classes */}
        <div className="text-center">
          <div className=" flex flex-row  text-theme-yellow-dark justify-center">
            <div className=" text-lg  font-bold  ">{totalCallCount}</div>
          </div>
          <div className="px-1 leading-5">Total Calls</div>
        </div>

        {/* div for mentoring sessions */}
        <div className="text-center ">
          <div className=" flex flex-row text-theme-yellow-dark justify-center">
            <div className="text-lg  font-bold  ">{totalConnectedCount}</div>
          </div>
          <div className="px-1 leading-5">Connected Calls </div>
        </div>

        {/* div for lectures recorded */}
        <div className="text-center">
          <div className=" flex flex-row text-theme-yellow-dark justify-center">
            <div className="text-lg  font-bold  ">{totalChatCount}</div>
          </div>
          <div className="px-1 leading-5">Chats</div>
        </div>
      </div>
    </div>
  );
}
