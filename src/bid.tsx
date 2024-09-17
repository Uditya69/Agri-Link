import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Bid: React.FC = () => {
  const location = useLocation();
  const auction = location.state?.auction;

  // If auction data is not available, handle accordingly
  if (!auction) {
    return <div>No auction data available.</div>;
  }

  const [bidAmount, setBidAmount] = useState<number | ''>(''); // For bid price
  const [quantity, setQuantity] = useState<number | ''>(''); // For quantity of the item
  const [currentBid, setCurrentBid] = useState<number>(auction.pricePerUnit); // Initial bid set to auction's pricePerUnit

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBidAmount(value === '' ? '' : Number(value));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(value === '' ? '' : Number(value));
  };

  const handlePlaceBid = () => {
    if (typeof bidAmount !== 'number' || bidAmount <= currentBid) {
      alert(`Bid must be higher than the current bid of ₹${currentBid.toFixed(2)}.`);
      return;
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    // Update current bid and reset fields
    setCurrentBid(bidAmount);
    setBidAmount('');
    setQuantity('');
    alert(`Bid placed successfully for ${quantity} units at ₹${bidAmount.toFixed(2)} per unit!`);
  };

  // Calculate total price based on quantity and current bid
  const totalPrice = (typeof quantity === 'number' && quantity > 0) ? quantity * currentBid : 0;

  // Format the auction end date
  const endDate = new Date(auction.endDate);
  const formattedEndDate = endDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div>
      {/* Auction Image Section */}
      <div className="m-4 p-4">
  <img 
    src={auction.imageUrl} 
    alt={auction.itemName} 
    className="max-w-full h-auto"
  />
</div>


      {/* Auction Details */}
      <div className="flex items-center justify-center">
  <h2 className="text-center">
    Bidding details
  </h2>
</div>


      <div id="outer" className='border-solid'>
        <div id="inner1" className='flex flex-row p-2 m-7 justify-between '>
            <div id="pic">
                <img src="https://picsum.photos/200/300" alt="" className='rounded-full h-10 w-10'/>
            </div>
            <div id="end">
                {/* Auction End Date */}
                <p>End Date: {formattedEndDate}</p>
            </div>
        </div>
        <div id="inner2">
            <p className='ml-4'>Description</p>
            <div 
  id='description' 
  className='border border-solid border-black h-48 w-50 m-4 '
></div>
        </div>
      </div>
      <div>
      <p className='text-gray-700 text-lg font-medium'>Current Bid: </p>

  <p className="text-xl font-bold text-black-600 mt-2 mb-4">
  ₹{currentBid.toFixed(2)} per {auction.unit}
   </p>


        {/* Bid Input */}
        <input
          type="number"
          value={bidAmount === '' ? '' : bidAmount}
          onChange={handleBidChange}
          placeholder="Enter your bid amount"
          min={currentBid + 1} // This ensures the user can't input a value lower than the current bid
        />

        {/* Quantity Input */}
        <br />
        <input
          type="number"
          value={quantity === '' ? '' : quantity}
          onChange={handleQuantityChange}
          placeholder="Enter quantity"
          min={1} // Minimum quantity should be 1

        />

        {/* Total Price Display */}
        {quantity && bidAmount && (
          <p className="mt-2 text-gray-700">
            Total Price: ₹{totalPrice.toFixed(2)} for {quantity} {auction.unit}
          </p>
        )}

        {/* Place Bid Button */}
        <br />
        <div className="flex justify-center">
  <button onClick={handlePlaceBid} className="ml-2">
    Place Bid
  </button>
</div>

      </div>
    </div>
  );
};

export default Bid;
