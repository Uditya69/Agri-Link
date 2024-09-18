import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../src/css/bottomNav.css'; 

const BottomNav: React.FC = () => {
  const location = useLocation();

  // Define routes where the BottomNav should not be shown
  const hiddenRoutes = ['/auth'];

  // Check if the current route is one of the hidden routes
  const shouldShowBottomNav = !hiddenRoutes.includes(location.pathname);

  if (!shouldShowBottomNav) {
    return null; // Do not render BottomNav
  }


  return (
    <div className="fixed bottom-0 w-full bg-white h-16 flex justify-around items-center rounded-t-lg shadow-lg">
      <Link to="/home" className="flex flex-col items-center text-black hover:text-green-400">
        <i className="fa-solid fa-house text-2xl"></i>
      </Link>

      <Link to="/auctions" className="flex flex-col items-center text-black hover:text-green-400">
  <img src="../../src/assets/auction.png" alt="Auction" className="w-8 h-8" />
</Link>


      <Link to="/profile" className="flex flex-col items-center text-black hover:text-green-400">
        <i className="fa-solid fa-user text-2xl"></i>
      </Link>
    </div>
  );
}

export default BottomNav;
