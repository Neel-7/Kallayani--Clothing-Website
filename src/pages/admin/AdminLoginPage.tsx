import { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import { LockKeyhole } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { BrandMark } from "@/components/layout/BrandMark";
import { Button } from "@/components/ui/button";

export function AdminLoginPage() {
  const { loading, role, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Catalogue sign in — Kallayani";
  }, []);

  if (!loading && role) return <Navigate replace to="/admin" />;

  return (
    <main className="grid min-h-screen bg-[#ede7df] lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,.9fr)]">
      <section className="relative hidden overflow-hidden bg-wine lg:block">
        <img
          alt="Kallayani textiles arranged in the atelier"
          className="absolute inset-0 size-full object-cover opacity-75"
          src="/images/women/editorial-bengal.webp"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17090a]/90 via-[#17090a]/20 to-[#17090a]/45" />
        <div className="absolute inset-x-12 top-10">
          <BrandMark light />
        </div>
        <p className="absolute bottom-12 left-12 max-w-lg font-editorial text-5xl leading-[.95] text-white">
          A quiet workspace for the catalogue behind the collection.
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-md border border-[#d3c9bd] bg-[#f8f5f0] p-8 sm:p-11">
          <LockKeyhole className="text-wine" size={26} />
          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[.2em] text-wine">
            Staff only
          </p>
          <h1 className="mt-3 font-editorial text-5xl leading-none tracking-[-.035em]">
            Catalogue sign in
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Use an account with an admin or manager Firebase claim.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={async (event) => {
              event.preventDefault();
              setSubmitting(true);
              setError("");
              try {
                await signIn(email, password);
                const destination = (location.state as { from?: string } | null)?.from ?? "/admin";
                navigate(destination, { replace: true });
              } catch (reason) {
                if (reason instanceof FirebaseError && reason.code === "auth/invalid-credential")
                  setError("The email or password is incorrect.");
                else setError(reason instanceof Error ? reason.message : "Sign in failed.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <label className="block text-xs font-semibold uppercase tracking-[.12em] text-muted">
              Email
              <input
                autoComplete="email"
                className="mt-2 h-12 w-full border border-[#cfc6bc] bg-white px-4 text-sm font-normal normal-case tracking-normal outline-none focus:border-wine"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-[.12em] text-muted">
              Password
              <input
                autoComplete="current-password"
                className="mt-2 h-12 w-full border border-[#cfc6bc] bg-white px-4 text-sm font-normal normal-case tracking-normal outline-none focus:border-wine"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>
            {error && (
              <p className="border-l-2 border-red bg-red/5 px-4 py-3 text-sm text-red">{error}</p>
            )}
            <Button className="w-full" disabled={submitting} type="submit">
              {submitting ? "Checking access…" : "Enter catalogue studio"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
