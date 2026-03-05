import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import OffersList from "./pages/OffersList/OffersList";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import Footer from "./components/layout/Footer";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import OfferDetails from "./components/ui/OfertDetails";
import { CartProvider } from "./context/CartContext";
import { FavortiteProvider } from "./context/FavoritesContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <FavortiteProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <div className="flex-1 h-fit">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/offers" element={<OffersList />} />
                  <Route path="/offers/:slug/:id" element={<OfferDetails />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>

              <Footer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </FavortiteProvider>
    </AuthProvider>
  );
};

export default App;
