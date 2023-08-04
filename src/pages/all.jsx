import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Toaster, toast } from "react-hot-toast";
import ReactModal from "react-modal";
import trashIcon from "../assets/trash-icon.png";

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
    width: "fit-content",
    padding: "0px",
    border: "none",
  },
};

function All() {
  const [tableData, setTableData] = useState();

  // values can be rowNumber or null
  const [commentModal, setCommentModal] = useState(null);
  const [commentText, setCommentText] = useState(null);

  const { userInfo, queryType, setQueryType } = useGlobalContext();

  const getData = async () => {
    const paramsData = {
      userEmail: userInfo.isAdmin ? "admin" : userInfo.email,
      action: "getsheetdata",
      status: "all",
      sheetname: queryType,
    };

    const queryParams = new URLSearchParams(paramsData);

    try {
      toast.loading("Fetching Data");
      const result = await fetch(`${import.meta.env.VITE_URL}?${queryParams}`);
      const data = await result.json();
      const sortedData = sortData(data.data);
      toast.dismiss();
      setTableData(sortedData);
      toast.success("Fetched");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to Fetch Data");
      console.log(err);
    }
  };

  const handleToggleStatus = async (rowNumber, state) => {
    console.log("running", rowNumber, state);
    // if state 0. make cell not done
    // if state 1. make cell done
    if (!state) {
      toast.loading("removing done");
    } else {
      toast.loading("putting done");
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
      console.log(result);
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
    }
  };

  const addComment = async (e) => {
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
      }
    } else {
      toast.dismiss();
      toast.error("please refresh and retry");
    }
  };

  useEffect(() => {
    setTableData();
    if (userInfo.email) {
      getData();
    }
  }, [userInfo, queryType]);

  const closeModal = () => {
    setCommentModal(null);
    setCommentText(null);
  };

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
      <ReactModal
        isOpen={commentModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <input
          className="text-black px-5 py-1"
          type="text"
          placeholder="add comment"
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addComment();
            }
          }}
        />
        <button
          className="bg-purple-500 hover:bg-purple-700 active:bg-purple-900 px-2 py-1 "
          onClick={addComment}
        >
          Add
        </button>
      </ReactModal>
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
              // temp variable stores an array of <td></td>
              var temp = [];
              // variable representing if the string has a link
              var isdone = false;
              // iterating through the object
              Object.keys(each).map((key, index) => {
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
                  // for admin to be able to edit comment
                  else if (key == "comment" && userInfo.isAdmin) {
                    temp.push(
                      <td
                        className="cursor-pointer hover:bg-yellow-700 "
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
                        className={` cursor-pointer`}
                        // onClick={() => handleToggleStatus(each["rowNumber"])}
                      >
                        {/* {each[key]} */}
                        <select
                          className={`bg-gray-800 ${isdone && "bg-green-900"} `}
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
                          <option value="not done">not done</option>
                        </select>
                      </td>
                    );
                  }
                  // after all conditions. this is what is rendered for all the normal cells
                  else {
                    temp.push(<td>{each[key]}</td>);
                  }
                }
              });
              {
                // for the delete cell
                temp.push(
                  <td
                    onClick={() => deleteRow(each.rowNumber)}
                    className="h-7 w-7 cursor-pointer bg-gray-800 hover:bg-gray-300 active:bg-red-600"
                  >
                    <img className=" h-7 w-7" src={trashIcon} />
                  </td>
                );
              }
              // return the whole row by passing the array of td as its child
              return <tr className={isdone && "bg-green-900"}>{temp}</tr>;
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

export default All;
