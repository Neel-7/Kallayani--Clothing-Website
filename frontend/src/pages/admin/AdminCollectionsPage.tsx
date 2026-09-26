import { useEffect, useMemo, useState } from "react";
import { Image as ImageIcon, Plus, Save, Search } from "lucide-react";
import {
  createAdminCollection,
  listAdminCollectionDocuments,
  saveAdminCollection,
  type AdminCollectionDocument,
} from "@/admin/content-repository";
import { Button } from "@/components/ui/button";

const inputClass =
  "mt-2 min-h-11 w-full border border-[#cec6bd] bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal outline-none focus:border-wine";
const labelClass = "block text-[10px] font-semibold uppercase tracking-[.15em] text-muted";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function AdminCollectionsPage() {
  const [collections, setCollections] = useState<AdminCollectionDocument[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState<AdminCollectionDocument | null>(null);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async (preferId?: string) => {
    const next = await listAdminCollectionDocuments();
    setCollections(next);
    const id = preferId ?? selectedId ?? next[0]?.id;
    const selected = next.find((entry) => entry.id === id) ?? next[0] ?? null;
    setSelectedId(selected?.id ?? "");
    setDraft(selected ? structuredClone(selected) : null);
  };

  useEffect(() => {
    document.title = "Collections | Kallayani catalogue";
    void listAdminCollectionDocuments()
      .then((next) => {
        setCollections(next);
        const selected = next[0] ?? null;
        setSelectedId(selected?.id ?? "");
        setDraft(selected ? structuredClone(selected) : null);
      })
      .catch((reason) => setError(reason.message));
  }, []);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return collections.filter((entry) =>
      `${entry.name} ${entry.slug}`.toLowerCase().includes(needle),
    );
  }, [collections, search]);

  const select = (entry: AdminCollectionDocument) => {
    setSelectedId(entry.id);
    setDraft(structuredClone(entry));
    setError("");
    setMessage("");
  };

  const update = <Key extends keyof AdminCollectionDocument>(
    key: Key,
    value: AdminCollectionDocument[Key],
  ) => setDraft((current) => (current ? { ...current, [key]: value } : current));

  return (
    <div className="mx-auto max-w-[1450px]">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-wine">Catalogue</p>
        <h1 className="mt-2 font-editorial text-5xl leading-none tracking-[-.035em] sm:text-6xl">
          Collections
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
          Manage collection landing-page copy, imagery, order, and publishing status.
        </p>
      </div>

      {error && (
        <p className="mt-6 border-l-2 border-red bg-red/5 px-4 py-3 text-sm text-red">{error}</p>
      )}
      {message && (
        <p className="mt-6 border-l-2 border-[#4d704e] bg-[#e7efe7] px-4 py-3 text-sm text-[#35553a]">
          {message}
        </p>
      )}

      <div className="mt-8 grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="border border-[#d8d1c7] bg-[#faf8f4]">
          <div className="border-b border-[#d8d1c7] p-4">
            <label className="relative block">
              <Search className="absolute left-3 top-3 text-muted" size={16} />
              <input
                className="h-11 w-full border border-[#cec6bd] bg-white pl-10 pr-3 text-sm outline-none focus:border-wine"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search collections"
                type="search"
                value={search}
              />
            </label>
            <div className="mt-3 flex gap-2">
              <input
                className="h-11 min-w-0 flex-1 border border-[#cec6bd] bg-white px-3 text-sm outline-none focus:border-wine"
                onChange={(event) => setNewName(event.target.value)}
                placeholder="New collection name"
                value={newName}
              />
              <button
                aria-label="Create collection"
                className="grid size-11 shrink-0 place-items-center bg-ink text-white hover:bg-wine disabled:opacity-40"
                disabled={!newName.trim()}
                onClick={() => {
                  const slug = slugify(newName);
                  setError("");
                  void createAdminCollection(slug, newName)
                    .then(async (id) => {
                      setNewName("");
                      await load(id);
                      setMessage("Draft collection created.");
                    })
                    .catch((reason) => setError(reason.message));
                }}
              >
                <Plus size={17} />
              </button>
            </div>
          </div>
          <div className="max-h-[680px] overflow-y-auto">
            {filtered.map((entry) => (
              <button
                className={`flex w-full items-center gap-3 border-b border-[#e1dbd3] p-4 text-left ${selectedId === entry.id ? "bg-white" : "hover:bg-white/70"}`}
                key={entry.id}
                onClick={() => select(entry)}
              >
                <div className="size-14 shrink-0 bg-[#e8e2da]">
                  {entry.categoryImage.src ? (
                    <img alt="" className="size-full object-cover" src={entry.categoryImage.src} />
                  ) : (
                    <ImageIcon className="m-auto h-full text-muted" size={19} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{entry.name}</p>
                  <p className="truncate text-xs text-muted">/{entry.slug}</p>
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-[.1em] text-muted">
                  {entry.status}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {draft ? (
          <section className="border border-[#d8d1c7] bg-[#faf8f4] p-5 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#d8d1c7] pb-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-wine">
                  Editing
                </p>
                <h2 className="mt-2 font-editorial text-4xl leading-none">{draft.name}</h2>
              </div>
              <Button
                disabled={saving}
                onClick={() => {
                  setSaving(true);
                  setError("");
                  setMessage("");
                  void saveAdminCollection(draft)
                    .then(async () => {
                      await load(draft.id);
                      setMessage("Collection saved.");
                    })
                    .catch((reason) => setError(reason.message))
                    .finally(() => setSaving(false));
                }}
              >
                <Save size={15} /> {saving ? "Saving…" : "Save collection"}
              </Button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className={labelClass}>
                Name
                <input
                  className={inputClass}
                  onChange={(event) => update("name", event.target.value)}
                  value={draft.name}
                />
              </label>
              <label className={labelClass}>
                Slug
                <input className={`${inputClass} bg-[#eeeae4]`} disabled value={draft.slug} />
              </label>
              <label className={`${labelClass} md:col-span-2`}>
                Headline
                <input
                  className={inputClass}
                  onChange={(event) => update("headline", event.target.value)}
                  value={draft.headline}
                />
              </label>
              <label className={`${labelClass} md:col-span-2`}>
                Description
                <textarea
                  className={`${inputClass} min-h-32 resize-y`}
                  onChange={(event) => update("description", event.target.value)}
                  value={draft.description}
                />
              </label>
              <label className={labelClass}>
                Status
                <select
                  className={inputClass}
                  onChange={(event) =>
                    update("status", event.target.value as AdminCollectionDocument["status"])
                  }
                  value={draft.status}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
              <label className={labelClass}>
                Position
                <input
                  className={inputClass}
                  min="0"
                  onChange={(event) => update("position", Number(event.target.value))}
                  type="number"
                  value={draft.position}
                />
              </label>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {(["hero", "categoryImage"] as const).map((field) => (
                <fieldset className="border border-[#d8d1c7] bg-white p-4" key={field}>
                  <legend className="px-2 font-editorial text-2xl">
                    {field === "hero" ? "Hero image" : "Category image"}
                  </legend>
                  <div className="mt-2 aspect-[16/9] bg-soft">
                    {draft[field].src ? (
                      <img
                        alt={draft[field].alt}
                        className="size-full object-cover"
                        src={draft[field].src}
                      />
                    ) : (
                      <div className="grid size-full place-items-center text-xs text-muted">
                        No image URL
                      </div>
                    )}
                  </div>
                  <label className={`${labelClass} mt-4`}>
                    Image URL
                    <input
                      className={inputClass}
                      onChange={(event) =>
                        update(field, { ...draft[field], src: event.target.value })
                      }
                      value={draft[field].src}
                    />
                  </label>
                  <label className={`${labelClass} mt-4`}>
                    Alt text
                    <input
                      className={inputClass}
                      onChange={(event) =>
                        update(field, { ...draft[field], alt: event.target.value })
                      }
                      value={draft[field].alt}
                    />
                  </label>
                </fieldset>
              ))}
            </div>

            <fieldset className="mt-8 border-t border-[#d8d1c7] pt-6">
              <legend className="font-editorial text-3xl">Subcategories</legend>
              <div className="mt-4 space-y-3">
                {draft.subcategories.map((subcategory, index) => (
                  <div
                    className="grid gap-3 border border-[#ddd6ce] bg-white p-3 md:grid-cols-[1fr_1.5fr_auto]"
                    key={`${subcategory.name}-${index}`}
                  >
                    <label className={labelClass}>
                      Name
                      <input
                        className={inputClass}
                        onChange={(event) =>
                          update(
                            "subcategories",
                            draft.subcategories.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, name: event.target.value } : item,
                            ),
                          )
                        }
                        value={subcategory.name}
                      />
                    </label>
                    <label className={labelClass}>
                      Image URL
                      <input
                        className={inputClass}
                        onChange={(event) =>
                          update(
                            "subcategories",
                            draft.subcategories.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, image: { ...item.image, src: event.target.value } }
                                : item,
                            ),
                          )
                        }
                        value={subcategory.image.src}
                      />
                    </label>
                    <button
                      className="self-end px-3 py-3 text-xs text-red underline"
                      onClick={() =>
                        update(
                          "subcategories",
                          draft.subcategories.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <Button
                  onClick={() =>
                    update("subcategories", [
                      ...draft.subcategories,
                      { name: "", image: { src: "", alt: "" } },
                    ])
                  }
                  variant="outline"
                >
                  <Plus size={15} /> Add subcategory
                </Button>
              </div>
            </fieldset>
          </section>
        ) : (
          <section className="grid min-h-80 place-items-center border border-dashed border-[#c9c0b7] text-sm text-muted">
            Choose a collection to edit.
          </section>
        )}
      </div>
    </div>
  );
}
