import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import TodaysProgressCard from "../components/TodaysProgressCard";
import MonthProgressCard from "../components/MonthProgressCard";
import { Toaster, toast } from "react-hot-toast";

export default function Profile({ props }) {
  //hello
  const { userInfo } = useGlobalContext();

  //here the user object has two properties { user , isAdmin}
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  /* userData is like 
  [
    {
        "Id": 1693313053204,
        "Date": 29,
        "Month": "Aug",
        "Year": 2023,
        "Type": "call",
        "Count": 1
    },
    {
        "Id": 1693313015986,
        "Date": 29,
        "Month": "Aug",
        "Year": 2023,
        "Type": "call",
        "Count": 1
    },
    ...
  ]
    */
  const [fecthingData, setFetchingData] = useState(false);
  const [typeSelected, setTypeSelected] = useState("call");
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

  const getDataByUserEmail = async () => {
    setFetchingData(true);
    const paramsData = {
      userEmail: userInfo?.email,
      action: "getProfileData",
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

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    //todays data in 13 digit format and use it as id, cause it will be unique
    const dataId = Date.now();
    console.log("todays date is", dataId);

    // Gather form data
    const salesType = e.target["work-type"].value;
    const count = {
      total: e.target["count"].value,
      connected: e.target["connected-calls"]
        ? e.target["connected-calls"].value
        : "",
    };

    // Prepare the data object
    const dataObject = {
      action: "addProfileData",
      userName: userInfo?.email,
      sheetname: userInfo?.email,
      day: currentDay, // Day of the month
      month: currentMonth,
      year: currentYear,
      dataId,
      salesType,
      count,
      subAction: "add",
      comment: "",
      edited: 0,
    };
    console.log("data object is", dataObject);

    // API call to the addData route in the api folder, in the addData.js file
    try {
      toast.dismiss();
      toast.loading("Adding data...");
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(dataObject),
      });
      const result = await response.json();
      console.log(result);
      if (result.successMessage == "done") {
        toast.dismiss();
        //clear the form

        e.target["count"].value = "";
        e.target["connected-calls"].value = "";
      }
    } catch (err) {
      toast.dismiss();
      console.log(err);
      toast.error("something went wrong. see console.");
    } finally {
      setLoading(false);
    }

    getDataByUserEmail();
  };

  // use effect to only call the api when the user is logged in and the data is not fetched
  useEffect(() => {
    if (userInfo?.email) {
      getDataByUserEmail();
    }
  }, [userInfo]);

  return (
    <>
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
      <div className="w-full h-full box-border">
        <h1 className="text-xl font-bold m-2">
          Hello there {userInfo ? userInfo?.email : "Guest"}!
        </h1>
        <div className="flex flex-row  h-full p-3">
          {/* div for form and todays progress */}
          <div className="flex flex-col justify-between items-center  h-full  sm:w-1/2 md:px-10 md:gap-10 ">
            {/* div for form */}
            <div className="bg-theme-light-gray rounded-lg p-5 w-full lg:w-2/3 mx-auto">
              <h3 className="font-semibold w-full text-center mb-5">
                Add data
              </h3>

              {/* form for adding data */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-center items-center gap-3  h-full"
              >
                <select
                  className="w-full  px-3 py-2 rounded-lg  text-lg outline-none  border border-theme-dark hover:border-theme-yellow-dark "
                  id="work-type"
                  name="work-type"
                  required
                  onChange={(e) => setTypeSelected(e.target.value)}
                >
                  <option value="Select type" defaultChecked disabled>
                    Select Type
                  </option>
                  <option value="call">Call</option>
                  <option value="chat">Chat</option>
                </select>

                {
                  //if type selected is calls , then show the input for connected-calls
                  typeSelected == "call" ? (
                    <>
                      <input
                        type="number"
                        id="count"
                        min={0}
                        placeholder="Total calls made"
                        className="w-full p-2 outline-none  rounded-lg border border-theme-dark hover:border-theme-yellow-dark"
                        required
                      />
                      <input
                          min={0}
                        type="number"
                        id="connected-calls"
                        name="connected-calls"
                        placeholder="Number of connected calls"
                        className="w-full p-2 outline-none  rounded-lg border border-theme-dark hover:border-theme-yellow-dark"
                        required
                      />
                    </>
                  ) : (
                    <input
                        min={0}

                        type="number"
                      id="count"
                      placeholder="Count"
                      className="w-full p-2 outline-none  rounded-lg border border-theme-dark hover:border-theme-yellow-dark"
                      required
                    />
                  )
                }

                <button
                  className="hover:bg-theme-dark hover:text-theme-yellow-dark font-semibold p-2 rounded-lg w-full border border-theme-dark bg-theme-yellow-dark text-theme-dark"
                  disabled={loading}
                >
                  {loading ? (
                    <i className="fa-solid fa-spinner animate-spin"></i>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            </div>

            {/* div for todays progress */}
            <>
              {!fecthingData ? (
                userData?.length > 0 ? (
                  <TodaysProgressCard userData={userData} />
                ) : (
                  <div className="flex justify-center items-center h-40">
                    No Data found! Try adding some data first.
                  </div>
                )
              ) : (
                <div className="flex justify-center items-center h-40">
                  <i className="fa-solid fa-spinner animate-spin text-5xl text-theme-yellow-dark"></i>
                </div>
              )}
            </>
          </div>

          {/* div for monthly progress */}
          <div className="w-full md:w-1/2 box-border pl-5 md:px-5 pb-5">
            {!fecthingData ? (
              userData?.length > 0 ? (
                <MonthProgressCard userData={userData} />
              ) : (
                <div className="flex justify-center items-center h-40">
                  No Data found! Try adding some data first.
                </div>
              )
            ) : (
              <div className="flex justify-center items-center h-full">
                <i className="fa-solid fa-spinner animate-spin text-5xl text-theme-yellow-dark"></i>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
