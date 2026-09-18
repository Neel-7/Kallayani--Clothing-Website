import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrandMark } from "./BrandMark";

export function Newsletter({ showTopBorder = true }: { showTopBorder?: boolean }) {
  return (
    <section
      className={`mx-gutter grid grid-cols-2 items-center gap-16 py-10 compact:gap-8 phone:grid-cols-1 phone:gap-6 phone:py-[30px] ${showTopBorder ? "border-t border-line" : ""}`}
      id="newsletter"
    >
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-[.12em] text-wine">
          Notes from the loom
        </p>
        <h2 className="font-serif text-[38px] font-normal leading-[1.05] tracking-[-.03em] tablet:text-[32px] phone:text-[34px]">
          A slower kind <em className="font-normal text-wine">of inbox.</em>
        </h2>
      </div>
      <form onSubmit={(event) => event.preventDefault()}>
        <label className="mb-[15px] block text-sm leading-[1.5] text-muted" htmlFor="email">
          First access to new edits, maker stories, and private appointments.
        </label>
        <div className="flex border-b border-ink">
          <input
            className="min-w-0 flex-1 border-0 bg-transparent py-3 text-[15px]"
            id="email"
            type="email"
            placeholder="Email address"
            required
          />
          <Button className="phone:px-4" type="submit">
            Join us <ArrowRight size={16} />
          </Button>
        </div>
      </form>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-white [&_a:hover]:underline [&_a:hover]:underline-offset-4">
      <div className="mx-gutter grid grid-cols-[1fr_1.2fr_.8fr] items-start gap-16 py-11 compact:gap-8 tablet:grid-cols-2 phone:gap-6 phone:py-8 phone:[&>a]:col-span-full">
        <BrandMark light />
        <p className="max-w-[440px] text-sm leading-[1.7] text-[#c8c3bf] tablet:col-start-1 phone:col-span-full">
          Handloom clothing and objects from Bengal and South India, thoughtfully selected for life
          in the US.
        </p>
        <nav
          className="grid grid-cols-2 justify-self-end gap-x-10 gap-y-3 tablet:col-start-2 tablet:row-span-2 phone:col-span-full phone:row-auto phone:justify-self-start phone:gap-x-16 phone:gap-y-4"
          aria-label="Footer navigation"
        >
          <Link to="/women">Women</Link>
          <Link to="/men">Men</Link>
          <Link to="/home">Home</Link>
          <Link to="/jewellery">Jewellery</Link>
        </nav>
      </div>
      <div className="mx-gutter flex justify-between gap-6 border-t border-[#393532] py-5 text-xs text-[#b4afaa] phone:flex-wrap phone:gap-4 phone:text-[11px] phone:[&>span:last-child]:w-full">
        <span>© 2026 Kallayani</span>
        <div className="flex gap-6">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
        <span>New York · Kolkata · Chennai</span>
      </div>
    </footer>
  );
}
