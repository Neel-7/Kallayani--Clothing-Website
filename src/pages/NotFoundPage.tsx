import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="not-found shell">
      <p className="section-kicker">Page not found</p>
      <h1>
        This thread ends here.
        <br />
        <em>Let’s find another.</em>
      </h1>
      <Link className="solid-link" to="/">
        Return home <ArrowLeft size={16} />
      </Link>
    </section>
  );
}
