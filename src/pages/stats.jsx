import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Toaster, toast } from "react-hot-toast";

function Stats() {
  const { userInfo } = useGlobalContext();

  const [statsData, setStatsData] = useState();

  const getData = async () => {
    const paramsData = {
      userEmail: userInfo.isAdmin ? "admin" : userInfo.email,
      action: "getstats",
    };

    const queryParams = new URLSearchParams(paramsData);

    try {
      toast.promise(
        (async () => {
          const result = await fetch(
            `${import.meta.env.VITE_URL}?${queryParams}`
          );
          const data = await result.json();
          setStatsData(data.data);
        })(),
        {
          loading: "Getting stats. This may take a while...",

          error: "Failed",
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setStatsData();
    if (userInfo.email) {
      getData();
    }
  }, [userInfo]);

  return (
    <div className="flex flex-col justify-center w-full flex-wrap">
      <Toaster
        position="bottom-left"
        toastOptions={{
          // Define default options
          className: "",

          style: {
            background: "#ff8e00",
            color: "#2e2c2d",
          },

          // Default options for specific types
          success: {
            duration: 2000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      <div className="flex justify-center font-semibold my-5">
        <button
          className="bg-green-600 px-4 p-2 rounded-sm hover:bg-green-700 active:bg-green-900"
          onClick={() => {
            if (userInfo.email) {
              getData();
            }
          }}
        >
          REFRESH
        </button>
      </div>
      <div className="flex justify-center w-full flex-wrap">
        {statsData &&
          Object.entries(statsData).map(([key, value]) => {
            return (
              <div className="bg-gray-600 flex flex-col p-5 rounded-sm m-5 text-center font-semibold text-gray-300">
                <span className="text-white font-bold">{key}</span>
                <div className="flex justify-between  my-1">
                  <span className="mx-2">Done :</span>
                  <span className="mx-2  text-green-500">{value.done}</span>
                </div>
                <div className="flex justify-between  my-1">
                  <span className="mx-2">not Done :</span>
                  <span className="mx-2 text-red-600">
                    {value.total - value.done}
                  </span>
                </div>
                <div className="flex justify-between  my-1">
                  <span className="mx-2">Total :</span>
                  <span className="text-white mx-2">{value.total}</span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Stats;
