import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserData);
        } else {
          console.log("No such document!");
        }
      } else {
        navigate("/auth");
      }
    });

    return () => unsubscribe();
  }, [db, navigate]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    auth.signOut();
    toast.success("You have logged out!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="flex items-center mb-6">
          <Link
            to="/"
            className="flex items-center text-green-500 hover:text-green-700 mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-3 h-9 w-9"
              fill="none"
              viewBox="0 0 24 24"
              stroke="black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        </div>

        <div className="flex justify-center mb-6">
          <img
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-green-200"
            src={userData.profilePicUrl}
          />
        </div>

        <h1 className="text-2xl font-bold text-green-900 mb-6 text-center">
          {userData.name}
        </h1>

        <div className="text-gray-800">
          <p className="mb-4">
            <strong>Email:</strong> {userData.email}
          </p>
          <p className="mb-4">
            <strong>Phone:</strong> {userData.phone}
          </p>
          <p className="mb-4">
            <strong>Date of Birth:</strong> {userData.dob}
          </p>
          <p className="mb-4">
            <strong>Gender:</strong> {userData.gender}
          </p>
          <p className="mb-4">
            <strong>Role:</strong> {userData.role}
          </p>

          {userData.farmerCardNumber || userData.gstNumber ? (
            <p className="mb-4">
              <strong>
                {userData.farmerCardNumber
                  ? "Farmer Card Number:"
                  : "GST Number:"}
              </strong>{" "}
              {userData.farmerCardNumber || userData.gstNumber}
            </p>
          ) : null}

          <p className="mb-4">
            <strong>Location:</strong> {userData.location.join(", ")}
          </p>
        </div>

        <div className="flex justify-center">
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
