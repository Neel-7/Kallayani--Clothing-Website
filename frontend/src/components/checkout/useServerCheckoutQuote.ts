import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CheckoutApiError, checkoutApi } from "@/data/checkout-api";
import type { RootState } from "@/store/store";
import { useCheckout } from "./CheckoutContext";

export function useServerCheckoutQuote() {
  const lines = useSelector((state: RootState) => state.shop.cartLines);
  const { shippingAddress, deliveryMethodId, quote, setQuote } = useCheckout();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<CheckoutApiError | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!shippingAddress || lines.length === 0) return;
    let active = true;
    setIsLoading(true);
    setError(null);
    checkoutApi
      .quote({ lines, shippingAddress, deliveryMethodId })
      .then((nextQuote) => {
        if (active) setQuote(nextQuote);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setQuote(null);
        setError(
          reason instanceof CheckoutApiError
            ? reason
            : new CheckoutApiError(0, "NETWORK_ERROR", "Checkout could not reach the server."),
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt, deliveryMethodId, lines, setQuote, shippingAddress]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  return { quote, isLoading, error, retry, lines };
}
