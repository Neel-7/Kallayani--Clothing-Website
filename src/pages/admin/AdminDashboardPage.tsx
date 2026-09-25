import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CircleAlert, PackagePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { listAdminProducts } from "@/admin/admin-repository";
import type { ProductDocument } from "@/types/admin";

export function AdminDashboardPage() {
  const [products, setProducts] = useState<ProductDocument[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Catalogue overview — Kallayani";
    void listAdminProducts()
      .then(setProducts)
      .catch((reason) => setError(reason.message));
  }, []);

  const counts = useMemo(
    () => ({
      total: products.length,
      published: products.filter((product) => product.status === "published").length,
      draft: products.filter((product) => product.status === "draft").length,
      archived: products.filter((product) => product.status === "archived").length,
    }),
    [products],
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-wine">Catalogue</p>
          <h1 className="mt-2 font-editorial text-5xl leading-none tracking-[-.035em] sm:text-6xl">
            Studio overview
          </h1>
        </div>
        <Link
          className="inline-flex min-h-11 items-center gap-2 bg-ink px-5 text-xs font-medium uppercase tracking-[.08em] text-white hover:bg-wine"
          to="/admin/products/new"
        >
          <PackagePlus size={16} /> New product
        </Link>
      </div>

      {error && (
        <p className="mt-8 flex items-center gap-2 border border-red/30 bg-red/5 p-4 text-sm text-red">
          <CircleAlert size={17} /> {error}
        </p>
      )}

      <section className="mt-10 grid gap-px bg-[#d8d1c7] sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(counts).map(([label, count]) => (
          <article className="bg-[#faf8f4] p-7" key={label}>
            <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-muted">
              {label}
            </p>
            <p className="mt-7 font-editorial text-6xl leading-none">{count}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 border border-[#d8d1c7] bg-white p-7 sm:p-9">
        <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-muted">Workflow</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          <span className="bg-[#f2eee8] px-4 py-3">Create a draft</span>
          <ArrowRight size={15} />
          <span className="bg-[#f2eee8] px-4 py-3">Add variants and media</span>
          <ArrowRight size={15} />
          <span className="bg-[#f2eee8] px-4 py-3">Validate</span>
          <ArrowRight size={15} />
          <span className="bg-[#e5eee5] px-4 py-3">Publish</span>
        </div>
      </section>
    </div>
  );
}
