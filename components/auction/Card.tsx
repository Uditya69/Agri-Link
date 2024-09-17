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
    unit: string
  };
}


const Card: React.FC<AuctionCardProps> = ({ auction }) => {
  const navigate = useNavigate();

  return (
    <div
      className="max-w-sm border border-gray-300 rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 cursor-pointer"
      onClick={() =>
        navigate("/bidder", {
          state: { auction },
        })
      }
    >
      {/* Image Section */}
      <div className="relative w-full h-48 bg-gray-200">
        <img
          src={auction.imageUrl}
          alt={auction.itemName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Auction Info */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{auction.itemName}</h3>
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-md">
            AID: {auction.auctionId}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-2">
          ₹{auction.pricePerUnit}/{auction.unit?auction.unit: "QT"}
        </p>

        <p className="text-gray-600 text-sm mb-2">
          Quantity: {auction.quantity}
        </p>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <img src={locationimg} alt="location" className="w-4 h-4" />
            <span>{auction.location}</span>
          </div>
          <p>Ends: {new Date(auction.auctionEndDate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
