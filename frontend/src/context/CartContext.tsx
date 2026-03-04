import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  product_data: any;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quentity?: number) => void;
  removeFromCart: (productID: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toogleShowCart: (state: boolean) => void;
  showCard: boolean;
  totalPrice: number;
}

/*
TWORZENIE KONTEKSTU

createContext<CartContextType | null>(null) -  Tworzysz globalny kontekst. Na start jego wartość to undefined. 
Bo wymuszasz używanie go tylko w CartProvider.
Jak ktoś spróbuje użyć poza nim → dostanie błąd.
Bardzo dobre zabezpieczenie */
const CartContext = createContext<CartContextType | null>(null);

/*

PROVIDER - (SERCE CAŁEGO SYSTEMU) 

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) =>{}  - To jest komponent opakowujący aplikację.
Każdy komponent wewnątrz <CartProvider> będzie miał dostęp do koszyka

*/
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem("cart");

    if (storedCart) {
      return JSON.parse(storedCart);
    }

    return [];
  });
  const [showCard, setShowCard] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const addToCart = (product: Product, quantity: number = 1) => {
    /*setCart(prev => {
        Używasz wersji z callbackiem.
        Dlaczego?
        Bo React może batchować aktualizacje i prev daje Ci zawsze najnowszy stan. */

    setCart((prev: CartItem[]) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev: CartItem[]) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

  const toogleShowCart = (state: boolean) => {
    setShowCard(state);
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  /*
Provider zwraca kontekst
Przekazujesz do kontekstu:
stan koszyka
wszystkie funkcje
obliczoną cenę
{children} → renderuje wszystko co jest w środku */
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toogleShowCart,
        showCard,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

//useCart (Custom Hook) - Tworzy własny hook.
export const useCart = () => {
  //Pobierasz dane z kontekstu.
  const context = useContext(CartContext);

  //Zabezpieczenie: Jeśli ktoś użyje useCart() poza CartProvider, dostanie błąd.
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
