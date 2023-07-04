import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Toaster, toast } from "react-hot-toast";

function checkDone(str) {
  var regex = /done/i; // Case-insensitive regex pattern for "done"
  return regex.test(str); // returns boolean
}

const isLink = (str) => {
  if (str) {
    if (typeof str !== "string") {
      return false;
    }
    return str.slice(0, 4) === "http";
  }
};

const sortData = (data) => {
  var notdoneArr = [];
  var doneArr = [];
  data.forEach((element) => {
    if (!checkDone(element.status)) {
      notdoneArr.push(element);
    } else {
      doneArr.push(element);
    }
  });
  return [...notdoneArr, ...doneArr];
};

function All() {
  const [tableData, setTableData] = useState();

  const { userInfo, queryType, setQueryType } = useGlobalContext();

  const getData = async () => {
    const paramsData = {
      userEmail: userInfo.isAdmin ? "admin" : userInfo.email,
      status: "all",
      sheetname: queryType,
    };

    const queryParams = new URLSearchParams(paramsData);

    try {
      const result = await fetch(`${import.meta.env.VITE_URL}?${queryParams}`);
      const data = await result.json();
      const sortedData = sortData(data.data);
      setTableData(sortedData);
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
      <h1 className="text-3xl font-bold pt-10 text-center">ALL</h1>
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
            // variable representing if the string has a link
            var isdone = false;
            // iterating through the object
            Object.keys(each).map((key, index) => {
              console.log(key);
              // condition to not make a td for rowNumber
              if (key !== "rowNumber") {
                // set the isdone variable to true
                if (key == "status" && checkDone(each[key])) isdone = true;
                // if the text is of the form of a link. then display a link
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
                    <>
                      <td
                        className={`${
                          isdone ? "hover:bg-red-600" : "hover:bg-green-600"
                        } cursor-pointer`}
                        onClick={() => modifyRow(each["rowNumber"])}
                      >
                        {each[key]}
                      </td>
                    </>
                  );
                } 
                // after all conditions. this is what is rendered for all the normal cells
                else {
                  temp.push(<td>{each[key]}</td>);
                }
              }
            });
            // return the whole row by passing the array of td as its child
            return <tr className={isdone && "bg-green-900"}>{temp}</tr>;
          })}
        </tbody>
      </table>
      {tableData?.length == 0 ? (
        <p className="text-xl font-semibold mt-5">empty</p>
      ) : null}
    </div>
  );
}

export default All;
