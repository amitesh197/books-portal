import React, { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { useGlobalContext } from "../context/globalContext";
import { auth, db, storage } from "../firebase.config";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  uploadBytes,
} from "firebase/storage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles

export default function CreateAnnounceForm({ handleGetAnnouncements }) {
  const { userInfo, setUserInfo } = useGlobalContext();
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0); // [0, 100]
  const [editorHtml, setEditorHtml] = useState(""); // Add a state for the editor content
  const [title, setTitle] = useState("");

  const uploadFile = async (file) => {
    if (!file) return null;
    if (file.size > 100000000) {
      alert("File size too large. Please upload a file less than 100MB");
      return null;
    }

    const storageRef = ref(storage, `announcement_files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", (snapshot) => {
      // Get the upload progress as a percentage
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`File ${file.name} Upload Progress: ${progress}%`);
      setProgress(progress);
    });

    try {
      // Wait for the upload to complete
      const snapshot = await uploadTask;
      const fileUrl = await getDownloadURL(snapshot.ref);
      const fileProbObj = {
        name: file.name,
        url: fileUrl,
      };
      return fileProbObj;
    } catch (error) {
      console.error(`Error uploading ${file.name}: ${error}`);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      const currAnnouncement = JSON.parse(
        localStorage.getItem("currAnnouncement")
      );
      if (currAnnouncement === "new") {
        const current_timestamp = Timestamp.fromDate(new Date());

        const uploadedFilePropObjs = await Promise.all(files.map(uploadFile));

        const response = await addDoc(collection(db, "announcements"), {
          title: e.target.title.value,
          content: editorHtml, // Use the editor content
          author: userInfo?.isAdmin ? "Admin" : userInfo?.email,
          date: current_timestamp,
          uploadedFilePropObjs: uploadedFilePropObjs,
        });

        console.log("Announcement added successfully!");
        handleGetAnnouncements();
      } else {
        // Edit an existing announcement
        // You need to find the announcement in the database using currAnnouncement.id
        // Then, update the announcement with the new title and content
        const announcementRef = doc(db, "announcements", currAnnouncement.id);
        await updateDoc(announcementRef, {
          title: e.target.title.value,
          content: editorHtml,
        });

        console.log("Announcement edited successfully!");
        handleGetAnnouncements();
        setEditing(false); // Exit edit mode after editing
      }
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Render the WYSIWYG editor
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      ["link"],
    ],
  };

  // Handle editor content change
  const handleEditorChange = (content) => {
    setEditorHtml(content);
  };

  //parse the stringified currAnnouncement frm localStorage
  const currAnnouncement = JSON.parse(localStorage.getItem("currAnnouncement"));
  // console.log("currAnnouncement", currAnnouncement);

  useEffect(() => {
    if (currAnnouncement !== "new") {
      setEditorHtml(currAnnouncement.content);
      setTitle(currAnnouncement.title);
    }
  }, []);

  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold text-center mb-2">
        Create Announcement
      </h2>
      <form onSubmit={handleSubmit}>
        <label className="mb-1 font-bold" htmlFor="title">
          Title:
        </label>
        <input
          className="w-full bg-white rounded-lg outline-none focus:border-theme-yellow-dark focus:ring-2 focus:ring-theme-yellow-dark px-2 py-1 text-lg mb-5"
          type="text"
          id="title"
          name="title"
          required
          defaultValue={title}
        />

        <label className="mb-1 font-bold" htmlFor="body">
          Body:
        </label>
        <ReactQuill
          value={editorHtml}
          onChange={handleEditorChange}
          modules={modules}
          className="bg-white rounded-lg outline-none focus:border-theme-yellow-dark focus:ring-2 focus:ring-theme-yellow-dark px-2 py-1 text-lg mb-5"
          required
        />

        {/* upload file */}
        <label className="mb-1 font-bold block" htmlFor="file">
          Upload Files:
        </label>
        <input
          className="w-fit bg-white rounded-lg outline-none focus:border-theme-yellow-dark focus:ring-2 focus:ring-theme-yellow-dark px-2 py-1"
          type="file"
          id="file"
          name="file"
          multiple // Allow multiple file selection
          onChange={(e) => setFiles([...e.target.files])}
        />
        <button
          className="inline border-2  border-theme-dark rounded-lg px-2 py-1 font-semibold text-theme-dark mx-2 text-xs"
          onClick={() => {
            setFiles([]);
            document.getElementById("file").value = "";
          }}
          type="button"
        >
          Remove all files
        </button>
        {files.length > 0 && (
          <div>
            {files.map((file, index) => (
              <div key={index} className="my-2">
                <p className=" text-theme-dark mx-2 my-2 inline">
                  File {index + 1}: {file.name}
                </p>
                <p className="inline text-sm">
                  {progress && progress < 100
                    ? `Uploading... ${progress.toFixed(0)}%`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          className="bg-theme-yellow-dark rounded-lg px-2 py-1 w-20  font-semibold text-theme-dark block mt-5"
          type="submit"
          disabled={submitting}
        >
          {submitting ? (
            <i className="fa-solid fa-spinner animate-spin" />
          ) : currAnnouncement === "new" ? (
            "Submit"
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
}
