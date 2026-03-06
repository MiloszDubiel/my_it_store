import React, { createContext, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

/*
React Query hooki:
useQuery → pobieranie danych za pomoca -  GET
useMutation → zmiana danych za pomocą - POST/PUT/DELETE
useQueryClient → dostęp do cache React Query
*/
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface FavoritesContextType {
  favorites: any[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const FavoriteContext = createContext<FavoritesContextType | null>(null);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  /*
  queryClient daje dostęp do cache React Query
  dzięki temu możemy np:
  - odświeżyć dane
  - zmienić cache ręcznie
  */
  const queryClient = useQueryClient();

  const fetchFavorites = async () => {
    const res = await axios.get(
      `/api/favorite/${user!.id}`,
    );

    return res.data;
  };

  /*
  ================================
  useQuery - pobieranie favorites
  ================================

  queryKey → klucz cache
  queryFn → funkcja która pobiera dane
  enabled → query odpali się tylko gdy user istnieje
  staleTime → przez ile dane są "świeże"
  */

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites", user?.id], // cache zależny od użytkownika
    queryFn: fetchFavorites,
    enabled: !!user, // jeśli user = null query się nie wykona
    staleTime: 1000 * 60 * 5, // 5 minut cache
  });

  /*
  Mutation służy do wykonwywania zapytań:
  - POST
  - PUT
  - DELETE
  */

  const toggleFavoriteMutation = useMutation({
    //mutationFn → funkcja która wykona request do backendu
    mutationFn: async (productId: string) => {
      return axios.post(
        `api/favorite/toggle/${productId}`,
        {
          userId: user!.id,
        },
      );
    },

    //onSuccess → co zrobić gdy request się powiedzie - tutaj odświeżamy favorites
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites", user?.id],
      });
    },
  });

  //Funkcja która będzie wywoływana w komponentach
  const toggleFavorite = (productId: string) => {
    toggleFavoriteMutation.mutate(productId);
  };

  const isFavorite = (productId: string) => {
    return favorites.some((product: any) => product.id === productId);
  };

  //Provider udostępnia dane w całej aplikacji

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

/*
Hook który używamy w komponentach
np:

const { favorites, toggleFavorite } = useFavorite()
*/
export const useFavorite = () => {
  const context = useContext(FavoriteContext);

  if (!context) {
    throw new Error("useFavorite must be used inside FavoriteProvider");
  }

  return context;
};
