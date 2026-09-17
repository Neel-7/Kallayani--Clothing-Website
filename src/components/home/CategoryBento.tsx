import { Link } from "react-router-dom";
import { collections } from "@/data/catalog";

export function CategoryBento() {
  return (
    <section className="category-section" aria-labelledby="ways-title">
      <div className="category-section__heading">
        <h2 id="ways-title">Shop by category</h2>
      </div>
      <div className="category-bento">
        {collections.map((item) => (
          <Link key={item.slug} to={`/${item.slug}`} className="category-card">
            <div className="category-card__media"><img loading="lazy" src={item.categoryImage.src} alt={item.categoryImage.alt} style={{ objectPosition: item.categoryImage.position }} /></div>
            <span>{item.name === "Home" ? "Home décor" : item.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
