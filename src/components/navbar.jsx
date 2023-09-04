import React from "react";
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
        className={`flex justify-between gap-5 w-full sm:w-3/4 md:w-1/2 items-center  `}
      >
        <Link
          to="/"
          className={
            `font-bold hover:text-theme-yellow-dark  cursor-pointer ` +
            (currentUrl == "" ? "text-theme-yellow-dark" : "")
          }
        >
          New
        </Link>
        <Link
          to="/all"
          className={
            `font-bold hover:text-theme-yellow-dark  cursor-pointer ` +
            (currentUrl == "all" ? "text-theme-yellow-dark" : "")
          }
        >
          All
        </Link>
        <Link
          to="/resolved"
          className={
            `font-bold hover:text-theme-yellow-dark  cursor-pointer ` +
            (currentUrl == "resolved" ? "text-theme-yellow-dark" : "")
          }
        >
          Resolved
        </Link>
        <Link
          to="/unresolved"
          className={
            `font-bold hover:text-theme-yellow-dark  cursor-pointer ` +
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
                `font-bold hover:text-theme-yellow-dark  cursor-pointer ` +
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
                `font-bold hover:text-theme-yellow-dark  cursor-pointer ` +
                (currentUrl == "profile" ? "text-theme-yellow-dark" : "")
              }
            >
              Profile
            </Link>
            <Link
              to="/history"
              className={
                `font-bold hover:text-theme-yellow-dark  cursor-pointer ` +
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
                `font-bold hover:text-theme-yellow-dark  cursor-pointer ` +
                (currentUrl == "dashboard" ? "text-theme-yellow-dark" : "")
              }
            >
              Dashboard
            </Link>
          </>
        )}
        {/* {userInfo?.isAdmin && (
          <Link
            to="/adduser"
            className="text-sm md:text-lg font-bold hover:text-theme-yellow-dark  cursor-pointer"
          >
            Add User
          </Link>
        )} */}
        <Link
          to="/info"
          className={
            `font-bold hover:text-theme-yellow-dark  cursor-pointer ` +
            (currentUrl == "info" ? "text-theme-yellow-dark" : "")
          }
        >
          <i className="fa-solid fa-circle-info"></i>
        </Link>
      </div>
      {userInfo ? (
        <a
          className="my-auto mx-2 hover:bg-red-600 font-bold hover:text-white text-red-600 active:text-red-600 px-2 py-1 rounded-lg  cursor-pointer"
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
  );
}

export default Navbar;
