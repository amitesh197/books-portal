import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Toaster, toast } from "react-hot-toast";
import { storage } from "../firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function Home() {
  const { userInfo, queryType, setQueryType } = useGlobalContext();

  // can take following values
  // name
  // number
  // newnumber
  // oldnumber
  // email
  // newemail
  // oldemail
  // coursename
  // content
  // query
  // file   ->   file
  const [formData, setFormData] = useState({});

  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      status: "",
      takenby: userInfo.email,
      sheetname: queryType,
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
      const snapshot = await uploadBytes(storageRef, formData.file);
      const fileurl = getDownloadURL(storageRef);
      toast.dismiss();
      toast.success("File Uploaded");
      return fileurl;
    } catch (err) {
      console.log(err);
      toast.dismiss();
      toast.error("problem while uploading file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      queryType == "coursenotvisible" ||
      queryType == "UPIpayment" ||
      queryType == "misc"
    ) {
      // upload the file to cloud storage and then take the url and upload to excell

      var fileurl;

      if (formData.file) {
        fileurl = await uploadFiletoCloud();
      }

      try {
        toast.loading("adding query");
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
          toast.success("entry made!!!");
          clearInput();
        }
      } catch (err) {
        toast.dismiss();
        console.log(err);
        toast.error("something went wrong");
      }
    } else {
      try {
        toast.loading("adding query");
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
          toast.success("entry made!!!");
          clearInput();
        }
      } catch (err) {
        toast.dismiss();
        console.log(err);
        toast.error("something went wrong. see console.");
      }
    }
    setFormData({});
  };

  useEffect(() => {
    // clear the formData
    setFormData({});
    // clear all the input feilds
    clearInput();
  }, [queryType]);

  return (
    <div className="flex flex-col justify-center items-center text-base font-semibold">
      <Toaster />
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

      <form
        className="flex flex-col p-5 rounded text-white  justify-center w-full md:w-1/2 lg:w-1/2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label className="my-1">Name</label>
          <input
            placeholder="Name"
            name="name"
            className="text-black rounded-md p-2 outline-theme-yellow-dark border-none"
            onChange={handleInput}
          />
        </div>

        {queryType == "emailchange" ? (
          <>
            <div className="flex flex-col my-3 ">
              <label className="my-1">New Email</label>
              <input
                type="email"
                placeholder="new email"
                name="newemail"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border-none"
                onChange={handleInput}
              />
            </div>
            <div className="flex flex-col my-3">
              <label className="my-1">Old Email</label>
              <input
                type="email"
                placeholder="old email"
                name="oldemail"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border-none"
                onChange={handleInput}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col my-3">
            <label className="my-1">Email</label>
            <input
              type="email"
              placeholder="email"
              name="email"
              className="text-black rounded-md p-2 outline-theme-yellow-dark border-none"
              onChange={handleInput}
            />
          </div>
        )}

        {queryType == "numberchange" ? (
          <>
            <div className="flex flex-col my-3">
              <label className="my-1">Old Number</label>
              <input
                type="number"
                placeholder="old number"
                name="oldnumber"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border-none"
                onChange={handleInput}
              />
            </div>
            <div className="flex flex-col my-3">
              <label className="my-1">New Number</label>
              <input
                type="number"
                placeholder="new number"
                name="newnumber"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border-none"
                onChange={handleInput}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col my-3">
            <label className="my-1">Number</label>
            <input
              type="number"
              placeholder="number"
              name="number"
              className="text-black rounded-md p-2 outline-theme-yellow-dark border-none"
              onChange={handleInput}
            />
          </div>
        )}

        {queryType == "contentmissing" ? (
          <>
            <div className="flex flex-col my-3">
              <label className="my-1">Course Name</label>
              <input
                placeholder="course name"
                name="coursename"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border-none"
                onChange={handleInput}
              />
            </div>
            <div className="flex flex-col my-3">
              <label className="my-1">Content</label>
              <input
                placeholder="content"
                name="content"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border-none"
                onChange={handleInput}
              />
            </div>
          </>
        ) : null}

        {queryType == "coursenotvisible" ? (
          <>
            <div className="flex flex-col my-3">
              <label className="my-1">Course Name</label>
              <input
                placeholder="course name"
                name="coursename"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border-none"
                onChange={handleInput}
              />
            </div>
            <div className="flex flex-col my-3">
              <label className="my-1">Content</label>
              <input
                placeholder="content"
                name="content"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border-none"
                onChange={handleInput}
              />
            </div>
          </>
        ) : null}

        {queryType == "UPIpayment" ? (
          <>
            <div className="flex flex-col my-3">
              <label className="my-1">Course Name</label>
              <input
                placeholder="course name"
                name="coursename"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border-none"
                onChange={handleInput}
              />
            </div>
          </>
        ) : null}

        {queryType == "grpnotalloted" ? (
          <div className="flex flex-col my-3">
            <label className="my-1">Course Name</label>
            <input
              placeholder="course name"
              name="coursename"
              className="text-black rounded-md p-2 outline-theme-yellow-dark border-none"
              onChange={handleInput}
            />
          </div>
        ) : null}

        <div className="flex flex-col my-3">
          <label className="my-1">Query</label>
          <textarea
            type="text"
            placeholder="details about the query"
            name="query"
            className="text-black rounded-md p-2 outline-theme-yellow-dark border-none"
            onChange={handleInput}
          />
        </div>

        {queryType == "UPIpayment" || queryType == "misc" ? (
          <>
            <div className="flex flex-col my-3">
              <label className="my-1">Current Course</label>
              <input
                placeholder="current course"
                name="currentcourse"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border-none"
                onChange={handleInput}
              />
            </div>
            <div className="flex flex-col my-3">
              <label className="my-1">Upgrade to which course</label>
              <input
                placeholder="upgrade to which course"
                name="upgradetowhichcourse"
                className="text-black rounded-md p-2 outline-theme-yellow-dark border-none"
                onChange={handleInput}
              />
            </div>
          </>
        ) : null}

        {queryType == "coursenotvisible" ||
        queryType == "UPIpayment" ||
        queryType == "misc" ? (
          <div className="flex flex-col my-3">
            <label className=" my-3">File</label>
            <input
              type="file"
              name="file"
              className="rounded-md p-2 outline-theme-yellow-dark border-none"
              onChange={handleFileChange}
            />
          </div>
        ) : null}

        <span className="my-3 text-xs text-slate-300 w-full text-center">
          {userInfo.isAdmin && (
            <span className="mt-3 text-xs text-slate-300">Admin :</span>
          )}{" "}
          {userInfo.email}
        </span>
        <button
          type="submit"
          className="bg-purple-700 hover:bg-purple-500 active:bg-purple-300 px-5 py-2 rounded-lg"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
}

export default Home;
