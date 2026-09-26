import { useEffect, useMemo, useState } from "react";
import { ExternalLink, HardDriveUpload, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { listAdminProducts } from "@/admin/admin-repository";
import type { ProductDocument, ProductImage } from "@/types/admin";

type MediaEntry = { image: ProductImage; product: ProductDocument; primary: boolean };

export function AdminMediaPage() {
  const [products, setProducts] = useState<ProductDocument[]>([]);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<"all" | "storage" | "legacy">("all");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Media — Kallayani catalogue";
    void listAdminProducts()
      .then(setProducts)
      .catch((reason) => setError(reason.message));
  }, []);

  const media = useMemo(() => {
    const entries: MediaEntry[] = [];
    for (const product of products) {
      const images = [product.primaryImage, ...product.gallery].filter(Boolean) as ProductImage[];
      const unique = images.filter(
        (image, index) => images.findIndex((candidate) => candidate.id === image.id) === index,
      );
      for (const image of unique)
        entries.push({ image, product, primary: product.primaryImage?.id === image.id });
    }
    return entries;
  }, [products]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return media.filter(({ image, product }) => {
      if (needle && !`${product.title} ${product.slug} ${image.alt}`.toLowerCase().includes(needle))
        return false;
      if (source === "storage" && !image.storagePath) return false;
      if (source === "legacy" && image.storagePath) return false;
      return true;
    });
  }, [media, search, source]);

  const storageCount = media.filter((entry) => entry.image.storagePath).length;
  const legacyCount = media.length - storageCount;

  return (
    <div className="mx-auto max-w-[1500px]">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-wine">Assets</p>
        <h1 className="mt-2 font-editorial text-5xl leading-none tracking-[-.035em] sm:text-6xl">
          Media library
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
          Review every image referenced by a product. Uploads, replacement, primary selection, and
          removal remain attached to the product editor so media cannot become detached
          accidentally.
        </p>
      </div>
      {error && (
        <p className="mt-6 border-l-2 border-red bg-red/5 px-4 py-3 text-sm text-red">{error}</p>
      )}

      <section className="mt-8 grid gap-px bg-[#d8d1c7] sm:grid-cols-3">
        {[
          { label: "Referenced media", value: media.length },
          { label: "Firebase Storage", value: storageCount },
          { label: "Awaiting migration", value: legacyCount },
        ].map((item) => (
          <article className="bg-[#faf8f4] p-6" key={item.label}>
            <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-muted">
              {item.label}
            </p>
            <p className="mt-4 font-editorial text-5xl leading-none">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-3 border border-[#d8d1c7] bg-[#faf8f4] p-4 sm:grid-cols-[1fr_220px]">
        <label className="relative">
          <Search className="absolute left-3 top-3 text-muted" size={16} />
          <input
            className="h-11 w-full border border-[#cec6bd] bg-white pl-10 pr-3 text-sm outline-none focus:border-wine"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search product or alt text"
            type="search"
            value={search}
          />
        </label>
        <select
          className="h-11 border border-[#cec6bd] bg-white px-3 text-sm outline-none focus:border-wine"
          onChange={(event) => setSource(event.target.value as typeof source)}
          value={source}
        >
          <option value="all">All sources</option>
          <option value="storage">Firebase Storage</option>
          <option value="legacy">Local migration assets</option>
        </select>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {filtered.map(({ image, product, primary }) => (
          <article
            className="border border-[#d8d1c7] bg-white p-3"
            key={`${product.id}-${image.id}`}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-soft">
              <img alt={image.alt} className="size-full object-cover" src={image.url} />
              {primary && (
                <span className="absolute left-2 top-2 bg-[#e5eee5] px-2 py-1 text-[9px] font-semibold uppercase tracking-[.12em] text-[#35553a]">
                  Primary
                </span>
              )}
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{product.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{image.alt}</p>
              </div>
              <Link
                aria-label={`Edit ${product.title}`}
                className="shrink-0 p-2 hover:bg-soft"
                to={`/admin/products/${product.id}`}
              >
                <ExternalLink size={15} />
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-[#e3ddd5] pt-3 text-[10px] font-semibold uppercase tracking-[.1em] text-muted">
              <HardDriveUpload size={13} />
              {image.storagePath ? "Firebase Storage" : "Local migration asset"}
            </div>
          </article>
        ))}
      </section>
      {filtered.length === 0 && (
        <p className="mt-8 border border-dashed border-[#c9c0b7] p-12 text-center text-sm text-muted">
          No media matches these filters.
        </p>
      )}
    </div>
  );
}
