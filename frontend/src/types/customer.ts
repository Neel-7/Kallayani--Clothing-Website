export type CustomerProfile = {
  id: string;
  email: string | null;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  marketingOptIn: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export type SavedAddress = {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
};

export type OrderLine = {
  productId: string;
  variantId: string;
  title: string;
  sku: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  optionSummary?: string;
};

export type CheckoutAddress = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string;
};

export type DeliveryMethod = {
  id: "standard" | "express";
  name: string;
  description: string;
  amount: number;
};

export type CheckoutQuote = {
  currency: "USD";
  lines: OrderLine[];
  deliveryMethods: DeliveryMethod[];
  deliveryMethod: DeliveryMethod;
  subtotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
};

export type CheckoutInput = {
  lines: Array<{ productId: string; variantId: string; quantity: number }>;
  shippingAddress: CheckoutAddress;
  deliveryMethodId: DeliveryMethod["id"];
};

export type PaymentSession = {
  orderId: string;
  clientSecret: string;
  total: number;
  currency: "USD";
  reservationExpiresAt: string;
  quote: CheckoutQuote;
};

export type CustomerOrder = {
  id: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  currency: "USD";
  lines: OrderLine[];
  subtotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
  shippingAddress: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };
  deliveryMethod?: DeliveryMethod;
  createdAt: string | null;
  updatedAt: string | null;
};
