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
      toast.loading("Uploading File")
      const snapshot = await uploadBytes(storageRef, formData.file);
      const fileurl = getDownloadURL(storageRef);
      toast.dismiss()
      toast.success("File Uploaded");
      return fileurl;
    } catch (err) {
      console.log(err);
      toast.dismiss()
      toast.error("problem while uploading file");
    }
  };

  const handleSubmit = async () => {
    console.log(formData);
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
        toast.loading("adding query")
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
          toast.dismiss()
          toast.success("entry made!!!");
          clearInput();
        }
      } catch (err) {
        toast.dismiss()
        console.log(err);
        toast.error("something went wrong");
      }
    } else {
      try {
        toast.loading("adding query")
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
          toast.dismiss()
          toast.success("entry made!!!");
          clearInput();
        }
      } catch (err) {
        toast.dismiss()
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
      <div className="flex flex-col  items-start">
        <span className="my-3">Name</span>
        <input
          placeholder="Name"
          name="name"
          className="text-black rounded-sm py-1 px-2"
          onChange={handleInput}
        />
      </div>

      {queryType == "emailchange" ? (
        <>
          <div className="flex flex-col  items-start">
            <span className="my-3">New Email</span>
            <input
              placeholder="new email"
              name="newemail"
              className="text-black rounded-sm py-1 px-2"
              onChange={handleInput}
            />
          </div>
          <div className="flex flex-col  items-start">
            <span className="my-3">Old Email</span>
            <input
              placeholder="old email"
              name="oldemail"
              className="text-black rounded-sm py-1 px-2"
              onChange={handleInput}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col  items-start">
          <span className="my-3">Email</span>
          <input
            placeholder="email"
            name="email"
            className="text-black rounded-sm py-1 px-2"
            onChange={handleInput}
          />
        </div>
      )}

      {queryType == "numberchange" ? (
        <>
          <div className="flex flex-col  items-start">
            <span className="my-3">Old Number</span>
            <input
              placeholder="old number"
              name="oldnumber"
              className="text-black rounded-sm py-1 px-2"
              onChange={handleInput}
            />
          </div>
          <div className="flex flex-col  items-start">
            <span className="my-3">New Number</span>
            <input
              placeholder="new number"
              name="newnumber"
              className="text-black rounded-sm py-1 px-2"
              onChange={handleInput}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col  items-start">
          <span className="my-3">Number</span>
          <input
            placeholder="number"
            name="number"
            className="text-black rounded-sm py-1 px-2"
            onChange={handleInput}
          />
        </div>
      )}

      {queryType == "contentmissing" ? (
        <>
          <div className="flex flex-col  items-start">
            <span className="my-3">Course Name</span>
            <input
              placeholder="course name"
              name="coursename"
              className="text-black rounded-sm py-1 px-2"
              onChange={handleInput}
            />
          </div>
          <div className="flex flex-col  items-start">
            <span className="my-3">Content</span>
            <input
              placeholder="content"
              name="content"
              className="text-black rounded-sm py-1 px-2"
              onChange={handleInput}
            />
          </div>
        </>
      ) : null}

      {queryType == "coursenotvisible" ? (
        <>
          <div className="flex flex-col  items-start">
            <span className="my-3">Course Name</span>
            <input
              placeholder="course name"
              name="coursename"
              className="text-black rounded-sm py-1 px-2"
              onChange={handleInput}
            />
          </div>
          <div className="flex flex-col  items-start">
            <span className="my-3">Content</span>
            <input
              placeholder="content"
              name="content"
              className="text-black rounded-sm py-1 px-2"
              onChange={handleInput}
            />
          </div>
        </>
      ) : null}

      {queryType == "UPIpayment" ? (
        <>
          <div className="flex flex-col  items-start">
            <span className="my-3">Course Name</span>
            <input
              placeholder="course name"
              name="coursename"
              className="text-black rounded-sm py-1 px-2"
              onChange={handleInput}
            />
          </div>
        </>
      ) : null}

      {queryType == "grpnotalloted" ? (
        <div className="flex flex-col  items-start">
          <span className="my-3">Course Name</span>
          <input
            placeholder="course name"
            name="coursename"
            className="text-black rounded-sm py-1 px-2"
            onChange={handleInput}
          />
        </div>
      ) : null}

      <div className="flex flex-col  items-start">
        <span className="my-3">Query</span>
        <input
          placeholder="details about the query"
          name="query"
          className="text-black rounded-sm py-1 px-2"
          onChange={handleInput}
        />
      </div>

      {queryType == "UPIpayment" || queryType == "misc" ? (
        <>
          <div className="flex flex-col  items-start">
            <span className="my-3">Current Course</span>
            <input
              placeholder="current course"
              name="currentcourse"
              className="text-black rounded-sm py-1 px-2"
              onChange={handleInput}
            />
          </div>
          <div className="flex flex-col  items-start">
            <span className="my-3">Upgrade to which course</span>
            <input
              placeholder="upgrade to which course"
              name="upgradetowhichcourse"
              className="text-black rounded-sm py-1 px-2"
              onChange={handleInput}
            />
          </div>
        </>
      ) : null}

      {queryType == "coursenotvisible" ||
      queryType == "UPIpayment" ||
      queryType == "misc" ? (
        <div className="flex flex-col  items-start">
          <span className=" my-3">File</span>
          <input
            type="file"
            name="file"
            className="rounded-sm py-1 px-2"
            onChange={handleFileChange}
          />
        </div>
      ) : null}

      <span className="my-3 text-xs text-slate-300">
        as{" "}
        {userInfo.isAdmin && (
          <span className="mt-3 text-xs text-slate-300">Admin :</span>
        )}{" "}
        {userInfo.email}
      </span>
      <button
        className="bg-purple-700 hover:bg-purple-500 active:bg-purple-300 px-5 py-2 rounded-lg"
        onClick={handleSubmit}
      >
        SUBMIT
      </button>
    </div>
  );
}

export default Home;
