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
    <div className="bottom-nav">
      <Link to="/home" className="nav-item">
        <span className="nav-icon"><i className="fa-solid fa-house"></i></span>
        <span className="nav-text font-mono">Home</span>
      </Link>
      
      <Link to="/auctions" className="nav-item">
        <span className="nav-icon"><i className="fa-solid fa-info"></i></span>
        <span className="nav-text font-mono">Auction</span>
      </Link>
      
      <Link to="/profile" className="nav-item">
        <span className="nav-icon"><i className="fa-solid fa-user"></i></span>
        <span className="nav-text font-mono">Profile</span>
      </Link>
    </div>
  );
}

export default BottomNav;
