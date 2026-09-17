import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { editorialFeatures } from "@/data/catalog";

function EditorialCopy({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="editorial-card__copy">
      <h2>{title}</h2>
      <p>{description}</p>
      <Button asChild>
        <Link to={href}>Shop now</Link>
      </Button>
    </div>
  );
}

export function EditorialImages() {
  const [left, right, wide] = editorialFeatures;
  return (
    <section className="editorial-images" aria-label="Featured edits">
      <div className="editorial-duet">
        {[left, right].map((feature) => (
          <article className="editorial-card" key={feature.title}>
            <img
              loading="lazy"
              src={feature.image.src}
              alt={feature.image.alt}
              style={{ objectPosition: feature.image.position }}
            />
            <Link
              className="editorial-card__image-link"
              to={feature.href}
              aria-label={`Shop ${feature.title}`}
            />
            <EditorialCopy {...feature} />
          </article>
        ))}
      </div>
      <article className="editorial-card editorial-card--wide">
        <img
          loading="lazy"
          src={wide.image.src}
          alt={wide.image.alt}
          style={{ objectPosition: wide.image.position }}
        />
        <Link
          className="editorial-card__image-link"
          to={wide.href}
          aria-label={`Shop ${wide.title}`}
        />
        <EditorialCopy {...wide} />
      </article>
    </section>
  );
}
