import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useFavorite } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";

interface OfferCardProps {
  id: string;
  product: any;
}

const OfferCard: React.FC<OfferCardProps> = ({ id, product }) => {
  const category = product.category_name || "Brak kategorii";
  const { addToCart, toogleShowCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorite();
  const { isAuthenticated } = useAuth();

  const favorite = isFavorite(product.id as string);

  const importantParams = [
    "Marka",
    "Model",
    "Przekątna ekranu",
    "Pojemność dysku",
    "Pamięć RAM",
  ];
  const displayedParams: string[] = [];

  importantParams.forEach((paramName) => {
    const param = product.product_data.parameters?.find(
      (p: any) => p.name === paramName,
    );
    if (param) {
      const value = param.valuesLabels?.[0] || param.values?.[0];
      if (value && displayedParams.length < 3)
        displayedParams.push(`${paramName}: ${value}`);
    }
  });

  const createSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  return (
    <Link
      to={`/offers/${createSlug(product.product_data.name)}/${product.external_id}`}
      className="block bg-white border hover:shadow-lg transition p-4 border-gray-200"
    >
      <div className="flex gap-6 items-start">
        <div className="w-40 h-32 fshrink-0">
          <img
            src={product.product_data.images[0]?.url}
            alt={product.product_data.name}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-lg hover:underline font-semibold line-clamp-2 hover:text-orange-600 transition">
            {product.product_data.name}
          </h3>

          <p className="text-sm text-gray-500 mt-1">Kategoria: {category}</p>

          <ul className="text-sm text-gray-600 mt-1 space-y-1">
            {displayedParams.map((param) => (
              <li key={param}>{param}</li>
            ))}
          </ul>

          <p className="text-sm text-gray-500 mt-2">
            Dostępna szybka wysyłka • Gwarancja 24 miesiące
          </p>
        </div>

        <div
          className="flex flex-col items-end gap-3"
          onClick={(e) => e.preventDefault()}
        >
          <p className="text-2xl font-bold text-gray-900">{product.price} zł</p>

          <button
            className="bg-orange-500 text-white px-6 py-2 hover:bg-orange-600 transition font-semibold cursor-pointer"
            onClick={() => {
              addToCart(product);
              toogleShowCart(true);
            }}
          >
            Dodaj do koszyka
          </button>

          {isAuthenticated && (
            <button
              onClick={() => toggleFavorite(id)}
              className="transition cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={favorite ? "#f97316" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={favorite ? "#f97316" : "currentColor"}
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default OfferCard;
