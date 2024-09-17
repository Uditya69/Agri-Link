import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../src/configs/firebase";
import Card from "./Card"; 

interface Auction {
  id: string;
  auctionEndDate: string;
  auctionStartDate: string;
  imageUrl: string;
  itemName: string;
  location: string;
  pricePerUnit: number;
  quantity: number;
  sellerEmail: string;
  sellerName: string | null;
  unit: string;
  auctionId: string;
}

const AuctionPage: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [searchLocation, setSearchLocation] = useState(""); // State for search input
=======
  const [searchLocation, setSearchLocation] = useState(""); 
>>>>>>> cd3c4df8f6f32814e7aaaf972160e14b30aeddd7

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const auctionRef = collection(db, "auctions");
        const auctionSnapshot = await getDocs(auctionRef);
        const auctionList = auctionSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Auction[];

        // Filter auctions where auctionEndDate is not past
        const now = new Date();
        const filteredAuctions = auctionList.filter((auction) => {
          const endDate = new Date(auction.auctionEndDate);
          return endDate >= now;
        });

        setAuctions(filteredAuctions);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const filteredAuctions = auctions.filter((auction) =>
    auction.location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="relative m-6">
        <input
          type="text"
          placeholder="Search by location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="p-3 pl-10 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filteredAuctions.length > 0 ? (
          filteredAuctions.map((auction) => (
            <div key={auction.id}>
              <Card auction={auction} searchLocation={""} />
            </div>
          ))
        ) : (
          <div>No active auctions available for this location.</div>
        )}
      </div>
    </div>
  );
};

export default AuctionPage;
