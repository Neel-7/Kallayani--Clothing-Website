import { Link } from "react-router-dom";
import { collections } from "@/data/catalog";

export function CategoryBento() {
  return (
    <section className="px-gutter pb-8 pt-[30px] phone:py-[26px]" aria-labelledby="ways-title">
      <div className="text-center">
        <h2
          id="ways-title"
          className="mb-[22px] font-display text-[clamp(24px,2.15vw,34px)] font-semibold uppercase leading-[1.2] tracking-[-.015em] phone:mb-[18px] phone:text-[23px]"
        >
          Shop by category
        </h2>
      </div>
      <div className="grid grid-cols-5 gap-4 tablet:flex tablet:overflow-x-auto tablet:snap-x tablet:snap-mandatory tablet:pb-[6px] phone:gap-3">
        {collections.map((item) => (
          <Link
            key={item.slug}
            to={`/${item.slug}`}
            className="group block min-w-0 tablet:flex-[0_0_calc((100%-32px)/3)] tablet:snap-start phone:flex-[0_0_calc((100%-12px)/2.2)]"
          >
            <div className="aspect-[4/5] overflow-hidden bg-soft">
              <img
                className="h-full w-full object-cover transition-transform duration-[450ms] group-hover:scale-[1.025]"
                loading="lazy"
                src={item.categoryImage.src}
                alt={item.categoryImage.alt}
                style={{ objectPosition: item.categoryImage.position }}
              />
            </div>
            <span className="block px-1 pt-3 text-center text-[15px] font-medium group-hover:underline group-hover:underline-offset-4 phone:pt-2.5 phone:text-sm">
              {item.name === "Home" ? "Home décor" : item.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
