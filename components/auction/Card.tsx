import React from "react";
import { useNavigate } from "react-router-dom";
import locationimg from "../../src/assets/shared/location.svg";

interface AuctionCardProps {
  auction: {
    itemName: string;
    quantity: number;
    pricePerUnit: number;
    auctionEndDate: string;
    imageUrl: string;
    auctionId: string;
    location: string;
    unit: string;
  };
  searchLocation: string; 
}

const Card: React.FC<AuctionCardProps> = ({ auction, searchLocation }) => {
  const navigate = useNavigate();

  // Function to highlight the searched location term
  const highlightLocation = (location: string, searchTerm: string) => {
    if (!searchTerm) return location;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = location.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className="max-w-sm border min-w-[350px] border-gray-300 rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 cursor-pointer"
      onClick={() =>
        navigate("/bid", {
          state: { auction },
        })
      }
    >
      {/* Image Section */}
      <div className="relative w-full h-48 bg-white pt-2 pr-2 pl-2 rounded-lg overflow-hidden">
  <img
    src={auction.imageUrl}
    alt={`Image of ${auction.itemName}`}
    className="w-full h-full object-cover rounded-lg"
  />
  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
</div>


      {/* Auction Info */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{auction.itemName}</h3>
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-md">
             #{auction.auctionId}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-2">
          ₹{auction.pricePerUnit}/{auction.unit ? auction.unit : "QT"}
        </p>

        <p className="text-gray-600 text-sm mb-2">Quantity: {auction.quantity}</p>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <img src={locationimg} alt="Location icon" className="w-4 h-4" />
            <span>{highlightLocation(auction.location, searchLocation)}</span>
          </div>
          <p>Ends: {new Date(auction.auctionEndDate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
