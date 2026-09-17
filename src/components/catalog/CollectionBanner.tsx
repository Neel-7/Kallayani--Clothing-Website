import type { Collection } from "@/types/catalog";

export function CollectionBanner({ collection }: { collection: Collection }) {
  return (
    <section className={`collection-banner collection-banner--${collection.slug}`}>
      <img fetchPriority="high" src={collection.hero.src} alt={collection.hero.alt} style={{ objectPosition: collection.hero.position }} />
      <div className="collection-banner__copy">
        <h1>{collection.name}</h1>
        <a className="campaign-link" href="#shop-category">Explore the collection</a>
      </div>
    </section>
  );
}
