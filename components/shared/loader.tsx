import React from "react";
import "./loader.css"; // External CSS for the spinner animation

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative">
        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden">
          <img
            src="../../src/assets/shared/logo.svg" // replace with your image
            alt="Loading"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Spinning Circle */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="spinner-circle w-4 h-40 sm:w-2 sm:h-52 md:w-6 md:h-64 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
