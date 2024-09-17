import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../src/configs/firebase";
import { getAuth } from "firebase/auth";
import Card from "./Card";
import Loader from "../shared/loader";
import search from "../../src/assets/shared/search.svg";
import cross from "../../src/assets/shared/cross.svg";
import { useNavigate } from "react-router-dom";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null); // State to store user role
  const navigate = useNavigate();

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
            location: typeof data.location === "string" ? data.location : "",
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

    const fetchUserRole = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            console.log(userData)
            setUserRole(userData.role || null); // Assuming userData has a `role` field
          } else {
            console.error("No user data found.");
          }
        } else {
          console.error("No user is currently logged in.");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchAuctions();
    fetchUserRole();
  }, []);

  const filteredAuctions = auctions.filter((auction) => {
    const searchLower = searchTerm.toLowerCase();
    const locationLower = auction.location.toLowerCase();
    const itemNameLower = auction.itemName.toLowerCase();

    return (
      locationLower.includes(searchLower) || itemNameLower.includes(searchLower)
    );
  });

  const handleAdd = () => {
    navigate('/additems');
  };

  if (loading) {
    return <Loader/>;

  }

  return (
    <div>
      <div className="relative m-6">
        <input
          type="text"
          placeholder="Search by location or item name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 pl-10 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <img src={search} alt="" />
        </div>
      </div>
      {userRole !== "buyer" && ( // Conditionally render button
        <div className="w-full flex justify-end px-5">
          <button
            onClick={handleAdd}
            className="w-fit flex flex-row items-center gap-2 p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            <p>Add Auction</p>
            <img src={cross} alt="cross" className="invert" />
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mb-[10%]">
        {filteredAuctions.length > 0 ? (
          filteredAuctions.map((auction) => (
            <div key={auction.id}>
              <Card auction={auction} searchLocation={searchTerm} />
            </div>
          ))
        ) : (
          <div>No active auctions available.</div>
        )}
      </div>
    </div>
  );
};

export default AuctionPage;
