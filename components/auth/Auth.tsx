import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-between mb-6 border-b border-gray-300">
          <button
            className={`pb-2 text-lg font-semibold ${
              isLogin
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`pb-2 text-lg font-semibold ${
              !isLogin
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <div className="mt-4">{isLogin ? <Login /> : <Signup />}</div>
      </div>
    </div>
  );
};

export default Auth;
