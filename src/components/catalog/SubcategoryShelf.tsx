import type { Subcategory } from "@/types/catalog";

export function SubcategoryShelf({ name, items }: { name: string; items: Subcategory[] }) {
  return (
    <section className="subcategory-section" id="shop-category" aria-labelledby="subcategory-title">
      <div className="subcategory-section__heading">
        <h2 id="subcategory-title">Shop {name.toLowerCase()} by category</h2>
      </div>
      <div className="subcategory-grid">
        {items.map((item) => (
          <a className="subcategory-card" href="#products" key={item.name}>
            <div className="category-card__media">
              <img
                loading="lazy"
                src={item.image.src}
                alt={item.image.alt}
                style={{ objectPosition: item.image.position }}
              />
            </div>
            <span>{item.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
