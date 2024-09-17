import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../src/configs/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import usePasswordToggle from "../../src/hooks/usePasswordToggle";
import visibleicon from "../../src/assets/auth/visible.svg";
import hiddenicon from "../../src/assets/auth/hidden.svg";
import logo from "../../src/assets/shared/logo.svg"
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { type, toggleVisibility, visible } = usePasswordToggle();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      navigate("/home");
    } catch (error: any) {
      console.error("Error logging in: ", error);

      if (error.code === "auth/user-not-found") {
        toast.error("User not found. Please sign up.");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Wrong password. Please try again.");
      } else {
        toast.error("Error logging in: " + error.message);
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.warn("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent.");
    } catch (error: any) {
      console.error("Error sending password reset email: ", error);
      toast.error("Error sending password reset email: " + error.message);
    }
  };

  return (
    <div >
    {/* Centered Logo Section */}
    <div className="flex flex-col items-center justify-center mb-8">
      <img
        src={logo}
        alt="Logo"
        className="w-32"
      />
    </div>
      {/* Login Form */}
      <div className="w-full max-w-sm">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Your email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="hi@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Choose a password
            </label>
            <div className="relative">
              <input
                id="password"
                type={type}
                placeholder="min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
              >
                <img src={visible ? visibleicon : hiddenicon} alt="Toggle Password Visibility" />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            Log In
          </button>
          <div className="text-sm text-center mt-4">
            <button
              type="button"
              onClick={handlePasswordReset}
              className="text-red-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </form>

       
        </div>
      </div>
  );
};

export default Login;
