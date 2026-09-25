import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Archive,
  ArrowLeft,
  ExternalLink,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createProductDraft,
  getAdminProduct,
  listAdminCollections,
  saveAdminProduct,
  saveProductMedia,
  setProductStatus,
  type AdminCollectionOption,
} from "@/admin/admin-repository";
import { deleteProductImage, uploadProductImage } from "@/admin/media";
import { validateForPublishing } from "@/admin/product-validation";
import { Button } from "@/components/ui/button";
import type { EditableProduct, ProductDocument, ProductImage } from "@/types/admin";

const emptyProduct: EditableProduct = {
  id: "",
  slug: "",
  title: "",
  description: "",
  status: "draft",
  primaryCategorySlug: "",
  collectionSlug: "",
  collectionSlugs: [],
  priceFrom: 0,
  priceTo: 0,
  listPriceFrom: null,
  currency: "USD",
  featured: false,
  inStock: false,
  badges: [],
  primaryImage: null,
  gallery: [],
  variants: [],
  craft: "",
  region: "",
  seoTitle: "",
  seoDescription: "",
};

const inputClass =
  "mt-2 min-h-11 w-full border border-[#cec6bd] bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-ink outline-none focus:border-wine";
const labelClass = "block text-[10px] font-semibold uppercase tracking-[.15em] text-muted";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Section({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section className="border border-[#d8d1c7] bg-[#faf8f4] p-5 sm:p-7">
      <div className="border-b border-[#ded8d0] pb-4">
        <h2 className="font-editorial text-3xl leading-none">{title}</h2>
        {intro && <p className="mt-2 text-xs leading-5 text-muted">{intro}</p>}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function asEditable(product: ProductDocument): EditableProduct {
  const { createdAt, createdBy, updatedAt, updatedBy, publishedAt, ...editable } = product;
  void createdAt;
  void createdBy;
  void updatedAt;
  void updatedBy;
  void publishedAt;
  return editable;
}

export function AdminProductEditorPage() {
  const { productId = "new" } = useParams();
  const isNew = productId === "new";
  const navigate = useNavigate();
  const [product, setProduct] = useState<EditableProduct>(emptyProduct);
  const [collections, setCollections] = useState<AdminCollectionOption[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    document.title = `${isNew ? "New product" : "Edit product"} — Kallayani catalogue`;
    setLoading(!isNew);
    setErrors([]);
    setMessage("");
    void Promise.all([
      listAdminCollections(),
      isNew ? Promise.resolve(null) : getAdminProduct(productId),
    ])
      .then(([nextCollections, storedProduct]) => {
        setCollections(nextCollections);
        if (storedProduct) setProduct(asEditable(storedProduct));
        else if (!isNew) setErrors(["This product could not be found."]);
      })
      .catch((reason) => setErrors([reason.message]))
      .finally(() => setLoading(false));
  }, [isNew, productId]);

  const media = useMemo(() => {
    const all = [product.primaryImage, ...product.gallery].filter(Boolean) as ProductImage[];
    return all.filter(
      (image, index) => all.findIndex((candidate) => candidate.id === image.id) === index,
    );
  }, [product.gallery, product.primaryImage]);

  const update = <Key extends keyof EditableProduct>(key: Key, value: EditableProduct[Key]) =>
    setProduct((current) => ({ ...current, [key]: value }));

  const saveDraft = async () => {
    setSaving(true);
    setErrors([]);
    setMessage("");
    try {
      if (isNew) {
        const id = await createProductDraft(product);
        navigate(`/admin/products/${id}`, { replace: true });
        return id;
      }
      await saveAdminProduct(productId, product);
      setMessage("Draft changes saved.");
      return productId;
    } catch (reason) {
      setErrors([reason instanceof Error ? reason.message : "The product could not be saved."]);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (status: "draft" | "published" | "archived") => {
    if (isNew) {
      setErrors(["Save the draft before changing its publishing status."]);
      return;
    }
    setSaving(true);
    setErrors([]);
    setMessage("");
    try {
      await saveAdminProduct(productId, product);
      if (status === "published") {
        const validationErrors = await validateForPublishing(product, productId);
        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          return;
        }
      }
      await setProductStatus(productId, status);
      update("status", status);
      setMessage(
        status === "published"
          ? "Product published."
          : status === "archived"
            ? "Product archived."
            : "Product returned to draft.",
      );
    } catch (reason) {
      setErrors([reason instanceof Error ? reason.message : "The status could not be changed."]);
    } finally {
      setSaving(false);
    }
  };

  const persistMedia = async (primaryImage: ProductImage | null, gallery: ProductImage[]) => {
    await saveProductMedia(productId, primaryImage, gallery);
    setProduct((current) => ({ ...current, primaryImage, gallery }));
  };

  if (loading) return <p className="py-20 text-center text-sm text-muted">Loading product…</p>;

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <Link
            className="inline-flex items-center gap-2 text-xs text-muted hover:text-wine"
            to="/admin/products"
          >
            <ArrowLeft size={14} /> Products
          </Link>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[.2em] text-wine">
            {isNew ? "New draft" : product.status}
          </p>
          <h1 className="mt-2 max-w-3xl font-editorial text-5xl leading-none tracking-[-.035em] sm:text-6xl">
            {product.title || "Untitled product"}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isNew && product.status === "published" && (
            <Button asChild variant="outline">
              <a href={`/product/${productId}`} rel="noreferrer" target="_blank">
                Preview <ExternalLink size={14} />
              </a>
            </Button>
          )}
          {!isNew && product.status !== "archived" && (
            <Button
              disabled={saving}
              onClick={() => void changeStatus("archived")}
              variant="outline"
            >
              <Archive size={15} /> Archive
            </Button>
          )}
          {!isNew && product.status === "published" ? (
            <Button disabled={saving} onClick={() => void changeStatus("draft")} variant="outline">
              Unpublish
            </Button>
          ) : (
            !isNew && (
              <Button disabled={saving} onClick={() => void changeStatus("published")}>
                Publish
              </Button>
            )
          )}
          <Button disabled={saving} onClick={() => void saveDraft()}>
            <Save size={15} /> {saving ? "Saving…" : "Save draft"}
          </Button>
        </div>
      </div>

      {message && (
        <p className="mt-6 border-l-2 border-[#4d704e] bg-[#e7efe7] px-4 py-3 text-sm text-[#35553a]">
          {message}
        </p>
      )}
      {errors.length > 0 && (
        <div className="mt-6 border-l-2 border-red bg-red/5 px-5 py-4 text-sm text-red">
          <p className="font-medium">This product needs attention:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(330px,.6fr)]">
        <div className="space-y-6">
          <Section title="Basic information">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={`${labelClass} sm:col-span-2`}>
                Title
                <input
                  className={inputClass}
                  onBlur={() => !product.slug && update("slug", slugify(product.title))}
                  onChange={(event) => update("title", event.target.value)}
                  value={product.title}
                />
              </label>
              <label className={labelClass}>
                Slug
                <input
                  className={inputClass}
                  onChange={(event) => update("slug", slugify(event.target.value))}
                  value={product.slug}
                />
              </label>
              <label className={labelClass}>
                Craft
                <input
                  className={inputClass}
                  onChange={(event) => update("craft", event.target.value)}
                  value={product.craft}
                />
              </label>
              <label className={labelClass}>
                Region
                <input
                  className={inputClass}
                  onChange={(event) => update("region", event.target.value)}
                  value={product.region}
                />
              </label>
            </div>
          </Section>

          <Section title="Description" intro="Required before publishing.">
            <label className={labelClass}>
              Product story
              <textarea
                className={`${inputClass} min-h-40 resize-y`}
                onChange={(event) => update("description", event.target.value)}
                value={product.description}
              />
            </label>
          </Section>

          <Section title="Categories and collections">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Primary category
                <select
                  className={inputClass}
                  onChange={(event) => {
                    update("primaryCategorySlug", event.target.value);
                    if (!product.collectionSlugs.includes(event.target.value))
                      update(
                        "collectionSlugs",
                        [...product.collectionSlugs, event.target.value].filter(Boolean),
                      );
                  }}
                  value={product.primaryCategorySlug}
                >
                  <option value="">Choose a category</option>
                  {collections.map((entry) => (
                    <option key={entry.slug} value={entry.slug}>
                      {entry.name}
                    </option>
                  ))}
                </select>
              </label>
              <fieldset>
                <legend className={labelClass}>Additional collections</legend>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {collections.map((entry) => (
                    <label className="flex items-center gap-2 text-sm" key={entry.slug}>
                      <input
                        checked={product.collectionSlugs.includes(entry.slug)}
                        onChange={(event) =>
                          update(
                            "collectionSlugs",
                            event.target.checked
                              ? [...new Set([...product.collectionSlugs, entry.slug])]
                              : product.collectionSlugs.filter((slug) => slug !== entry.slug),
                          )
                        }
                        type="checkbox"
                      />{" "}
                      {entry.name}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </Section>

          <Section
            title="Variants and stock"
            intro="Publishing requires at least one available variant."
          >
            <div className="space-y-3">
              {product.variants.map((variant, index) => (
                <div
                  className="grid gap-3 border border-[#ddd6ce] bg-white p-3 sm:grid-cols-[1.1fr_1fr_.8fr_.7fr_auto]"
                  key={variant.id}
                >
                  <label className={labelClass}>
                    Size
                    <input
                      className={inputClass}
                      onChange={(event) =>
                        update(
                          "variants",
                          product.variants.map((item, itemIndex) =>
                            itemIndex === index
                              ? {
                                  ...item,
                                  size: event.target.value,
                                  optionSummary: `Size: ${event.target.value}`,
                                }
                              : item,
                          ),
                        )
                      }
                      value={variant.size}
                    />
                  </label>
                  <label className={labelClass}>
                    SKU
                    <input
                      className={inputClass}
                      onChange={(event) =>
                        update(
                          "variants",
                          product.variants.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, sku: event.target.value } : item,
                          ),
                        )
                      }
                      value={variant.sku}
                    />
                  </label>
                  <label className={labelClass}>
                    Price
                    <input
                      className={inputClass}
                      min="0"
                      onChange={(event) =>
                        update(
                          "variants",
                          product.variants.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, price: Number(event.target.value) }
                              : item,
                          ),
                        )
                      }
                      type="number"
                      value={variant.price}
                    />
                  </label>
                  <label className={labelClass}>
                    Quantity
                    <input
                      className={inputClass}
                      min="0"
                      onChange={(event) => {
                        const quantity = Number(event.target.value);
                        update(
                          "variants",
                          product.variants.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, availableQuantity: quantity, inStock: quantity > 0 }
                              : item,
                          ),
                        );
                        update(
                          "inStock",
                          product.variants.some((item, itemIndex) =>
                            itemIndex === index ? quantity > 0 : item.inStock,
                          ),
                        );
                      }}
                      type="number"
                      value={variant.availableQuantity}
                    />
                  </label>
                  <button
                    aria-label="Remove variant"
                    className="self-end p-3 text-muted hover:text-red"
                    onClick={() =>
                      update(
                        "variants",
                        product.variants.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <Button
                onClick={() =>
                  update("variants", [
                    ...product.variants,
                    {
                      id: crypto.randomUUID(),
                      sku: "",
                      optionSummary: "Size: One size",
                      size: "One size",
                      price: product.priceFrom,
                      listPrice: null,
                      availableQuantity: 0,
                      inStock: false,
                    },
                  ])
                }
                variant="outline"
              >
                <Plus size={15} /> Add variant
              </Button>
            </div>
          </Section>

          <Section title="Media" intro="JPEG, PNG, or WebP; maximum 10 MB. Alt text is required.">
            {isNew ? (
              <p className="bg-[#efe9e1] p-4 text-sm text-muted">
                Save this draft first to create a secure product upload path.
              </p>
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <label className={labelClass}>
                    Image
                    <input
                      accept="image/jpeg,image/png,image/webp"
                      className={inputClass}
                      onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                      type="file"
                    />
                  </label>
                  <label className={labelClass}>
                    Alt text
                    <input
                      className={inputClass}
                      onChange={(event) => setUploadAlt(event.target.value)}
                      placeholder="Describe the product image"
                      value={uploadAlt}
                    />
                  </label>
                  <Button
                    className="self-end"
                    disabled={!uploadFile || uploadProgress > 0}
                    onClick={() => {
                      if (!uploadFile) return;
                      setErrors([]);
                      setUploadProgress(1);
                      void uploadProductImage(productId, uploadFile, uploadAlt, setUploadProgress)
                        .then(async (image) => {
                          const gallery = [...product.gallery, image];
                          const primary = product.primaryImage ?? image;
                          try {
                            await persistMedia(primary, gallery);
                            setUploadFile(null);
                            setUploadAlt("");
                            setMessage("Image uploaded and saved.");
                          } catch (reason) {
                            await deleteProductImage(image).catch(() => undefined);
                            throw reason;
                          }
                        })
                        .catch((reason) => setErrors([reason.message]))
                        .finally(() => setUploadProgress(0));
                    }}
                  >
                    <Upload size={15} /> Upload
                  </Button>
                </div>
                {uploadProgress > 0 && (
                  <div className="mt-4 h-1 bg-[#ddd5cc]">
                    <div
                      className="h-full bg-wine transition-[width]"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {media.map((image) => (
                    <article className="border border-[#d8d1c7] bg-white p-3" key={image.id}>
                      <div className="aspect-[4/5] bg-soft">
                        <img alt={image.alt} className="size-full object-cover" src={image.url} />
                      </div>
                      <p className="mt-3 line-clamp-2 text-xs text-muted">{image.alt}</p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        {product.primaryImage?.id === image.id ? (
                          <span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#35553a]">
                            Primary
                          </span>
                        ) : (
                          <button
                            className="text-xs underline"
                            onClick={() =>
                              void persistMedia(image, product.gallery).catch((reason) =>
                                setErrors([reason.message]),
                              )
                            }
                          >
                            Make primary
                          </button>
                        )}
                        <button
                          aria-label="Remove image"
                          className="p-2 text-muted hover:text-red"
                          onClick={() => {
                            const gallery = product.gallery.filter(
                              (entry) => entry.id !== image.id,
                            );
                            const primary =
                              product.primaryImage?.id === image.id
                                ? (gallery[0] ?? null)
                                : product.primaryImage;
                            void persistMedia(primary, gallery)
                              .then(() => deleteProductImage(image))
                              .catch((reason) => setErrors([reason.message]));
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </article>
                  ))}
                  {media.length === 0 && (
                    <div className="grid aspect-[4/3] place-items-center border border-dashed border-[#c9c0b7] text-center text-sm text-muted">
                      <span>
                        <ImagePlus className="mx-auto mb-2" />
                        No media yet
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </Section>
        </div>

        <div className="space-y-6 xl:sticky xl:top-6">
          <Section title="Pricing">
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <label className={labelClass}>
                Price from, USD
                <input
                  className={inputClass}
                  min="0"
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    update("priceFrom", value);
                    if (!product.priceTo) update("priceTo", value);
                  }}
                  step="0.01"
                  type="number"
                  value={product.priceFrom}
                />
              </label>
              <label className={labelClass}>
                Price to, USD
                <input
                  className={inputClass}
                  min="0"
                  onChange={(event) => update("priceTo", Number(event.target.value))}
                  step="0.01"
                  type="number"
                  value={product.priceTo}
                />
              </label>
              <label className={labelClass}>
                List price
                <input
                  className={inputClass}
                  min="0"
                  onChange={(event) =>
                    update("listPriceFrom", event.target.value ? Number(event.target.value) : null)
                  }
                  step="0.01"
                  type="number"
                  value={product.listPriceFrom ?? ""}
                />
              </label>
            </div>
          </Section>

          <Section title="Merchandising">
            <label className="flex items-center gap-3 text-sm">
              <input
                checked={product.featured}
                onChange={(event) => update("featured", event.target.checked)}
                type="checkbox"
              />{" "}
              Feature on the storefront
            </label>
            <label className={`${labelClass} mt-5`}>
              Badges
              <input
                className={inputClass}
                onChange={(event) =>
                  update(
                    "badges",
                    event.target.value
                      .split(",")
                      .map((value) => value.trim())
                      .filter(Boolean),
                  )
                }
                placeholder="New, Handwoven"
                value={product.badges.join(", ")}
              />
            </label>
          </Section>

          <Section title="Search metadata">
            <div className="space-y-4">
              <label className={labelClass}>
                SEO title
                <input
                  className={inputClass}
                  onChange={(event) => update("seoTitle", event.target.value)}
                  value={product.seoTitle}
                />
              </label>
              <label className={labelClass}>
                SEO description
                <textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  onChange={(event) => update("seoDescription", event.target.value)}
                  value={product.seoDescription}
                />
              </label>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
