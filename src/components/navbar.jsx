import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Link } from "react-router-dom";
import { auth } from "../firebase.config";
import { signOut } from "firebase/auth";
import logo from "../assets/edsarrthi-logo.webp";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { userInfo, setUserInfo } = useGlobalContext();
  const navigate = useNavigate();
  //get current url last part
  let currentUrl = window.location.href.split("/").pop();
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef(null);

  // Function to close the navbar when clicking outside of it
  const closeNavbar = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Add a click event listener to the document body
  useEffect(() => {
    document.body.addEventListener("click", closeNavbar);

    // Clean up the event listener when the component unmounts
    return () => {
      document.body.removeEventListener("click", closeNavbar);
    };
  }, []);

  const logOut = () => {
    signOut(auth)
      .then((a) => {
        console.log(a);
        console.log("signout succesfulling");
        sessionStorage.removeItem("userInfo");
        navigate("/login");
        setUserInfo(null);
      })
      .catch((error) => {
        console.log("error is ", err);
      });
  };

  return (
    <>
      <nav
        ref={navbarRef}
        className="flex items-center justify-between flex-wrap px-2 py-2 bg-theme-dark text-white fixed top-0 left-0 z-10 w-screen"
      >
        <div className="flex items-center flex-shrink-0 text-white mr-6  w-1/4 lg:w-fit">
          <Link to="/">
            <img src={logo} className="w-100 h-10 mr-2" alt="Logo" />
          </Link>
        </div>

        <div className="block lg:hidden mx-auto w-fit capitalize text-lg">
          {currentUrl === ""
            ? "New"
            : currentUrl === "topperformers"
            ? "Top Performers"
            : currentUrl}
        </div>

        <div
          className=" lg:hidden w-1/4 lg:w-fit flex justify-end pr-1 sm:pr-5
"
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center px-3  py-2 rounded text-black-500 hover:text-black-400 "
          >
            <svg
              className={`fill-current h-3 w-3  ${isOpen ? "hidden" : "block"}`}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
            <svg
              className={`fill-current h-3 w-3 ${isOpen ? "block" : "hidden"}`}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
            </svg>
          </button>
        </div>
        <div
          className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto py-2 lg:py-0 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="text-sm lg:flex-grow ">
            <Link
              to="/"
              className={
                `px-2 block my-3 lg:my-0 text-lg lg:inline-block lg:mt-0 text-white-200 mr-4 hover:text-theme-yellow-dark  cursor-pointer ` +
                (currentUrl == "" ? "text-theme-yellow-dark" : "")
              }
            >
              New
            </Link>
            <Link
              to="/all"
              className={
                `px-2 block my-3 lg:my-0 text-lg lg:inline-block lg:mt-0 text-white-200 mr-4 hover:text-theme-yellow-dark  cursor-pointer ` +
                (currentUrl == "all" ? "text-theme-yellow-dark" : "")
              }
            >
              All
            </Link>
            <Link
              to="/resolved"
              className={
                `px-2 block my-3 lg:my-0 text-lg lg:inline-block lg:mt-0 text-white-200 mr-4 hover:text-theme-yellow-dark  cursor-pointer ` +
                (currentUrl == "resolved" ? "text-theme-yellow-dark" : "")
              }
            >
              Resolved
            </Link>
            <Link
              to="/unresolved"
              className={
                `px-2 block my-3 lg:my-0 text-lg lg:inline-block lg:mt-0 text-white-200 mr-4 hover:text-theme-yellow-dark  cursor-pointer ` +
                (currentUrl == "unresolved" ? "text-theme-yellow-dark" : "")
              }
            >
              Unresolved
            </Link>
            {userInfo?.isAdmin && (
              <>
                <Link
                  to="/stats"
                  className={
                    `px-2 block my-3 lg:my-0 text-lg lg:inline-block lg:mt-0 text-white-200 mr-4 hover:text-theme-yellow-dark  cursor-pointer ` +
                    (currentUrl == "stats" ? "text-theme-yellow-dark" : "")
                  }
                >
                  Stats
                </Link>
              </>
            )}
            {!userInfo?.isAdmin && (
              <>
                <Link
                  to="/profile"
                  className={
                    `px-2 block my-3 lg:my-0 text-lg lg:inline-block lg:mt-0 text-white-200 mr-4 hover:text-theme-yellow-dark  cursor-pointer ` +
                    (currentUrl == "profile" ? "text-theme-yellow-dark" : "")
                  }
                >
                  Profile
                </Link>
                <Link
                  to="/history"
                  className={
                    `px-2 block my-3 lg:my-0 text-lg lg:inline-block lg:mt-0 text-white-200 mr-4 hover:text-theme-yellow-dark  cursor-pointer ` +
                    (currentUrl == "history" ? "text-theme-yellow-dark" : "")
                  }
                >
                  History
                </Link>
              </>
            )}
            {userInfo?.isAdmin && (
              <>
                <Link
                  to="/dashboard"
                  className={
                    `px-2 block my-3 lg:my-0 text-lg lg:inline-block lg:mt-0 text-white-200 mr-4 hover:text-theme-yellow-dark  cursor-pointer ` +
                    (currentUrl == "dashboard" ? "text-theme-yellow-dark" : "")
                  }
                >
                  Dashboard
                </Link>
              </>
            )}
            <Link
              to="/topperformers"
              className={
                `px-2 block my-3 lg:my-0 text-lg lg:inline-block lg:mt-0 text-white-200 mr-4 hover:text-theme-yellow-dark  cursor-pointer ` +
                (currentUrl == "topperformers" ? "text-theme-yellow-dark" : "")
              }
            >
              Top Performers
            </Link>
            <Link
              to="/announcements"
              className={
                `px-2 block my-3 lg:my-0 text-lg lg:inline-block lg:mt-0 text-white-200 mr-4 hover:text-theme-yellow-dark  cursor-pointer ` +
                (currentUrl == "announcements" ? "text-theme-yellow-dark" : "")
              }
            >
              Announcements
            </Link>

            <Link
              to="/info"
              className={
                `px-2 block my-3 lg:my-0 text-lg lg:inline-block lg:mt-0 text-white-200 mr-4 hover:text-theme-yellow-dark  cursor-pointer ` +
                (currentUrl == "info" ? "text-theme-yellow-dark" : "")
              }
            >
              <i className="fa-solid fa-circle-info"></i>
            </Link>
            {/* {userInfo?.isAdmin && (
          <Link
            to="/adduser"
            className="text-sm md:text-lg  hover:text-theme-yellow-dark  cursor-pointer"
          >
            Add User
          </Link>
        )} */}
          </div>
          <div>
            {userInfo ? (
              <Link
                className="inline-flex items-center bg-red-500 rounded-lg py-1 px-2 my-3 lg:my-0 text-lg border-0 mx-2 lg:py-0 lg:mx-5"
                onClick={logOut}
              >
                Logout
              </Link>
            ) : (
              <Link
                to="/login"
                className="my-auto mx-2  text-theme-yellow-dark active:text-theme-yellow-dark px-2 py-1 rounded-lg  cursor-pointer"
                // onClick={() => setAuth(true)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
