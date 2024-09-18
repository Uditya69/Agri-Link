import {useEffect,useState} from 'react';
import Card from './auction/Card'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../src/configs/firebase';
import Loader from './shared/loader';

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

const AuctionCarousel = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  //@ts-ignore
  const [searchTerm, setSearchTerm] = useState(""); 
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const auctionRef = collection(db, "auctions");
        const auctionSnapshot = await getDocs(auctionRef);
        const auctionList = auctionSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            location: typeof data.location === 'string' ? data.location : '',
          };
        }) as Auction[];

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
  }, []); // Ensure no direct call here triggers re-render

  const filteredAuctions = auctions.filter((auction) => {
    const searchLower = searchTerm.toLowerCase();
    const locationLower = auction.location.toLowerCase();
    const itemNameLower = auction.itemName.toLowerCase();
    return locationLower.includes(searchLower) || itemNameLower.includes(searchLower);
  });

  if (loading) {
    return <Loader />;
  }

  return (
<div className="flex flex-row gap-4 p-4 mb-[10%] h-[500px] overflow-y-auto  w-full">
  {filteredAuctions.length > 0 ? (
    filteredAuctions.map((auction) => (
      <div key={auction.id}>
        <Card auction={auction} searchLocation={""} />
      </div>
    ))
  ) : (
    <div>No active auctions available for this search term.</div>
  )}
</div>


  
  );
};

export default AuctionCarousel;