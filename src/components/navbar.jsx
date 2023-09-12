import React, { useState } from "react";
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
      <div className="flex flex-row justify-between text-xs md:text-lg bg-theme-dark text-white  w-full p-2 fixed top-0  h-14 z-10">
        <div
          className="mx-2 cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <img className="w-20 h-10" src={logo} alt="logo" />
        </div>
        <div
          className={`flex justify-between gap-5 lg:gap-10  w-fit items-center text-xs md:text-base lg:text-lg `}
        >
          <Link
            to="/"
            className={
              ` hover:text-theme-yellow-dark  cursor-pointer ` +
              (currentUrl == "" ? "text-theme-yellow-dark" : "")
            }
          >
            New
          </Link>
          <Link
            to="/all"
            className={
              ` hover:text-theme-yellow-dark  cursor-pointer ` +
              (currentUrl == "all" ? "text-theme-yellow-dark" : "")
            }
          >
            All
          </Link>
          <Link
            to="/resolved"
            className={
              ` hover:text-theme-yellow-dark  cursor-pointer ` +
              (currentUrl == "resolved" ? "text-theme-yellow-dark" : "")
            }
          >
            Resolved
          </Link>
          <Link
            to="/unresolved"
            className={
              ` hover:text-theme-yellow-dark  cursor-pointer ` +
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
                  ` hover:text-theme-yellow-dark  cursor-pointer ` +
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
                  ` hover:text-theme-yellow-dark  cursor-pointer ` +
                  (currentUrl == "profile" ? "text-theme-yellow-dark" : "")
                }
              >
                Profile
              </Link>
              <Link
                to="/history"
                className={
                  ` hover:text-theme-yellow-dark  cursor-pointer ` +
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
                  ` hover:text-theme-yellow-dark  cursor-pointer ` +
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
              ` hover:text-theme-yellow-dark  cursor-pointer whitespace-nowrap ` +
              (currentUrl == "topperformers" ? "text-theme-yellow-dark" : "")
            }
          >
            Top Performers
          </Link>
          <Link
            to="/announcements"
            className={
              ` hover:text-theme-yellow-dark  cursor-pointer whitespace-nowrap ` +
              (currentUrl == "announcements" ? "text-theme-yellow-dark" : "")
            }
          >
            Announcements
          </Link>

          {/* {userInfo?.isAdmin && (
          <Link
            to="/adduser"
            className="text-sm md:text-lg  hover:text-theme-yellow-dark  cursor-pointer"
          >
            Add User
          </Link>
        )} */}
          <Link
            to="/info"
            className={
              ` hover:text-theme-yellow-dark  cursor-pointer ` +
              (currentUrl == "info" ? "text-theme-yellow-dark" : "")
            }
          >
            <i className="fa-solid fa-circle-info"></i>
          </Link>
        </div>
        {userInfo ? (
          <a
            className="my-auto mx-2 hover:bg-red-600  hover:text-white text-red-600 active:text-red-600 px-2 py-1 rounded-lg  cursor-pointer"
            onClick={logOut}
          >
            Logout
          </a>
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
      {/* <nav className="flex items-center justify-between flex-wrap p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6 lg:mr-72">
          <img src={logo} className="w-100 h-10 mr-2" alt="Logo" />
        </div>
        <div className="block lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center px-3 py-2 rounded text-black-500 hover:text-black-400"
          >
            <svg
              className={`fill-current h-3 w-3 ${isOpen ? "hidden" : "block"}`}
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
          className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="text-sm lg:flex-grow">
            <a
              href="#"
              className="block mt-4 lg:inline-block lg:mt-0 text-white-200 mr-4"
            >
              First Link
            </a>
            <a
              href="#"
              className="block mt-4 lg:inline-block lg:mt-0 text-white-200 mr-4"
            >
              Second Link
            </a>
            <a
              href="#"
              className="block mt-4 lg:inline-block lg:mt-0 text-white-200 mr-4"
            >
              Third Link
            </a>
            <div class="dropdown">
              <button class="dropbtn">
                Dropdown
                <i class="fa fa-caret-down"></i>
              </button>
              <div class="dropdown-content">
                <a href="#">Link 1</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
              </div>
            </div>
          </div>
          <div>
            <button className="inline-flex items-center bg-amber-500 border-0 py-2 px-4 text-white py-0 lg:py-0">
              Click Me
            </button>
          </div>
        </div>
      </nav> */}
    </>
  );
}

export default Navbar;
