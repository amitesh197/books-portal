import Loading from "../components/Loading";
import AnnouncementCard from "../components/AnnouncementCard";
import FullAnnouncementContainer from "../components/FullAnnouncementContainer";
import { useGlobalContext } from "../context/globalContext";
import React, { useEffect } from "react";
import { auth, db, storage } from "../firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";
import ScrollToTopBtn from "../components/ScrollToTopBtn";

export default function Announcements({ data }) {
  const { userInfo, setUserInfo } = useGlobalContext();
  console.log("userInfo", userInfo);
  const [fetchingData, setFetchingData] = React.useState(false);
  const [allAnnouncements, setAllAnnouncements] = React.useState([]); // [ {author, date, content}, {author, date, content}, ...
  const [currAnnouncement, setCurrAnnouncement] = React.useState(null);

  const handleGetAnnouncements = async () => {
    setFetchingData(true);
    console.log("Fetching data for admin");

    try {
      const announcements = collection(db, "announcements");
      const q = query(announcements);
      const querySnapshot = await getDocs(q);
      let announcementsList = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        //also add the id of the document to the object
        announcementsList.push({ ...doc.data(), id: doc.id });
      });
      console.log("announcementsList before", announcementsList);
      /*
      announcementsList is an array of objects
      [
       {
        "id" : "String",
        "author": "String",
        "date": 2023-08-21T09:40:00.560Z,
        "content": String
        },
        {
          ...
        },
        ...
      ]
      */
      //sort by date
      announcementsList.sort((a, b) => {
        return b.date.seconds - a.date.seconds;
      });
      //convet date to string like 20 Aug, 2021 at 9:40 AM

      announcementsList.forEach((announcement) => {
        const date = new Date(announcement.date.seconds * 1000);
        const dateString = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const timeString = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        announcement.date = `${dateString}`;
      });

      console.log("announcementsList", announcementsList);

      setAllAnnouncements(announcementsList);
      if (announcementsList.length > 0) {
        setCurrAnnouncement(announcementsList[0]);
      }
    } catch (err) {
      console.log("Error hai:", err);
    }

    setFetchingData(false);
  };

  const handleNewAnnouncement = async () => {
    //set the currAnnouncement to "new" so that the FullAnnouncementContainer renders the form
    setCurrAnnouncement("new");
    localStorage.setItem("currAnnouncement", JSON.stringify("new"));
  };

  useEffect(() => {
    handleGetAnnouncements();
  }, []);

  return (
    <div className="w-full  box-border overflow-clip">
      <div className=" m-2 text-lg font-semibold w-fit">
        Recent Announcements
      </div>

      {fetchingData ? (
        <Loading />
      ) : (
        <div className="flex  flex-col  md:flex-row gap-5  h-full px-5 md:px-10 box-border pb-10">
          {/* cards container */}
          <div className="flex flex-col w-full md:w-4/6  gap-5 overflow-auto px-2 h-60 md:h-full">
            {/* card */}
            {userInfo?.isAdmin && (
              <div
                className={`w-full h-fit rounded p-2 relative flex flex-col items-center justify-center `}
                onClick={() => console.log("clicked")}
              >
                <div
                  className="h-10 w-10 flex justify-center items-center text-xl font-bold rounded bg-theme-yellow-dark hover:scale-110 transitio ease-out duration-150 cursor-pointer"
                  onClick={() => handleNewAnnouncement()}
                >
                  {" "}
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </div>
                <div className="font-semibold text-sm mt-2">
                  New Announcement
                </div>
              </div>
            )}
            {allAnnouncements.map((announcement) => {
              return (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  currAnnouncementId={currAnnouncement?.id}
                  setCurrAnnouncement={setCurrAnnouncement}
                />
              );
            })}
          </div>

          {/* full info container */}
          <div className="w-full px-5 py-3 my-5 md:my-0 bg-theme-gray rounded-lg  relative mb-3">
            {currAnnouncement && (
              <FullAnnouncementContainer
                currAnnouncement={currAnnouncement}
                handleGetAnnouncements={handleGetAnnouncements}
                setCurrAnnouncement={setCurrAnnouncement}
              />
            )}
          </div>

          <ScrollToTopBtn />
        </div>
      )}
    </div>
  );
}
