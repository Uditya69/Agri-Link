// src/components/Signup.tsx
import React, { useState } from "react";
import { auth, db } from "../../src/utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import usePasswordToggle from "../../src/hooks/usePasswordToggle";
import visibleicon from "../../src/assets/auth/visible.svg";
import hiddenicon from "../../src/assets/auth/hidden.svg";
import { toast } from "react-toastify";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const { type, toggleVisibility, visible } = usePasswordToggle();
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        phone,
        email,
        uid: user.uid,
      });

      toast.success("User registered successfully!");
    } catch (error: any) {
      console.error("Error signing up: ", error);
      toast.error("Error signing up: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">Name:</label>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 outline-none rounded-lg"
        />
      </div>
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">Email:</label>
        <input
          type="email"
          placeholder="Email"
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
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">Phone:</label>
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 outline-none rounded-lg"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
      >
        Sign Up
      </button>
    </form>
  );
};

export default Signup;
