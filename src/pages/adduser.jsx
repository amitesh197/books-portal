import React, { useState } from "react";
import { auth } from "../firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useGlobalContext } from "../context/globalContext";
import { Toaster, toast } from "react-hot-toast";

function Adduser() {
  const { setUserInfo } = useGlobalContext();

  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
  });

  const [signupError, setSignupError] = useState(null);

  const signupHandler = async () => {
    setSignupError(null);
    if (signupData.email && signupData.password) {
      try {
        console.log("sending");
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          signupData.email,
          signupData.password
        );
        const user = userCredentials.user;
        setUserInfo({ email: user.email, isAdmin: false });
        toast.success("user created");
      } catch (err) {
        console.log("error is ", err.message);
        setSignupError(err.message);
      }
    }
  };

  return (
    <div className="flex justify-center">
      <Toaster />
      <div className="w-full flex flex-col md:flex-row mt-10 items-center justify-evenly ">
        {/* login */}
        <div className="w-64 text-slate-300 flex flex-col mt-10 md:mt-0 ">
          <p className=" text-donkey-rose font-medium text-2xl text-center">
            Add User
          </p>
          <input
            type="email"
            className=" bg-background-dark-gray rounded-md px-2 py-2 my-1 text-black outline-none focus:border-2 focus:border-donkey-rose"
            placeholder="email"
            onChange={(e) =>
              setSignupData((prev) => ({ ...prev, email: e.target.value }))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                signupHandler();
              }
            }}
          />
          <input
            className=" bg-background-dark-gray rounded-md px-2 py-2 my-1 text-black outline-none focus:border-2 focus:border-donkey-rose"
            placeholder="password"
            type="password"
            onChange={(e) =>
              setSignupData((prev) => ({ ...prev, password: e.target.value }))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                signupHandler();
              }
            }}
          />
          <span className="text-md text-red-500">{signupError}</span>
          <button
            className=" bg-gray-600  hover:bg-gray-500 active:bg-gray-400   p-2 w-full rounded-md mt-2"
            onClick={signupHandler}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Adduser;
