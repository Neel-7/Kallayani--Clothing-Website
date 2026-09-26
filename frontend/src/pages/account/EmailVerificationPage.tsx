import { CheckCircle2, MailCheck, RefreshCw, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authRepository } from "@/data/auth";
import {
  authAuthenticated,
  verificationFailed,
  verificationSending,
  verificationSent,
} from "@/store/customer-auth";
import type { RootState } from "@/store/store";

export function EmailVerificationPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.customerAuth);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const user = authState.user!;

  useEffect(() => {
    document.title = "Verify email | Kallayani";
  }, []);

  const sendVerification = async () => {
    dispatch(verificationSending());
    setMessage("");
    try {
      await authRepository.sendEmailVerification();
      dispatch(verificationSent());
      setMessage("A new verification email has been sent.");
    } catch (error) {
      dispatch(verificationFailed());
      setMessage(error instanceof Error ? error.message : "The verification email could not be sent.");
    }
  };

  const checkStatus = async () => {
    setChecking(true);
    setMessage("");
    try {
      const refreshed = await authRepository.refreshUser();
      dispatch(authAuthenticated(refreshed));
      setMessage(refreshed.emailVerified ? "Your email is now verified." : "Verification is still pending. Open the link in your email, then check again.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Verification status could not be refreshed.");
    } finally {
      setChecking(false);
    }
  };

  if (user.emailVerified) {
    return (
      <div className="flex min-h-[460px] flex-col items-start justify-center bg-soft p-10 phone:p-6">
        <CheckCircle2 className="text-wine" size={32} strokeWidth={1.5} />
        <h1 className="mt-6 font-editorial text-[clamp(42px,5vw,62px)] font-medium leading-none">Email verified.</h1>
        <p className="mt-4 max-w-[46ch] text-sm leading-6 text-muted">Your email address has been confirmed and your account is ready.</p>
        <Button className="mt-7" asChild><Link to="/account">Return to account</Link></Button>
      </div>
    );
  }

  return (
    <div>
      <MailCheck className="text-wine" size={30} strokeWidth={1.5} />
      <h1 className="mt-6 font-editorial text-[clamp(42px,5vw,62px)] font-medium leading-none tracking-[-.03em]">Verify your email.</h1>
      <p className="mt-4 max-w-[54ch] text-sm leading-6 text-muted">
        We sent a verification link to <strong className="font-medium text-ink">{user.email}</strong>. Open it, then return here to confirm.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Button type="button" onClick={checkStatus} disabled={checking}><RefreshCw size={15} /> {checking ? "Checking" : "Check status"}</Button>
        <Button type="button" variant="outline" onClick={sendVerification} disabled={authState.verification.status === "sending"}><Send size={15} /> {authState.verification.status === "sending" ? "Sending" : "Send another email"}</Button>
      </div>
      {message && <p className="mt-6 max-w-[52ch] border-l-2 border-wine bg-soft px-4 py-3 text-xs leading-5 text-muted" role="status">{message}</p>}
    </div>
  );
}
