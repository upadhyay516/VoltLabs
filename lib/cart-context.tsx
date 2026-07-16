"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./auth-context";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

// Pricing rules, kept in one place so cart/checkout/payment/emails never
// disagree with each other.
export const FREE_DELIVERY_THRESHOLD = 699;
export const DELIVERY_CHARGE = 30;
export const PROJECT_REPORT_FEE = 99;

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
  count: number;
  projectReport: boolean;
  setProjectReport: (value: boolean) => void;
  deliveryCharge: number;
  reportFee: number;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Each account (and signed-out guests) gets its own storage key, so signing
// out — or signing in as a different Google account on the same browser —
// never shows someone else's cart.
function storageKeyFor(userId: string | null) {
  return userId ? `voltlab_cart_${userId}` : "voltlab_cart_guest";
}
function reportKeyFor(userId: string | null) {
  return userId ? `voltlab_report_${userId}` : "voltlab_report_guest";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [projectReport, setProjectReportState] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [activeReportKey, setActiveReportKey] = useState<string | null>(null);

  // Whenever the signed-in user changes (login, logout, switch account),
  // load whatever cart belongs to that key instead of keeping old items.
  useEffect(() => {
    if (authLoading) return;
    const key = storageKeyFor(user?.id ?? null);
    const reportKey = reportKeyFor(user?.id ?? null);
    setActiveKey(key);
    setActiveReportKey(reportKey);

    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch {
        setItems([]);
      }
    } else {
      setItems([]);
    }

    setProjectReportState(localStorage.getItem(reportKey) === "1");
  }, [user?.id, authLoading]);

  useEffect(() => {
    if (activeKey) localStorage.setItem(activeKey, JSON.stringify(items));
  }, [items, activeKey]);

  useEffect(() => {
    if (activeReportKey) {
      localStorage.setItem(activeReportKey, projectReport ? "1" : "0");
    }
  }, [projectReport, activeReportKey]);

  function addItem(item: Omit<CartItem, "quantity">, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQuantity(id: string, qty: number) {
    if (qty <= 0) return removeItem(id);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
  }

  function clearCart() {
    setItems([]);
    setProjectReportState(false);
  }

  function setProjectReport(value: boolean) {
    setProjectReportState(value);
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  // No delivery charge on an empty cart, and free above the threshold.
  const deliveryCharge =
    items.length === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const reportFee = projectReport ? PROJECT_REPORT_FEE : 0;
  const total = subtotal + deliveryCharge + reportFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        count,
        projectReport,
        setProjectReport,
        deliveryCharge,
        reportFee,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
