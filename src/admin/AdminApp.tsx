import { Route, Routes } from "react-router-dom";
import { AdminAuthProvider } from "./AdminAuthContext";
import { AdminGate } from "./AdminGate";
import { AdminLayout, AdminNotFound } from "./AdminLayout";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminProductEditorPage } from "@/pages/admin/AdminProductEditorPage";
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage";

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
            <Route path="/admin/*" element={<AdminNotFound />} />
          </Route>
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}
