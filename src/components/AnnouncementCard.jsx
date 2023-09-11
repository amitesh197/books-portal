import React from "react";

export default function AnnouncementCard({
  announcement,
  currAnnouncementId,
  setCurrAnnouncement,
}) {
  /*
      announcement is an object
     
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

  //destructuring announcement
  const { id, title, content, date, author } = announcement;

  const highlight =
    currAnnouncementId === id
      ? "border-theme-yellow-dark"
      : "border-transparent";

  return (
    <div
      className={`w-full h-fit rounded bg-theme-gray p-2 relative border-2  hover:border-theme-yellow-light cursor-pointer ${highlight}`}
      onClick={() => setCurrAnnouncement(announcement)}
    >
      <div className="font-semibold text-lg mb-5">{title}</div>
      <div className="flex flex-row gap-2 text-sm ">
        <div>{date}</div>
        <div>By {author}</div>
      </div>
      <div className="absolute bottom-2 right-2 text-xs">
        Click to read more <i className="fa-solid fa-arrow-right"></i>
      </div>
    </div>
  );
}
