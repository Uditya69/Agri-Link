import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

import { auth } from "../../configs/firebase";
import { toast } from "react-toastify";
interface UserData {
  dob: string;
  email: string;
  farmerCardNumber: string;
  gender: string;
  gstNumber: string | null;
  location: string[];
  name: string;
  phone: string;
  profilePicUrl: string;
  role: string;
  uid: string;
}

function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch Firestore document using the user's uid
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserData); // Set the fetched data in state
        } else {
          console.log("No such document!");
        }
      } else {
        navigate("/auth"); // Redirect to auth page if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [db, navigate]);

  if (!userData) {
    return <div>Loading...</div>;
  }
  const handleLogout = () => {
    auth.signOut();
    toast.success("You have logged out!");
  };
  return (
    <div className="h-screen flex items-center bg-green-100">
      <div className="max-w-4xl  mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-green-900 mb-6 text-center md:text-left">
          Your Profile
        </h1>

        <div className="items-center">
          <div className="flex flex-row justify-between items-start">
            <div>
              <p className="text-lg font-semibold text-gray-800">
                <strong>Name:</strong> {userData.name}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong>Email:</strong> {userData.email}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong>Phone:</strong> {userData.phone}
              </p>
            </div>
            <img
              src={userData.profilePicUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-green-200 mb-6 md:mb-0 md:mr-6"
            />
          </div>

          <div className="text-left md:text-left">
            <p className="text-lg font-semibold text-gray-800">
              <strong>Date of Birth:</strong> {userData.dob}
            </p>

            <p className="text-lg font-semibold text-gray-800">
              <strong>Gender:</strong> {userData.gender}
            </p>
            <p className="text-lg font-semibold text-gray-800">
              <strong>Role:</strong> {userData.role}
            </p>

            {userData.farmerCardNumber || userData.gstNumber ? (
              <p className="text-lg font-semibold text-gray-800 mt-2">
                {userData.farmerCardNumber ? (
                  <>
                    <strong>Farmer Card Number:</strong>{" "}
                    {userData.farmerCardNumber}
                  </>
                ) : (
                  <>
                    <strong>GST Number:</strong> {userData.gstNumber}
                  </>
                )}
              </p>
            ) : null}

            <p className="text-lg font-semibold text-gray-800 mt-2">
              <strong>Location:</strong> {userData.location.join(", ")}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
