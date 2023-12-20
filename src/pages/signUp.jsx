import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import logo from "../assets/edsarrthi-logo.webp";
import { useNavigate } from "react-router-dom";
import UserPool from "../UserPool";

function SignUp() {
  const navigate = useNavigate();
  const { setUserInfo } = useGlobalContext();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  const [loginError, setLoginError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevVisible) => !prevVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prevVisible) => !prevVisible);
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);
    if (loginData.email && loginData.password) {
      try {
        UserPool.signUp(
          loginData.email,
          loginData.password,
          [],
          null,
          (err, data) => {
            if (err) {
              console.log(err);
              setLoginError(err.message);
              return;
            }
            console.log(data);
            setLoginError(null);
            navigate("/");
          }
        );

        // setUserInfo({ email: data.user.email, isAdmin: false });
        // sessionStorage.setItem(
        //   "userInfo",
        //   JSON.stringify({
        //     token: data.session.access_token,
        //     email: data.user.email,
        //     isAdmin: false,
        //   })
        // );

        navigate("/");
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
    // console.log("data", data, error);
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
            Please <span className="text-theme-yellow-dark">SignUp</span> to
            continue
          </div>
          <div className="flex flex-col gap-5 items-center justify-center ">
            <form className="w-full px-10 lg:px-32" onSubmit={signupHandler}>
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

              <div className="relative">
                <input
                  className="w-full rounded-lg border-2 border-theme-dark my-2 px-3 py-1 text-lg outline-none focus:border-theme-yellow-dark"
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirm_password"
                  onChange={(e) =>
                    setLoginData((prev) => ({
                      ...prev,
                      confirm_password: e.target.value,
                    }))
                  }
                  value={loginData.confirm_password}
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 "
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {confirmPasswordVisible ? (
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
                    "SignUp"
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
            Please SignUp to continue.
          </div>

          <div className="flex flex-col gap-5 items-center justify-center ">
            <form
              className="w-full px-10 lg:px-32 text-black"
              onSubmit={signupHandler}
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

              <div className="relative">
                <input
                  className="w-full rounded-lg border-2 border-theme-dark my-2 px-3 py-1 text-lg outline-none focus:border-theme-yellow-dark"
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirm_password"
                  onChange={(e) =>
                    setLoginData((prev) => ({
                      ...prev,
                      confirm_password: e.target.value,
                    }))
                  }
                  value={loginData.confirm_password}
                  required
                />

                <button
                  type="button"
                  className="absolute top-1/2 right-4 transform -translate-y-1/2"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {confirmPasswordVisible ? (
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
                    "SignUp"
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

export default SignUp;
