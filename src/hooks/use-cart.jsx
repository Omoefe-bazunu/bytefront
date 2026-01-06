"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Cyber-Industrial Debounce Protocol
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const CartContext = createContext(undefined);

// State Comparison Protocol
const cartItemsEqual = (items1, items2) => {
  if (items1.length !== items2.length) return false;
  return items1.every((item1, index) => {
    const item2 = items2[index];
    return item1.id === item2.id && item1.quantity === item2.quantity;
  });
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const isUpdatingFromFirestore = useRef(false);
  const currentUserRef = useRef(user);
  const unsubscribeRef = useRef(null);
  const hasLoadedOnce = useRef(false);
  const previousUserIdRef = useRef(null);

  useEffect(() => {
    currentUserRef.current = user;
  }, [user]);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.discountedPrice ?? item.price;
    return acc + price * item.quantity;
  }, 0);
  const shipping = cartItems.length > 0 ? 0 : 0;
  const total = subtotal + shipping;

  // Immediate Sync to Central Network
  const saveCartImmediately = useCallback(async (items) => {
    if (currentUserRef.current) {
      try {
        isUpdatingFromFirestore.current = true;
        const cartRef = doc(db, "carts", currentUserRef.current.uid);
        await setDoc(cartRef, { items }, { merge: true });
      } catch (error) {
        console.error("CRITICAL: Network Sync Failed", error);
      } finally {
        setTimeout(() => {
          isUpdatingFromFirestore.current = false;
        }, 150);
      }
    }
  }, []);

  // Core Load Logic: Prevents stale/cached data leaks
  const loadCart = useCallback(
    async (isUserChange = false) => {
      if (authLoading) return;

      try {
        setIsLoading(true);
        // CRITICAL: Immediate state purge on user transition to prevent ghost data
        if (isUserChange) setCartItems([]);

        if (user) {
          console.log(`[AUTH] Fetching manifest for unit: ${user.uid}`);
          const cartRef = doc(db, "carts", user.uid);
          const cartSnap = await getDoc(cartRef);

          if (cartSnap.exists()) {
            const firestoreItems = cartSnap.data().items || [];
            setCartItems(firestoreItems);
          } else {
            // New Unit: Check for migration payload
            if (!isUserChange) {
              const localCart = localStorage.getItem("cart");
              if (localCart) {
                const localItems = JSON.parse(localCart);
                console.log("[MIGRATE] Injecting local payload to cloud");
                setCartItems(localItems);
                await saveCartImmediately(localItems);
                localStorage.removeItem("cart");
              }
            } else {
              console.log("[INIT] Fresh identity detected. Manifest empty.");
              setCartItems([]);
            }
          }
        } else {
          // Anonymous Unit
          const localCart = localStorage.getItem("cart");
          const items = localCart ? JSON.parse(localCart) : [];
          setCartItems(items);
        }

        hasLoadedOnce.current = true;
      } catch (error) {
        console.error("DATA_ERR: Manifest retrieval failed", error);
        setCartItems([]);
      } finally {
        setInitialized(true);
        setIsLoading(false);
      }
    },
    [user?.uid, authLoading, saveCartImmediately]
  );

  // Lifecycle: Auth Ready
  useEffect(() => {
    if (!authLoading && !hasLoadedOnce.current) {
      previousUserIdRef.current = user?.uid || null;
      loadCart(false);
    }
  }, [authLoading, loadCart]);

  // Lifecycle: Identity Switch
  useEffect(() => {
    if (!authLoading && hasLoadedOnce.current) {
      const currentUserId = user?.uid || null;
      if (currentUserId !== previousUserIdRef.current) {
        console.log("[SYSTEM] Identity shift detected. Re-initializing...");
        setInitialized(false);
        previousUserIdRef.current = currentUserId;
        loadCart(true);
      }
    }
  }, [user?.uid, authLoading, loadCart]);

  // Real-time Cloud Synchronization
  useEffect(() => {
    if (unsubscribeRef.current) unsubscribeRef.current();

    if (!user || !initialized || authLoading) return;

    const cartRef = doc(db, "carts", user.uid);
    unsubscribeRef.current = onSnapshot(cartRef, (doc) => {
      if (isUpdatingFromFirestore.current) return;

      if (doc.exists()) {
        const firestoreItems = doc.data().items || [];
        setCartItems((prevItems) => {
          if (!cartItemsEqual(prevItems, firestoreItems)) {
            return firestoreItems;
          }
          return prevItems;
        });
      }
    });

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [user?.uid, initialized, authLoading]);

  // Debounced Save Protocol
  const saveCartToFirestore = useCallback(
    debounce(async (items) => {
      if (currentUserRef.current && initialized && !authLoading) {
        isUpdatingFromFirestore.current = true;
        const cartRef = doc(db, "carts", currentUserRef.current.uid);
        await setDoc(cartRef, { items }, { merge: true });
        setTimeout(() => {
          isUpdatingFromFirestore.current = false;
        }, 150);
      }
    }, 500),
    [initialized, authLoading]
  );

  // Sync state to local/cloud on change
  useEffect(() => {
    if (!initialized || authLoading) return;

    if (user) {
      saveCartToFirestore(cartItems);
    } else {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user, initialized, authLoading, saveCartToFirestore]);

  const addToCart = useCallback((product) => {
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
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(async () => {
    setCartItems([]);
    if (currentUserRef.current) {
      await saveCartImmediately([]);
    } else {
      localStorage.removeItem("cart");
    }
  }, [saveCartImmediately]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading: isLoading || authLoading,
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
