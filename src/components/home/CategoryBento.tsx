import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { collections } from "@/data/catalog";

const classNames = ["category-card--women", "category-card--men", "category-card--kids", "category-card--home", "category-card--jewellery"];

export function CategoryBento() {
  return (
    <section className="category-section" aria-labelledby="ways-title">
      <div className="category-section__heading">
        <p className="section-kicker">Explore Kallayani</p>
        <h2 id="ways-title">Shop by category</h2>
      </div>
      <div className="category-bento">
        {collections.map((item, index) => (
          <Link key={item.slug} to={`/${item.slug}`} className={`category-card ${classNames[index]}`}>
            <img src={item.hero.src} alt={item.hero.alt} style={{ objectPosition: item.hero.position }} />
            <span>{item.name}<ArrowUpRight size={18} strokeWidth={1.5} /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
