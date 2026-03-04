import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
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
  const [search, setSearch] = useState<string>("");

  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    showCard,
    clearCart,
    toogleShowCart,
  } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const searchProduct = useCallback(() => {
    const query = search.trim().toLowerCase();
    if (query) {
      navigate(`/offers?search=${encodeURIComponent(query)}&page=1`);
    }
  }, [search, navigate]);

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between w-full relative">
      <Link to="/" className="text-2xl font-bold text-orange-500">
        My IT Store
      </Link>

      <div className="flex items-center gap-6 flex-1 mx-6">
        <div className="flex items-center border overflow-hidden focus-within:ring-2 focus-within:ring-orange-100 w-1/3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Szukaj produktów..."
              className="w-full pl-10 pr-4 py-2 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          <button
            className="bg-orange-500 text-white px-5 py-2 hover:bg-orange-600 transition"
            onClick={searchProduct}
          >
            Szukaj
          </button>
        </div>

        <Link
          to="/offers"
          className="whitespace-nowrap text-gray-700 font-medium hover:text-orange-600 transition"
        >
          Wszystkie produkty
        </Link>
      </div>

      <div className="flex items-center gap-6 text-gray-600 relative ">
        {<Heart size={22} className="hover:text-orange-600 cursor-pointer" />}
        {
          <MessageCircle
            size={22}
            className="hover:text-orange-600 cursor-pointer"
          />
        }
        <Bell size={22} className="hover:text-orange-600 cursor-pointer" />

        <div className="relative">
          <ShoppingCart
            size={22}
            className="hover:text-orange-600 cursor-pointer"
            onClick={() => toogleShowCart(!showCard)}
          />

          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-[2px] rounded-full">
              {totalItems}
            </span>
          )}
        </div>

        {showCard && (
          <div className="absolute top-[45px] right-0 mt-3 w-[500px] bg-white border shadow-xl p-4 z-50  overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Twój koszyk</h2>
            {cart.length === 0 ? (
              <p>Twój koszyk jest pusty.</p>
            ) : (
              <>
                <ul className="max-h-[260px] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <li key={item.id} className="flex gap-3 mb-3 border-b pb-3">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={
                            item.product_data.images?.[0]?.url ||
                            "/no-image.png"
                          }
                          alt={item.product_data.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="font-medium line-clamp-2">
                          {item.product_data.name}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="number"
                            className="w-14 border px-1 py-[2px]"
                            value={item.quantity}
                            min={1}
                            max={item.stock}
                            onChange={(e) =>
                              updateQuantity(
                                item.id,
                                Math.max(1, Number(e.target.value)),
                              )
                            }
                          />
                          <span className="text-sm text-gray-500">
                            x {item.price} zł
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold">
                          {(item.price * item.quantity).toFixed(2)} zł
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Usuń
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Suma:</span>
                    <span>{totalPrice.toFixed(2)} zł</span>
                  </div>

                  <button
                    onClick={() => {
                      toogleShowCart(false);
                      navigate("/cart");
                    }}
                    className="w-full mt-3 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
                  >
                    Przejdź do koszyka
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full mt-2 text-sm text-red-500 hover:underline"
                  >
                    Wyczyść koszyk
                  </button>
                </div>
              </>
            )}
          </div>
        )}
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
            <div className="absolute right-0 mt-2 w-56 bg-white border shadow-lg  py-2 z-50">
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
