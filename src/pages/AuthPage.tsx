import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandMark } from "@/components/layout/BrandMark";

type AuthMode = "login" | "signup";

const authCopy = {
  login: {
    eyebrow: "Welcome back",
    title: "Return to your collection.",
    description: "Sign in to revisit saved pieces, follow your orders, and continue your story.",
    image: "/images/auth/login-homecoming.webp",
    imageAlt: "A quiet homecoming in a rain-lit heritage room",
    quote: "Clothes carry memory. Your wardrobe should too.",
    submit: "Sign in",
  },
  signup: {
    eyebrow: "Join Kallayani",
    title: "Begin your private edit.",
    description:
      "Create an account for thoughtful recommendations, early access, and a quieter way to shop.",
    image: "/images/auth/signup-beginning.webp",
    imageAlt: "Three generations sharing a newly woven textile in a sunlit atelier",
    quote: "A slower wardrobe, shaped by craft and chosen with intention.",
    submit: "Create account",
  },
} as const;

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="size-[18px]" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.33 2.98-7.39Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.62-2.38l-3.24-2.53c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.13H3.06v2.61A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.92A6 6 0 0 1 6.08 12c0-.67.12-1.32.32-1.92V7.47H3.06A10 10 0 0 0 2 12c0 1.63.39 3.17 1.06 4.53l3.34-2.61Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.88A9.65 9.65 0 0 0 12 2a10 10 0 0 0-8.94 5.47l3.34 2.61c.79-2.37 3-4.13 5.6-4.13Z"
      />
    </svg>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="group relative border-b border-[#bdb4a9] transition-colors duration-300 focus-within:border-wine">
      <label
        className="block text-[11px] font-medium uppercase tracking-[.14em] text-[#756d65]"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="flex items-center gap-3">
        <LockKeyhole
          aria-hidden="true"
          className="size-[17px] shrink-0 text-[#8d8379] transition-colors group-focus-within:text-wine"
        />
        <input
          autoComplete={autoComplete}
          className="min-w-0 flex-1 border-0 bg-transparent py-3 text-[15px] text-ink outline-none placeholder:text-[#aaa198]"
          id={id}
          minLength={8}
          onChange={onChange ? (event) => onChange(event.target.value) : undefined}
          placeholder="At least 8 characters"
          required
          type={visible ? "text" : "password"}
          value={value}
        />
        <button
          aria-label={visible ? "Hide password" : "Show password"}
          className="grid size-10 shrink-0 place-items-center text-[#756d65] transition-colors hover:text-wine"
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          {visible ? <EyeOff aria-hidden="true" size={17} /> : <Eye aria-hidden="true" size={17} />}
        </button>
      </div>
    </div>
  );
}

export function AuthPage({ mode }: { mode: AuthMode }) {
  const pageRef = useRef<HTMLElement>(null);
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const copy = authCopy[mode];
  const isSignup = mode === "signup";

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "instant" });
    const frame = window.requestAnimationFrame(() =>
      window.scrollTo({ top: 0, behavior: "instant" }),
    );
    document.title = `${isSignup ? "Create account" : "Sign in"} — Kallayani`;
    setPassword("");
    setSubmitted(false);
    return () => window.cancelAnimationFrame(frame);
  }, [isSignup]);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .fromTo(
          "[data-auth-image]",
          { scale: 0.88, opacity: 0.35 },
          { scale: 1, opacity: 1, duration: 1.5 },
        )
        .fromTo(
          "[data-auth-brand]",
          { y: -14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          0.15,
        )
        .fromTo(
          "[data-auth-word]",
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.08 },
          0.35,
        )
        .fromTo(
          "[data-auth-form]",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          0.45,
        );
    },
    { scope: pageRef, dependencies: [mode], revertOnUpdate: true },
  );

  const passwordScore = Math.min(
    3,
    (password.length >= 8 ? 1 : 0) +
      (/[A-Z]/.test(password) ? 1 : 0) +
      (/\d|[^A-Za-z]/.test(password) ? 1 : 0),
  );

  return (
    <main
      ref={pageRef}
      className="min-h-[100svh] w-full max-w-full overflow-x-hidden bg-[#f3eee7] font-['Satoshi','Jost',sans-serif]"
    >
      <div className="grid min-h-[100svh] grid-flow-dense grid-cols-12">
        <section
          className="sticky top-0 col-span-7 h-[100svh] min-h-0 self-start overflow-hidden bg-wine tablet:relative tablet:col-span-12 tablet:h-[46svh] tablet:min-h-[46svh]"
          aria-label="Kallayani story"
        >
          <img
            data-auth-image
            alt={copy.imageAlt}
            className={`absolute inset-0 size-full object-cover ${isSignup ? "object-[52%_48%]" : "object-[58%_48%]"}`}
            src={copy.image}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,10,8,.58)_0%,rgba(20,10,8,.04)_38%,rgba(24,8,9,.74)_100%)]" />
          <div className="absolute inset-0 opacity-[.16] [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_120_120%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%22.9%22_numOctaves=%222%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%22.45%22/%3E%3C/svg%3E')]" />

          <div
            data-auth-brand
            className="absolute left-[clamp(22px,3vw,52px)] top-[clamp(22px,3vw,44px)] z-10"
          >
            <BrandMark light />
          </div>

          <div className="absolute inset-x-[clamp(22px,5vw,76px)] bottom-[clamp(34px,8vh,88px)] z-10 max-w-2xl text-white tablet:bottom-8 tablet:max-w-[600px]">
            <blockquote className="font-editorial text-[clamp(36px,3.6vw,58px)] font-medium leading-[.95] tracking-[-.045em] tablet:text-[clamp(32px,7vw,54px)] phone:text-[30px]">
              {copy.quote.split(" ").map((word, index) => (
                <span
                  data-auth-word
                  className="mr-[.22em] inline-block"
                  key={`${mode}-${word}-${index}`}
                >
                  {word}
                </span>
              ))}
            </blockquote>
          </div>

        </section>

        <section
          id="auth-form"
          className="relative col-span-5 flex min-h-[100svh] items-center justify-center overflow-hidden px-[clamp(28px,5vw,88px)] py-16 tablet:col-span-12 tablet:min-h-0 phone:px-5 phone:py-12"
        >
          <div className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-[#caaa83]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-wine/10 blur-3xl" />

          <div data-auth-form className="relative z-10 w-full max-w-[460px]">
            <Link
              className="mb-10 flex w-max items-center gap-2 text-[11px] font-medium uppercase tracking-[.14em] text-[#6f675f] transition-colors hover:text-wine phone:mb-8"
              to="/"
            >
              <ArrowLeft aria-hidden="true" size={14} /> Back to the collection
            </Link>

            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[.2em] text-wine">
              {copy.eyebrow}
            </p>
            <h1 className="max-w-2xl font-editorial text-[clamp(43px,4vw,62px)] font-medium leading-[.93] tracking-[-.045em] text-ink">
              {copy.title}
            </h1>
            <p className="mb-8 mt-5 max-w-[430px] text-[14px] leading-[1.75] text-[#6b625a]">
              {copy.description}
            </p>

            <button
              className="group flex min-h-12 w-full items-center justify-center gap-3 border border-[#c9c0b7] bg-white/55 px-5 text-[13px] font-medium tracking-[.02em] text-ink transition-all duration-300 hover:border-[#9f9388] hover:bg-white"
              type="button"
            >
              <GoogleMark /> Continue with Google
            </button>

            <div className="my-7 flex items-center gap-4 text-[10px] uppercase tracking-[.18em] text-[#8a8179]">
              <span className="h-px flex-1 bg-[#d6cec6]" /> or continue with email{" "}
              <span className="h-px flex-1 bg-[#d6cec6]" />
            </div>

            <form
              className="space-y-6"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              {isSignup && (
                <div className="grid grid-cols-2 gap-5 phone:grid-cols-1">
                  <label className="border-b border-[#bdb4a9] pb-3 text-[11px] font-medium uppercase tracking-[.14em] text-[#756d65] focus-within:border-wine">
                    First name
                    <input
                      autoComplete="given-name"
                      className="mt-1 w-full border-0 bg-transparent text-[15px] normal-case tracking-normal text-ink outline-none placeholder:text-[#aaa198]"
                      name="firstName"
                      placeholder="Your first name"
                      required
                    />
                  </label>
                  <label className="border-b border-[#bdb4a9] pb-3 text-[11px] font-medium uppercase tracking-[.14em] text-[#756d65] focus-within:border-wine">
                    Last name
                    <input
                      autoComplete="family-name"
                      className="mt-1 w-full border-0 bg-transparent text-[15px] normal-case tracking-normal text-ink outline-none placeholder:text-[#aaa198]"
                      name="lastName"
                      placeholder="Your last name"
                      required
                    />
                  </label>
                </div>
              )}

              <div className="group border-b border-[#bdb4a9] transition-colors duration-300 focus-within:border-wine">
                <label
                  className="block text-[11px] font-medium uppercase tracking-[.14em] text-[#756d65]"
                  htmlFor={`${mode}-email`}
                >
                  Email address
                </label>
                <div className="flex items-center gap-3">
                  <Mail
                    aria-hidden="true"
                    className="size-[17px] shrink-0 text-[#8d8379] transition-colors group-focus-within:text-wine"
                  />
                  <input
                    autoComplete="email"
                    className="min-w-0 flex-1 border-0 bg-transparent py-3 text-[15px] text-ink outline-none placeholder:text-[#aaa198]"
                    id={`${mode}-email`}
                    placeholder="you@example.com"
                    required
                    type="email"
                  />
                </div>
              </div>

              <PasswordField
                autoComplete={isSignup ? "new-password" : "current-password"}
                id={`${mode}-password`}
                label="Password"
                onChange={isSignup ? setPassword : undefined}
                value={isSignup ? password : undefined}
              />

              {isSignup && password.length > 0 && (
                <div aria-live="polite" className="-mt-3">
                  <div className="grid grid-cols-3 gap-1.5">
                    {[1, 2, 3].map((level) => (
                      <span
                        className={`h-[2px] transition-colors ${passwordScore >= level ? "bg-wine" : "bg-[#d8d0c8]"}`}
                        key={level}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-[#746b63]">
                    Use 8 characters with a capital and a number or symbol.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 text-[12px] text-[#675f57]">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input className="peer sr-only" type="checkbox" required={isSignup} />
                  <span className="grid size-4 place-items-center border border-[#9f958c] bg-transparent text-transparent transition-colors peer-checked:border-wine peer-checked:bg-wine peer-checked:text-white">
                    <Check aria-hidden="true" size={11} />
                  </span>
                  {isSignup ? "I agree to the terms" : "Remember me"}
                </label>
                {!isSignup && (
                  <a
                    className="border-b border-transparent transition-colors hover:border-wine hover:text-wine"
                    href="mailto:care@kallayani.com?subject=Password%20reset"
                  >
                    Forgot password?
                  </a>
                )}
              </div>

              <button
                className="group flex min-h-[52px] w-full items-center justify-between bg-wine px-5 text-[12px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:bg-[#681b20]"
                type="submit"
              >
                {copy.submit}
                <span className="grid size-7 place-items-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight aria-hidden="true" size={15} />
                </span>
              </button>

              {submitted && (
                <p
                  aria-live="polite"
                  className="border-l-2 border-wine bg-white/50 px-4 py-3 text-[12px] leading-relaxed text-[#574f48]"
                >
                  Your details look good. Secure account services can now be connected to this form.
                </p>
              )}
            </form>

            <p className="mt-8 text-center text-[13px] text-[#6c645c]">
              {isSignup ? "Already have an account?" : "New to Kallayani?"}{" "}
              <Link
                className="font-medium text-wine underline decoration-wine/35 underline-offset-4 transition-colors hover:decoration-wine"
                to={isSignup ? "/login" : "/signup"}
              >
                {isSignup ? "Sign in" : "Create an account"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
