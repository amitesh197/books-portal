import React, { useState } from "react";
import CreateAnnounceForm from "./CreateAnnounceForm";
import { useGlobalContext } from "../context/globalContext";
import { auth, db, storage } from "../firebase.config";
import { doc, deleteDoc } from "firebase/firestore";
import parse from "html-react-parser"; // Import the parse function from html-react-parser

export default function FullAnnouncementContainer({
  currAnnouncement,
  setCurrAnnouncement,
  handleGetAnnouncements,
}) {
  const { userInfo, setUserInfo } = useGlobalContext();

  //destructuring currAnnouncement
  /*
      currAnnouncement is  object
      
       {
        "id" : "String",
        "author": "String",
        "date": {
            "seconds": 1692519608,
            "nanoseconds": 172000000
        },
        "content": String
        }
      */
  const { title, content, date, author, uploadedFilePropObjs } =
    currAnnouncement;
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    localStorage.setItem("currAnnouncement", JSON.stringify(currAnnouncement));
    setCurrAnnouncement("new");
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "announcements", id));
      console.log("Announcement deleted successfully!");
      handleGetAnnouncements();
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setDeleting(false);
    }
  };

  return currAnnouncement === "new" ? (
    <CreateAnnounceForm handleGetAnnouncements={handleGetAnnouncements} />
  ) : (
    <>
      <div className="full-announcement">
        <div className="text-3xl font-bold my-2 leading-tight">{title}</div>
        {parse(content)}
        <div className="">
          {uploadedFilePropObjs && uploadedFilePropObjs?.length > 0 && (
            <>
              <p className="block font-bold text-lg mt-3">Files:</p>
              {uploadedFilePropObjs?.map((filePropObj, index) => (
                <div className="" key={index}>
                  <a
                    className=" text-blue-500 hover:text-blue-800 w-fit"
                    href={filePropObj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {filePropObj.name}
                    <i className="fa-solid fa-arrow-up-right-from-square mx-2 text-sm"></i>
                  </a>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="flex flex-row justify-between items-center text-sm mt-5">
          <div className="">{date}</div>
          <div className="">By {author}</div>
        </div>
      </div>

      {userInfo?.isAdmin === true ? (
        <div className="mt-5">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded w-20"
            onClick={handleEdit}
          >
            Edit
          </button>

          <div
            className=" float-right text-center  px-2 py-1 w-20 rounded bg-red-600 hover:bg-red-700 cursor-pointer text-white font-semibold "
            onClick={() => handleDelete(currAnnouncement.id)}
          >
            {deleting ? (
              <i className="fa-solid fa-spinner animate-spin"></i>
            ) : (
              "Delete"
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
