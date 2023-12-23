import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/edsarrthi-logo.webp";
import UserPool from "../UserPool";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { data } from "autoprefixer";

function Login() {
  const { setUserInfo } = useGlobalContext();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [user, setUser] = useState(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevVisible) => !prevVisible);
  };

  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);
    if (loginData.email && loginData.password) {
      const user = new CognitoUser({
        Username: loginData.email,
        Pool: UserPool,
      });

      const authDetails = new AuthenticationDetails({
        Username: loginData.email,
        Password: loginData.password,
      });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          // console.log("onSuccess:", data);
          /* data = {
                "idToken": {
                  "jwtToken": "",
                  "payload": {
                    "sub": "11d3edba-40c1-7090-caf4-0f8d32382b8e",
                    "email_verified": true,
                    "iss": "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_HiJPiffM7",
                    "cognito:username": "TestUser",
                    "origin_jti": "3beab445-2ea0-4e09-a822-f4aa4e6361db",
                    "aud": "6db3r7ki8e23eiin42124vr9v1",
                    "event_id": "45f5fbcd-5415-4b69-8a7f-296767ecf3e3",
                    "token_use": "id",
                    "auth_time": 1703071217,
                    "exp": 1703074817,
                    "iat": 1703071217,
                    "jti": "8b07a68b-aba2-4405-9c10-2429f11d3447",
                    "email": "test@gmail.com"
                  }
                },
                "refreshToken": {
                  "token": ""
                },
                "accessToken": {
                  "jwtToken": "",
                  "payload": {
                    "sub": "11d3edba-40c1-7090-caf4-0f8d32382b8e",
                    "iss": "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_HiJPiffM7",
                    "client_id": "6db3r7ki8e23eiin42124vr9v1",
                    "origin_jti": "3beab445-2ea0-4e09-a822-f4aa4e6361db",
                    "event_id": "45f5fbcd-5415-4b69-8a7f-296767ecf3e3",
                    "token_use": "access",
                    "scope": "aws.cognito.signin.user.admin",
                    "auth_time": 1703071217,
                    "exp": 1703074817,
                    "iat": 1703071217,
                    "jti": "1bc4f2d2-0cc6-4779-9d85-ba3ca6c6f00d",
                    "username": "TestUser"
                  }
                },
                "clockDrift": -4
              }  */
          const accessTokenPayload = data.getAccessToken().payload;

          // Check if the user has the admin role
          const isAdmin =
            accessTokenPayload["cognito:groups"]?.includes("admins");

          setUserInfo({
            username: data.accessToken.payload.username,
            email: data.idToken.payload.email,
            token: data.accessToken.jwtToken,
            isAdmin: isAdmin,
          });

          // Store the user info in the session storage (storing the isAdmin is a bad idea, but i am doing it for now, please change it later. )
          sessionStorage.setItem(
            "userInfo",
            JSON.stringify({
              username: data.accessToken.payload.username,
              token: data.accessToken.jwtToken,
              email: data.idToken.payload.email,
              isAdmin: isAdmin,
            })
          );
          setLoading(false);

          navigate("/");
        },
        onFailure: (err) => {
          console.error("onFailure:", err);
          setLoginError(err.message);
          setLoading(false);
        },
        newPasswordRequired: (data) => {
          console.log("newPasswordRequired:", data);
          setIsFirstTime(true);
          setUser(user);
          setLoading(false);
        },
      });
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);
    if (loginData.password) {
      const cognitoUser = user;
      cognitoUser.completeNewPasswordChallenge(
        loginData.password,
        {},
        {
          onSuccess: (data) => {
            let isAdmin = false;
            setUserInfo({
              username: data.accessToken.payload.username,
              email: data.idToken.payload.email,
              token: data.accessToken.jwtToken,
              isAdmin: isAdmin,
            });
            sessionStorage.setItem(
              "userInfo",
              JSON.stringify({
                username: data.accessToken.payload.username,
                email: data.idToken.payload.email,
                token: data.accessToken.jwtToken,
                isAdmin: isAdmin,
              })
            );
            setLoading(false);

            navigate("/");
          },
          onFailure: (err) => {
            console.error("onFailure:", err);
            setLoginError(err.message);
            setLoading(false);
          },
        }
      );
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("userInfo")) {
      navigate("/");
    }
  }, []);

  return isFirstTime ? (
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
            This is your first time logging in.
            <br /> Please set a new password for security.
          </div>
          <div className="flex flex-col gap-5 items-center justify-center ">
            <form className="w-full px-10 lg:px-32" onSubmit={changePassword}>
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
  ) : (
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
            Please Login to continue
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
