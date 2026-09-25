import { useEffect, useMemo, useState } from "react";
import { Archive, Copy, Edit3, PackagePlus, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  duplicateProduct,
  listAdminCollections,
  listAdminProducts,
  setProductStatus,
  type AdminCollectionOption,
} from "@/admin/admin-repository";
import { Button } from "@/components/ui/button";
import type { CatalogStatus, ProductDocument } from "@/types/admin";

export function AdminProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductDocument[]>([]);
  const [collections, setCollections] = useState<AdminCollectionOption[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CatalogStatus | "all">("all");
  const [collection, setCollection] = useState("all");
  const [stock, setStock] = useState("all");
  const [featured, setFeatured] = useState("all");
  const [error, setError] = useState("");

  const reload = async () => {
    const [nextProducts, nextCollections] = await Promise.all([
      listAdminProducts(),
      listAdminCollections(),
    ]);
    setProducts(nextProducts);
    setCollections(nextCollections);
  };

  useEffect(() => {
    document.title = "Products — Kallayani catalogue";
    void reload().catch((reason) => setError(reason.message));
  }, []);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return products.filter((product) => {
      if (needle && !`${product.title} ${product.slug}`.toLowerCase().includes(needle))
        return false;
      if (status !== "all" && product.status !== status) return false;
      if (collection !== "all" && !product.collectionSlugs.includes(collection)) return false;
      if (stock !== "all" && product.inStock !== (stock === "in")) return false;
      if (featured !== "all" && product.featured !== (featured === "yes")) return false;
      return true;
    });
  }, [collection, featured, products, search, status, stock]);

  const selectClass =
    "h-11 border border-[#cec6bd] bg-white px-3 text-xs text-ink outline-none focus:border-wine";

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-wine">Catalogue</p>
          <h1 className="mt-2 font-editorial text-5xl leading-none tracking-[-.035em] sm:text-6xl">
            Products
          </h1>
        </div>
        <Button asChild>
          <Link to="/admin/products/new">
            <PackagePlus size={16} /> New product
          </Link>
        </Button>
      </div>

      <section className="mt-9 grid gap-3 border border-[#d8d1c7] bg-[#faf8f4] p-4 md:grid-cols-2 xl:grid-cols-[2fr_repeat(4,1fr)]">
        <label className="relative">
          <Search className="absolute left-3 top-3 text-muted" size={16} />
          <input
            className={`${selectClass} w-full pl-10`}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title or slug"
            type="search"
            value={search}
          />
        </label>
        <select
          className={selectClass}
          onChange={(event) => setStatus(event.target.value as typeof status)}
          value={status}
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select
          className={selectClass}
          onChange={(event) => setCollection(event.target.value)}
          value={collection}
        >
          <option value="all">All collections</option>
          {collections.map((entry) => (
            <option key={entry.slug} value={entry.slug}>
              {entry.name}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          onChange={(event) => setStock(event.target.value)}
          value={stock}
        >
          <option value="all">All stock</option>
          <option value="in">In stock</option>
          <option value="out">Out of stock</option>
        </select>
        <select
          className={selectClass}
          onChange={(event) => setFeatured(event.target.value)}
          value={featured}
        >
          <option value="all">All merchandising</option>
          <option value="yes">Featured</option>
          <option value="no">Not featured</option>
        </select>
      </section>

      {error && (
        <p className="mt-5 border-l-2 border-red bg-red/5 px-4 py-3 text-sm text-red">{error}</p>
      )}

      <section className="mt-5 overflow-x-auto border border-[#d8d1c7] bg-white">
        <table className="w-full min-w-[940px] border-collapse text-left text-sm">
          <thead className="bg-[#ebe6df] text-[10px] uppercase tracking-[.16em] text-muted">
            <tr>
              <th className="px-5 py-4">Product</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Collection</th>
              <th className="px-4 py-4">Price</th>
              <th className="px-4 py-4">Stock</th>
              <th className="px-4 py-4">Updated</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr className="border-t border-[#e3ddd5]" key={product.id}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-12 shrink-0 bg-[#eee9e2]">
                      {product.primaryImage && (
                        <img
                          alt=""
                          className="size-full object-cover"
                          src={product.primaryImage.url}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.title || "Untitled product"}</p>
                      <p className="text-xs text-muted">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.1em] ${product.status === "published" ? "bg-[#e5eee5] text-[#35553a]" : product.status === "archived" ? "bg-[#e5e2df] text-[#655d57]" : "bg-[#f3e7d6] text-[#79511f]"}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-muted">{product.primaryCategorySlug || "—"}</td>
                <td className="px-4 py-4">${product.priceFrom.toFixed(2)}</td>
                <td className="px-4 py-4 text-muted">{product.inStock ? "In stock" : "Out"}</td>
                <td className="px-4 py-4 text-xs text-muted">
                  {product.updatedAt?.toDate().toLocaleDateString() ?? "—"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      aria-label={`Edit ${product.title}`}
                      className="p-2 hover:bg-soft"
                      onClick={() => navigate(`/admin/products/${product.id}`)}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      aria-label={`Duplicate ${product.title}`}
                      className="p-2 hover:bg-soft"
                      onClick={() =>
                        void duplicateProduct(product.id)
                          .then((id) => navigate(`/admin/products/${id}`))
                          .catch((reason) => setError(reason.message))
                      }
                    >
                      <Copy size={16} />
                    </button>
                    {product.status !== "archived" && (
                      <button
                        aria-label={`Archive ${product.title}`}
                        className="p-2 hover:bg-soft"
                        onClick={() =>
                          void setProductStatus(product.id, "archived")
                            .then(reload)
                            .catch((reason) => setError(reason.message))
                        }
                      >
                        <Archive size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-12 text-center text-sm text-muted">No products match these filters.</p>
        )}
      </section>
      <p className="mt-3 text-xs text-muted">
        Showing {filtered.length} of {products.length} products.
      </p>
    </div>
  );
}
