import React from 'react';
import { Link } from 'react-router-dom';
import '.././src/css/header.css';

const Header: React.FC = () => {
  return (
    <div className='header'>
      <ul className="nav-links">
        <li className="nav-item">
          <Link to="/home/weather">Weather</Link> {}
        </li>
        <li className="nav-item">
          <Link to="/add">Add Item</Link> {/* Navigates to Add Item component */}
        </li>
        <li className="nav-item">
          <Link to="/auctions">Auctions</Link> {/* Navigates to Auctions component */}
        </li>
        <li className="nav-item">
          <Link to="/profile">Profile</Link> {/* Navigates to Profile component */}
        </li>
      </ul>
    </div>
  );
};

export default Header;
