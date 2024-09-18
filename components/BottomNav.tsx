import React from "react";
import { Link, useLocation } from "react-router-dom";
import auctionicon from "../src/assets/bottomnav/auction.svg";
import homeicon from "../src/assets/bottomnav/home.svg";
import profileicon from "../src/assets/bottomnav/profile.svg";

const BottomNav: React.FC = () => {
  const location = useLocation();
  const hiddenRoutes = ["/auth"];
  const shouldShowBottomNav = !hiddenRoutes.includes(location.pathname);

  if (!shouldShowBottomNav) {
    return null;
  }

  return (
    <div className=" sm:block md:hidden">
      <div className="fixed  bottom-0 w-full flex justify-around items-center bg-white border-t border-gray-200 p-2 shadow-md transition-colors duration-300 hover:bg-gray-100">
        <Link
          to="/"
          className="flex flex-col items-center text-gray-700 hover:text-green-500 transition-transform duration-300 hover:scale-110"
        >
          <img src={homeicon} alt="home" className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          to="/auctions"
          className="flex flex-col items-center text-gray-700 hover:text-green-500 transition-transform duration-300 hover:scale-110"
        >
          <img src={auctionicon} alt="auction" className="w-6 h-6" />
          <span className="text-xs mt-1">Auction</span>
        </Link>

        <Link
          to="/profile"
          className="flex flex-col items-center text-gray-700 hover:text-green-500 transition-transform duration-300 hover:scale-110"
        >
          <img src={profileicon} alt="profile" className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
