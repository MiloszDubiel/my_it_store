import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const FavoriteContext = createContext<FavoritesContextType | null>(null);

export const FavortiteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/favorite/${user.id}`,
        );

        setFavorites(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (productId: string) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/favorite/toggle/${productId}`,
        { userId: user!.id },
      );

      if (res.data.favorite) {
        const productRes = await axios.get(
          `http://localhost:5000/allegro/products/${productId}`,
        );
        setFavorites((prev) => [...prev, productRes.data]);
      } else {
        setFavorites((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some((p) => p.id === productId);
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites must be used inside FavortiteProvider");
  }
  return context;
};
