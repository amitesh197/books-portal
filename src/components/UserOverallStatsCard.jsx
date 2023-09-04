import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { useNavigate } from "react-router-dom";

export default function UserOverallStatsCard({ userData }) {
  const navigate = useNavigate();
  const handleClick = () => {
    // console.log("user data is", userData);
    /* 
    userData = {
    "userName": "test2@gmail.com",
    "totalCount": 30,
    "totalCallCount": 30,
    "totalConnectedCount": 10,
    "totalChatCount": 20
}
    */
    //set username in local storage
    localStorage.setItem("userName", userData.userName);
    //redirect to user history page
    // get username from email
    const userName = userData.userName.split("@")[0];
    navigate(`/users/${userName}`);
  };
  const targetCountForMonth = 1875;

  return (
    <div
      className="w-fit m-3 p-2 rounded-lg bg-theme-light-gray relative parent-show-on-hover cursor-pointer hover:shadow-md transition-shadow ease-out hover:shadow-theme-yellow-dark "
      onClick={() => {
        handleClick();
      }}
    >
      <h1 className="text-lg font-semibold w-full text-center">
        {userData.userName}
      </h1>

      {/* progress bar and stats container */}
      <div className="flex flex-row flex-nowrap justify-center items-center gap-3 px-3">
        {/* progress bar */}
        <div className="w-28 h-2w-28">
          <CircularProgressbar
            value={userData.totalCount}
            maxValue={targetCountForMonth}
            text={`${userData.totalCount} `}
            strokeWidth={12}
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

        {/* stats container */}
        <div className="flex flex-wrap  w-full justify-evenly items-center my-6">
          {/* div for live classes */}
          <div className="text-center">
            <div className=" flex flex-row text-theme-yellow-dark justify-center">
              <div className="text-lg  font-bold  ">
                {userData.totalCallCount}
              </div>
            </div>
            <div className="font-semibold text-xs px-1 leading-3 tracking-tighter">
              Total Calls
            </div>
          </div>

          {/* div for mentoring sessions */}
          <div className="text-center ">
            <div className=" flex flex-row text-theme-yellow-dark justify-center">
              <div className="text-lg  font-bold  ">
                {userData.totalConnectedCount}
              </div>
            </div>
            <div className="font-semibold text-xs px-1 leading-3 tracking-tighter">
              Connected Calls
            </div>
          </div>

          {/* div for lectures recorded */}
          <div className="text-center">
            <div className=" flex flex-row text-theme-yellow-dark justify-center">
              <div className="text-lg  font-bold  ">
                {userData.totalChatCount}
              </div>
            </div>
            <div className="font-semibold text-xs px-1 leading-3 tracking-tighter">
              Chats
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs absolute bottom-2 right-4 hidden child-show-on-hover">
        Show full stats <i className="fa-solid fa-arrow-right"></i>
      </p>
    </div>
  );
}
