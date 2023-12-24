import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useGlobalContext } from "./context/globalContext";

import Home from "./pages/home";
import Login from "./pages/login";
import Resolved from "./pages/resolved";
import Unresolved from "./pages/unresolved";
import All from "./pages/all";
import Info from "./pages/info";
import Stats from "./pages/stats";
import Profile from "./pages/profile";
import History from "./pages/history";
import UserHistory from "./pages/[userName]";
import TopPerformers from "./pages/topPerformers";
import Announcements from "./pages/announcements";
import MonthlyUserHistory from "./pages/monthlyUserHistory";
import CurrUsersStats from "./pages/currUsersStats";
import SignUp from "./pages/signUp";

function App() {
  const { userInfo, setUserInfo } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    //get userInfo from session storage
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (userInfo) {
      setUserInfo(userInfo);
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className=" pt-14 ">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/" element={userInfo && <Home />} />
        <Route path="/all" element={userInfo && <All />} />
        <Route path="/resolved" element={userInfo && <Resolved />} />
        <Route path="/unresolved" element={userInfo && <Unresolved />} />
        <Route path="/topperformers" element={userInfo && <TopPerformers />} />
        <Route path="/profile" element={!userInfo?.isAdmin && <Profile />} />
        <Route path="/history" element={userInfo && <History />} />
        <Route path="/stats" element={userInfo?.isAdmin && <Stats />} />
        <Route
          path="/current-users-stats"
          element={userInfo?.isAdmin && <CurrUsersStats />}
        />
        <Route
          path="/monthly-user-history"
          element={userInfo?.isAdmin && <MonthlyUserHistory />}
        />
        <Route path="/announcements" element={userInfo && <Announcements />} />
        <Route
          path="/users/:userName"
          element={userInfo?.isAdmin && <UserHistory />}
        />
        <Route path="/info" element={userInfo && <Info />} />
      </Routes>
    </div>
  );
}

export default App;
