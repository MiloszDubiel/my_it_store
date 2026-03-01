import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import OffersPage from "./pages/OffersPage/OffersPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import Footer from "./components/layout/Footer";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Flex column, min-height 100vh */}
        <div className="flex flex-col min-h-screen">
          <Navbar />

          {/* Główny content, rozciąga się na resztę przestrzeni */}
          <div className="flex-1 h-fit">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
