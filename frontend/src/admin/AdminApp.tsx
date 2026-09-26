import { Route, Routes } from "react-router-dom";
import { AdminAuthProvider } from "./AdminAuthContext";
import { AdminGate } from "./AdminGate";
import { AdminLayout, AdminNotFound } from "./AdminLayout";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminProductEditorPage } from "@/pages/admin/AdminProductEditorPage";
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage";
import { AdminCollectionsPage } from "@/pages/admin/AdminCollectionsPage";
import { AdminHomepagePage } from "@/pages/admin/AdminHomepagePage";
import { AdminMediaPage } from "@/pages/admin/AdminMediaPage";
import { AdminOrdersPage } from "@/pages/admin/AdminOrdersPage";
import { AdminOrderDetailsPage } from "@/pages/admin/AdminOrderDetailsPage";
import { AdminCustomersPage } from "@/pages/admin/AdminCustomersPage";
import { AdminCustomerDetailsPage } from "@/pages/admin/AdminCustomerDetailsPage";
import { AdminInventoryPage } from "@/pages/admin/AdminInventoryPage";
import { AdminSettingsPage } from "@/pages/admin/AdminSettingsPage";

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<AdminGate />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/products/new" element={<AdminProductEditorPage />} />
            <Route path="/admin/products/:productId" element={<AdminProductEditorPage />} />
            <Route path="/admin/collections" element={<AdminCollectionsPage />} />
            <Route path="/admin/homepage" element={<AdminHomepagePage />} />
            <Route path="/admin/media" element={<AdminMediaPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/orders/:orderId" element={<AdminOrderDetailsPage />} />
            <Route path="/admin/customers" element={<AdminCustomersPage />} />
            <Route path="/admin/customers/:customerId" element={<AdminCustomerDetailsPage />} />
            <Route path="/admin/inventory" element={<AdminInventoryPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/admin/*" element={<AdminNotFound />} />
          </Route>
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}
