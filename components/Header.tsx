import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="lg:px-16 px-4 bg-white flex flex-wrap items-center py-4 shadow-md">
     <div className="flex-1 flex justify-between items-center">
  <Link to="/">
    <img src="../../src/assets/logo3.png" alt="Home" className="h-14 w-auto" />
  </Link>
</div>


      <div className="hidden md:flex flex-grow">
        <nav>
          <ul className="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
            <li>
              <Link
                to="/"
                className="md:p-4 py-3 px-0 block md:mb-0 mb-2 transition-colors duration-300 hover:text-green-500"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/add"
                className="md:p-4 py-3 px-0 block transition-colors duration-300 hover:text-green-500"
              >
                Add Items
              </Link>
            </li>
            <li>
              <Link
                to="/auctions"
                className="md:p-4 py-3 px-0 block transition-colors duration-300 hover:text-green-500"
              >
                Auctions
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="md:p-4 py-3 px-0 block transition-colors duration-300 hover:text-green-500"
              >
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
