// src/components/Signup.tsx
import React, { useState } from "react";
import { auth, db } from "../../src/utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import usePasswordToggle from "../../src/hooks/usePasswordToggle";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const { type, toggleVisibility, visible } = usePasswordToggle(); 
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        phone,
        email,
        uid: user.uid,
      });

      alert("User registered successfully!");
    } catch (error: any) {
      console.error("Error signing up: ", error);
      alert("Error signing up: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div>
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-gray-700">Password</label>
        <div className="relative">
          <input
            type={type} 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500"
          >
            {visible ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-gray-700">Phone</label>
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
      >
        Sign Up
      </button>
    </form>
  );
};

export default Signup;