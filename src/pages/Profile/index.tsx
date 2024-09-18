import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "../../configs/firebase";
import { toast } from "react-toastify";
import Loader from "../../../components/shared/loader";
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
    return <Loader/>;
  }

  const handleLogout = () => {
    auth.signOut();
    toast.success("You have logged out!");
  };
  const handleNav = () => {
    navigate('/myauctions');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
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
<div className="flex justify-center items-center gap-6 ">
  <button
    onClick={handleNav}
    className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
  >
    My Auctions
  </button>
  <button
    onClick={handleLogout}
    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
  >
    Logout
  </button>
</div>

      </div>
    </div>
  );
}

export default Profile;
