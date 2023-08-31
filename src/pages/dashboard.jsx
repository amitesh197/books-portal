import React from "react";
import { useGlobalContext } from "../context/globalContext";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "../components/navbar";

export default function Dashboard() {
  const { userInfo } = useGlobalContext();

  //here the user object has two properties { user , isAdmin}
  const [fecthingData, setFetchingData] = useState(false);
  const [userData, setUserData] = useState(null);
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
        setUserData(data.data);

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
          Feature coming soon !
        </h1>
        {/* {userData.map((user, index) => {
        return <FacultyOverAllStatsCard key={index} facultyData={user} />;
      })} */}
      </div>
    </>
  );
}
