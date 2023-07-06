import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/login";
import Resolved from "./pages/resolved";
import Unresolved from "./pages/unresolved";
import { useGlobalContext } from "./context/globalContext";
import All from "./pages/all";
import Info from "./pages/info";
import Adduser from "./pages/adduser";
import Stats from "./pages/stats";

function App() {
  const {isLoggedIn ,userInfo} =  useGlobalContext()
  return (
    <div className="">
      <Navbar />
      <div className="mt-16">
        <Routes>
          <Route path="/" element={userInfo?<Home/>:<Navigate to="/login" />} />
          <Route path="/all" element={userInfo?<All/>:<Navigate to="/login" />} />
          <Route path="/resolved" element={userInfo?<Resolved/>:<Navigate to="/login" />} />
          <Route path="/unresolved" element={userInfo?<Unresolved/>:<Navigate to="/login" />} />
          <Route path="/stats" element={userInfo?.isAdmin?<Stats/>:<Navigate to="/" />} />
          {/* <Route path="/adduser" element={userInfo?.isAdmin?<Adduser/>:<Navigate to="/" />} /> */}
          <Route path="/info" element={userInfo?<Info/>:<Navigate to="/login" />} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
