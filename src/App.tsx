import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "../components/auth/Auth";
import ProtectedRoute from "../components/auth/ProtectedRoute.tsx";
import AddItem from "../components/auction/AddItem";
import Auction from "../components/auction/Auction";
import "./index.css";
import ContactUs from '../components/ContactUs';
import Home from "../components/Home";
import Mandi from '../components/Mandi'
import Profile from '../components/Profile'
import BottomNav from '../components/BottomNav';

const App: React.FC = () => { 
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={<ProtectedRoute><Home /></ProtectedRoute>}
        />
        <Route path="/add" element={<AddItem/>} />
        <Route path="/auctions"element={<Auction/>} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <BottomNav/>
    </Router>
  );
};

export default App;
