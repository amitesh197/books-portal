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

function Unresolved() {
  const [tableData, setTableData] = useState();

  const { userInfo, queryType, setQueryType } = useGlobalContext();

  const getData = async () => {
    const paramsData = {
      userEmail: userInfo.isAdmin ? "admin" : userInfo.email,
      status: "notdone",
      sheetname: queryType,
    };

    const queryParams = new URLSearchParams(paramsData);

    try {
      const result = await fetch(`${import.meta.env.VITE_URL}?${queryParams}`);
      const data = await result.json();
      setTableData(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const modifyRow = async (rowNumber) => {
    // row numbers in excel start from 1
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          sheetname: queryType,
          toggleStatus: true,
          rowNumber: rowNumber + 1,
        }),
      });
      const result = await response.json();
      if (result.successMessage == "done removed") {
        toast.success("done removed");
        if (userInfo.email) {
          getData();
        }
      } else if (result.successMessage == "status set to done") {
        toast.success("status set to done");
        if (userInfo.email) {
          getData();
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("something went wrong. see console.");
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
      <h1 className="text-3xl font-bold pt-10 text-center">UNRESOLVED</h1>
      <select
        className="mt-5 bg-gray-700 mb-10 px-5 py-2 rounded-md"
        value={queryType}
        onChange={(e) => setQueryType(e.target.value)}
      >
        <option value="numberchange">number change</option>
        <option value="emailchange">email change</option>
        <option value="contentmissing">content missing</option>
        <option value="coursenotvisible">course not visible</option>
        <option value="UPIpayment">UPI Payment</option>
        <option value="grpnotalloted">grp not alloted</option>
        <option value="misc">misc</option>
      </select>
      <table className=" mx-auto">
        <thead>
          {queryType == "numberchange" && (
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>OLD NUMBER</th>
              <th>NEW NUMBER</th>
              <th>QUERY</th>
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
              <th>TAKENBY</th>
              <th>STATUS</th>
            </tr>
          )}
        </thead>
        <tbody>
          {tableData?.map((each) => {
            // tableData is an array of objects
            // temp variable stores an array of <td></td>
            var temp = [];
            // iteration over the objects
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
                // if user is admin then enable him to toggle the status of the row in the excel sheet
                else if (key == "status" && userInfo.isAdmin) {
                  temp.push(
                    <td
                      className="hover:bg-green-600 cursor-pointer"
                      onClick={() => modifyRow(each["rowNumber"])}
                    >
                      {" "}
                      adasd{each[key]}
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
            return <tr className="">{temp}</tr>;
          })}
        </tbody>
      </table>
      {tableData?.length == 0 ? (
        <p className="text-xl font-semibold mt-5">empty</p>
      ) : null}
    </div>
  );
}

export default Unresolved;
