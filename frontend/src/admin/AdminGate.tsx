import { Navigate, Outlet } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "./AdminAuthContext";

export function AdminGate() {
  const { loading, role, user, signOut, refreshClaims } = useAdminAuth();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f3f0ea] text-sm text-muted">
        Checking staff access…
      </main>
    );
  }

  if (!user || user.isAnonymous) return <Navigate replace to="/admin/login" />;

  if (!role) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f3f0ea] px-6">
        <section className="max-w-lg border border-line bg-white p-10 text-center">
          <ShieldAlert className="mx-auto mb-5 text-wine" size={32} />
          <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-wine">
            Access denied
          </p>
          <h1 className="mt-3 font-editorial text-4xl leading-none">Staff role required.</h1>
          <p className="mt-5 text-sm leading-7 text-muted">
            {user.email} is signed in, but its refreshed Firebase token does not contain an admin or
            manager claim.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Button onClick={() => void refreshClaims()} variant="outline">
              Refresh access
            </Button>
            <Button onClick={() => void signOut()}>Sign out</Button>
          </div>
        </section>
      </main>
    );
  }

  return <Outlet />;
}
