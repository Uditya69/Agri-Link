import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../src/configs/firebase";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type TopBid = {
  bidAmount: number;
  userId: string;
  userName?: string;
};

const Bid: React.FC = () => {
  const location = useLocation();
  const auction = location.state?.auction;

  const [bidAmount, setBidAmount] = useState<number | "">("");
  const [currentBid, setCurrentBid] = useState<number>(auction.pricePerUnit);
  const [topBids, setTopBids] = useState<TopBid[]>(auction.topBids || []);
  const [currentUser, setCurrentUser] = useState<{ userId: string; role: string; userName?: string } | null>(null);
  const [sellerId, setSellerId] = useState<string | undefined>(auction?.sellerId);
  
  const navigate = useNavigate();

  console.log(auction)
  if (!auction) {
    return <div>No auction data available.</div>;
  }

  // Fetch current user and their name from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({ userId, role: userData.role, userName: userData.name });
        } else {
          console.log("No such user document!");
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch the user's name for each top bid (memoize this function to avoid unnecessary re-renders)
  const fetchUserName = useCallback(async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data().name : "Unknown User";
  }, []);

  // Only fetch names when the topBids change
  useEffect(() => {
    const fetchTopBidNames = async () => {
      const updatedBids = await Promise.all(
        topBids.map(async (bid) => {
          if (!bid.userName) {
            const userName = await fetchUserName(bid.userId);
            return { ...bid, userName };
          }
          return bid;
        })
      );
      setTopBids(updatedBids);
    };

    if (topBids.length > 0) {
      fetchTopBidNames();
    }
  }, [topBids, fetchUserName]);

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBidAmount(value === "" ? "" : Number(value));
  };

  // Handle placing a bid
  const handlePlaceBid = async () => {
    if (bidAmount === "") {
      toast.error("Please enter a valid bid amount.");
      return;
    }

    const newBid = { bidAmount, userId: currentUser?.userId as string };
    const updatedBids = [...topBids, newBid].sort((a, b) => b.bidAmount - a.bidAmount).slice(0, 5);

    setTopBids(updatedBids);

    try {
      const auctionRef = doc(db, "auctions", auction.id);
      await updateDoc(auctionRef, { topBids: updatedBids });
      setCurrentBid(updatedBids[0].bidAmount); // Update current bid with the highest bid
      toast.success("Bid submitted successfully!");
    } catch (error) {
      toast.error("Error submitting bid.");
      console.error("Error updating auction bids:", error);
    }
  };

  const handleChatWithSeller = async () => {
    if (!currentUser) {
      toast.error("You need to be logged in to chat with the seller.");
      return;
    }

    if (!sellerId) {
      toast.error("Seller information is missing.");
      console.error("Error: sellerId is undefined.");
      return;
    }

    const combinedId = sellerId + currentUser.userId; // Unique chat ID combining buyer and seller UID
    const userChatRef = doc(db, "userChats", combinedId);
    const chatRef = doc(db, "chats", combinedId);

    try {
      const chatDoc = await getDoc(userChatRef);

      if (!chatDoc.exists()) {
        // Create a new chat if it doesn't exist
        await setDoc(userChatRef, {
          userId: currentUser.userId,
          sellerId: sellerId, // Ensure sellerId is defined
          combinedId: combinedId,
        });

        // Initialize the chat messages collection for this conversation
        await setDoc(chatRef, {
          messages: [],
        });

        toast.success("Chat started successfully.");
      }

      // Redirect to chat screen with chatId
      navigate(`/chat/${combinedId}`);
    } catch (error) {
      toast.error("Error initiating chat.");
      console.error("Error creating or fetching chat:", error);
    }
  };

  const endDate = auction.auctionEndDate;

  return (
    <div className="max-w-4xl mx-auto pb-[10%]">
      <div className="p-4">
        <img src={auction.imageUrl} alt={auction.itemName} className="w-full h-auto object-cover rounded-lg shadow-lg" />
      </div>

      <div className="text-center mt-4">
        <h2 className="text-3xl font-bold mb-2">Bidding Details</h2>
        <p className="text-gray-500">End Date: {endDate}</p>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-center mb-4">
          <p className="text-lg font-medium text-gray-700">Current Bid:</p>
          <p className="text-2xl font-bold ml-2">₹{currentBid.toFixed(2)} per {auction.unit}</p>
        </div>

        {currentUser?.role === "buyer" && (
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <input
              type="number"
              value={bidAmount === "" ? "" : bidAmount}
              onChange={handleBidChange}
              placeholder="Enter your bid amount"
              className="p-3 border rounded-md w-full sm:w-60"
            />
            <button
              onClick={handlePlaceBid}
              className="bg-green-500 text-white p-3 rounded-md font-bold w-full sm:w-auto"
            >
              Place Bid
            </button>
            <button
              onClick={handleChatWithSeller}
              className="bg-blue-500 text-white p-3 rounded-md font-bold w-full sm:w-auto"
            >
              Chat with Seller
            </button>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Top 5 Bids:</h3>
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-200">Rank</th>
                <th className="px-4 py-2 bg-gray-200">Bid Amount</th>
                <th className="px-4 py-2 bg-gray-200">User Name</th>
              </tr>
            </thead>
            <tbody>
              {topBids.map((bid, index) => (
                <tr key={index} className="text-center border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">₹{bid.bidAmount.toFixed(2)}</td>
                  <td className="px-4 py-2">{bid.userName || "Loading..."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bid;
