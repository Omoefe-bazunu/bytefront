"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import type { CartItem, Product } from "@/lib/types";
import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const debounce = <F extends (...args: any[]) => void>(
  func: F,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => Promise<void>;
  loading: boolean;
  subtotal: number;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to compare cart items
const cartItemsEqual = (items1: CartItem[], items2: CartItem[]): boolean => {
  if (items1.length !== items2.length) return false;

  return items1.every((item1, index) => {
    const item2 = items2[index];
    return item1.id === item2.id && item1.quantity === item2.quantity;
  });
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Refs to prevent race conditions and track state
  const isUpdatingFromFirestore = useRef(false);
  const currentUserRef = useRef(user);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const hasLoadedOnce = useRef(false);
  const previousUserIdRef = useRef<string | null>(null);

  // Update current user ref
  useEffect(() => {
    currentUserRef.current = user;
  }, [user]);

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.discountedPrice ?? item.price;
    return acc + price * item.quantity;
  }, 0);
  const shipping = cartItems.length > 0 ? 0 : 0;
  const total = subtotal + shipping;

  // Immediate save to Firestore
  const saveCartImmediately = useCallback(
    async (items: CartItem[]) => {
      if (currentUserRef.current) {
        try {
          isUpdatingFromFirestore.current = true;
          const cartRef = doc(db, "carts", currentUserRef.current.uid);
          await setDoc(cartRef, { items }, { merge: true });
        } catch (error) {
          console.error("Error saving cart immediately:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description:
              "Failed to update cart in Firestore. Please try again.",
          });
          throw error;
        } finally {
          setTimeout(() => {
            isUpdatingFromFirestore.current = false;
          }, 100);
        }
      }
    },
    [toast]
  );

  // Load cart function
  const loadCart = useCallback(
    async (isUserChange = false) => {
      if (authLoading) return;

      try {
        setIsLoading(true);

        if (user) {
          console.log("Loading cart for authenticated user:", user.uid);
          const cartRef = doc(db, "carts", user.uid);
          const cartSnap = await getDoc(cartRef);

          if (cartSnap.exists()) {
            const firestoreItems = cartSnap.data().items || [];
            console.log("Loaded cart from Firestore:", firestoreItems);
            setCartItems(firestoreItems);
          } else {
            console.log("No Firestore cart found");

            // Only try to migrate from localStorage if this is the initial load or first login
            // Don't migrate if user is logging back in (they should start fresh if no Firestore cart)
            if (!isUserChange) {
              try {
                const localCart = localStorage.getItem("cart");
                if (localCart) {
                  const localItems: CartItem[] = JSON.parse(localCart);
                  console.log("Migrating cart from localStorage:", localItems);
                  setCartItems(localItems);
                  await saveCartImmediately(localItems);
                  localStorage.removeItem("cart");
                } else {
                  setCartItems([]);
                }
              } catch (parseError) {
                console.error("Error parsing localStorage cart:", parseError);
                localStorage.removeItem("cart");
                setCartItems([]);
              }
            } else {
              // User logged back in but has no Firestore cart - start empty
              console.log(
                "User logged back in with no Firestore cart, starting empty"
              );
              setCartItems([]);
            }
          }
        } else {
          console.log(
            "Loading cart for unauthenticated user from localStorage"
          );
          // When user logs out, save current cart to localStorage
          if (isUserChange && cartItems.length > 0) {
            console.log("User logged out, saving current cart to localStorage");
            try {
              localStorage.setItem("cart", JSON.stringify(cartItems));
            } catch (error) {
              console.error(
                "Error saving cart to localStorage on logout:",
                error
              );
            }
          }

          // Load from localStorage for unauthenticated users
          try {
            const localCart = localStorage.getItem("cart");
            const items = localCart ? JSON.parse(localCart) : [];
            console.log("Loaded cart from localStorage:", items);
            setCartItems(items);
          } catch (parseError) {
            console.error("Error parsing localStorage cart:", parseError);
            localStorage.removeItem("cart");
            setCartItems([]);
          }
        }

        hasLoadedOnce.current = true;
      } catch (error) {
        console.error("Error loading cart:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load cart. Please try again.",
        });
        setCartItems([]);
      } finally {
        setInitialized(true);
        setIsLoading(false);
      }
    },
    [user?.uid, authLoading, toast, saveCartImmediately, cartItems]
  );

  // Initial load - wait for auth to be ready
  useEffect(() => {
    if (!authLoading && !hasLoadedOnce.current) {
      console.log(
        "Auth ready, initial cart load. User:",
        user?.uid || "anonymous"
      );
      setInitialized(false);
      previousUserIdRef.current = user?.uid || null;
      loadCart(false);
    }
  }, [authLoading, loadCart]);

  // Handle user changes after initial load
  useEffect(() => {
    if (!authLoading && hasLoadedOnce.current) {
      const currentUserId = user?.uid || null;
      const previousUserId = previousUserIdRef.current;

      // Only reload if the user actually changed
      if (currentUserId !== previousUserId) {
        console.log("User changed from", previousUserId, "to", currentUserId);
        setInitialized(false);
        previousUserIdRef.current = currentUserId;
        loadCart(true); // Pass true to indicate this is a user change
      }
    }
  }, [user?.uid, authLoading, loadCart]);

  // Real-time updates for authenticated users
  useEffect(() => {
    // Clean up previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (!user || !initialized || authLoading) return;

    console.log("Setting up Firestore listener for user:", user.uid);
    const cartRef = doc(db, "carts", user.uid);
    const unsubscribe = onSnapshot(
      cartRef,
      (doc) => {
        if (isUpdatingFromFirestore.current) return;

        if (doc.exists()) {
          const firestoreItems = doc.data().items || [];
          console.log("Firestore listener update:", firestoreItems);

          setCartItems((prevItems) => {
            if (!cartItemsEqual(prevItems, firestoreItems)) {
              return firestoreItems;
            }
            return prevItems;
          });
        }
      },
      (error) => {
        console.error("Error in cart listener:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to sync cart. Trying to reconnect...",
        });
      }
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [user?.uid, initialized, authLoading, toast]);

  // Save cart changes
  const saveCartToFirestore = useCallback(
    debounce(async (items: CartItem[]) => {
      if (currentUserRef.current && initialized && !authLoading) {
        try {
          console.log("Saving cart to Firestore:", items);
          isUpdatingFromFirestore.current = true;
          const cartRef = doc(db, "carts", currentUserRef.current.uid);
          await setDoc(cartRef, { items }, { merge: true });
        } catch (error) {
          console.error("Error saving cart:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to save cart. Changes may not persist.",
          });
        } finally {
          setTimeout(() => {
            isUpdatingFromFirestore.current = false;
          }, 100);
        }
      }
    }, 500),
    [initialized, authLoading, toast]
  );

  // Save cart when items change
  useEffect(() => {
    if (!initialized || authLoading) return;

    if (user) {
      saveCartToFirestore(cartItems);
    } else {
      try {
        console.log("Saving cart to localStorage:", cartItems);
        localStorage.setItem("cart", JSON.stringify(cartItems));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Failed to save cart locally. Your browser may be blocking localStorage.",
        });
      }
    }
  }, [cartItems, user, initialized, authLoading, saveCartToFirestore]);

  const addToCart = useCallback(
    (product: Product) => {
      if (isUpdatingFromFirestore.current || authLoading) return;

      try {
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
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add item to cart.",
        });
      }
    },
    [authLoading, toast]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      if (isUpdatingFromFirestore.current || authLoading) return;

      try {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== productId)
        );
      } catch (error) {
        console.error("Error removing from cart:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to remove item from cart.",
        });
      }
    },
    [authLoading, toast]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) return;
      if (isUpdatingFromFirestore.current || authLoading) return;

      try {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          )
        );
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update cart quantity.",
        });
      }
    },
    [authLoading, toast]
  );

  const clearCart = useCallback(async () => {
    if (authLoading) return;

    try {
      setCartItems([]);
      if (currentUserRef.current) {
        await saveCartImmediately([]);
      } else {
        localStorage.removeItem("cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear cart. Please try again.",
      });
    }
  }, [authLoading, saveCartImmediately, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

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
