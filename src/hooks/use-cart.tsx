// src/hooks/use-cart.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { CartItem, Product } from "@/lib/types";
import { useAuth } from "./use-auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  loading: boolean;
  subtotal: number;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.discountedPrice ?? item.price;
    return acc + price * item.quantity;
  }, 0);
  const shipping = cartItems.length > 0 ? 7000 : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    const loadCartFromFirestore = async () => {
      if (user) {
        setLoading(true);
        const cartRef = doc(db, "carts", user.uid);
        const cartSnap = await getDoc(cartRef);
        if (cartSnap.exists()) {
          setCartItems(cartSnap.data().items || []);
        }
        setLoading(false);
      } else {
        // Load from local storage for guests
        const localCart = localStorage.getItem("cart");
        setCartItems(localCart ? JSON.parse(localCart) : []);
        setLoading(false);
      }
    };
    loadCartFromFirestore();
  }, [user]);

  useEffect(() => {
    const saveCart = async () => {
      if (user) {
        const cartRef = doc(db, "carts", user.uid);
        await setDoc(cartRef, { items: cartItems }, { merge: true });
        localStorage.removeItem("cart"); // Clear local cart after migrating to Firestore
      } else {
        localStorage.setItem("cart", JSON.stringify(cartItems));
      }
    };
    if (!loading) {
      saveCart();
    }
  }, [cartItems, user, loading]);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
        subtotal,
        shipping,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
