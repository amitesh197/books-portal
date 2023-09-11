import { auth, db, storage } from "@/firebase/clientApp";
import { collection, addDoc } from "firebase/firestore";

const addAnnouncement = async (req, res) => {
  try {
    // Extract data from the request body
    const { author, date, title, content, uploadedFilePropObjs } = req.body;

    // console.log("req.body", req.body);
    // Create a new document in the "announcements" collection
    const docRef = await addDoc(collection(db, "announcements"), {
      author,
      date,
      title,
      content,
      uploadedFilePropObjs,
    });

    // Send the response
    res.status(200).json({
      successMessage: "Announcement added successfully",
      id: docRef.id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Internal server error" }); // Send an error response in case of error
  }
};

export default addAnnouncement;
