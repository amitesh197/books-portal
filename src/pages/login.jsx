import React, { useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { auth, db } from "../firebase.config.jsx";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";

function Login() {
  const {  setUserInfo } = useGlobalContext();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loginError , setLoginError] = useState(null)

  const portalAdmins = collection(db, "portal-admins");

  const navigate = useNavigate();

  const checkIfAdmin = async (email) => {
    const q = query(portalAdmins, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    // get
    var arr = false;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const eachDoc = doc.data();
      console.log(doc.id, " => ", eachDoc);
      arr = true;
    });
    if (arr) {
      return true;
    } else {
      return false;
    }
  };

  const loginHandler = async (e) => {
    setLoginError(null)
    if (loginData.email && loginData.password){
      try {
        console.log("sending");
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          loginData.email,
          loginData.password
        );
        const user = userCredentials.user;
        const bool = await checkIfAdmin(loginData.email);
        setUserInfo({email:user.email,isAdmin:bool});
        if(bool){
          navigate("/unresolved");  
        }
        else{
          navigate("/");
        }
      } catch (err) {
        console.log("error is ", err.message);
        setLoginError(err.message)
      }
    }
  };

  return (
    <div className="flex justify-center">
      {/* <Toaster /> */}
      <div className="w-full flex flex-col md:flex-row mt-10 items-center justify-evenly ">
        {/* login */}
        <div className="w-64 text-slate-300 flex flex-col mt-10 md:mt-0 ">
          <p className=" text-donkey-rose font-medium text-2xl text-center">
            Login
          </p>
          <input
            type="email"
            className=" bg-background-dark-gray rounded-md px-2 py-2 my-1 text-black outline-none focus:border-2 focus:border-donkey-rose"
            placeholder="email"
            onChange={(e) =>
              setLoginData((prev) => ({ ...prev, email: e.target.value }))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                loginHandler();
              }
            }}
          />
          <input
            className=" bg-background-dark-gray rounded-md px-2 py-2 my-1 text-black outline-none focus:border-2 focus:border-donkey-rose"
            placeholder="password"
            type="password"
            onChange={(e) =>
              setLoginData((prev) => ({ ...prev, password: e.target.value }))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                loginHandler();
              }
            }}
          />
          <span className="text-md text-red-500">{loginError}</span>
          <button
            className=" bg-gray-600  hover:bg-gray-500 active:bg-gray-400   p-2 w-full rounded-md mt-2"
            onClick={loginHandler}
          >
            Log In
          </button>
        </div>
        {/* register */}
        {/* <div className="w-64 text-slate-300 flex flex-col ">
          <p className=" text-donkey-rose font-medium text-2xl text-center">
            Register
          </p>
          <input
            className=" bg-background-dark-gray rounded-md px-2 py-2 my-1 text-black outline-none focus:border-2 focus:border-donkey-rose"
            placeholder="username"
            onChange={(e) =>
              setSignUpData((prev) => ({ ...prev, username: e.target.value }))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                signUpHandler();
              }
            }}
          />
          <input
            className=" bg-background-dark-gray rounded-md px-2 py-2 my-1 text-black outline-none focus:border-2 focus:border-donkey-rose"
            placeholder="email"
            onChange={(e) =>
              setSignUpData((prev) => ({ ...prev, email: e.target.value }))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                signUpHandler();
              }
            }}
          />
          <input
            className=" bg-background-dark-gray rounded-md px-2 py-2 my-1 text-black outline-none focus:border-2 focus:border-donkey-rose"
            placeholder="password"
            type="password"
            onChange={(e) =>
              setSignUpData((prev) => ({ ...prev, password: e.target.value }))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                signUpHandler();
              }
            }}
          />
          <input
            className=" bg-background-dark-gray rounded-md px-2 py-2 my-1 text-black outline-none focus:border-2 focus:border-donkey-rose"
            placeholder="verify password"
            type="password"
            onChange={(e) =>
              setSignUpData((prev) => ({
                ...prev,
                verifyPassword: e.target.value,
              }))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                signUpHandler();
              }
            }}
          />
          <button
            className=" bg-gray-600  hover:bg-gray-500 active:bg-gray-400   p-2 w-full rounded-md mt-2"
            onClick={signUpHandler}
          >
            Sign Up
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default Login;
