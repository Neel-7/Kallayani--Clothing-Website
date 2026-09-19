import { Link } from "react-router-dom";
import { primaryNavItems } from "@/components/layout/header/mega-menu-data";

const categoryImages: Record<string, { src: string; alt: string; position: string }> = {
  women: {
    src: "/images/women/home-category.webp",
    alt: "Two women wearing a rust handwoven dress and an ivory Jamdani saree",
    position: "50% 36%",
  },
  men: {
    src: "/images/men/home-category.webp",
    alt: "Man wearing a rust handwoven panjabi beside an indigo doorway",
    position: "50% 32%",
  },
  kids: {
    src: "/images/kids/home-category.webp",
    alt: "Three children laughing through the windows of a colorful cardboard playhouse",
    position: "50% 42%",
  },
  home: {
    src: "/images/home-edit.webp",
    alt: "Bedroom with hand-block printed bedding and cushions",
    position: "50% 55%",
  },
  traditional: {
    src: "/images/three_girl_traditional.png",
    alt: "Three women wearing traditional sarees",
    position: "50% 45%",
  },
  gifts: {
    src: "/images/home-tablecloth.webp",
    alt: "Hand-block printed tablecloth on a set dining table",
    position: "50% 46%",
  },
  jewellery: {
    src: "/images/jewellery-campaign-v3.webp",
    alt: "Woman wearing handcrafted gold and garnet jewellery",
    position: "50% 34%",
  },
  wedding: {
    src: "/images/heritage_travels_beauty.png",
    alt: "Couple wearing traditional dress outdoors",
    position: "50% 42%",
  },
};

export function CategoryGrid() {
  return (
    <section
      className="px-[clamp(8px,1vw,18px)] pb-11 pt-9 phone:pb-8 phone:pt-7"
      id="shop-by-category"
      aria-labelledby="ways-title"
    >
      <div className="w-full">
        <h2
          id="ways-title"
          className="mb-7 text-center font-editorial text-[clamp(30px,2.5vw,42px)] font-semibold leading-[1.1] tracking-[-.02em] phone:mb-5 phone:text-[28px]"
        >
          Shop by category
        </h2>
        <div className="grid grid-cols-4 gap-x-4 gap-y-5 tablet:grid-cols-2 phone:gap-x-3 phone:gap-y-4">
          {primaryNavItems.map((item) => {
            const image = categoryImages[item.id];
            return (
              <Link
                key={item.id}
                to={item.viewAllHref}
                className="group block min-w-0 bg-white shadow-[0_2px_8px_rgba(44,30,25,0.11)] transition-shadow duration-200 hover:shadow-[0_4px_13px_rgba(44,30,25,0.15)] focus-visible:outline-offset-4"
              >
                <div className="aspect-[1.06/1] overflow-hidden bg-soft">
                  <img
                    className="h-full w-full object-cover transition-transform duration-[450ms] group-hover:scale-[1.025]"
                    loading="lazy"
                    src={image.src}
                    alt={image.alt}
                    style={{ objectPosition: image.position }}
                  />
                </div>
                <span className="flex min-h-[50px] items-center justify-center px-2 py-2 text-center font-ui text-[17px] font-medium leading-[1.3] tracking-[.005em] group-hover:text-wine phone:min-h-[48px] phone:text-[16px]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
