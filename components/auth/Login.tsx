import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../src/utils/firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import usePasswordToggle from "../../src/hooks/usePasswordToggle";
import visibleicon from "../../src/assets/auth/visible.svg";
import hiddenicon from "../../src/assets/auth/hidden.svg";
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
    <form onSubmit={handleLogin} className="space-y-4 ">
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">Email:</label>
        <input
          type="email"
          placeholder="hi@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 outline-none rounded-lg"
        />
      </div>
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">Password:</label>
        <div className="relative">
          <input
            type={type}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 outline-none rounded-lg"
          />
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500"
          >
            <img src={visible ? visibleicon : hiddenicon} alt="" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
        >
          Log In
        </button>
      </div>

      <div className="text-sm text-center">
        <button
          type="button"
          onClick={handlePasswordReset}
          className="text-red-500 hover:underline"
        >
          Forgot Password?
        </button>
      </div>
    </form>
  );
};

export default Login;
