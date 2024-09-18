import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../src/configs/firebase";
import { getAuth } from "firebase/auth";
import Card from "../../../components/auction/Card";
import Loader from "../../../components/shared/loader";
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
  sellerId: string; // Assuming you store the seller's UID in auctions
}

const MyAuctions: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userAuctions, setUserAuctions] = useState<Auction[]>([]); // State for user's auctions
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
            setUserRole(userData.role || null);
            fetchUserAuctions(user.uid, userData.role); // Fetch auctions based on role
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

    const fetchUserAuctions = async (userId: string, role: string) => {
      try {
        let auctionQuery;
        if (role === "seller") {
          // Query auctions where the logged-in user is the seller
          auctionQuery = query(collection(db, "auctions"), where("sellerId", "==", userId));
        } else if (role === "buyer") {
          // Assuming there's a field in auction to track buyers, customize as needed
          // auctionQuery = query(collection(db, "auctions"), where("buyerId", "==", userId)); (implement this based on your schema)
          auctionQuery = query(collection(db, "auctions"), where("participants", "array-contains", userId)); // Example for buyers
        }

        if (auctionQuery) {
          const auctionSnapshot = await getDocs(auctionQuery);
          const auctionList = auctionSnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          }) as Auction[];
          setUserAuctions(auctionList);
        }
      } catch (error) {
        console.error("Error fetching user auctions:", error);
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

  

  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      {userRole === "seller" && userAuctions.length > 0 ? (
        <div>
          <h2>Your Auctions:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mb-[10%]">
            {userAuctions.map((auction) => (
              <div key={auction.id}>
                <Card auction={auction} searchLocation={searchTerm} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>No auctions found for your account.</div>
      )}
    </div>
  );
};

export default MyAuctions;
