import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useGlobalContext } from "../context/globalContext";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import FirstPerformerCard from "../components/FirstPerformerCard";
import SecondPerformerCard from "../components/SecondPerformerCard";
import ThirdPerformerCard from "../components/ThirdPerformerCard";

export default function TopPerformers() {
  const { userInfo } = useGlobalContext();
  const navigate = useNavigate();

  //here the user object has two properties { user , isAdmin}
  const [fecthingData, setFetchingData] = useState(false);
  const [topThree, setTopThree] = useState(null);

  //useMemo
  const getTopPerformers = async () => {
    setFetchingData(true);
    const paramsData = {
      userEmail: userInfo?.email,
      action: "getTopPerformers",
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
        setTopThree(data.data);
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
    getTopPerformers();
  }, []);

  /* here the topPerformers is like an array of objects with first element as first performer and so on
  topThree [ { 
      userName: 'example@gmail.com',
      totalCount: 247,
      totalCallCount: 250,
      totalConnectedCount: 105,
      totalChatCount: 142 },
      ...
    ]
           
  */

  return (
    <>

      <div className="w-full">
        <h1 className="text-center w-full my-2 font-semibold text-xl">
          Top Performers of This Month !
        </h1>
        {fecthingData ? (
          <Loading />
        ) : (
          <div>
            {topThree && (
              <div className="flex flex-row row gap-2 p-2 my-2 justify-center ">
                {<SecondPerformerCard topThree={topThree} />}
                {<FirstPerformerCard topThree={topThree} />}
                {<ThirdPerformerCard topThree={topThree} />}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
