import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Toaster, toast } from "react-hot-toast";
import ReactModal from "react-modal";
import trashIcon from "../assets/trash-icon.png";
import Loading from "../components/Loading";
import Navbar from "../components/navbar";

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

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Shadow background color
  },
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "fit-content",

    padding: "20px",
    border: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    width: "30rem",
  },
};

function All() {
  const { userInfo, queryType, setQueryType } = useGlobalContext();
  const [tableData, setTableData] = useState();
  const [loading, setLoading] = useState(true);
  // values can be rowNumber or null
  const [commentModal, setCommentModal] = useState(null);
  const [commentText, setCommentText] = useState(null);

  const getData = async () => {
    // console.log("running");
    setLoading(true);
    const paramsData = {
      userEmail: userInfo.isAdmin ? "admin" : userInfo.email,
      action: "getsheetdata",
      status: "all",
      sheetname: queryType,
    };
    // console.log("params data is", paramsData);
    const queryParams = new URLSearchParams(paramsData);

    try {
      const result = await fetch(`${import.meta.env.VITE_URL}?${queryParams}`);
      const data = await result.json();
      //remvove the id from the data
      console.log("data isdfsdf", data.data);
      /* data.data = [
        {
          "date": "Invalid Date",
          "name": "Arijit Singh",
          "newemail": "new@sadf.asdf",
          "oldemail": "old@asa.asd",
          "number": "",
          "query": "",
          "comment": "",
          "querytakenby": "shantanuesakpal1420@gmail.com",
          "status": "",
          "rowNumber": 13
        }
      ...
      ]
      */
      let sortedData = sortData(data.data);
      //remove the id from the data and fix the date format
      sortedData = sortedData.map((each) => {
        delete each.id;
        each.date = new Date(each.date).toLocaleDateString();
        return each;
      });
      toast.dismiss();
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

  const handleToggleStatus = async (rowNumber, state) => {
    console.log("running", rowNumber, state);
    // if state 0. make cell not done
    // if state 1. make cell done
    if (!state) {
      toast.loading("removing done");
      setLoading(true);
    } else {
      toast.loading("putting done");
      setLoading(true);
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          sheetname: queryType,
          action: "toggleStatus",
          state: state,
          rowNumber: rowNumber + 1,
        }),
      });
      const result = await response.json();
      if (result.successMessage == "done removed") {
        toast.dismiss();
        toast.success("done removed");
      } else if (result.successMessage == "status set to done") {
        toast.dismiss();
        toast.success("status set to done");
      }
      if (userInfo.email) {
        getData();
      }
    } catch (err) {
      console.log(err);
      toast.dismiss();
      toast.error("something went wrong. see console.");
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (e) => {
    setLoading(true);
    // comment modal holds the rowNumber of the cell
    if (commentModal) {
      toast.loading("updating comment");
      try {
        const response = await fetch(`${import.meta.env.VITE_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify({
            sheetname: queryType,
            action: "addComment",
            rowNumber: commentModal + 1,
            commentText: commentText,
          }),
        });
        const result = await response.json();
        if (result.successMessage == "Comment updated") {
          toast.dismiss();
          setCommentModal(null);
          setCommentText(null);
          toast.success("Comment updated");
          getData();
          if (userInfo.email) {
            getData();
          }
        } else {
          toast.dismiss();
        }
      } catch (err) {
        console.log(err);
        toast.dismiss();
        toast.error("something went wrong. see console.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.dismiss();
      toast.error("please retry");
      setCommentModal(null);
    }
  };

  const deleteRow = async (rowNumber) => {
    if (rowNumber) {
      toast.loading("deleting query");
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify({
            sheetname: queryType,
            action: "deleteRow",
            rowNumber: rowNumber,
          }),
        });
        const result = await response.json();
        if (result.successMessage == "Row Deleted") {
          toast.dismiss();
          toast.success("Query Deleted");
          getData();
        }
      } catch (err) {
        console.log(err);
        toast.dismiss();
        toast.error("something went wrong. see console.");
        setLoading(false);
      }
    } else {
      toast.dismiss();
      toast.error("please refresh and retry");
    }
  };

  useEffect(() => {
    //set the query type to the query in local storage
    const query = localStorage.getItem("queryType");
    //if query is not null then set the query type to the query in local storage
    if (query) {
      setQueryType(query);
    } else {
      setQueryType("numberchange");
      localStorage.setItem("queryType", "numberchange");
    }

    setTableData(null);
    if (userInfo?.email) {
      getData();
    }
  }, [userInfo?.email, queryType]);

  const closeModal = () => {
    setCommentModal(null);
    setCommentText(null);
  };

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
            onChange={(e) => {
              setQueryType(e.target.value);
              localStorage.setItem("queryType", e.target.value);
            }}
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
        <ReactModal
          isOpen={commentModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <textarea
            className="text-black p-2 border border-theme-dark-gray rounded-md w-full outline-none focus:border-theme-yellow-dark"
            type="text"
            placeholder="Add comment..."
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addComment();
              }
            }}
            rows={3}
            autoFocus
          />
          <button
            className="bg-theme-yellow-dark hover:bg-theme-dark text-theme-dark hover:text-theme-yellow-dark border border-theme-dark px-2 py-1 cursor-pointer rounded-md w-20 "
            onClick={() => {
              addComment();
            }}
          >
            {loading ? (
              <i className="fa-solid fa-spinner animate-spin "></i>
            ) : (
              "Add"
            )}
          </button>
        </ReactModal>
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

              <tbody className="border border-theme-dark-gray bg-theme-light-gray p-2">
                {tableData?.map((each, ind) => {
                  // tableData is an array of objects
                  // temp variable stores an array of <td></td>
                  var temp = [];
                  // variable representing if the string has a link
                  var isdone = false;
                  // iterating through the object
                  Object.keys(each).map((key, index) => {
                    // condition to not make a td for rowNumber
                    if (key !== "rowNumber") {
                      // set the isdone variable to true
                      if (key == "status" && checkDone(each[key]))
                        isdone = true;
                      // if the text is of the form of a link. then display a link
                      if (isLink(each[key])) {
                        temp.push(
                          <td
                            key={index}
                            className="border border-theme-dark-gray bg-theme-light-gray p-2"
                          >
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
                      // for admin to be able to edit comment
                      else if (key == "comment" && userInfo.isAdmin) {
                        temp.push(
                          <td
                            key={index}
                            className="border border-theme-dark-gray hover:bg-theme-yellow-light p-2 cursor-pointer"
                            onClick={() => setCommentModal(each["rowNumber"])}
                          >
                            {each[key]}
                          </td>
                        );
                      }
                      // if user is admin then enable him to toggle the status of the row in the excel sheet
                      else if (key == "status" && userInfo.isAdmin) {
                        temp.push(
                          <td
                            key={index}
                            className={` cursor-pointer border border-theme-dark-gray bg-theme-light-gray p-2`}
                            // onClick={() => handleToggleStatus(each["rowNumber"])}
                          >
                            {/* {each[key]} */}
                            <select
                              className="p-1 rounded-md border border-theme-dark-gray bg-theme-light-gray cursor-pointer focus:border-theme-yellow-dark outline-none"
                              value={isdone ? "done" : "not done"}
                              onChange={(e) => {
                                const value = e.target.value;
                                const isDone = value === "done";
                                handleToggleStatus(
                                  each["rowNumber"],
                                  isDone ? 1 : 0
                                );
                              }}
                            >
                              <option value="done">Done</option>
                              <option value="not done">Not done</option>
                            </select>
                          </td>
                        );
                      }
                      // after all conditions. this is what is rendered for all the normal cells
                      else {
                        temp.push(
                          <td
                            key={index}
                            className="border border-theme-dark-gray bg-theme-light-gray p-2"
                          >
                            {each[key]}
                          </td>
                        );
                      }
                    }
                  });
                  {
                    // for the delete cell
                    temp.push(
                      <td
                        onClick={() => deleteRow(each.rowNumber)}
                        className="text-red-500 cursor-pointer hover:text-red-700 p-2 border border-theme-dark-gray bg-theme-light-gray "
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </td>
                    );
                  }
                  // return the whole row by passing the array of td as its child
                  return (
                    <tr className="border border-theme-dark-gray p-1 relative">
                      {temp}
                      <td
                        className={`h-full w-2 absolute -left-1 top-0 z-10 ${
                          isdone ? "bg-green-600" : "bg-red-500"
                        }`}
                      ></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default All;
