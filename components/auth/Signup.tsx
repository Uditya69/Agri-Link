import React, { useState } from "react";
import { auth, db, storage } from "../../src/configs/firebase"; // Import storage as well
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import usePasswordToggle from "../../src/hooks/usePasswordToggle";
import visibleicon from "../../src/assets/auth/visible.svg";
import hiddenicon from "../../src/assets/auth/hidden.svg";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [role, setRole] = useState<string>("buyer");
  const [gstNumber, setGstNumber] = useState<string>("");
  const [farmerCardNumber, setFarmerCardNumber] = useState<string>("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const { type, toggleVisibility, visible } = usePasswordToggle();
  const navigate = useNavigate();

  const checkIfEmailExists = async () => {
    const userDoc = await getDoc(doc(db, "users", email));
    return userDoc.exists();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the email already exists
    const emailExists = await checkIfEmailExists();
    if (emailExists) {
      toast.error("Email already exists. Please use another email.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let profilePicUrl = "";

      // Upload the profile picture to Firebase Storage
      if (profilePic) {
        const profilePicRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(profilePicRef, profilePic);
        profilePicUrl = await getDownloadURL(profilePicRef); // Get the download URL
      }

      // Save the user's data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        phone,
        email,
        uid: user.uid,
        city,
        pin,
        address,
        state,
        gender,
        dob,
        role,
        gstNumber: role === "buyer" ? gstNumber : null,
        farmerCardNumber: role === "seller" ? farmerCardNumber : null,
        profilePicUrl,
      });

      // Reset form fields and navigate to login page
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
      setCity("");
      setPin("");
      setAddress("");
      setState("");
      setGender("");
      setDob("");
      setRole("buyer");
      setGstNumber("");
      setFarmerCardNumber("");
      setProfilePic(null);

      navigate("/auth");
      toast.success("User registered successfully!");
    } catch (error: any) {
      console.error("Error signing up: ", error);
      toast.error("Error signing up: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">Name:</label>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 outline-none rounded-lg"
        />
      </div>
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">Email:</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 outline-none rounded-lg"
        />
      </div>
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">Password:</label>
        <div className="relative">
          <input
            type={type}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 outline-none rounded-lg"
          />
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500"
          >
            <img src={visible ? visibleicon : hiddenicon} alt="" />
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">Phone:</label>
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 outline-none rounded-lg"
        />
      </div>

      {/* Location fields */}
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">City:</label>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-3 outline-none rounded-lg"
        />
      </div>
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">PIN:</label>
        <input
          type="text"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full p-3 outline-none rounded-lg"
        />
      </div>
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">Address:</label>
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-3 outline-none rounded-lg"
        />
      </div>
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">State:</label>
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full p-3 outline-none rounded-lg"
        />
      </div>

      {/* Gender, DOB, and Role */}
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">Gender:</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full p-3 outline-none rounded-lg"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">Date of Birth:</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full p-3 outline-none rounded-lg"
        />
      </div>
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 outline-none rounded-lg"
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
      </div>

      {/* Conditional GST or Farmer Card */}
      {role === "buyer" ? (
        <div className="flex flex-row items-center">
          <label className="block text-gray-700">GST Number:</label>
          <input
            type="text"
            placeholder="GST Number"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
            className="w-full p-3 outline-none rounded-lg"
          />
        </div>
      ) : (
        <div className="flex flex-row items-center">
          <label className="block text-gray-700">Farmer Card Number:</label>
          <input
            type="text"
            placeholder="Farmer Card Number"
            value={farmerCardNumber}
            onChange={(e) => setFarmerCardNumber(e.target.value)}
            className="w-full p-3 outline-none rounded-lg"
          />
        </div>
      )}

      {/* Profile Picture Upload */}
      <div className="flex flex-row items-center">
        <label className="block text-gray-700">Profile Picture:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files ? e.target.files[0] : null)}
          className="w-full p-3 outline-none rounded-lg"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Sign Up
      </button>
    </form>
  );
};

export default Signup;
