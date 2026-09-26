import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <section className="mx-gutter flex min-h-[65vh] flex-col items-start justify-center">
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-[.12em] text-wine">
        Page not found
      </p>
      <h1 className="mb-8 font-editorial text-[clamp(48px,7vw,96px)] font-medium leading-none tracking-[-.03em]">
        This thread ends here.
        <br />
        <em className="text-red">Let’s find another.</em>
      </h1>
      <Button asChild>
        <Link to="/">
          Return home <ArrowLeft size={16} />
        </Link>
      </Button>
    </section>
  );
}
