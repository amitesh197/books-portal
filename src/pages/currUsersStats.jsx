import React, { useMemo } from "react";
import { useGlobalContext } from "../context/globalContext";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "../components/navbar";
import Loading from "../components/Loading";
import UserOverallStatsCard from "../components/UserOverallStatsCard";
import { useNavigate } from "react-router-dom";

export default function CurrUsersStats() {
  const { userInfo } = useGlobalContext();
  const navigate = useNavigate();

  //here the user object has two properties { user , isAdmin}
  const [fecthingData, setFetchingData] = useState(false);
  // const [allUsersData, setAllUsersData] = useState(null);
  const [allUsersData, setAllUsersData] = useState(null);

  //useMemo
  const getAllUsersData = async () => {
    setFetchingData(true);
    const paramsData = {
      userEmail: userInfo?.email,
      action: "getAllUsersSummary",
      status: "all",
      sheetname: userInfo?.email,
    };
    console.log("params data is", paramsData);

    const queryParams = new URLSearchParams(paramsData);

    try {
      toast.dismiss();
      setFetchingData(true);
      const result = await fetch(`${import.meta.env.VITE_URL}?${queryParams}`);
      const data = await result.json();
      toast.dismiss();
      console.log("data", data);
      if ((data.message = "done")) {
        //sort data by total connected count
        data.data.sort((a, b) => {
          return b.totalConnectedCount - a.totalConnectedCount;
        });

        setAllUsersData(data.data);
        console.log("user Data", data.data);
        toast.success("Fetched");
        setFetchingData(false);
      } else {
        toast.error("Failed to Fetch Data");
        setFetchingData(false);
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to Fetch Data");
      console.log(err);
      setFetchingData(false);
    }
  };

  useEffect(() => {
    if (userInfo?.isAdmin === false) {
      toast.error("You are not authorized to view this page");
      navigate("/");
    }
    getAllUsersData();
  }, [userInfo?.isAdmin]);

  return (
    <>
      <Navbar />
      <div className="flex flex-row flex-wrap items-center justify-evenly ">
        <h1 className="text-xl font-semibold w-full text-center my-2">
          All users stats for current month
        </h1>
        {!allUsersData && fecthingData ? (
          <Loading />
        ) : (
          <div className="flex flex-row flex-wrap items-center justify-evenly ">
            {allUsersData?.map((user, index) => {
              return (
                <UserOverallStatsCard
                  key={index}
                  userData={user}
                  index={index}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
