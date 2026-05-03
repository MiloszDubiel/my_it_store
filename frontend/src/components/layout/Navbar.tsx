import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Heart,
  MessageCircle,
  Bell,
  ShoppingCart,
  User,
  Search,
} from "lucide-react";

import { useFavorite } from "../../context/FavoritesContext";
import type { Product } from "../../types/ProductType";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  toogleShowCart,
} from "../../redux/slices/cartSlice";

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const [search, setSearch] = useState<string>("");

  type ModalType = "cart" | "favorites" | "account" | "notifications" | null;

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const { favorites } = useFavorite();

  const cart = useAppSelector((state) => state.cart.cart);
  const dispatch = useAppDispatch();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setActiveModal(null);
  };

  const createSlug = useCallback(
    (name: string) =>
      name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-"),
    [],
  );

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
        <div className="flex items-center border overflow-hidden focus-within:ring-2 focus-within:ring-orange-100 w-1/3 border-gray-200">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Szukaj produktów..."
              className="w-full pl-10 pr-4 py-2 outline-0 "
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
        <div className="relative">
          <Heart
            size={22}
            className="hover:text-orange-600 cursor-pointer"
            onClick={() =>
              setActiveModal(activeModal === "favorites" ? null : "favorites")
            }
          />

          {favorites.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
              {favorites.length}
            </span>
          )}
          {activeModal === "favorites" && (
            <div className="absolute top-11.25 right-0 mt-3 w-125 bg-white border shadow-xl p-4 z-50 overflow-y-auto ax-h-[400px] border-gray-200">
              <h3 className="text-lg font-bold mb-3">Ulubione produkty</h3>
              {favorites.length === 0 ? (
                <p>Nie masz jeszcze ulubionych produktów.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {favorites.map((product: Product) => {
                    return (
                      <li
                        key={product.id}
                        className="flex items-center gap-3 border-b border-gray-200 pb-2"
                      >
                        <div className="w-12 h-12 shrink-0">
                          <img
                            src={
                              product.product_data.images?.[0]?.url ||
                              "/no-image.png"
                            }
                            alt={product.product_data.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>

                        <div className="flex-1 flex items-center justify-between w-3/4 ">
                          <div
                            className="font-medium text-sm truncate"
                            style={{ maxWidth: "calc(100% - 60px)" }}
                            title={product.product_data.name}
                          >
                            {product.product_data.name}
                          </div>

                          <div className="text-gray-500 text-xs shrink-0 ml-2">
                            {product.price} zł
                          </div>
                        </div>

                        <Link
                          to={`/offers/${createSlug(product.product_data.name)}/${product.id}`}
                          className="text-orange-500 hover:underline text-xs ml-3 shrink-0"
                          onClick={() => setActiveModal(null)}
                        >
                          Zobacz
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
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
            onClick={() =>
              setActiveModal(activeModal === "cart" ? null : "cart")
            }
          />

          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </div>

        {activeModal === "cart" && (
          <div className="absolute top-11.25 right-0 mt-3 w-125 bg-white border shadow-xl p-4 z-50  overflow-y-auto border-gray-200">
            <h2 className="text-xl font-bold mb-4">Twój koszyk</h2>
            {cart.length === 0 ? (
              <p>Twój koszyk jest pusty.</p>
            ) : (
              <>
                <ul className="max-h-65 overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-3 mb-3 border-b border-gray-400 pb-3"
                    >
                      <div className="w-16 h-16 shrink-0">
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
                          <div className="flex items-center overflow-hidden">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(
                                  updateQuantity({
                                    id: item.id,
                                    quantity: Math.max(1, item.quantity - 1),
                                  }),
                                );
                              }}
                              className="px-2 py-1 bg-orange-100 hover:bg-orange-500"
                            >
                              −
                            </button>

                            <span className="px-3 text-sm min-w-7.5 text-center">
                              {item.quantity}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(
                                  updateQuantity({
                                    id: item.id,
                                    quantity: Math.min(
                                      item.stock,
                                      item.quantity + 1,
                                    ),
                                  }),
                                );
                              }}
                              className="px-2 py-1 bg-orange-100 hover:bg-orange-500"
                            >
                              +
                            </button>
                          </div>

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
                          onClick={() =>
                            dispatch(removeFromCart({ id: item.id }))
                          }
                          className="text-xs text-red-500 hover:underline"
                        >
                          Usuń
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Suma:</span>
                    <span>
                      {cart
                        .reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0,
                        )
                        .toFixed(2)}{" "}
                      zł
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      dispatch(toogleShowCart(false));
                      navigate("/cart");
                    }}
                    className="w-full mt-3 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
                  >
                    Przejdź do koszyka
                  </button>

                  <button
                    onClick={() => dispatch(clearCart())}
                    className="w-full mt-2 text-sm text-red-500 hover:underline"
                  >
                    Wyczyść koszyk
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        <div className="relative cursor-pointer">
          <button
            onClick={() =>
              setActiveModal(activeModal === "account" ? null : "account")
            }
            className="flex items-center gap-2 hover:text-orange-600 transition"
          >
            <User size={22} />
            <span className="hidden md:block">
              {isAuthenticated ? user?.email : "Konto"}
            </span>
          </button>

          {activeModal === "account" && (
            <div className="absolute right-0 mt-2 w-56 bg-white border-gray-400 shadow-lg  py-2 z-50 ">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 hover:bg-orange-50"
                    onClick={() => setActiveModal(null)}
                  >
                    Zaloguj się
                  </Link>

                  <Link
                    to="/register"
                    className="block px-4 py-2 hover:bg-orange-50"
                    onClick={() => setActiveModal(null)}
                  >
                    Zarejestruj się
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                    Zalogowany jako:
                    <div className="font-semibold">{user?.email}</div>
                  </div>

                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-orange-50"
                    onClick={() => setActiveModal(null)}
                  >
                    Mój profil
                  </Link>

                  {user?.role === "USER" && (
                    <Link
                      to="/orders"
                      className="block px-4 py-2 hover:bg-orange-50"
                      onClick={() => setActiveModal(null)}
                    >
                      Moje zamówienia
                    </Link>
                  )}

                  {user?.role === "SELLER" && (
                    <>
                      <Link
                        to="/seller/dashboard"
                        className="block px-4 py-2 hover:bg-orange-50"
                        onClick={() => setActiveModal(null)}
                      >
                        Panel sprzedawcy
                      </Link>
                      <Link
                        to="/seller/products"
                        className="block px-4 py-2 hover:bg-orange-50"
                        onClick={() => setActiveModal(null)}
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
