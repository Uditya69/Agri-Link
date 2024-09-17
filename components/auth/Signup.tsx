import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../../src/configs/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import usePasswordToggle from "../../src/hooks/usePasswordToggle";
import visibleicon from "../../src/assets/auth/visible.svg";
import hiddenicon from "../../src/assets/auth/hidden.svg";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../shared/loader";


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
  const [profilePicPreview, setProfilePicPreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // New state for loading
  const { type, toggleVisibility, visible } = usePasswordToggle();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocationData = async () => {
      if (pin.length === 6) {
        setLoading(true); // Set loading to true before starting fetch
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
          const data = await response.json();

          if (data[0].Status === "Success") {
            const locationData = data[0].PostOffice[0];
            setCity(locationData.District);
            setState(locationData.State);
            setAddress(locationData.Division);
          } else {
            toast.error("Invalid PIN. Please check the PIN.");
          }
        } catch (error) {
          toast.error("Error fetching location data. Please try again.");
        } finally {
          setLoading(false); // Set loading to false after fetch completes
        }
      }
    };

    fetchLocationData();
  }, [pin]);

 

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when signup starts

    // Required fields for everyone
    const requiredFields = [
      email,
      password,
      name,
      phone,
      city,
      pin,
      address,
      state,
      gender,
      dob,
    ];

    // Check for empty fields
    const hasEmptyFields = requiredFields.some((field) => field.trim() === "");

    // GST Number and Farmer Card Number should be required based on role
    if (role === "buyer" && gstNumber.trim() === "") {
      toast.error("Please provide GST Number for buyers.");
      setLoading(false); // Set loading to false on error
      return;
    }

    if (role === "seller" && farmerCardNumber.trim() === "") {
      toast.error("Please provide Farmer Card Number for sellers.");
      setLoading(false); // Set loading to false on error
      return;
    }

    // If any required field is empty, show error
    if (hasEmptyFields) {
      toast.error("Please fill in all required fields.");
      setLoading(false); // Set loading to false on error
      return;
    }

    // Continue with the signup process if no fields are empty
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let profilePicUrl = "";

      // Upload the profile picture to Firebase Storage if provided
      if (profilePic) {
        const profilePicRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(profilePicRef, profilePic);
        profilePicUrl = await getDownloadURL(profilePicRef);
      }

      // Save the user's data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        phone,
        email,
        uid: user.uid,
        location: [state, city, address,pin],
        gender,
        dob,
        role,
        gstNumber: role === "buyer" ? gstNumber : null,
        farmerCardNumber: role === "seller" ? farmerCardNumber : null,
        profilePicUrl,
      });

      // Reset form fields
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
      setProfilePicPreview("");

      navigate("/auth");
      toast.success("User registered successfully!");
    } catch (error: any) {
      console.error("Error signing up: ", error);

      // Specific Firebase error handling
      switch (error.code) {
        case "auth/email-already-in-use":
          toast.error("This email is already in use.");
          break;
        case "auth/weak-password":
          toast.error("Password is too weak. Please use a stronger password.");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email. Please use a correct format.");
          break;
        default:
          toast.error("Error signing up: " + error.message);
      }
    } finally {
      setLoading(false); // Set loading to false after process ends
    }
  };

  // Function to handle profile picture change and preview
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-screen p-4">
          <div>
            <div>
              <Loader />
              <span className="visually-hidden"></span>
            </div>
          </div>
        </div>
      ) : (
<form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
  <div className="mb-4 flex flex-row items-center">
    <label className="block text-gray-700 text-sm font-bold mb-2 mr-4">Name:</label>
    <input
      type="text"
      placeholder="Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="shadow appearance-none border ml-{10rem} rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-4 flex flex-row items-center">
    <label className="block text-gray-700 text-sm font-bold mb-2 mr-4">Email:</label>
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-4 flex flex-row items-center flex-grow">
    <label className="block text-gray-700 text-sm font-bold mb-2 mr-4">Password:</label>
    <div className="relative">
      <input
        type={type}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
      >
        <img src={visible ? visibleicon : hiddenicon} alt="Toggle Password Visibility" />
      </button>
    </div>
  </div>

  <div className="mb-4 flex flex-row items-center mt-4">
    <label className="block text-gray-700 text-sm font-bold mb-2 mr-4">Phone:</label>
    <input
      type="text"
      placeholder="Phone"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-4 flex flex-row items-center">
    <label className="block text-gray-700 text-sm font-bold mb-2 mr-4">PIN:</label>
    <input
      type="text"
      placeholder="PIN"
      value={pin}
      onChange={(e) => setPin(e.target.value)}
      className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-4 flex flex-row items-center">
    <label className="block text-gray-700 text-sm font-bold mb-2 mr-4">City:</label>
    <input
      type="text"
      placeholder="City"
      value={city}
      onChange={(e) => setCity(e.target.value)}
      className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-4 flex flex-row items-center">
    <label className="block text-gray-700 text-sm font-bold mb-2 mr-4">State:</label>
    <input
      type="text"
      placeholder="State"
      value={state}
      onChange={(e) => setState(e.target.value)}
      className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-4 flex flex-row items-center">
    <label className="block text-gray-700 text-sm font-bold mb-2 mr-1">Block Address:</label>
    <input
      type="text"
      placeholder="Address"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-4 flex flex-row items-center">
    <label className="block text-gray-700 text-sm font-bold mb-2 mr-4">Gender:</label>
    <select
      value={gender}
      onChange={(e) => setGender(e.target.value)}
      className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    >
      <option value="">Select Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="non-binary">Non-binary</option>
      <option value="prefer-not-to-say">Prefer not to say</option>
    </select>
  </div>

  <div className="mb-4 flex flex-row items-center">
    <label className="block text-gray-700 text-sm font-bold mb-2 mr-4">Date of Birth:</label>
    <input
      type="date"
      value={dob}
      onChange={(e) => setDob(e.target.value)}
      className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-4 flex flex-row items-center">
    <label className="block text-gray-700 text-sm font-bold mb-2 mr-4">Role:</label>
    <select
      value={role}
      onChange={(e) => setRole(e.target.value)}
      className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    >
      <option value="buyer">Buyer</option>
      <option value="seller">Seller</option>
    </select>
  </div>

  {role === "buyer" && (
    <div className="mb-4 flex flex-row items-center">
      <label className="block text-gray-700 text-sm font-bold mb-2 mr-4">GST Number:</label>
      <input
        type="text"
        placeholder="GST Number"
        value={gstNumber}
        onChange={(e) => setGstNumber(e.target.value)}
        className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  )}

  {role === "seller" && (
    <div className="mb-4 flex flex-row items-center">
      <label className="block text-gray-700 text-sm font-bold mb-2 mr-4">Farmer Card Number:</label>
      <input
        type="text"
        placeholder="Farmer Card Number"
        value={farmerCardNumber}
        onChange={(e) => setFarmerCardNumber(e.target.value)}
        className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  )}

  <div className="mb-4 flex flex-row items-center">
    <label className="block text-gray-700 text-sm font-bold mb-2 mr-4" >Profile Picture:</label>
    <input
      type="file"
      accept="image/*"
      onChange={handleProfilePicChange}
      className="w-full p-3 outline-none rounded-lg"
    />
    {profilePicPreview && (
      <img src={profilePicPreview} alt="Profile Preview" className="w-20 h-20 mt-2" />
    )}
  </div>

  <button
    type="submit"
    className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
  >
    Sign Up
  </button>
</form>

      )}
    </div>
  );
};

export default Signup;
