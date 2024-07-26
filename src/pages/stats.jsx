import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Toaster, toast } from "react-hot-toast";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

function Stats() {
  const { userInfo, queryType, setQueryType } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const navigate = useNavigate();

  const calculateStats = (data) => {
    // Initialize an object to store stats
    const stats = {};

    // Iterate through the data array
    data.forEach((query) => {
      // Get the query type from each query object
      const queryType = query.query_type;

      // If the query type is not already in the stats object, initialize it
      if (!stats[queryType]) {
        stats[queryType] = {
          total: 0,
          done: 0,
        };
      }

      // Increment the total count for the query type
      stats[queryType].total++;

      // Check if the query is marked as "Done" and increment the "done" count
      if (query.status === "Done") {
        stats[queryType].done++;
      }
    });

    // Set the calculated stats to the component state
    setStatsData(stats);
  };

  const camelCaseToSentenceCase = (camelCaseString) => {
    // Split camelCaseString into words using regex
    const words = camelCaseString.split(/(?=[A-Z])/);

    // Capitalize the first word and join the rest with a space
    const sentenceCaseString = words
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");

    return sentenceCaseString;
  };

  const getData = async ({ withToast }) => {
    setLoading(true);
    // toast.loading("Fetching...");
    console.log("Fetching data...");
    try {
      // Display a loading message or spinner if needed

      const response = await fetch(
          "https://446kx5s4a4.execute-api.ap-south-1.amazonaws.com/dev/queries/",
          {
            method: "POST",
            body: JSON.stringify({type: "getData", queryType: "all"}),
          }
      );

      // Check if the response is successful (status code 200-299)
      if (!response.ok) {
        throw new Error(`${response.type} error! Status: ${response.status}`);
      }

      // Parse the response as JSON
      let data = await response.json();
      // console.log("All data:", data);
      /*  data = [{
        "date": "2023-12-21T07:59:23.369Z",
        "taken_by": "shantanuesakpal1420@gmail.com",
        "new_name": "new name",
        "number": "12314",
        "status": "Done",
        "comment": "ha bhai ho gaya query solve",
        "id": 1703145563369,
        "email": "shantanuesakpal1420@gmail.com",
        "name": "shantanu sakpal",
        "query_type": "nameChange",
        "query_desc": ""
      },...]
*/
      calculateStats(data);
    } catch (err) {
      // Display an error message or handle the error as needed
      toast.error(err.message);
      console.error("Error:", err);
    } finally {
      // Set loading state to false
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.isAdmin === false) {
      toast.error("You are not authorized to view this page");
      navigate("/");
    }
    if (userInfo.email) {
      getData({ withToast: false });
    }
  }, [userInfo]);

  return (
    <>
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

        {loading ? (
          <Loading />
        ) : (
          <div className="flex justify-center w-full flex-wrap">
            {statsData &&
              Object.entries(statsData).map(([key, value]) => {
                return (
                  <div
                    key={key}
                    className="bg-theme-light-gray flex flex-col p-5 rounded-lg  m-5 text-center text-theme-dark border border-theme-yellow-dark hover:shadow-xl transition duration-300 ease-in-out cursor-pointer"
                    onClick={() => {
                      localStorage.setItem("queryType", key);
                      //push to /all
                      navigate("/all");
                    }}
                  >
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
      </div>
    </>
  );
}

export default Stats;
