import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "../components/navbar";
import Loading from "../components/Loading";

function Stats() {
  const { userInfo } = useGlobalContext();
  const [fecthingData, setFetchingData] = useState(false);
  const [statsData, setStatsData] = useState();

  const getData = async () => {
    setFetchingData(true);
    const paramsData = {
      userEmail: userInfo.isAdmin ? "admin" : userInfo.email,
      action: "getstats",
    };

    const queryParams = new URLSearchParams(paramsData);

    try {
      const result = await fetch(`${import.meta.env.VITE_URL}?${queryParams}`);
      const data = await result.json();
      setStatsData(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingData(false);
    }
  };

  const camelCaseToSentenceCase = (str) => {
    if (str === "numberchange") {
      return "Number Change";
    } else if (str === "emailchange") {
      return "Email Change";
    } else if (str === "contentmissing") {
      return "Content Missing";
    } else if (str === "coursenotvisible") {
      return "Course Not Visible";
    } else if (str === "UPIpayment") {
      return "UPI Payment";
    } else if (str === "grpnotalloted") {
      return "Group Not Alloted";
    } else if (str === "misc") {
      return "Miscellanous";
    } else {
      return str;
    }
  };

  useEffect(() => {
    setStatsData(null);
    if (userInfo.email) {
      getData();
    }
  }, [userInfo]);

  return (
    <>
      <Navbar />
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

        {fecthingData ? (
          <Loading />
        ) : (
          <div className="flex justify-center w-full flex-wrap">
            {statsData &&
              Object.entries(statsData).map(([key, value]) => {
                return (
                  <div className="bg-theme-light-gray flex flex-col p-5 rounded-lg  m-5 text-center text-theme-dark border border-theme-yellow-dark">
                    <span className="text-xl mb-2 font-bold">
                      {camelCaseToSentenceCase(key)}
                    </span>
                    <div className="flex justify-between  my-1">
                      <span className="mx-2">Done :</span>
                      <span className="mx-2  text-green-600">{value.done}</span>
                    </div>
                    <div className="flex justify-between  my-1">
                      <span className="mx-2">Not done :</span>
                      <span className="mx-2 text-red-600">
                        {value.total - value.done}
                      </span>
                    </div>
                    <div className="flex justify-between  my-1">
                      <span className="mx-2">Total :</span>
                      <span className=" mx-2">{value.total}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
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
      </div>
    </>
  );
}

export default Stats;
