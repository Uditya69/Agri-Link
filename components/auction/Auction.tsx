import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../src/configs/firebase";
import Card from "./Card"; // Assuming you have a Card component

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
  const navigate = useNavigate();

  // Fetch auction data from Firestore
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {auctions.length > 0 ? (
        auctions.map((auction) => (
          <div
            key={auction.id}
            onClick={() =>
              navigate("/bidder", {
                state: { auction }, // Passing auction data to the bidder page
              })
            }
          >
            <Card auction={auction} />
          </div>
        ))
      ) : (
        <div>No active auctions available.</div>
      )}
    </div>
  );
};

export default AuctionPage;
