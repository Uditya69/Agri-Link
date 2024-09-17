import React, { useState } from 'react';
import '../src/css/home.css';
const Home: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: string) => {
    setClickedItem(item); // Store clicked item to highlight it
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle btn btn-light"
      >
        Farm-Link
      </button>
      {isOpen && (
        <div
          className="dropdown-content w-300 py-4 absolute mt-2 bg-white shadow-lg rounded-lg animate-fadeIn"
          style={{ transition: 'all 0.3s ease' }}
        >
          <div className="menu menu-default flex flex-col w-full">
            <div className="menu-item">
              <a
                className={`menu-link flex items-center p-4 hover:bg-gray-100 ${clickedItem === 'item1' ? 'text-green-500' : ''}`}
                href="#"
                onClick={() => handleItemClick('item1')}
              >
                <span className="menu-icon mr-2">
                  <i className="ki-outline ki-badge" />
                </span>
                <span className="menu-title">Live Weather Update</span>
              </a>
            </div>
            <div className="menu-item">
              <a
                className={`menu-link flex items-center p-4 hover:bg-gray-100 ${clickedItem === 'item2' ? 'text-green-500' : ''}`}
                href="#"
                onClick={() => handleItemClick('item2')}
              >
                <span className="menu-icon mr-2">
                  <i className="ki-outline ki-profile-circle" />
                </span>
                <span className="menu-title">Government Schemes</span>
              </a>
            </div>
            

          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
