import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrandMark } from "./BrandMark";

export function Newsletter() {
  return (
    <section className="newsletter shell" id="newsletter">
      <div>
        <p className="section-kicker">Notes from the loom</p>
        <h2>A slower kind<br /><em>of inbox.</em></h2>
      </div>
      <form onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="email">First access to new edits, maker stories, and private appointments.</label>
        <div className="newsletter__field">
          <input id="email" type="email" placeholder="Email address" required />
          <Button type="submit">Join us <ArrowRight size={16} /></Button>
        </div>
      </form>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top shell">
        <BrandMark light />
        <p>Handloom clothing and objects from Bengal and South India, thoughtfully selected for life in the US.</p>
        <nav aria-label="Footer navigation">
          <Link to="/women">Women</Link><Link to="/men">Men</Link><Link to="/home">Home</Link><Link to="/jewellery">Jewellery</Link>
        </nav>
      </div>
      <div className="footer__bottom shell">
        <span>© 2026 Kallayani</span>
        <div><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
        <span>New York · Kolkata · Chennai</span>
      </div>
    </footer>
  );
}
