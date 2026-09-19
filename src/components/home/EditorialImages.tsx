import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { editorialFeatures } from "@/data/catalog";

function EditorialCopy({
  title,
  description,
  href,
  wide = false,
}: {
  title: string;
  description: string;
  href: string;
  wide?: boolean;
}) {
  return (
    <div
      className={
        wide
          ? "absolute bottom-9 left-[5%] max-w-[420px] bg-white/95 px-8 py-6 text-left phone:bottom-4 phone:left-4 phone:right-4 phone:p-5"
          : "px-4 pb-6 pt-5 text-center phone:py-[18px] phone:pb-5"
      }
    >
      <h2 className="font-editorial text-[clamp(30px,2.7vw,42px)] font-semibold leading-[1.1] tracking-[-.025em] phone:text-[30px]">
        {title}
      </h2>
      <p className="mb-3 mt-2 text-sm text-muted">{description}</p>
      <Button
        asChild
        className={`!min-h-9 !border-0 !bg-transparent !px-2 !text-xs !text-ink underline underline-offset-[5px] hover:!text-wine ${wide ? "!px-0" : ""}`}
      >
        <Link to={href}>Shop now</Link>
      </Button>
    </div>
  );
}

export function EditorialImages() {
  const [left, right, wide] = editorialFeatures;
  return (
    <section className="px-gutter pb-7" aria-label="Featured edits">
      <div className="grid grid-cols-2 gap-4 phone:grid-cols-1 phone:gap-2">
        {[left, right].map((feature) => (
          <article className="relative min-w-0" key={feature.title}>
            <img
              className="h-[clamp(350px,37vw,620px)] w-full object-cover tablet:h-[420px] phone:h-[105vw] phone:max-h-[560px]"
              loading="lazy"
              src={feature.image.src}
              alt={feature.image.alt}
              style={{ objectPosition: feature.image.position }}
            />
            <Link
              className="absolute inset-x-0 top-0 h-[clamp(350px,37vw,620px)] tablet:h-[420px] phone:h-[105vw] phone:max-h-[560px]"
              to={feature.href}
              aria-label={`Shop ${feature.title}`}
            />
            <EditorialCopy {...feature} />
          </article>
        ))}
      </div>
      <article className="relative mt-2 min-w-0">
        <img
          className="h-[clamp(350px,35vw,560px)] w-full object-cover phone:h-[440px]"
          loading="lazy"
          src={wide.image.src}
          alt={wide.image.alt}
          style={{ objectPosition: wide.image.position }}
        />
        <Link
          className="absolute inset-x-0 top-0 h-[clamp(350px,35vw,560px)] phone:h-[440px]"
          to={wide.href}
          aria-label={`Shop ${wide.title}`}
        />
        <EditorialCopy {...wide} wide />
      </article>
    </section>
  );
}
