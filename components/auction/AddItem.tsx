import React, { useState, useEffect } from "react";
import { storage, db, auth } from "../../src/configs/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

// Zod schema for form validation
const auctionSchema = z.object({
  itemName: z.string().min(1, "Item Name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  pricePerUnit: z.number().min(1, "Price per unit must be at least 1"),
  auctionEndDate: z.date().refine(
    (date) => date.getTime() - new Date().getTime() <= 3 * 24 * 60 * 60 * 1000,
    "Auction end date cannot be more than 3 days from today"
  ),
  image: z.any().optional(),
});

const AuctionForm: React.FC = () => {
  const [itemName, setItemName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>("kg");
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [auctionEndDate, setAuctionEndDate] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  // Get the current date formatted as "YYYY-MM-DD"
  const auctionStartDate: string = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { displayName, email } = user;
        setUserData({ displayName, email, location: "Default location" });
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

    if (loading) return;

    const formData = {
      itemName,
      quantity,
      unit,
      pricePerUnit,
      auctionEndDate: new Date(auctionEndDate),
      image,
    };

    try {
      auctionSchema.parse(formData);
      setErrors({});
      setLoading(true);

      const auctionId = uuidv4();
      let imageUrl = "";

      if (image) {
        const imageRef = ref(storage, `auctionImages/${auctionId}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await setDoc(doc(db, "auctions", auctionId), {
        auctionId,
        itemName,
        quantity,
        unit,
        pricePerUnit,
        auctionStartDate,
        auctionEndDate,
        sellerName: userData.displayName,
        sellerEmail: userData.email,
        location: userData.location,
        imageUrl,
      });

      setItemName("");
      setQuantity(1);
      setUnit("kg");
      setPricePerUnit(0);
      setAuctionEndDate("");
      setImage(null);
      setLoading(false);
      toast.success("Auction created successfully!");
      navigate("/auctions");
    } catch (error: any) {
      setLoading(false);
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
    <form onSubmit={handleAuctionSubmit} className="space-y-4 p-4">
      <div>
        <label className="block text-gray-700">Item Name:</label>
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
          className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
        {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
      </div>
  
      <div>
        <label className="block text-gray-700">Unit:</label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="kg">Kilogram (kg)</option>
          <option value="ton">Ton</option>
          <option value="quintal">Quintal</option>
        </select>
        {errors.unit && <p className="text-red-500">{errors.unit}</p>}
      </div>
  
      <div>
        <label className="block text-gray-700">Price per Unit:</label>
        <input
          type="number"
          placeholder="Price per Unit"
          value={pricePerUnit}
          onChange={(e) => setPricePerUnit(Number(e.target.value))}
          className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
        {errors.pricePerUnit && (
          <p className="text-red-500">{errors.pricePerUnit}</p>
        )}
      </div>
  
      <div>
        <label className="block text-gray-700">Auction End Date:</label>
        <input
          type="date"
          value={auctionEndDate}
          onChange={(e) => setAuctionEndDate(e.target.value)}
          className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
          onChange={(e) =>
            setImage(e.target.files ? e.target.files[0] : null)
          }
          className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>
  
      <button
        type="submit"
        disabled={loading}
        className={`w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 ${
          loading && "opacity-50 cursor-not-allowed"
        }`}
      >
        {loading ? "Creating Auction..." : "Create Auction"}
      </button>
    </form>
  );
  
};

export default AuctionForm;
