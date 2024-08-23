import { useEffect, useState } from "react";
import { useLocation, Route, Routes, useNavigate } from "react-router-dom";
import { useGlobalContext } from "./context/globalContext";
import { Navigate } from "react-router-dom";

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
import Navbar from "./components/navbar.jsx";
import Dashboard from "./pages/dashboard.jsx";
<<<<<<< HEAD
import Incentives from "./pages/incentives.jsx";
=======
>>>>>>> 5518310d4b6d10b7c15645e9c972a194777b0b43

function App() {
    const { userInfo, setUserInfo } = useGlobalContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        //get userInfo from session storage
        const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        if (userInfo) {
            setUserInfo(userInfo);
        } else {
            navigate("/login");
        }
    }, []);
    const showSidebar = !["/login", "/signup"].includes(location.pathname);

    return (
        <div className="flex  w-screen  h-screen">
            <div className="w-fit">{
                showSidebar && (
                    <Navbar />
                )
            }
            </div>
            <div className="w-full overflow-x-scroll overflow-y-scroll">
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
                    /> <Route
                        path="/dashboard"
                        element={userInfo?.isAdmin && <Dashboard />}
                    />
                    <Route path="/announcements" element={userInfo && <Announcements />} />
<<<<<<< HEAD
                    <Route
                        path="/incentives"
                        element={userInfo?.isAdmin && <Incentives />}
                    />
=======
>>>>>>> 5518310d4b6d10b7c15645e9c972a194777b0b43
                    
                    <Route
                        path="/users/:userName"
                        element={userInfo?.isAdmin && <UserHistory />}
                    />
                    <Route path="/info" element={userInfo && <Info />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
