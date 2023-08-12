import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Toaster, toast } from "react-hot-toast";

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

  const { userInfo, queryType, setQueryType } = useGlobalContext();

  const getData = async () => {
    const paramsData = {
      userEmail: userInfo.isAdmin ? "admin" : userInfo.email,
      action: "getsheetdata",
      status: "done",
      sheetname: queryType,
    };

    const queryParams = new URLSearchParams(paramsData);

    try {
      toast.loading("Fetching Data");
      const result = await fetch(`${import.meta.env.VITE_URL}?${queryParams}`);
      const data = await result.json();
      toast.dismiss();
      setTableData(data.data);
      toast.success("Fetched");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to Fetch Data");
      console.log(err);
    }
  };

  useEffect(() => {
    setTableData();
    if (userInfo.email) {
      getData();
    }
  }, [userInfo, queryType]);

  return (
    <div className="text-white flex flex-col items-center">
      <Toaster />
      <h1 className="text-3xl font-bold pt-5 text-center">RESOLVED</h1>
      <select
        className="my-5 bg-theme-yellow-dark  px-5 py-2 rounded-md font-semibold text-black outline-none w-full lg:w-1/3 md:w-1/2"
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
      <div className=" w-full overflow-auto">
        <table className=" mx-auto">
          <thead>
            {queryType == "numberchange" && (
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>OLD NUMBER</th>
                <th>NEW NUMBER</th>
                <th>QUERY</th>
                <th>COMMENT</th>
                <th>TAKENBY</th>
                <th>STATUS</th>
              </tr>
            )}
            {queryType == "emailchange" && (
              <tr>
                <th>NAME</th>
                <th>OLD EMAIL</th>
                <th>NEW EMAIL</th>
                <th>NUMBER</th>
                <th>QUERY</th>
                <th>COMMENT</th>
                <th>TAKENBY</th>
                <th>STATUS</th>
              </tr>
            )}
            {queryType == "contentmissing" && (
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>NUMBER</th>
                <th>COURSE NAME</th>
                <th>CONTENT</th>
                <th>QUERY</th>
                <th>COMMENT</th>
                <th>TAKENBY</th>
                <th>STATUS</th>
              </tr>
            )}
            {queryType == "coursenotvisible" && (
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>NUMBER</th>
                <th>COURSE NAME</th>
                <th>CONTENT</th>
                <th>LINK</th>
                <th>QUERY</th>
                <th>COMMENT</th>
                <th>TAKENBY</th>
                <th>STATUS</th>
              </tr>
            )}
            {queryType == "UPIpayment" && (
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>NUMBER</th>
                <th>COURSE NAME</th>
                <th>LINK</th>
                <th>QUERY</th>
                <th>CURRENT COURSE</th>
                <th>UPGRADE TO WHICH COURSE</th>
                <th>COMMENT</th>
                <th>TAKENBY</th>
                <th>STATUS</th>
              </tr>
            )}
            {queryType == "grpnotalloted" && (
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>NUMBER</th>
                <th>COURSE NAME</th>
                <th>QUERY</th>
                <th>COMMENT</th>
                <th>TAKENBY</th>
                <th>STATUS</th>
              </tr>
            )}
            {queryType == "misc" && (
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>NUMBER</th>
                <th>LINK</th>
                <th>QUERY</th>
                <th>CURRENT COURSE</th>
                <th>UPGRADE TO WHICH COURSE</th>
                <th>COMMENT</th>
                <th>TAKENBY</th>
                <th>STATUS</th>
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
                      <td>
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
                    temp.push(<td>{each[key]}</td>);
                  }
                }
              });
              // return the whole row by passing the array of td as its child
              return <tr className="bg-green-900">{temp}</tr>;
            })}
          </tbody>
        </table>
      </div>
      {tableData?.length == 0 ? (
        <p className="text-xl font-semibold mt-5">empty</p>
      ) : null}
    </div>
  );
}

export default Resolved;
