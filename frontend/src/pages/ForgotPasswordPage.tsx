import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BrandMark } from "@/components/layout/BrandMark";
import { Button } from "@/components/ui/button";
import { authRepository } from "@/data/auth";
import {
  clearPasswordReset,
  passwordResetFailed,
  passwordResetSending,
  passwordResetSent,
} from "@/store/customer-auth";
import type { RootState } from "@/store/store";

export function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const resetState = useSelector((state: RootState) => state.customerAuth.passwordReset);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Reset password | Kallayani";
    dispatch(clearPasswordReset());
  }, [dispatch]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    dispatch(passwordResetSending(email));
    setError("");
    try {
      await authRepository.sendPasswordReset(email);
      dispatch(passwordResetSent(email));
    } catch (reason) {
      dispatch(passwordResetFailed());
      setError(reason instanceof Error ? reason.message : "The reset email could not be sent.");
    }
  };

  return (
    <main className="grid min-h-[100dvh] grid-cols-[1.05fr_.95fr] bg-[#f3eee7] tablet:grid-cols-1">
      <section className="relative min-h-[100dvh] overflow-hidden tablet:min-h-[38dvh]">
        <img className="absolute inset-0 size-full object-cover object-[58%_48%]" src="/images/auth/login-homecoming.webp" alt="A quiet homecoming in a rain-lit heritage room" />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute left-gutter top-8"><BrandMark light /></div>
      </section>
      <section className="flex items-center px-[clamp(28px,7vw,96px)] py-14 phone:px-5">
        <div className="w-full max-w-[480px]">
          <Link className="inline-flex min-h-11 items-center gap-2 text-xs text-muted hover:text-wine" to="/login"><ArrowLeft size={14} /> Back to sign in</Link>
          {resetState.status === "sent" ? (
            <div className="mt-10">
              <CheckCircle2 className="text-wine" size={30} strokeWidth={1.5} />
              <h1 className="mt-6 font-editorial text-[clamp(44px,5vw,62px)] font-medium leading-none tracking-[-.03em]">Check your inbox.</h1>
              <p className="mt-5 max-w-[48ch] text-sm leading-6 text-muted">If an account exists for {resetState.email}, a password-reset message is on its way.</p>
              <Button className="mt-8" asChild><Link to="/login">Return to sign in</Link></Button>
            </div>
          ) : (
            <>
              <h1 className="mt-9 font-editorial text-[clamp(44px,5vw,62px)] font-medium leading-none tracking-[-.03em]">Reset your password.</h1>
              <p className="mt-5 max-w-[46ch] text-sm leading-6 text-muted">Enter your account email and we will send a secure reset link.</p>
              <form className="mt-9" onSubmit={handleSubmit}>
                <label className="grid gap-2 text-xs font-medium text-muted">
                  Email address
                  <span className="flex min-h-12 items-center gap-3 border border-line bg-white px-4">
                    <Mail size={16} />
                    <input className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
                  </span>
                </label>
                <Button className="mt-6 w-full" type="submit" disabled={resetState.status === "sending"}>{resetState.status === "sending" ? "Sending" : "Send reset link"}</Button>
                {error && <p className="mt-5 border-l-2 border-wine px-4 text-xs leading-5 text-muted" role="alert">{error}</p>}
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
