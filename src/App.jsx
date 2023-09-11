import { useEffect, useState } from "react";
import "./App.css";
import Home from "./pages/home";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/login";
import Resolved from "./pages/resolved";
import Unresolved from "./pages/unresolved";
import All from "./pages/all";
import Info from "./pages/info";
import Stats from "./pages/stats";
import Profile from "./pages/profile";
import History from "./pages/history";
import Dashboard from "./pages/dashboard";
import UserHistory from "./pages/[userName]";
import Loading from "./components/Loading";
import { useGlobalContext } from "./context/globalContext";
import { auth, db } from "./firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import TopPerformers from "./pages/topPerformers";
import Announcements from "./pages/announcements";

function App() {
  const { userInfo, setUserInfo } = useGlobalContext();
  const navigate = useNavigate();
  //get current url last part
  let currentUrl = window.location.href.split("/").pop();
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
        // console.log("user is ", user);
      } else {
        setUserInfo(null);
      }
    });
  }, []);

  useEffect(() => {
    const user = sessionStorage.getItem("userInfo");
    if (!user) {
      navigate("/login");
    }
  }, []);

  return sessionStorage.getItem("userInfo") ? (
    userInfo?.email ? (
      <>
        <div className=" pt-14 ">
          <Routes>
            <Route
              path="/"
              element={userInfo ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/all"
              element={userInfo ? <All /> : <Navigate to="/login" />}
            />
            <Route
              path="/resolved"
              element={userInfo ? <Resolved /> : <Navigate to="/login" />}
            />
            <Route
              path="/unresolved"
              element={userInfo ? <Unresolved /> : <Navigate to="/login" />}
            />
            <Route
              path="/topperformers"
              element={userInfo ? <TopPerformers /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={
                userInfo?.isAdmin === false ? (
                  <Profile />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/history"
              element={userInfo ? <History /> : <Navigate to="/login" />}
            />
            <Route
              path="/stats"
              element={userInfo?.isAdmin ? <Stats /> : <Navigate to="/" />}
            />
            <Route
              path="/dashboard"
              element={userInfo?.isAdmin ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/announcements"
              element={userInfo ? <Announcements /> : <Navigate to="/" />}
            />
            <Route
              path="/users/:userName"
              element={
                userInfo?.isAdmin ? <UserHistory /> : <Navigate to="/" />
              }
            />
            {/* <Route path="/adduser" element={userInfo?.isAdmin?<Adduser/>:<Navigate to="/" />} /> */}
            <Route
              path="/info"
              element={userInfo ? <Info /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </>
    ) : (
      <Loading />
    )
  ) : (
    <div className=" pt-14 ">
      <Login />
    </div>
  );
}

export default App;
