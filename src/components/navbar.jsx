import React, { useEffect } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import detailIcon from "../assets/detail.png";

function Navbar() {
  const { userInfo, setUserInfo } = useGlobalContext();

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
    <div className="flex flex-row justify-between text-xs md:text-lg bg-gray-800  w-full py-5 fixed top-0 px-1 sm:px-5 md:px-20">
      <div className="flex justify-between w-full sm:w-3/4 md:w-1/2">
        <Link
          to="/"
          className="  font-bold hover:text-gray-500 active:text-gray-800 cursor-pointer"
        >
          New
        </Link>
        <Link
          to="/all"
          className="  font-bold hover:text-gray-500 active:text-gray-800 cursor-pointer"
        >
          All
        </Link>
        <Link
          to="/resolved"
          className=" font-bold hover:text-gray-500 active:text-gray-800 cursor-pointer"
        >
          Resolved
        </Link>
        <Link
          to="/unresolved"
          className=" font-bold hover:text-gray-500 active:text-gray-800 cursor-pointer"
        >
          Unresolved
        </Link>
        <Link
          to="/stats"
          className=" font-bold hover:text-gray-500 active:text-gray-800 cursor-pointer"
        >
          Stats
        </Link>
        {/* {userInfo?.isAdmin && (
          <Link
            to="/adduser"
            className="text-sm md:text-lg font-bold hover:text-gray-500 active:text-gray-800 cursor-pointer"
          >
            Add User
          </Link>
        )} */}
        <Link
          to="/info"
          className="  font-bold flex items-center hover:text-gray-500 active:text-gray-800 cursor-pointer"
        >
          <img className="h-5" src={detailIcon} />
        </Link>
      </div>
      {userInfo ? (
        <a
          className=" font-bold text-red-500 hover:text-red-700 active:text-red-900  cursor-pointer"
          onClick={logOut}
        >
          LogOut
        </a>
      ) : (
        <Link
          to="/login"
          className=" font-bold hover:text-gray-500 active:text-gray-800 cursor-pointer"
          // onClick={() => setAuth(true)}
        >
          LogIn
        </Link>
      )}
    </div>
  );
}

export default Navbar;
