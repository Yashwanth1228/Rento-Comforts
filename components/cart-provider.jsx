"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

function toCartItem(product) {
  const mode = product.mode === "buy" ? "buy" : "rent";

  return {
    id: product.id,
    cartKey: `${mode}:${product.id}`,
    mode,
    quantity: mode === "buy" ? 1 : null,
    previewOnly: Boolean(product.previewOnly),
    name: product.name,
    category: product.category || null,
    brand: product.brand || null,
    imageUrl: product.imageUrl,
    imageAlt: product.imageAlt,
    monthlyRentalPricePaise:
      mode === "rent" ? product.monthlyRentalPricePaise : null,
    purchasePricePaise: mode === "buy" ? product.purchasePricePaise : null,
    refundableDepositPaise:
      mode === "rent" ? product.refundableDepositPaise : null,
    minimumRentalMonths:
      mode === "rent" ? product.minimumRentalMonths : null,
    availabilityMessage:
      mode === "rent" ? product.availabilityMessage : null,
    rentalPlan: mode === "rent" ? product.rentalPlan || null : undefined,
    rentalDates: mode === "rent" ? product.rentalDates || null : undefined,
    configurationPending: mode === "rent" && (!product.rentalPlan || !product.rentalDates),
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product) => {
    if (!product?.id || !product?.name || !product?.imageUrl) {
      return false;
    }

    const hasValidPrice =
      product.mode === "buy"
        ? Number.isSafeInteger(product.purchasePricePaise) &&
          product.purchasePricePaise > 0
        : Number.isSafeInteger(product.monthlyRentalPricePaise) &&
          product.monthlyRentalPricePaise > 0;

    if (!hasValidPrice) {
      return false;
    }

    if (product.previewOnly && process.env.NODE_ENV !== "development") {
      return false;
    }

    setItems((currentItems) => {
      const cartItem = toCartItem(product);

      if (currentItems.some((item) => item.cartKey === cartItem.cartKey)) {
        return currentItems;
      }

      return [...currentItems, cartItem];
    });

    return true;
  }, []);

  const removeItem = useCallback((cartKey) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.cartKey !== cartKey),
    );
  }, []);

  const updateQuantity = useCallback((cartKey, quantity) => {
    if (!Number.isSafeInteger(quantity) || quantity < 1) return;
    setItems((currentItems) => currentItems.map((item) => (
      item.cartKey === cartKey && item.mode === "buy"
        ? { ...item, quantity }
        : item
    )));
  }, []);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity }),
    [items, addItem, removeItem, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);

  if (!cart) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return cart;
}
