import React from "react";

export default function TodaysProgressCard({ userData }) {
  /* userData is like [
    {
        "Id": 1693313053204,
        "Date": 29,
        "Month": "Aug",
        "Year": 2023,
        "Type": "call",
        "Count": 1
    },
    {
        "Id": 1693313015986,
        "Date": 29,
        "Month": "Aug",
        "Year": 2023,
        "Type": "call",
        "Count": 1
    },
    ...
]
    */
  const callsCount = userData
    .filter((item) => item.Type === "call")
    .reduce((acc, item) => acc + item.Count, 0);
  const chatsCount = userData
    .filter((item) => item.Type === "chat")
    .reduce((acc, item) => acc + item.Count, 0);

  return (
    <div className="w-full my-5 bg-theme-light-gray rounded-lg p-5 h-full flex flex-col gap-5">
      <h1 className="font-bold w-full text-center text-2xl ">
        Today's Progress
      </h1>

      {/* div for progress  */}
      <div className="flex flex-wrap w-full justify-evenly items-center ">
        {/* div for calls */}
        <div className="text-center">
          <div className=" text-theme-yellow-dark justify-center font-bold text-3xl">
            {callsCount}
          </div>
          <div className="font-semibold text-lg px-1 ">Calls</div>
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
