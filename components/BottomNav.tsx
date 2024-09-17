import React from 'react';
import { Link } from 'react-router-dom';
import '../src/css/bottomNav.css'; 

const BottomNav: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <Link to="/" className="nav-item">
        <span className="nav-icon"><i className="fa-solid fa-house"></i></span>
        <span className="nav-text font-mono">Home</span>
      </Link>
      <Link to="/add" className="nav-item">
        <span className="nav-icon font-mono"><i className="fa-brands fa-rocketchat"></i></span>
        <span className="nav-text font-mono">Add Item</span>
      </Link>
      <Link to="/auctions" className="nav-item">
        <span className="nav-icon"><i className="fa-solid fa-info"></i></span>
        <span className="nav-text font-mono" >Auction</span>
      </Link>
      <Link to="/profile" className="nav-item">
        <span className="nav-icon"><i className="fa-solid fa-user"></i></span>
        <span className="nav-text font-mono">Profile</span>
      </Link>
    </nav>
  );
}

export default BottomNav;
