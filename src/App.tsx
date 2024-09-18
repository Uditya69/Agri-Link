import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "../components/auth/Auth";
import ProtectedRoute from "../components/auth/ProtectedRoute.tsx";
import AddItem from "../components/auction/AddItem";
import Auction from "../components/auction/Auction.tsx";
import Header from '../components/Header';
import Weather from '../components/Weather';
import MyAuctions from '../components/auction/MyAuctions';
import "./index.css";
import ContactUs from "../components/ContactUs";
import Home from "../components/Home";
import Profile from "./pages/Profile";
import BottomNav from "../components/BottomNav";
import Bid from "../components/auction/bid.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/weather" element={<Weather/>} />
        <Route path="/bid" element={<Bid/>} />
        <Route path="/myauctions" element={<MyAuctions/>} />
        <Route path="/auctions"element={<Auction/>} />
        <Route
          path="/additems"
          element={
            <ProtectedRoute>
              <AddItem />
            </ProtectedRoute>
          }
        />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <BottomNav />
    </Router>
  );
};

export default App;
