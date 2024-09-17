import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center w-full m-auto  h-screen  p-4">
      <div className="flex flex-col overflow-scroll  min-h-[55%] min-w-[40%]  items-center justify-between m-auto p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-between gap-5 mb-6 border-b border-gray-300">
          <button
            className={`pb-2 text-lg font-semibold ${
              isLogin
                ? "text-green-500 border-b-2 border-green-500"
                : "text-gray-500"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`pb-2 text-lg font-semibold ${
              !isLogin
                ? "text-green-500 border-b-2 border-green-500"
                : "text-gray-500"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <div className=" flex justify-center items-center m-auto">{isLogin ? <Login /> : <Signup />}</div>
      </div>
    </div>
  );
};

export default Auth;
