import React, { useEffect } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import detailIcon from "../assets/detail.png";
import logo from "../assets/edsarrthi-logo.webp";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { userInfo, setUserInfo } = useGlobalContext();
  const navigate = useNavigate();
  const portalAdmins = collection(db, "portal-admins");

  const checkIfAdmin = async (email) => {
    const q = query(portalAdmins, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    var arr = false;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // const eachDoc = doc.data();
      // console.log(doc.id, " => ", eachDoc);
      arr = true;
    });
    if (arr) {
      return true;
    } else {
      return false;
    }
  };
  const settheuserdata = async (user) => {
    const bool = await checkIfAdmin(user.email);
    setUserInfo({ email: user.email, isAdmin: bool });
  };

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        settheuserdata(user);
        console.log("user is ", user);
      } else {
        setUserInfo(null);
      }
    });
  }, []);

  const logOut = () => {
    signOut(auth)
      .then((a) => {
        console.log(a);
        console.log("signout succesfulling");
      })
      .catch((error) => {
        console.log("error is ", err);
      });
  };

  return (
    <div className="flex flex-row justify-between text-xs md:text-lg bg-navbar-dark text-white  w-full p-2 fixed top-0  h-fit">
      <div
        className="mx-2 cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      >
        <img className="w-20 h-10" src={logo} alt="logo" />
      </div>
      <div className="flex justify-between w-full sm:w-3/4 md:w-1/2 items-center">
        <Link
          to="/"
          className="  font-bold hover:text-theme-yellow-dark  cursor-pointer"
        >
          New
        </Link>
        <Link
          to="/all"
          className="  font-bold hover:text-theme-yellow-dark  cursor-pointer"
        >
          All
        </Link>
        <Link
          to="/resolved"
          className=" font-bold hover:text-theme-yellow-dark  cursor-pointer"
        >
          Resolved
        </Link>
        <Link
          to="/unresolved"
          className=" font-bold hover:text-theme-yellow-dark  cursor-pointer"
        >
          Unresolved
        </Link>
        <Link
          to="/stats"
          className=" font-bold hover:text-theme-yellow-dark  cursor-pointer"
        >
          Stats
        </Link>
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
          className="  font-bold flex items-center hover:text-theme-yellow-dark  cursor-pointer"
        >
          <img className="h-5" src={detailIcon} />
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
          className="my-auto font-bold hover:text-theme-yellow-dark  cursor-pointer"
          // onClick={() => setAuth(true)}
        >
          LogIn
        </Link>
      )}
    </div>
  );
}

export default Navbar;
