import { auth, db, storage } from "@/firebase/clientApp";
import { doc, deleteDoc } from "firebase/firestore";

const handler = async (req, res) => {
  try {
    // Extract data from the request body
    const { id } = req.body;
    // console.log("req.body", req.body);
    //delete the doc with the given id from the announcements collection
    await deleteDoc(doc(db, "announcements", id));

    // Send the response
    res.status(200).json({
      message: "Announcement deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Internal server error" }); // Send an error response in case of error
  }
};

export default handler;
