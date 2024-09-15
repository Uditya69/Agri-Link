import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "../components/auth/Auth";
import Home from "../components/home/index";
import ProtectedRoute from "../components/auth/ProtectedRoute.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/home"
          element={<ProtectedRoute><Home /></ProtectedRoute>}
        />
      </Routes>
    </Router>
  );
};

export default App;
