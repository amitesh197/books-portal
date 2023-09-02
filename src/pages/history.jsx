import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import Navbar from "../components/navbar";
import { Toaster, toast } from "react-hot-toast";
import Loading from "../components/Loading";
import DataTable from "../components/DataTable";

export default function History() {
  const { userInfo } = useGlobalContext();

  //here the user object has two properties { user , isAdmin}
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  //here the user object has two properties { user , isAdmin}
  const [groupedUserData, setGroupedUserData] = useState(null);
  const [fecthingData, setFetchingData] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterTypeValue, setFilterTypeValue] = useState("all");
  const [editingRowData, setEditingRowData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ungroupedUserData, setUngroupedUserData] = useState([]); //for showing in table, we weill onnly show the first element of each array in groupedUserData
  // Add this state variable
  const [filteredUserData, setFilteredUserData] = useState([]);

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
        let responseData = data;
        /* 
        the responseData is {
          message : String,
          data: [{
            "Id":1692943564405,
              "Date": 13,
              "Month": 8,
              "Year": 2023,
              "Type": "live",
              "ClassName": "asdf",
              "Hours": 5,
              "Minutes": 20
              "Edited":0,
              },
            ...
            
            ]}//the acutal sheet data
        */
        console.log("Success in history fetch:", responseData);
        //sort data by id in descending order,if Id is same, sort by Edited in descending order
        responseData.data.sort((a, b) => {
          if (a.Id === b.Id) {
            return b.Edited - a.Edited;
          } else {
            return b.Id - a.Id;
          }
        });
        //make groups of data by Id
        const groupedData = responseData.data.reduce((acc, curr) => {
          if (acc[curr.Id]) {
            acc[curr.Id].push(curr);
          } else {
            acc[curr.Id] = [curr];
          }
          return acc;
        }, {});

        const ungroupedUserData = Object.values(groupedData).map(
          (array) => array[0]
        );
        console.log("Grouped data:", groupedData);
        console.log("Ungrouped data:", ungroupedUserData);

        setGroupedUserData(groupedData);
        setUngroupedUserData(ungroupedUserData);
        setFilteredUserData(ungroupedUserData);

        /*Grouped data= 
        {
        "1692943564405": [
            {
                "Id": 1692943564405,
                "Date": 25,
                "Month": "Aug",
                "Year": 2023,
                "Type": "recording",
                "ClassName": "new",
                "Hours": 0,
                "Minutes": 36,
                "Comment": "live",
                "Edited": 3
            },
            ...
        ],
        "1692943564300": [
            {
                "Id": 1692943564300,
                "Date": 24,
                "Month": "Aug",
                "Year": 2023,
                "Type": "mentoring",
                "ClassName": "new",
                "Hours": 0,
                "Minutes": 36,
                "Comment": "",
                "Edited": 3
            },...
        ],
        ...
    }  */
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

  const handleEditRowData = async (rowData) => {
    setEditingRowData(true);
    /* rowData is an object =
      {
        dataId,
        currentDay,
        currentMonth,
        currentYear,
        type,
        count,
        connectedCalls,
        comment,
        edited
      }
      */
    // console.log("Edit row data:", rowData);
    //destructuring the rowData object
    let {
      Id: dataId,
      Date: day,
      Month: month,
      Year: year,
      Type: salesType,
      Count: count,
      Comment: comment,
      Edited: edited,
    } = rowData;

    // Prepare the data object
    const dataObject = {
      action: "addProfileData",
      userName: userInfo?.email,
      sheetname: userInfo?.email,
      subAction: "edit",
      dataId,
      day,
      month,
      year,
      salesType,
      count,
      comment,
      edited,
    };
    console.log("data object is", dataObject);

    // API call to the addData route in the api folder, in the addData.js file
    try {
      toast.dismiss();
      toast.loading("Updating...");

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
        toast.success("Entry updated");
        getDataByUserEmail();
      }
    } catch (err) {
      toast.dismiss();
      console.log(err);
      toast.error("something went wrong. see console.");
    } finally {
      setEditingRowData(false);
      setIsModalOpen(false);
    }
  };

  const filterData = () => {
    const filteredData = ungroupedUserData.filter((userData) => {
      if (filterType === "all") {
        return true; // Include all data
      } else if (filterType === "day") {
        return userData.Date === parseInt(filterTypeValue, 10);
      } else if (filterType === "month") {
        return userData.Month === filterTypeValue;
      } else if (filterType === "year") {
        return userData.Year === parseInt(filterTypeValue, 10);
      } else if (filterType === "type") {
        return userData.Type === filterTypeValue;
      }
    });
    setFilteredUserData(filteredData);
  };

  useEffect(() => {
    if (userInfo?.email) {
      getDataByUserEmail();
    }
  }, [userInfo]);

  return (
    <>
      <Navbar />
      <form className="m-2">
        <div className="flex items-center space-x-4">
          <label className="text-gray-600">Filter Type:</label>
          <select
            className="px-2 py-1 border rounded-md"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="day">Day</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
            <option value="type">Type</option>
          </select>

          {filterType === "day" && (
            <select
              className="px-2 py-1 border rounded-md"
              onChange={(e) => setFilterTypeValue(e.target.value)}
            >
              {Array.from({ length: 31 }, (_, index) => index + 1).map(
                (day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                )
              )}
            </select>
          )}

          {filterType === "month" && (
            <select
              className="px-2 py-1 border rounded-md"
              onChange={(e) => setFilterTypeValue(e.target.value)}
            >
              {monthNames.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          )}

          {filterType === "year" && (
            <input
              type="number"
              className="px-2 py-1 border rounded-md"
              placeholder="2023"
              onChange={(e) => setFilterTypeValue(e.target.value)}
            />
          )}

          {filterType === "type" && (
            <select
              className="px-2 py-1 border rounded-md"
              onChange={(e) => setFilterTypeValue(e.target.value)}
            >
              <option value="call">Call</option>
              <option value="chat">Chat</option>
            </select>
          )}

          <button
            type="button"
            className="px-4 py-2 text-white bg-blue-500 rounded-md"
            onClick={() => filterData()}
          >
            Submit
          </button>
        </div>
      </form>
      <div className="w-full h-screen">
        {!userInfo?.email ? (
          <Loading />
        ) : (
          <div>
            {/* Render the @tanstack/react-table */}
            {!fecthingData && groupedUserData && ungroupedUserData ? (
              filteredUserData.length > 0 ? (
                <DataTable
                  groupedUserData={groupedUserData}
                  ungroupedUserData={filteredUserData} // Use filteredUserData here
                  handleEditRowData={handleEditRowData}
                  editingRowData={editingRowData}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full py-10">
                  <h1 className="text-2xl font-bold text-gray-600">
                    No Data Found
                  </h1>
                </div>
              )
            ) : (
              <Loading />
            )}
          </div>
        )}
      </div>
    </>
  );
}
