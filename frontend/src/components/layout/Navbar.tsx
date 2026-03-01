import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Heart,
  MessageCircle,
  Bell,
  ShoppingCart,
  User,
  Search,
} from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between w-full relative">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-orange-500">
        My IT Store
      </Link>

      {/* Wyszukiwarka */}
      <div className="flex-1 mx-6">
        <div className="flex items-center border overflow-hidden focus-within:ring-2 focus-within:ring-orange-100 w-1/3">
          <select
            className="bg-gray-100 px-3 py-2 text-sm outline-none border-r"
            defaultValue="all"
          >
            <option value="all">Wszystkie</option>
            <option value="laptops">Laptopy</option>
            <option value="components">Podzespoły</option>
            <option value="phones">Telefony</option>
            <option value="accessories">Akcesoria</option>
          </select>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Szukaj produktów..."
              className="w-full pl-10 pr-4 py-2 outline-none"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          <button className="bg-orange-500 text-white px-5 py-2 hover:bg-orange-600 transition">
            Szukaj
          </button>
        </div>
      </div>

      {/* Ikony + Konto */}
      <div className="flex items-center gap-6 text-gray-600 relative">
        <Heart size={22} className="hover:text-orange-600 cursor-pointer" />
        <MessageCircle
          size={22}
          className="hover:text-orange-600 cursor-pointer"
        />
        <Bell size={22} className="hover:text-orange-600 cursor-pointer" />
        <ShoppingCart
          size={22}
          className="hover:text-orange-600 cursor-pointer"
        />

        {/* USER MENU */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 hover:text-orange-600 transition"
          >
            <User size={22} />
            <span className="hidden md:block">
              {isAuthenticated ? user?.email : "Konto"}
            </span>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border shadow-lg rounded-lg py-2 z-50">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 hover:bg-orange-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Zaloguj się
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 hover:bg-orange-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Zarejestruj się
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-4 py-2 text-sm text-gray-500 border-b">
                    Zalogowany jako:
                    <div className="font-semibold">{user?.email}</div>
                    <div className="text-xs text-orange-500">
                      Rola: {user?.role}
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-orange-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Mój profil
                  </Link>

                  {user?.role === "USER" && (
                    <Link
                      to="/orders"
                      className="block px-4 py-2 hover:bg-orange-50"
                      onClick={() => setIsOpen(false)}
                    >
                      Moje zamówienia
                    </Link>
                  )}

                  {user?.role === "SELLER" && (
                    <>
                      <Link
                        to="/seller/dashboard"
                        className="block px-4 py-2 hover:bg-orange-50"
                        onClick={() => setIsOpen(false)}
                      >
                        Panel sprzedawcy
                      </Link>
                      <Link
                        to="/seller/products"
                        className="block px-4 py-2 hover:bg-orange-50"
                        onClick={() => setIsOpen(false)}
                      >
                        Moje produkty
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
                  >
                    Wyloguj się
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
