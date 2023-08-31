import React from "react";
import Navbar from "../components/navbar";

function Info() {
  return (
    <>
      <Navbar />
      <div className="  flex justify-center">
        <ol className="mt-10 text-center font-semibold  text-red-600 w-4/5 md:w-3/4">
          <li className="my-10 font-bold text-3xl">POINTS TO BE REMEMBERED</li>
          <li className="my-2">
            When directly altering status in the excel sheets make sure that you
            do not put "not done". if there is a "done" word present in that
            cell. it will autmatically detect that that task is done.
          </li>
          <li className="my-2">
            If the web app becomes unresponsive. Dont keep on clicking. It will
            be running in background and you might make duplicate entries.
          </li>
          <li className="my-2">
            Avoid Clicking twice. as it will make 2 entries.
          </li>
        </ol>
      </div>
    </>
  );
}

export default Info;
