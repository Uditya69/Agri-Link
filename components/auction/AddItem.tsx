import React, { useState, useEffect } from "react";
import { storage, db, auth } from "../../src/configs/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth"; // Import to get current user

// Zod schema for form validation
const auctionSchema = z.object({
  itemName: z.string().min(1, "Item Name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  pricePerUnit: z.number().min(1, "Price per unit must be at least 1"),
  auctionEndDate: z
    .date()
    .refine(
      (date) => date.getTime() - new Date().getTime() <= 3 * 24 * 60 * 60 * 1000,
      "Auction end date cannot be more than 3 days from today"
    ),
  image: z.any().optional(),
});

const AuctionForm: React.FC = () => {
  const [itemName, setItemName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [auctionEndDate, setAuctionEndDate] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [errors, setErrors] = useState<any>({});
  const [userData, setUserData] = useState<any>(null); // Store logged-in user data
  const navigate = useNavigate();

  // Fetch the current user's data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch user data (for example, from Firestore if more user details are stored there)
        const { displayName, email } = user;
        // Assuming location is stored in Firestore under user profile
        // Fetch it from Firestore if not part of Firebase Auth
        setUserData({ displayName, email, location: "Your default location" }); // Modify location fetch logic as needed
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuctionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData) {
      toast.error("You must be logged in to create an auction");
      return;
    }

    // If loading, prevent further submissions
    if (loading) return;

    const formData = {
      itemName,
      quantity,
      pricePerUnit,
      auctionEndDate: new Date(auctionEndDate),
      image,
    };

    // Validate the form data using Zod
    try {
      auctionSchema.parse(formData);
      setErrors({});
      setLoading(true); // Set loading state to true

      const auctionId = uuidv4(); // Generate a unique auction ID

      let imageUrl = "";

      // Upload the image to Firebase Storage
      if (image) {
        const imageRef = ref(storage, `auctionImages/${auctionId}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Save the auction details in Firestore, including seller's data
      await setDoc(doc(db, "auctions", auctionId), {
        auctionId,
        itemName,
        quantity,
        pricePerUnit,
        auctionEndDate,
        sellerName: userData.displayName, // Get seller's name from user data
        sellerEmail: userData.email,      // Use email or other identifier
        location: userData.location,      // Get location from user data
        imageUrl,
      });

      // Reset form fields
      setItemName("");
      setQuantity(1);
      setPricePerUnit(0);
      setAuctionEndDate("");
      setImage(null);

      setLoading(false); // Set loading state to false
      toast.success("Auction created successfully!");
      navigate("/auctions");
    } catch (error: any) {
      setLoading(false); // Set loading state to false in case of an error
      if (error instanceof z.ZodError) {
        const fieldErrors: any = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error("Error creating auction: " + error.message);
      }
    }
  };

  return (
    <form onSubmit={handleAuctionSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Item Name:</label>
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="w-full p-3 outline-none rounded-lg"
        />
        {errors.itemName && <p className="text-red-500">{errors.itemName}</p>}
      </div>

      <div>
        <label className="block text-gray-700">Quantity:</label>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full p-3 outline-none rounded-lg"
        />
        {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
      </div>

      <div>
        <label className="block text-gray-700">Price per Unit:</label>
        <input
          type="number"
          placeholder="Price per Unit"
          value={pricePerUnit}
          onChange={(e) => setPricePerUnit(Number(e.target.value))}
          className="w-full p-3 outline-none rounded-lg"
        />
        {errors.pricePerUnit && <p className="text-red-500">{errors.pricePerUnit}</p>}
      </div>

      <div>
        <label className="block text-gray-700">Auction End Date:</label>
        <input
          type="date"
          value={auctionEndDate}
          onChange={(e) => setAuctionEndDate(e.target.value)}
          className="w-full p-3 outline-none rounded-lg"
        />
        {errors.auctionEndDate && (
          <p className="text-red-500">{errors.auctionEndDate}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700">Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="w-full p-3 outline-none rounded-lg"
        />
      </div>

      <button
        type="submit"
        disabled={loading} // Disable button while loading
        className={`w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
          loading && "opacity-50 cursor-not-allowed"
        }`}
      >
        {loading ? "Creating Auction..." : "Create Auction"}
      </button>
    </form>
  );
};

export default AuctionForm;
