import { auth, db, storage } from "../firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";

const getAnnouncements = async (req, res) => {
  try {
    const announcements = collection(db, "announcements");
    const q = query(announcements);
    const querySnapshot = await getDocs(q);
    var announcementsList = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //also add the id of the document to the object
      announcementsList.push({ ...doc.data(), id: doc.id });
    });

    // Send the response
    res.status(200).json(announcementsList); // Send the announcements list as JSON response
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Internal server error" }); // Send an error response in case of error
  }
};

export default getAnnouncements;
