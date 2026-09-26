import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/header/Header";
import { CollectionPage } from "@/pages/CollectionPage";
import { AuthPage } from "@/pages/AuthPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProductPage } from "@/pages/ProductPage";
import { ShopPage } from "@/pages/ShopPage";
import { CartPage } from "@/pages/CartPage";
import { WishlistPage } from "@/pages/WishlistPage";
import { RecentlyViewedPage } from "@/pages/RecentlyViewedPage";
import { FirebaseShopSync } from "@/components/FirebaseShopSync";
import { AccountLayout } from "@/components/account/AccountLayout";
import { AccountDashboardPage } from "@/pages/account/AccountDashboardPage";
import { AccountProfilePage } from "@/pages/account/AccountProfilePage";
import { AccountAddressesPage } from "@/pages/account/AccountAddressesPage";
import { AccountOrdersPage } from "@/pages/account/AccountOrdersPage";
import { OrderDetailsPage } from "@/pages/account/OrderDetailsPage";
import { EmailVerificationPage } from "@/pages/account/EmailVerificationPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { CheckoutLayout } from "@/components/checkout/CheckoutLayout";
import { ShippingAddressPage } from "@/pages/checkout/ShippingAddressPage";
import { DeliveryMethodPage } from "@/pages/checkout/DeliveryMethodPage";
import { OrderReviewPage } from "@/pages/checkout/OrderReviewPage";
import { PaymentPage } from "@/pages/checkout/PaymentPage";
import { OrderConfirmationPage } from "@/pages/checkout/OrderConfirmationPage";
import { PaymentFailedPage } from "@/pages/checkout/PaymentFailedPage";

const AdminApp = lazy(() => import("@/admin/AdminApp"));

function App() {
  const { pathname, hash } = useLocation();
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const isAuthPage =
    normalizedPath === "/login" ||
    normalizedPath === "/signup" ||
    normalizedPath === "/forgot-password";
  const isAdminPage = normalizedPath === "/admin" || normalizedPath.startsWith("/admin/");

  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView({ behavior: "instant" });
    else window.scrollTo({ top: 0, behavior: "instant" });
    if (pathname === "/") document.title = "Kallayani | Heritage in Every Thread";
  }, [pathname, hash]);

  if (isAdminPage) {
    return (
      <Suspense
        fallback={
          <main className="grid min-h-screen place-items-center bg-[#f3f0ea] text-sm text-muted">
            Opening catalogue studio…
          </main>
        }
      >
        <AdminApp />
      </Suspense>
    );
  }

  if (isAuthPage) {
    return (
      <div className="w-full overflow-x-clip">
        <a
          className="fixed left-2 top-2 z-[80] -translate-y-[150%] bg-ink px-4 py-3 text-white focus:translate-y-0"
          href="#auth-form"
        >
          Skip to form
        </a>
        <Routes>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-clip">
      <FirebaseShopSync />
      <a
        className="fixed left-2 top-2 z-[80] -translate-y-[150%] bg-ink px-4 py-3 text-white focus:translate-y-0"
        href="#main-content"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/recently-viewed" element={<RecentlyViewedPage />} />
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<AccountDashboardPage />} />
            <Route path="profile" element={<AccountProfilePage />} />
            <Route path="addresses" element={<AccountAddressesPage />} />
            <Route path="orders" element={<AccountOrdersPage />} />
            <Route path="orders/:orderId" element={<OrderDetailsPage />} />
            <Route path="verify-email" element={<EmailVerificationPage />} />
          </Route>
          <Route path="/checkout" element={<CheckoutLayout />}>
            <Route index element={<Navigate replace to="shipping" />} />
            <Route path="shipping" element={<ShippingAddressPage />} />
            <Route path="delivery" element={<DeliveryMethodPage />} />
            <Route path="review" element={<OrderReviewPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="confirmation" element={<OrderConfirmationPage />} />
            <Route path="payment-failed" element={<PaymentFailedPage />} />
          </Route>
          <Route path="/:slug" element={<CollectionPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
