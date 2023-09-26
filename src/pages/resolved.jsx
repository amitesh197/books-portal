import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Toaster, toast } from "react-hot-toast";
import Loading from "../components/Loading";
import Navbar from "../components/navbar";

const isLink = (str) => {
  if (str) {
    if (typeof str !== "string") {
      return false;
    }
    return str.slice(0, 4) === "http";
  }
};

function Resolved() {
  const [tableData, setTableData] = useState();
  const [loading, setLoading] = useState(false);
  const { userInfo, queryType, setQueryType } = useGlobalContext();

  const getData = async () => {
    setLoading(true);
    const paramsData = {
      userEmail: userInfo.isAdmin ? "admin" : userInfo.email,
      action: "getsheetdata",
      status: "done",
      sheetname: queryType,
    };

    const queryParams = new URLSearchParams(paramsData);

    try {
      const result = await fetch(`${import.meta.env.VITE_URL}?${queryParams}`);
      const data = await result.json();
      toast.dismiss();
      /* data.data = [
        {
          "date": "2023-04-08T18:30:00.000Z",
          "name": "New User",
          "email": "shantanuesakpal1420@gmail.com",
          "oldnumber": 3,
          "newnumber": 2,
          "query": "",
          "comment": "",
          "querytakenby": "shantanuesakpal1420@gmail.com",
          "status": "",
          "rowNumber": 24
        },
      ...
      ]
      */
      //sort data in descending order of id
      let sortedData = data.data.sort((a, b) => b.id - a.id);
      //remove the id from the data and fix the date format
      sortedData = sortedData.map((each) => {
        delete each.id;
        each.date = new Date(each.date).toLocaleDateString();
        return each;
      });
      setTableData(sortedData);
      toast.success("Fetched");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to Fetch Data");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTableData(null);
    if (userInfo.email) {
      getData();
    }
  }, [userInfo, queryType]);

  return (
    <>
      <Navbar />
      <div className=" flex flex-col p-2">
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

        <div className="flex flex-row gap-3 items-center justify-center  w-fit">
          <label
            htmlFor="query-type "
            className="w-fit text-left pl-1 text-lg font-semibold "
          >
            Select Query type:
          </label>

          <select
            className="float-left  border-2 border-theme-yellow-dark inline px-3 py-2 rounded-md  text-black outline-none w-fit  cursor-pointer"
            value={queryType}
            onChange={(e) => setQueryType(e.target.value)}
          >
            <option value="numberchange">Number change</option>
            <option value="emailchange">Email change</option>
            <option value="contentmissing">Content Missing</option>
            <option value="coursenotvisible">Course Not Visible</option>
            <option value="UPIpayment">UPI Payment</option>
            <option value="grpnotalloted">Group not alloted</option>
            <option value="misc">Misc</option>
          </select>
        </div>
        {loading && !tableData ? (
          <Loading />
        ) : tableData?.length == 0 ? (
          <p className="text-xl  mt-5 text-center w-full">
            No Data of the selected type found.
          </p>
        ) : (
          <div className=" mx-2 my-5 flex flex-col items-center ">
            <table>
              <thead className="bg-theme-yellow-dark border border-theme-dark-gray text-theme-dark px-2 py-1">
                {queryType == "numberchange" && (
                  <tr>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      DATE
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      NAME
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      EMAIL
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      OLD NUMBER
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      NEW NUMBER
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      QUERY
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      COMMENT
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      TAKEN BY
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      STATUS
                    </th>
                  </tr>
                )}
                {queryType == "emailchange" && (
                  <tr>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      DATE
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      NAME
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      NEW EMAIL
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      OLD EMAIL
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      NUMBER
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      QUERY
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      COMMENT
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      TAKEN BY
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      STATUS
                    </th>
                  </tr>
                )}
                {queryType == "contentmissing" && (
                  <tr>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      DATE
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      NAME
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      EMAIL
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      NUMBER
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      COURSE NAME
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      CONTENT
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      QUERY
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      COMMENT
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      TAKEN BY
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      STATUS
                    </th>
                  </tr>
                )}
                {queryType == "coursenotvisible" && (
                  <tr>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      DATE
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      NAME
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      EMAIL
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      NUMBER
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      COURSE NAME
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      CONTENT
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      LINK
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      QUERY
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      COMMENT
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      TAKEN BY
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      STATUS
                    </th>
                  </tr>
                )}
                {queryType == "UPIpayment" && (
                  <tr>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      DATE
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      NAME
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      EMAIL
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      NUMBER
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      COURSE NAME
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      LINK
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      QUERY
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      CURRENT COURSE
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      UPGRADE TO WHICH COURSE
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      COMMENT
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      TAKEN BY
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      STATUS
                    </th>
                  </tr>
                )}
                {queryType == "grpnotalloted" && (
                  <tr>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      DATE
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      NAME
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      EMAIL
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      NUMBER
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      COURSE NAME
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      QUERY
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      COMMENT
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      TAKEN BY
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      STATUS
                    </th>
                  </tr>
                )}
                {queryType == "misc" && (
                  <tr>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      DATE
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      NAME
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      EMAIL
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      NUMBER
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      LINK
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      QUERY
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      CURRENT COURSE
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      UPGRADE TO WHICH COURSE
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      COMMENT
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      TAKEN BY
                    </th>
                    <th className="px-3 py-2 text-sm border border-theme-dark-gray">
                      STATUS
                    </th>
                  </tr>
                )}
              </thead>

              <tbody>
                {tableData?.map((each) => {
                  // tableData is an array of objects
                  var temp = [];
                  Object.keys(each).map((key, index) => {
                    // condition to not make a td for rowNumber
                    if (key !== "rowNumber") {
                      // check if the text of the cell is a link or not
                      if (isLink(each[key])) {
                        temp.push(
                          <td className="border border-theme-dark-gray bg-theme-light-gray p-2">
                            <a
                              className="text-blue-400 underline"
                              target="_blank"
                              href={each[key]}
                            >
                              Link
                            </a>
                          </td>
                        );
                      }
                      // regular <td> cell
                      else {
                        temp.push(
                          <td className="border border-theme-dark-gray bg-theme-light-gray p-2">
                            {each[key]}
                          </td>
                        );
                      }
                    }
                  });
                  // return the whole row by passing the array of td as its child
                  return <tr className="bg-green-900">{temp}</tr>;
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Resolved;
