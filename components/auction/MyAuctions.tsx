import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../src/configs/firebase";
import { getAuth } from "firebase/auth";
import Card from "./Card";
import Loader from "../shared/loader";
import searchIcon from "../../src/assets/shared/search.svg"; // Corrected import path
import crossIcon from "../../src/assets/shared/cross.svg";   // Corrected import path
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
  sellerId: string; // Assuming the sellerId field exists in the auction
}

const MyAuction: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null); // State to store user role
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAuctions = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const userId = user.uid;

          // Fetch auctions where sellerId matches current user's UID
          const auctionRef = collection(db, "auctions");
          const q = query(auctionRef, where("sellerId", "==", userId));
          const auctionSnapshot = await getDocs(q);

          const auctionList = auctionSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            location: typeof doc.data().location === "string" ? doc.data().location : "",
          })) as Auction[];

          setAuctions(auctionList);
        } else {
          console.error("No user is currently logged in.");
        }
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
            setUserRole(userData.role || null); // Assuming userData has a `role` field
          } else {
            console.error("No user data found.");
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserAuctions();
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
    navigate("/additems");
  };

  if (loading) {
    return <Loader />;
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
          <img src={searchIcon} alt="Search" />
        </div>
      </div>

      {userRole !== "buyer" && (
        <div className="w-full flex justify-end px-5">
          <button
            onClick={handleAdd}
            className="w-fit flex flex-row items-center gap-2 p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            <p>Add Auction</p>
            <img src={crossIcon} alt="Add" className="invert" />
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

export default MyAuction;
