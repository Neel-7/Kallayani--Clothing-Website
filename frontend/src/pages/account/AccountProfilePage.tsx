import { Check, Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AccountError } from "@/components/account/AccountLayout";
import { Button } from "@/components/ui/button";
import { authRepository } from "@/data/auth";
import { apiErrorMessage } from "@/store/api-error";
import { authAuthenticated } from "@/store/customer-auth";
import type { RootState } from "@/store/store";
import { useGetProfileQuery, useUpsertProfileMutation } from "@/store/customer-api";

export function AccountProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.customerAuth.user)!;
  const profile = useGetProfileQuery();
  const [saveProfile, saveState] = useUpsertProfileMutation();
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    document.title = "Profile | Kallayani";
  }, []);

  if (profile.error) {
    return <AccountError message="Your profile could not be loaded." onRetry={profile.refetch} />;
  }

  if (profile.isLoading) return <ProfileSkeleton />;

  const data = profile.data;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");
    const form = new FormData(event.currentTarget);
    const firstName = String(form.get("firstName") ?? "").trim();
    const lastName = String(form.get("lastName") ?? "").trim();
    try {
      await saveProfile({
        firstName,
        lastName,
        marketingOptIn: form.get("marketingOptIn") === "on",
      }).unwrap();
      const updatedUser = await authRepository.updateName(firstName, lastName);
      dispatch(authAuthenticated(updatedUser));
      setFeedback("Your profile has been updated.");
    } catch (error) {
      setFeedback(apiErrorMessage(error, "Your profile could not be updated. Please try again."));
    }
  };

  return (
    <div>
      <header>
        <h1 className="font-editorial text-[clamp(42px,5vw,62px)] font-medium leading-none tracking-[-.03em]">Profile.</h1>
        <p className="mt-4 text-sm leading-6 text-muted">Keep your name and communication preferences current.</p>
      </header>

      <form className="mt-10 max-w-2xl border-t border-line pt-7" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6 phone:grid-cols-1">
          <Field label="First name" name="firstName" autoComplete="given-name" defaultValue={data?.firstName || user.firstName} />
          <Field label="Last name" name="lastName" autoComplete="family-name" defaultValue={data?.lastName || user.lastName} />
        </div>
        <label className="mt-6 grid gap-2 text-xs font-medium text-muted">
          Email address
          <span className="flex min-h-12 items-center gap-3 border border-line bg-soft px-4 text-sm text-ink">
            <Mail size={16} /> {data?.email || user.email}
          </span>
        </label>

        <div className="mt-5 flex items-start justify-between gap-5 border border-line p-4 phone:flex-col">
          <span className="flex items-start gap-3 text-sm">
            <ShieldCheck className="mt-0.5 shrink-0 text-wine" size={18} />
            <span>
              <strong className="block font-medium">Email {user.emailVerified ? "verified" : "not verified"}</strong>
              <span className="mt-1 block text-xs leading-5 text-muted">
                {user.emailVerified ? "Your email address has been confirmed." : "Confirm your email to secure your account."}
              </span>
            </span>
          </span>
          {!user.emailVerified && <Link className="shrink-0 text-xs text-wine underline underline-offset-4" to="/account/verify-email">Verify email</Link>}
        </div>

        <label className="mt-7 flex cursor-pointer items-start gap-3 text-sm">
          <input className="peer sr-only" defaultChecked={data?.marketingOptIn} name="marketingOptIn" type="checkbox" />
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center border border-line text-transparent peer-checked:border-wine peer-checked:bg-wine peer-checked:text-white">
            <Check size={13} />
          </span>
          <span>
            <strong className="block font-medium">Kallayani notes</strong>
            <span className="mt-1 block text-xs leading-5 text-muted">Receive new collection and maker-story emails.</span>
          </span>
        </label>

        <div className="mt-8 flex items-center gap-5">
          <Button type="submit" disabled={saveState.isLoading}>{saveState.isLoading ? "Saving" : "Save profile"}</Button>
          {feedback && <p className="text-xs leading-5 text-muted" role="status">{feedback}</p>}
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, autoComplete, defaultValue }: { label: string; name: string; autoComplete: string; defaultValue: string }) {
  return (
    <label className="grid gap-2 text-xs font-medium text-muted">
      {label}
      <input className="min-h-12 border border-line bg-white px-4 text-sm text-ink outline-none focus:border-wine" name={name} autoComplete={autoComplete} defaultValue={defaultValue} required />
    </label>
  );
}

function ProfileSkeleton() {
  return <div className="min-h-[460px] animate-pulse bg-soft" aria-label="Loading profile" />;
}
