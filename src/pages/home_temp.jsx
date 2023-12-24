import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Toaster, toast } from "react-hot-toast";
import { storage } from "../firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Navbar from "../components/navbar";

function Home() {
  const { userInfo, queryType, setQueryType } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  /* types of queries
  nameChange: {
    id: 0,
    date: 1,
    name: 2,
    email: 3,
    number: 4,
    newName: 5,
    query: 6,
    comment: 7,
    querytakenby: 8,
    status: 9
  },

  batchShift: {
    id: 0,
    date: 1,
    name: 2,
    email: 3,
    number: 4,
    currentBatch: 5,
    newBatch: 6,
    reason: 7,
    file: 8,
    query: 9,
    comment: 10,
    querytakenby: 11,
    status: 12
  },

  emi: {
    id: 0,
    date: 1,
    name: 2,
    email: 3,
    number: 4,
    coursename: 5,
    firstInstallment: 6,
    secondInstallment: 7,
    file: 8,
    query: 9,
    comment: 10,
    querytakenby: 11,
    status: 12
  },

  refund: {
    id: 0,
    date: 1,
    name: 2,
    email: 3,
    number: 4,
    coursename: 5,
    reason: 6,
    query: 7,
    comment: 8,
    querytakenby: 9,
    status: 10
  },

  removeCourseAccess: {
    id: 0,
    date: 1,
    name: 2,
    email: 3,
    number: 4,
    coursename: 5,
    reason: 6,
    query: 7,
    comment: 8,
    querytakenby: 9,
    status: 10
  },

  feedback: {
    id: 0,
    date: 1,
    name: 2,
    email: 3,
    number: 4,
    coursename: 5,
    feedback: 6,
    file: 7,
    query: 8,
    comment: 9,
    querytakenby: 10,
    status: 11
  },

  numberchange: {
    id: 0,
    date: 1,
    name: 2,
    email: 3,
    oldnumber: 4,
    newnumber: 5,
    query: 6,
    comment: 7,
    querytakenby: 8,
    status: 9
  },
  emailchange: {
    id: 0,
    date: 1,
    name: 2,
    newemail: 3,
    oldemail: 4,
    number: 5,
    query: 6,
    comment: 7,
    querytakenby: 8,
    status: 9
  },
  contentmissing: {
    id: 0,
    date: 1,
    name: 2,
    email: 3,
    number: 4,
    coursename: 5,
    content: 6,
    query: 7,
    comment: 8,
    querytakenby: 9,
    status: 10
  },
  coursenotvisible: {
    id: 0,
    date: 1,
    name: 2,
    email: 3,
    number: 4,
    coursename: 5,
    content: 6,
    file: 7,
    query: 8,
    comment: 9,
    querytakenby: 10,
    status: 11
  },
  UPIpayment: {
    id: 0,
    date: 1,
    name: 2,
    email: 3,
    number: 4,
    coursename: 5,
    file: 6,
    query: 7,
    currentcourse: 8,
    upgradetowhichcourse: 9,
    comment: 10,
    querytakenby: 11,
    status: 12
  },
  grpnotalloted: {
    id: 0,
    date: 1,
    name: 2,
    email: 3,
    number: 4,
    coursename: 5,
    query: 6,
    comment: 7,
    querytakenby: 8,
    status: 9
  },
  misc: {
    id: 0,
    date: 1,
    name: 2,
    email: 3,
    number: 4,
    file: 5,
    query: 6,
    currentcourse: 7,
    upgradetowhichcourse: 8,
    comment: 9,
    querytakenby: 10,
    status: 11
  }
  */

  //todays data in 13 digit format and use it as id, cause it will be unique
  const dataId = Date.now();
  // Get current date, month, and year in format day/month/year
  const now = new Date(dataId);
  const todaysdate = now;

  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      id: dataId,
      date: todaysdate,
      status: "",
      querytakenby: userInfo.email,
      sheetname: queryType,
      action: "addQuery",
    }));
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

  const handleFileChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      file: event.target.files[0],
    }));
  };

  const uploadFiletoCloud = async () => {
    const now = new Date();
    const monthYear = `${now.getMonth() + 1}-${now.getFullYear()}`;
    const dayTime = `${now.getDate()}/${now.toLocaleTimeString("en-IN", {
      hour12: false,
    })}`;
    var storageRef = ref(
      storage,
      // the path of the file
      `${monthYear}/${dayTime}-${formData.file.name} `
    );
    try {
      toast.loading("Uploading File");
      setLoading(true);
      const snapshot = await uploadBytes(storageRef, formData.file);
      const fileurl = getDownloadURL(storageRef);
      toast.dismiss();
      toast.success("File Uploaded");
      return fileurl;
    } catch (err) {
      console.log(err);
      toast.dismiss();
      toast.error("problem while uploading file");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form data is", formData);
    /*
    formData = 
    {
      "name": "hgjkgh",
      "status": "",
      "takenby": "test1@gmail.com",
      "sheetname": "numberchange",
      "email": "admin1@gmail.com",
      "oldnumber": "12",
      "newnumber": "12",
      "query": "asdf",
      "status": "",
      "takenby": userInfo.email,
      "sheetname": queryType,
    }
    
    this is received as 
    var jsonData = JSON.parse(e.postData.contents) in the google sheets script

    */
    if (
      queryType == "coursenotvisible" ||
      queryType == "UPIpayment" ||
      queryType == "misc" ||
      queryType == "batchShift" ||
      queryType == "emi" ||
      queryType == "feedback"
    ) {
      // upload the file to cloud storage and then take the url and upload to excell

      var fileurl;

      if (formData.file) {
        fileurl = await uploadFiletoCloud();
      }

      try {
        toast.loading("Adding query...");
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify({ ...formData, file: fileurl }),
        });
        const result = await response.json();
        console.log(result);
        if (result.successMessage == "done") {
          toast.dismiss();
          toast.success("Entry made");
          clearInput();
        }
      } catch (err) {
        toast.dismiss();
        console.log(err);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        toast.loading("Adding query...");
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        console.log(result);
        if (result.successMessage == "done") {
          toast.dismiss();
          toast.success("Entry made");
          clearInput();
        }
      } catch (err) {
        toast.dismiss();
        console.log(err);
        toast.error("something went wrong. see console.");
      } finally {
        setLoading(false);
      }
    }
    // setFormData({});
  };

  useEffect(() => {
    // clear the formData
    setFormData({});
    // clear all the input feilds
    clearInput();
  }, [queryType]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center text-black text-base  w-full">
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
        <h1 className="w-full block p-2 font-semibold text-xl">
          Welcome {userInfo.isAdmin && <span className="inline">Admin </span>}{" "}
          {userInfo.email}
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
              />
            </div>
          )}

          {queryType == "nameChange" ? (
            <>
              <div className="flex flex-col">
                <label className=" mx-1 font-semibold">Old Name</label>
                <input
                  placeholder="Old Name"
                  name="oldName"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className=" mx-1 font-semibold">New Name</label>
                <input
                  placeholder="New Name"
                  name="newName"
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
                  name="oldemail"
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
                  name="newemail"
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
                  name="oldnumber"
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
                  name="newnumber"
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
              />
            </div>
          )}
          {queryType === "batchShift" ? (
            <>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">Current Batch</label>
                <input
                  placeholder="Current batch"
                  name="currentBatch"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">New Batch</label>
                <input
                  placeholder="New batch"
                  name="newBatch"
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
                name="coursename"
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
                  name="coursename"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">First Installment</label>
                <input
                  placeholder="First Installment"
                  name="firstInstallment"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">
                  Second Installment
                </label>
                <input
                  placeholder="Second Installment"
                  name="secondInstallment"
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
                  name="coursename"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">Content</label>
                <input
                  placeholder="Content"
                  required
                  name="content"
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
                  name="coursename"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">Content</label>
                <input
                  placeholder="Content"
                  required
                  name="content"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
            </>
          ) : null}

          {queryType == "UPIpayment" ? (
            <>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">Course Name</label>
                <input
                  placeholder="Course name"
                  required
                  name="coursename"
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
                name="coursename"
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

          <div className="flex flex-col ">
            <label className=" mx-1 font-semibold">Query</label>
            <textarea
              type="text"
              placeholder="Details about the query"
              name="query"
              className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
              onChange={handleInput}
            />
          </div>

          {queryType == "UPIpayment" || queryType == "misc" ? (
            <>
              <div className="flex flex-col ">
                <label className=" mx-1 font-semibold">Current Course</label>
                <input
                  placeholder="Current course"
                  name="currentcourse"
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
                  name="upgradetowhichcourse"
                  className="text-black rounded-md p-2 outline-theme-yellow-dark border border-theme-dark"
                  onChange={handleInput}
                />
              </div>
            </>
          ) : null}

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
