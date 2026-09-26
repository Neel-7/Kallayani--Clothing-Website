import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type {
  CheckoutAddress,
  CheckoutQuote,
  DeliveryMethod,
  PaymentSession,
} from "@/types/customer";

type CheckoutContextValue = {
  shippingAddress: CheckoutAddress | null;
  deliveryMethodId: DeliveryMethod["id"];
  quote: CheckoutQuote | null;
  paymentSession: PaymentSession | null;
  setShippingAddress: (address: CheckoutAddress) => void;
  setDeliveryMethodId: (id: DeliveryMethod["id"]) => void;
  setQuote: (quote: CheckoutQuote | null) => void;
  setPaymentSession: (session: PaymentSession | null) => void;
  reset: () => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [shippingAddress, updateShippingAddress] = useState<CheckoutAddress | null>(null);
  const [deliveryMethodId, updateDeliveryMethodId] =
    useState<DeliveryMethod["id"]>("standard");
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);
  const setShippingAddress = useCallback((address: CheckoutAddress) => {
    updateShippingAddress(address);
    setQuote(null);
    setPaymentSession(null);
  }, []);
  const setDeliveryMethodId = useCallback((id: DeliveryMethod["id"]) => {
    updateDeliveryMethodId(id);
    setQuote(null);
    setPaymentSession(null);
  }, []);
  const reset = useCallback(() => {
    updateShippingAddress(null);
    updateDeliveryMethodId("standard");
    setQuote(null);
    setPaymentSession(null);
  }, []);

  const value = useMemo<CheckoutContextValue>(
    () => ({
      shippingAddress,
      deliveryMethodId,
      quote,
      paymentSession,
      setShippingAddress,
      setDeliveryMethodId,
      setQuote,
      setPaymentSession,
      reset,
    }),
    [deliveryMethodId, paymentSession, quote, reset, setDeliveryMethodId, setShippingAddress, shippingAddress],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const value = useContext(CheckoutContext);
  if (!value) throw new Error("useCheckout must be used inside CheckoutProvider.");
  return value;
}
