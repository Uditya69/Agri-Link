import React from "react";
import { auth } from "../../src/configs/firebase";
import { toast } from "react-toastify";

const Home: React.FC = () => {
  const handleLogout = () => {
    auth.signOut();
    toast.success("You have logged out!");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold">Welcome to the Home Page</h1>
      <p className="mt-4 text-gray-700">
        Only authenticated users can access this page.
      </p>
      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
