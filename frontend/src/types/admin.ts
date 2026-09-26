export type StaffRole = "admin" | "manager";
export type CatalogStatus = "draft" | "published" | "archived";

export type ProductImage = {
  id: string;
  storagePath: string;
  url: string;
  thumbnailStoragePath?: string;
  thumbnailUrl?: string;
  alt: string;
  position: string | null;
  width: number;
  height: number;
};

export type ProductVariantDocument = {
  id: string;
  sku: string;
  optionSummary: string;
  size: string;
  price: number;
  listPrice: number | null;
  availableQuantity: number;
  inStock: boolean;
};

export type ProductDocument = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: CatalogStatus;
  primaryCategorySlug: string;
  collectionSlug: string;
  collectionSlugs: string[];
  priceFrom: number;
  priceTo: number;
  listPriceFrom: number | null;
  currency: "USD";
  featured: boolean;
  inStock: boolean;
  badges: string[];
  primaryImage: ProductImage | null;
  gallery: ProductImage[];
  variants: ProductVariantDocument[];
  craft: string;
  region: string;
  seoTitle: string;
  seoDescription: string;
  createdAt: string | null;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string;
  publishedAt: string | null;
};

export type EditableProduct = Omit<
  ProductDocument,
  "createdAt" | "createdBy" | "updatedAt" | "updatedBy" | "publishedAt"
>;

export type AdminCollectionOption = { slug: string; name: string };

export type AdminCollectionDocument = {
  id: string;
  slug: string;
  name: string;
  headline: string;
  description: string;
  hero: import("./catalog").MediaAsset;
  categoryImage: import("./catalog").MediaAsset;
  subcategories: import("./catalog").Subcategory[];
  position: number;
  status: CatalogStatus;
  updatedAt: string | null;
  updatedBy: string;
};

export type HomepageContentKind = "banner" | "category" | "editorial";

export type HomepageContentEntry = {
  id: string;
  kind: HomepageContentKind;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imagePosition: string;
  linkUrl: string;
  ctaLabel: string;
  position: number;
  status: CatalogStatus;
  updatedAt: string | null;
};

export type CreateHomepageEntryInput = {
  id?: string;
  kind: HomepageContentKind;
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: string;
  linkUrl?: string;
  ctaLabel?: string;
  position?: number;
  status?: CatalogStatus;
};

export type AdminOrderLine = {
  productId: string;
  variantId: string;
  title: string;
  sku: string;
  optionSummary?: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type AdminOrder = {
  id: string;
  displayNumber?: string;
  userId: string;
  customerEmail?: string | null;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  reservationStatus?: string;
  currency: "USD";
  lines: AdminOrderLine[];
  subtotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
  refundedAmount?: number;
  shippingAddress?: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };
  deliveryMethod?: { id: string; name: string; description: string; amount: number };
  tracking?: { carrier?: string; trackingNumber?: string };
  refunds?: Array<{
    operationId: string;
    refundId: string;
    amount: number;
    reason: string;
    restocked: boolean;
    staffUid: string;
    createdAt: string | null;
  }>;
  cancellation?: { reason?: string; staffUid?: string };
  createdAt: string | null;
  updatedAt: string | null;
  paidAt?: string | null;
  canceledAt?: string | null;
  fulfilledAt?: string | null;
  deliveredAt?: string | null;
};

export type AdminCustomer = {
  id: string;
  email: string | null;
  emailVerified: boolean;
  disabled: boolean;
  firstName: string;
  lastName: string;
  marketingOptIn: boolean;
  createdAt: string;
  lastSignInAt: string | null;
  orders: number;
  totalSpent: number;
};

export type AdminCustomerDetails = Omit<AdminCustomer, "orders"> & {
  addresses: Array<{
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
  }>;
  cartCount: number;
  wishlistCount: number;
  orders: AdminOrder[];
};

export type LowStockItem = {
  productId: string;
  productTitle: string;
  productStatus: string;
  imageUrl: string;
  variantId: string;
  sku: string;
  optionSummary: string;
  availableQuantity: number;
  threshold: number;
};

export type StoreSettings = {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currency: "USD";
  lowStockThreshold: number;
  standardShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  reservationMinutes: number;
  orderPrefix: string;
};

export type AdminDashboardReport = {
  rangeDays: number;
  metrics: {
    netSales: number;
    grossSales: number;
    refunds: number;
    orders: number;
    averageOrderValue: number;
    unitsSold: number;
    customers: number;
    newCustomers: number;
    fulfillmentQueue: number;
    lowStockCount: number;
  };
  daily: Array<{ date: string; orders: number; netSales: number }>;
  recentOrders: AdminOrder[];
  fulfillment: {
    unfulfilled: number;
    picking: number;
    packed: number;
    shipped: number;
  };
};
