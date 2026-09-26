import type { Collection } from "@/types/catalog";

export function CollectionBanner({ collection }: { collection: Collection }) {
  return (
    <section className="relative h-[min(50vw,calc(100svh-130px))] min-h-[420px] max-h-[1020px] overflow-hidden bg-soft after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(transparent_50%,#17141266)] tablet:h-[62vw] tablet:min-h-[460px] tablet:max-h-[620px] phone:h-[min(68svh,580px)] phone:min-h-[450px]">
      <img
        className={`h-full w-full object-cover desktop:!object-top ${collection.slug === "men" ? "phone:!object-[45%_50%]" : ""}`}
        fetchPriority="high"
        src={collection.hero.src}
        alt={collection.hero.alt}
        style={{ objectPosition: collection.hero.position }}
      />
      <div className="absolute bottom-[50px] left-1/2 z-[2] w-[90%] -translate-x-1/2 text-center text-white phone:bottom-[30px]">
        <h1 className="mb-[14px] font-editorial text-[clamp(52px,5.4vw,82px)] font-medium leading-[.98] tracking-[-.025em] [text-shadow:0_1px_15px_#0003] phone:text-[44px]">
          {collection.name}
        </h1>
        <a
          className="inline-flex min-h-11 items-center text-sm underline underline-offset-[6px]"
          href="#shop-category"
        >
          Explore the collection
        </a>
      </div>
    </section>
  );
}
