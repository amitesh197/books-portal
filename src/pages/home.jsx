import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "../components/navbar";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase.config";

function Home() {
  const { userInfo, queryType, setQueryType } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [fileObj, setFileObj] = useState(null);

  /* 
  column names in the db:--
    id bigint not null,
    date timestamp with time zone null,
    email text null,
    number bigint null,
    query_desc text null,
    comment text null,
    taken_by text null,
    status text null,
    queryType text null,
    name text null,
    new_name text null,
    current_batch text null,
    new_batch text null,
    current_course text null,
    reason text null,
    feedback text null,
    new_number text null,
    new_email text null,
    content_desc text null,
    file text null,
    new_course text null, 
    first_installment bigint null,
    second_installment bigint null,
   */

  //todays date in 13 digit format and use it as id, cause it will be unique
  const dataId = Date.now();
  // Get current date, month, and year in format day/month/year
  const now = new Date(dataId);
  const todaysdate = now;
  //convert dateId to string
  const dataIdString = dataId.toString();
  // console.log("dataIdString", dataIdString);

  const handleFileChange = (event) => {
    setFileObj(event.target.files[0]);
    // console.log(event.target.files[0]);
  };

  const uploadFiletoCloud = async () => {
    const now = new Date();
    const monthYear = `${now.getMonth() + 1}-${now.getFullYear()}`;
    const dayTime = `${now.getDate()}/${now.toLocaleTimeString("en-IN", {
      hour12: false,
    })}`;
    const storageRef = ref(
      storage,
      // the path of the file
      `${monthYear}/${dayTime}-${fileObj.name} `
    );

    try {
      toast.loading("Uploading File");
      setLoading(true);

      // Use await to wait for the Promise to be fulfilled
      const snapshot = await uploadBytes(storageRef, fileObj);
      const fileurl = await getDownloadURL(storageRef);

      toast.dismiss();
      toast.success("File Uploaded");

      return fileurl;
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Problem while uploading file");
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      id: dataIdString,
      date: todaysdate,
      status: "Pending",
      taken_by: userInfo.email,
      query_type: queryType,
      comment: " ",
      query_desc: "",
    }));
    // this is the data that will be sent to the db.
  };

  const clearInput = () => {
    // clear all the input feilds
    const inputFields = document.querySelectorAll("input");
    inputFields.forEach((input) => {
      input.value = "";
    });
    const textFields = document.querySelectorAll("textarea");
    textFields.forEach((input) => {
      input.value = "";
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    let formDataWithFile = formData;
    if (
      (queryType == "coursenotvisible" ||
        queryType == "UPIpayment" ||
        queryType == "misc" ||
        queryType == "batchShift" ||
        queryType == "emi" ||
        queryType == "feedback") &&
      fileObj
    ) {
      const fileurl = await uploadFiletoCloud();
      //add file url to the form data
      formDataWithFile = {
        ...formData,
        file: fileurl,
      };
    }

    try {
      // console.log("form data with link", formDataWithFile);
      // Send a delete query to dynamodb

      const response = await fetch(
        "https://g87ruzy4zl.execute-api.ap-south-1.amazonaws.com/dev/queries/",
        {
          method: "POST",
          body: JSON.stringify(formDataWithFile),
          // or 'POST' or other HTTP methods
        }
      );
      if (!response.ok) {
        let err = response.json();
        throw new Error(`${err} \n Status: ${response.status}`);
      }
      clearInput();
      toast.dismiss();
      toast.success("Query added !");
    } catch (error) {
      //clear toast
      toast.dismiss();
      toast.error(error.message);
      console.error("error:", error);
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
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
      <div className="flex flex-col items-center justify-center text-black text-base  w-full">
        <h1 className="w-full block p-2 font-semibold text-xl">
          Welcome {userInfo.isAdmin && <span className="inline">Admin </span>}{" "}
          {userInfo.username}
        </h1>
        <form
          className="flex flex-col gap-5 rounded  justify-center w-full md:w-2/3 lg:w-1/2 m-2 mb-5"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label className=" mx-1 font-semibold">Type</label>
            <select
              className="w-full  px-3 py-2 rounded-lg  text-lg outline-none  border border-theme-dark hover:border-theme-yellow-dark cursor-pointer"
              value={queryType}
              onChange={(e) => setQueryType(e.target.value)}
            >
              <option value="nameChange">Name Change</option>
              <option value="batchShift">Batch Shift</option>
              <option value="emi">EMI</option>
              <option value="refund">Refund</option>
              <option value="removeCourseAccess">Remove Course Access</option>
              <option value="feedback">Feedback</option>

              <option value="numberchange">Number change</option>
              <option value="emailchange">Email change</option>
              <option value="contentmissing">Content Missing</option>
              <option value="coursenotvisible">Course Not Visible</option>
              <option value="UPIpayment">UPI Payment</option>
              <option value="grpnotalloted">Group not alloted</option>
              <option value="misc">Misc</option>
            </select>
          </div>

          {queryType != "nameChange" && (
            <div className="flex flex-col">
              <label className=" mx-1 font-semibold">Name</label>
              <input
                placeholder="Name"
                name="name"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                onChange={handleInput}
                required
              />
            </div>
          )}

          {queryType == "nameChange" ? (
            <>
              <div className="flex flex-col">
                <label className=" mx-1 font-semibold">Old Name</label>
                <input
                  placeholder="Old Name"
                  name="name"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className=" mx-1 font-semibold">New Name</label>
                <input
                  placeholder="New Name"
                  name="new_name"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                  required
                />
              </div>
            </>
          ) : null}

          {queryType == "emailchange" ? (
            <>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">Old Email</label>
                <input
                  type="email"
                  placeholder="Old email"
                  required
                  name="email"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
              <div className="flex flex-col  ">
                <label className=" mx-1 font-semibold">New Email</label>
                <input
                  type="email"
                  placeholder="New email"
                  required
                  name="new_email"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col ">
              <label className=" mx-1 font-semibold">Email</label>
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                onChange={handleInput}
              />
            </div>
          )}

          {queryType == "numberchange" ? (
            <>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">Old Number</label>
                <input
                  type="number"
                  placeholder="Old number"
                  required
                  name="number"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                  min={0}
                />
              </div>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">New Number</label>
                <input
                  type="number"
                  placeholder="New number"
                  required
                  name="new_number"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                  min={0}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col ">
              <label className=" mx-1 font-semibold">Number</label>
              <input
                type="number"
                placeholder="Number"
                name="number"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                onChange={handleInput}
                min={0}
                required
              />
            </div>
          )}
          {queryType === "batchShift" ? (
            <>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">Current Batch</label>
                <input
                  placeholder="Current batch"
                  name="current_batch"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">New Batch</label>
                <input
                  placeholder="New batch"
                  name="new_batch"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
            </>
          ) : null}

          {queryType === "refund" ||
          queryType === "removeCourseAccess" ||
          queryType === "feedback" ? (
            <div className="flex flex-col ">
              <label className=" mx-1 font-semibold">Course Name</label>
              <input
                placeholder="Course name"
                name="current_course"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                onChange={handleInput}
              />
            </div>
          ) : null}

          {queryType === "batchShift" ||
          queryType === "refund" ||
          queryType === "removeCourseAccess" ? (
            <div className="flex flex-col ">
              <label className=" mx-1 font-semibold">Reason</label>
              <input
                placeholder="Reason"
                name="reason"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                onChange={handleInput}
              />
            </div>
          ) : null}

          {queryType === "emi" ? (
            <>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">Course Name</label>
                <input
                  placeholder="Current course"
                  name="current_course"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">First Installment</label>
                <input
                  type="number"
                  placeholder="First Installment"
                  name="first_installment"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">
                  Second Installment
                </label>
                <input
                  type="number"
                  placeholder="Second Installment"
                  name="second_installment"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
            </>
          ) : null}

          {queryType == "contentmissing" ? (
            <>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">Course Name</label>
                <input
                  placeholder="Course name"
                  required
                  name="current_course"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">Content</label>
                <input
                  placeholder="Content"
                  required
                  name="content_desc"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
            </>
          ) : null}

          {queryType == "coursenotvisible" ? (
            <>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">Course Name</label>
                <input
                  placeholder="Course name"
                  required
                  name="current_course"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">Content</label>
                <input
                  placeholder="Content"
                  required
                  name="content_desc"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
            </>
          ) : null}

          {queryType == "grpnotalloted" ? (
            <div className="flex flex-col ">
              <label className=" mx-1 font-semibold">Course Name</label>
              <input
                placeholder="Course name"
                required
                name="current_course"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                onChange={handleInput}
              />
            </div>
          ) : null}

          {queryType == "feedback" ? (
            <div className="flex flex-col ">
              <label className=" mx-1 font-semibold">Feedback</label>
              <input
                placeholder="Feedback"
                required
                name="feedback"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                onChange={handleInput}
              />
            </div>
          ) : null}
          {queryType == "UPIpayment" || queryType == "misc" ? (
            <>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">Current Course</label>
                <input
                  placeholder="Current course"
                  name="current_course"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">
                  Upgrade to which course
                </label>
                <input
                  placeholder="Upgrade to which course"
                  name="new_course"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
            </>
          ) : null}

          <div className="flex flex-col ">
            <label className=" mx-1 font-semibold">Query</label>
            <textarea
              type="text"
              placeholder="Details about the query"
              name="query_desc"
              className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
              onChange={handleInput}
            />
          </div>

          {queryType == "coursenotvisible" ||
          queryType == "UPIpayment" ||
          queryType == "misc" ||
          queryType == "batchShift" ||
          queryType == "emi" ||
          queryType == "feedback" ? (
            <div className="flex flex-col ">
              <label className="  mx-1 font-semibold">File</label>
              <input
                type="file"
                name="file"
                className="rounded-md p-2 outline-theme-yellow-dark border-none"
                onChange={handleFileChange}
              />
            </div>
          ) : null}

          <button
            type="submit"
            className="bg-theme-yellow-dark hover:bg-theme-dark font-bold hover:text-theme-yellow-dark w-1/2 px-5 py-2 rounded-lg mx-auto mt-2"
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
    </>
  );
}

export default Home;
