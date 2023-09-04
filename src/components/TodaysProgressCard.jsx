import React from "react";

export default function TodaysProgressCard({ userData }) {
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
  // Get current date, month, and year
  const currentDate = new Date();
  //convert current month number to month name
  let currentDay = currentDate.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  //filter the data by current date, month, and year
  userData = userData.filter(
    (item) =>
      item.Date === currentDay &&
      item.Month === currentMonth &&
      item.Year === currentYear
  );
  console.log("userData is in todays", userData);
  const callsCount = userData
    .filter((item) => item.Type === "call")
    .reduce((acc, item) => acc + item.Count, 0);
  const chatsCount = userData
    .filter((item) => item.Type === "chat")
    .reduce((acc, item) => acc + item.Count, 0);
  const connectedCount = userData
    .filter((item) => item.Type === "call")
    .reduce((acc, item) => acc + item.Connected, 0);

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
