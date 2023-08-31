import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { useRouter } from "next/router";

export default function FacultyOverAllStatsCard({ facultyData }) {
  const router = useRouter();
  /* facultyData is an object with the following structure
     {
        "userName": "Shantanu Sakpal",
        "totalMinutes": 2724,
        "totalLiveMinutes": 2112,
        "totalMentorMinutes": 401,
        "totalRecordMinutes": 90
    },
    */
  const targetTimeHrs = 70; //in hrs
  const targetTimeMins = targetTimeHrs * 60; //in minutes
  const completedTimeHrs = Math.floor(facultyData.totalMinutes / 60);
  const completedTimeMins = facultyData.totalMinutes % 60;

  const liveClassesHours = Math.floor(facultyData.totalLiveMinutes / 60);
  const liveClassesMinutes = facultyData.totalLiveMinutes % 60;
  const mentoringSessionsHours = Math.floor(
    facultyData.totalMentorMinutes / 60
  );
  const mentoringSessionsMinutes = facultyData.totalMentorMinutes % 60;
  const lecturesRecordedHours = Math.floor(facultyData.totalRecordMinutes / 60);
  const lecturesRecordedMinutes = facultyData.totalRecordMinutes % 60;

  const handleClick = () => {
    router.push(`/user/${facultyData.userName}`);
  };

  return (
    <div
      className="w-fit m-3 p-2 rounded-lg bg-theme-gray  relative parent-show-on-hover cursor-pointer hover:shadow-md transition-shadow ease-out hover:shadow-theme-yellow-dark "
      onClick={() => {
        handleClick();
      }}
    >
      <h1 className="text-lg font-semibold w-full text-center">
        {facultyData.userName}
      </h1>

      {/* progress bar and stats container */}
      <div className="flex flex-row flex-nowrap justify-center items-center gap-3 px-3">
        {/* progress bar */}
        <div className="w-28 h-2w-28">
          <CircularProgressbar
            value={facultyData.totalMinutes}
            maxValue={targetTimeMins}
            text={`${completedTimeHrs}hrs `}
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
              <div className="text-lg  font-bold  ">{liveClassesHours}</div>
              <p className="  flex items-center text-sm mr-2">hrs</p>
            </div>
            <div className="font-semibold text-xs px-1 leading-3 tracking-tighter">
              Live <br /> Classes
            </div>
          </div>

          {/* div for mentoring sessions */}
          <div className="text-center ">
            <div className=" flex flex-row text-theme-yellow-dark justify-center">
              <div className="text-lg  font-bold  ">
                {mentoringSessionsHours}
              </div>
              <p className="  flex items-center text-sm mr-2">hrs</p>
            </div>
            <div className="font-semibold text-xs px-1 leading-3 tracking-tighter">
              Mentoring <br /> Sessions
            </div>
          </div>

          {/* div for lectures recorded */}
          <div className="text-center">
            <div className=" flex flex-row text-theme-yellow-dark justify-center">
              <div className="text-lg  font-bold  ">
                {lecturesRecordedHours}
              </div>
              <p className="  flex items-center text-sm mr-2">hrs</p>
            </div>
            <div className="font-semibold text-xs px-1 leading-3 tracking-tighter">
              Lectures <br /> Recorded
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
