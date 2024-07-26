import React, { useMemo } from "react";
import { useGlobalContext } from "../context/globalContext";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "../components/navbar";
import Loading from "../components/Loading";
import UserOverallStatsCard from "../components/UserOverallStatsCard";
import { useNavigate } from "react-router-dom";

export default function MonthlyUserHistory() {
  const { userInfo } = useGlobalContext();
  const navigate = useNavigate();

  //here the user object has two properties { user , isAdmin}
  const [fecthingData, setFetchingData] = useState(false);
  const [fetchingEmpEmails, setFetchingEmpEmails] = useState(false);

  const [empEmail, setEmpEmail] = useState(null);
  const [allEmpEmails, setAllEmpEmails] = useState(null);

  const [userMonthlyHistory, setUserMonthlyHistory] = useState(null);

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

  function webhook(){
    //listen to webhookgit
  }

  const getEmpEmails = async () => {
    setFetchingEmpEmails(true);
    const paramsData = {
      userEmail: userInfo?.email,
      action: "getEmpEmails",
      status: "all",
      sheetname: "",
    };
    // console.log("params data is", paramsData);

    const queryParams = new URLSearchParams(paramsData);

    try {
      toast.dismiss();
      const result = await fetch(`${import.meta.env.VITE_URL}?${queryParams}`);
      const data = await result.json();
      toast.dismiss();
      if ((data.message = "done")) {
        setAllEmpEmails(data.data);
        // console.log("emp emails", data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingEmpEmails(false);
    }
  };

  const getUserMonthlyHistory = async () => {
    setFetchingData(true);
    const paramsData = {
      userEmail: userInfo?.email,
      action: "getUserMonthlyHistory",
      status: "all",
      sheetname: empEmail,
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
        let responseData = data.data;
        /* 
       responseData = [ { targetMonth: 9,
                      targetYear: 2023,
                      totalCallCount: 5,
                      totalConnectedCount: 2,
                      totalChatCount: 2,
                      totalCount: 7 },
                    { targetMonth: 8,
                      targetYear: 2023,
                      totalCallCount: 30,
                      totalConnectedCount: 20,
                      totalChatCount: 35,
                      totalCount: 65 } ]
        */
        // console.log("Success in monthy data fetch:", responseData);
        setUserMonthlyHistory(responseData);
      } else {
        toast.error("Failed to Fetch Data");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to Fetch Data");
      console.log(err);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    if (userInfo?.isAdmin === false) {
      toast.error("You are not authorized to view this page");
      navigate("/");
    }
    getEmpEmails();
  }, [userInfo?.isAdmin]);

  return (
    <>
      <Navbar />
      <div className="px-4 ">
        <h1 className="text-xl font-semibold w-full  my-2">
          Select Employee Email to view Monthly History
        </h1>
        <div className=" mb-3">
          {fetchingEmpEmails ? (
            //loading faonawesome
            <i className="fas fa-spinner fa-spin text-4xl text-theme-yellow-dark  "></i>
          ) : (
            //select tag
            <div className="flex  items-center gap-2 w-full">
              <select
                className="w-max p-2 rounded-md border-2 border-gray-400"
                onChange={(e) => setEmpEmail(e.target.value)}
                defaultValue={"Select Employee Email"}
              >
                <option disabled>Select Employee Email</option>
                {allEmpEmails?.map((item, index) => {
                  return (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  );
                })}
              </select>
              <button
                className="bg-theme-yellow-dark text-white p-2 rounded-md w-24"
                onClick={getUserMonthlyHistory}
              >
                {
                  //loading faonawesome
                  fecthingData ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    "Get Data"
                  )
                }
              </button>
            </div>
          )}
        </div>

        <div className="py-3">
          {fecthingData ? (
            <Loading />
          ) : userMonthlyHistory ? (
            <>
              <div className="px-3 my-3 text-xl w-full text-center">
                Monthly history for {empEmail}
              </div>
              <div className="flex flex-wrap ">
                {userMonthlyHistory.map((item, index) => {
                  let userData = {
                    userName: empEmail,
                    totalCallCount: item.totalCallCount,
                    totalConnectedCount: item.totalConnectedCount,
                    totalChatCount: item.totalChatCount,
                    totalCount: item.totalCount,
                  };
                  let targetMonthName = monthNames[item.targetMonth];
                  return (
                    <div className="my-2">
                      <div className="-mb-2 w-full text-center">
                        {targetMonthName}, {item.targetYear}
                      </div>
                      <UserOverallStatsCard
                        key={index}
                        userData={userData}
                        type="monthly"
                      />
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div>No Data to show</div>
          )}
        </div>
      </div>
    </>
  );
}
