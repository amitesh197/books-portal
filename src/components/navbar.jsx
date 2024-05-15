import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Link } from "react-router-dom";
import { auth } from "../firebase.config";
import { signOut } from "firebase/auth";
import logo from "../assets/sarrthiias-navlogo.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { userInfo, setUserInfo } = useGlobalContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  //get current url last part
  let currentUrl = window.location.href.split("/").pop();
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef(null);
  const dashboardRef = useRef(null);

  // Function to close the navbar when clicking outside of it
  const closeNavbar = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      dashboardRef.current && // Check if dashboardRef.current is not null
      !dashboardRef.current.contains(event.target)
    ) {
      setIsOpen(false);
      setMenuOpen(false);
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
        className="flex items-center justify-between flex-wrap px-2 py-2 bg-theme-dark text-white fixed top-0 left-0 z-20 w-screen"
      >
        <div className="flex items-center flex-shrink-0 text-white mr-6  w-1/3 lg:w-20 h-10">
          <Link to="/">
            <img src={logo} className="w-full mr-2" alt="Logo" />
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
            <i
              className={`fa-solid fa-bars ${isOpen ? "hidden" : "block"}`}
            ></i>
            <i
              className={`fa-solid fa-times ${isOpen ? "block" : "hidden"}`}
            ></i>
          </button>
        </div>
        <div
          className={`w-full block flex-grow lg:flex lg:items-center lg:justify-center lg:w-auto py-2 lg:py-0  ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="text-sm lg:flex-grow lg:flex lg:items-center lg:justify-center">
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
                <div
                  ref={dashboardRef}
                  className={
                    `pr-5 block my-3 lg:my-0 text-lg lg:inline-block lg:mt-0 text-white-200 mr-4 hover:text-theme-yellow-dark  cursor-pointer relative select-none ` +
                    (currentUrl == "dashboard" ? "text-theme-yellow-dark" : "")
                  }
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  Dashboard&nbsp;&nbsp;
                  <div
                    className={`absolute -top-1 right-0 bg-theme-dark text-white w-4 h-4 m-2`}
                  >
                    <svg
                      className="fill-current text-white h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </div>
                  <div
                    className={`${
                      menuOpen ? "block" : "hidden"
                    } absolute top-full left-0 bg-theme-dark text-white   mt-1 w-max `}
                  >
                    <Link
                      to="/current-users-stats"
                      className="block px-4 py-2 border border-theme-yellow-dark text-sm capitalize hover:bg-theme-yellow-dark hover:text-white "
                    >
                      Current Month Stats
                    </Link>
                    <Link
                      to="/monthly-user-history"
                      className="block px-4 py-2 text-sm border border-theme-yellow-dark capitalize hover:bg-theme-yellow-dark hover:text-white"
                    >
                      Monthly user&apos;s history
                    </Link>
                  </div>
                </div>
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
                className="inline-flex items-center bg-red-500 rounded-lg py-1 px-2 my-3  text-lg border-0 mx-2 lg:my-0 lg:w-20  lg:px-2"
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
