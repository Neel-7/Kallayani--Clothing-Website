import type { Subcategory } from "@/types/catalog";

export function SubcategoryShelf({ items }: { items: Subcategory[] }) {
  const isPair = items.length === 2;
  const hasIncompleteRow = items.length % 4 !== 0;

  return (
    <section
      className="px-gutter pb-8 pt-[30px] phone:py-[26px]"
      id="shop-category"
      aria-labelledby="subcategory-title"
    >
      <div className="text-center">
        <h2
          id="subcategory-title"
          className="mb-[22px] font-editorial text-[clamp(30px,2.5vw,42px)] font-semibold leading-[1.1] tracking-[-.02em] phone:mb-[18px] phone:text-[28px]"
        >
          Shop by category
        </h2>
      </div>
      <div
        className={
          isPair
            ? "mx-auto grid w-full max-w-[1120px] grid-cols-2 gap-5 tablet:max-w-[820px] tablet:gap-4 phone:gap-3"
            : hasIncompleteRow
              ? "flex flex-wrap justify-center gap-4 tablet:gap-y-6 phone:gap-x-3 phone:gap-y-[22px]"
              : "grid grid-cols-4 gap-4 tablet:grid-cols-2 tablet:gap-x-4 tablet:gap-y-6 phone:gap-x-3 phone:gap-y-[22px]"
        }
      >
        {items.map((item) => (
          <a
            className={`group block min-w-0 ${!isPair && hasIncompleteRow ? "w-[calc((100%-48px)/4)] tablet:w-[calc((100%-16px)/2)] phone:w-[calc((100%-12px)/2)]" : ""}`}
            href="#products"
            key={item.name}
          >
            <div
              className={`${isPair ? "aspect-[5/4] phone:aspect-[4/5]" : "aspect-[4/5]"} overflow-hidden bg-soft`}
            >
              <img
                className="h-full w-full object-cover transition-transform duration-[450ms] group-hover:scale-[1.025]"
                loading="lazy"
                src={item.image.src}
                alt={item.image.alt}
                style={{ objectPosition: item.image.position }}
              />
            </div>
            <span
              className={`block px-1 text-center font-ui font-medium leading-[1.35] group-hover:underline group-hover:underline-offset-4 ${isPair ? "pt-3.5 text-[19px] phone:pt-2.5 phone:text-[16px]" : "pt-3 text-[17px] phone:pt-2.5 phone:text-[16px]"}`}
            >
              {item.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
