import React from "react";
import { useGlobalContext } from "../context/globalContext";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "../components/navbar";
import Loading from "../components/Loading";
import FacultyOverAllStatsCard from "../components/FacultyOverAllStatsCard";

export default function Dashboard() {
  const { userInfo } = useGlobalContext();

  //here the user object has two properties { user , isAdmin}
  const [fecthingData, setFetchingData] = useState(false);
  const [allUsersData, setAllUsersData] = useState(null);

  const getAllUsersData = async () => {
    setFetchingData(true);
    const paramsData = {
      userEmail: userInfo?.email,
      action: "getAllUsersSummary",
      status: "all",
      sheetname: userInfo?.email,
    };
    // console.log("params data is", paramsData);

    const queryParams = new URLSearchParams(paramsData);

    try {
      toast.dismiss();
      setFetchingData(true);
      const result = await fetch(`${import.meta.env.VITE_URL}?${queryParams}`);
      const data = await result.json();
      toast.dismiss();
      if ((data.message = "done")) {
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
    getAllUsersData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-row flex-wrap items-center justify-evenly ">
        <h1 className="text-xl font-semibold w-full text-center my-2">
          All Users Stats
        </h1>
        {!allUsersData && fecthingData ? (
          <Loading />
        ) : (
          <div className="flex flex-row flex-wrap items-center justify-evenly ">
            {allUsersData?.map((user, index) => {
              return (
                <FacultyOverAllStatsCard
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
