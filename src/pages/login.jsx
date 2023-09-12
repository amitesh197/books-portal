import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { auth, db } from "../firebase.config.jsx";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import logo from "../assets/edsarrthi-logo.webp";

function Login() {
  const { setUserInfo } = useGlobalContext();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevVisible) => !prevVisible);
  };

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
    e.preventDefault();
    setLoginError(null);
    setLoading(true);
    if (loginData.email && loginData.password) {
      try {
        console.log("sending");
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          loginData.email,
          loginData.password
        );
        const user = userCredentials.user;
        const bool = await checkIfAdmin(loginData.email);
        setUserInfo({ email: user.email, isAdmin: bool });
        sessionStorage.setItem(
          "userInfo",
          JSON.stringify({ email: user.email, isAdmin: bool })
        );
        if (bool) {
          navigate("/stats");
        } else {
          navigate("/");
        }
      } catch (err) {
        console.log("error is ", err.message);
        setLoginError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("userInfo")) {
      navigate("/");
    }
  }, []);

  return (
    <>
      {/* for desktop view */}
      <div className="w-full h-screen hidden sm:flex   flex-row flex-wrap -mt-14 m-0 ">
        <div className="w-1/2  bg-theme-dark text-white ">
          <img
            className="w-1/3 h-fit mx-auto my-20"
            src={logo}
            width="100"
            height="100"
            alt="edsarrthi logo"
          />
          <div className="font-bold text-3xl mx-8 lg:mx-16 text-center my-20">
            Welcome to{" "}
            <span className="text-theme-yellow-dark"> Edsarrthi's</span> Sales
            Query Portal!
          </div>
        </div>
        <div className="w-1/2">
          <div className="my-10 mx-auto text-center text-xl font-semibold">
            Please <span className="text-theme-yellow-dark">Login</span> to
            continue
          </div>
          <div className="flex flex-col gap-5 items-center justify-center ">
            <form className="w-full px-10 lg:px-32" onSubmit={loginHandler}>
              <input
                className="w-full rounded-lg border-2 border-theme-dark my-2 px-3 py-1  text-lg  outline-none focus:border-theme-yellow-dark"
                type="email"
                placeholder="Email"
                name="email"
                onChange={(e) =>
                  setLoginData((prev) => ({ ...prev, email: e.target.value }))
                }
                value={loginData.email}
                required
                autoComplete="on"
              />

              <div className="relative">
                <input
                  className="w-full rounded-lg border-2 border-theme-dark my-2 px-3 py-1 text-lg outline-none focus:border-theme-yellow-dark"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  onChange={(e) =>
                    setLoginData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  value={loginData.password}
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 "
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <i className="far fa-eye-slash" id="togglePassword"></i>
                  ) : (
                    <i className="far fa-eye" id="togglePassword"></i>
                  )}
                </button>
              </div>
              {loginError && (
                <div className="text-red-500 text-sm mt-1 mx-2">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-lg border-2 border-theme-yellow-dark my-2 px-3 py-1 text-center  font-bold text-xl  hover:cursor-pointer bg-theme-yellow-dark text-white transition-all ease-out hover:bg-white hover:text-theme-yellow-dark"
              >
                {
                  loading ? (
                    <i className="fa-solid fa-spinner animate-spin"></i>
                  ) : (
                    "Login"
                  ) //not using google sign in for now
                }
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* for mobile view */}
      <div className="w-full h-screen flex flex-row flex-wrap p-0 -mt-14 sm:hidden box-border ">
        <div className=" w-full bg-theme-dark text-white ">
          <img
            className="w-1/3 h-fit mx-auto my-20"
            src={logo}
            width="100"
            height="100"
            alt="edsarrthi logo"
          />
          <div className="font-bold text-3xl mx-2 text-center my-10">
            Welcome to{" "}
            <span className="text-theme-yellow-dark"> Edsarrthi's</span>{" "}
            Performance Portal!
          </div>
          <div className="my-5 mx-auto text-center text-xl font-semibold">
            Please Login to continue.
          </div>

          <div className="flex flex-col gap-5 items-center justify-center ">
            <form
              className="w-full px-10 lg:px-32 text-black"
              onSubmit={loginHandler}
            >
              <input
                className="w-full rounded-lg border-2 border-theme-dark my-2 px-3 py-1  text-lg  outline-none focus:border-theme-yellow-dark"
                type="email"
                placeholder="Email"
                name="email"
                onChange={(e) =>
                  setLoginData((prev) => ({ ...prev, email: e.target.value }))
                }
                value={loginData.email}
                required
                autoComplete="on"
              />

              <div className="relative">
                <input
                  className="w-full rounded-lg border-2 border-theme-dark my-2 px-3 py-1 text-lg outline-none focus:border-theme-yellow-dark"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  onChange={(e) =>
                    setLoginData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  value={loginData.password}
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-4 transform -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <i className="far fa-eye-slash" id="togglePassword"></i>
                  ) : (
                    <i className="far fa-eye" id="togglePassword"></i>
                  )}
                </button>
              </div>

              {loginError && (
                <div className="text-red-500 text-sm mt-1 mx-2">
                  {loginError}
                </div>
              )}
              <button
                type="submit"
                className="w-full rounded-lg border-2 border-theme-yellow-light my-2 px-3 py-1 text-center  font-bold text-xl  hover:cursor-pointer bg-theme-yellow-light text-white transition-all ease-out hover:bg-white hover:text-theme-yellow-dark"
              >
                {
                  loading ? (
                    <i className="fa-solid fa-spinner animate-spin"></i>
                  ) : (
                    "Login"
                  ) //not using google sign in for now
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
