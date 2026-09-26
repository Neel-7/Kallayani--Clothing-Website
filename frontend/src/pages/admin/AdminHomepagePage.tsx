import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Plus, Save, Trash2 } from "lucide-react";
import {
  createHomepageContent,
  deleteHomepageContent,
  listHomepageContent,
  saveHomepageContent,
  type HomepageContentEntry,
  type HomepageContentKind,
} from "@/admin/content-repository";
import { Button } from "@/components/ui/button";

const inputClass =
  "mt-2 min-h-11 w-full border border-[#cec6bd] bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal outline-none focus:border-wine";
const labelClass = "block text-[10px] font-semibold uppercase tracking-[.15em] text-muted";

export function AdminHomepagePage() {
  const [entries, setEntries] = useState<HomepageContentEntry[]>([]);
  const [kind, setKind] = useState<HomepageContentKind>("banner");
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState<HomepageContentEntry | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async (preferred?: { kind: HomepageContentKind; id?: string }) => {
    const next = await listHomepageContent();
    setEntries(next);
    const targetKind = preferred?.kind ?? kind;
    const targetId = preferred?.id ?? selectedId;
    const candidates = next.filter((entry) => entry.kind === targetKind);
    const selected =
      candidates.find((entry) => entry.id === targetId) ??
      candidates[0] ??
      null;
    setKind(targetKind);
    setSelectedId(selected?.id ?? "");
    setDraft(selected ? structuredClone(selected) : null);
  };

  useEffect(() => {
    document.title = "Homepage — Kallayani catalogue";
    void listHomepageContent()
      .then((next) => {
        setEntries(next);
        const selected = next.find((entry) => entry.kind === "banner") ?? null;
        setSelectedId(selected?.id ?? "");
        setDraft(selected ? structuredClone(selected) : null);
      })
      .catch((reason) => setError(reason.message));
  }, []);

  const visible = useMemo(() => entries.filter((entry) => entry.kind === kind), [entries, kind]);

  const update = <Key extends keyof HomepageContentEntry>(
    key: Key,
    value: HomepageContentEntry[Key],
  ) => setDraft((current) => (current ? { ...current, [key]: value } : current));

  const chooseKind = (nextKind: HomepageContentKind) => {
    setKind(nextKind);
    const first = entries.find((entry) => entry.kind === nextKind) ?? null;
    setSelectedId(first?.id ?? "");
    setDraft(first ? structuredClone(first) : null);
    setError("");
    setMessage("");
  };

  const handleCreate = async () => {
    const title = newTitle.trim();
    if (!title) return;
    setCreating(true);
    setError("");
    setMessage("");
    try {
      const newId = await createHomepageContent({
        kind,
        title,
        position: visible.length + 1,
        status: "draft",
        description: "",
        imageUrl: "",
        imageAlt: title,
        imagePosition: "50% 50%",
        linkUrl: kind === "banner" ? "/women" : "/",
        ctaLabel: kind === "banner" ? "Discover collection" : "",
      });
      setNewTitle("");
      setMessage(`New ${kind === "banner" ? "hero banner" : kind} created.`);
      await load({ kind, id: newId });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to create content.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!draft) return;
    const itemLabel = draft.title ? `"${draft.title}"` : `this ${draft.kind}`;
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${itemLabel}? This action cannot be undone.`,
    );
    if (!confirmed) return;
    setDeleting(true);
    setError("");
    setMessage("");
    try {
      await deleteHomepageContent(draft.kind, draft.id);
      setMessage(`${draft.kind === "banner" ? "Hero banner" : "Content"} deleted.`);
      await load({ kind: draft.kind });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to delete content.");
    } finally {
      setDeleting(false);
    }
  };

  const kindLabel =
    kind === "banner"
      ? "hero banner"
      : kind === "category"
        ? "category tile"
        : "editorial feature";

  return (
    <div className="mx-auto max-w-[1450px]">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-wine">Content</p>
          <h1 className="mt-2 font-editorial text-5xl leading-none tracking-[-.035em] sm:text-6xl">
            Homepage
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
            Edit hero campaigns, category tiles, and editorial stories without redeploying the
            storefront.
          </p>
        </div>
        <Button asChild variant="outline">
          <a href="/" rel="noreferrer" target="_blank">
            Preview homepage <ExternalLink size={14} />
          </a>
        </Button>
      </div>

      {error && (
        <p className="mt-6 border-l-2 border-red bg-red/5 px-4 py-3 text-sm text-red">{error}</p>
      )}
      {message && (
        <p className="mt-6 border-l-2 border-[#4d704e] bg-[#e7efe7] px-4 py-3 text-sm text-[#35553a]">
          {message}
        </p>
      )}

      <div className="mt-8 flex gap-2 border-b border-[#d0c8be]">
        {(["banner", "category", "editorial"] as HomepageContentKind[]).map((value) => (
          <button
            className={`border-b-2 px-4 py-3 text-xs font-semibold uppercase tracking-[.12em] ${kind === value ? "border-wine text-wine" : "border-transparent text-muted"}`}
            key={value}
            onClick={() => chooseKind(value)}
          >
            {value === "banner"
              ? "Hero banners"
              : value === "category"
                ? "Category tiles"
                : "Editorial features"}
          </button>
        ))}
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="overflow-hidden border border-[#d8d1c7] bg-[#faf8f4]">
          <div className="border-b border-[#d8d1c7] bg-white p-3">
            <div className="flex gap-2">
              <input
                className="h-10 min-w-0 flex-1 border border-[#cec6bd] bg-white px-3 text-sm outline-none focus:border-wine"
                onChange={(event) => setNewTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && newTitle.trim() && !creating) {
                    event.preventDefault();
                    void handleCreate();
                  }
                }}
                placeholder={`New ${kind === "banner" ? "banner" : kind === "category" ? "category" : "feature"} title…`}
                value={newTitle}
              />
              <button
                aria-label={`Create ${kind}`}
                className="grid size-10 shrink-0 place-items-center bg-ink text-white transition-colors hover:bg-wine disabled:opacity-40"
                disabled={!newTitle.trim() || creating}
                onClick={() => void handleCreate()}
                type="button"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="max-h-[640px] overflow-y-auto">
            {visible.map((entry) => (
              <button
                className={`flex w-full items-center gap-3 border-b border-[#e1dbd3] p-4 text-left transition-colors ${selectedId === entry.id ? "bg-white" : "hover:bg-white/70"}`}
                key={entry.id}
                onClick={() => {
                  setSelectedId(entry.id);
                  setDraft(structuredClone(entry));
                  setError("");
                  setMessage("");
                }}
              >
                <div className="size-16 shrink-0 bg-soft">
                  {entry.imageUrl ? (
                    <img alt="" className="size-full object-cover" src={entry.imageUrl} />
                  ) : (
                    <div className="grid size-full place-items-center text-[10px] text-muted">
                      No img
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{entry.title || "Untitled"}</p>
                  <p className="text-xs text-muted">Position {entry.position}</p>
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-[.1em] text-muted">
                  {entry.status}
                </span>
              </button>
            ))}
            {visible.length === 0 && (
              <p className="p-6 text-center text-xs text-muted">
                No {kindLabel}s yet. Enter a title above to create one.
              </p>
            )}
          </div>
        </aside>

        {draft ? (
          <section className="border border-[#d8d1c7] bg-[#faf8f4] p-5 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#d8d1c7] pb-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-wine">
                  {draft.kind}
                </p>
                <h2 className="mt-2 font-editorial text-4xl leading-none">
                  {draft.title || "Untitled content"}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  className="border-[#d8d1c7] text-[#a13535] hover:border-red hover:bg-red/10 hover:text-red"
                  disabled={saving || deleting}
                  onClick={() => void handleDelete()}
                  type="button"
                  variant="outline"
                >
                  <Trash2 size={15} /> {deleting ? "Deleting…" : "Delete"}
                </Button>
                <Button
                  disabled={saving || deleting}
                  onClick={() => {
                    setSaving(true);
                    setError("");
                    setMessage("");
                    void saveHomepageContent(draft)
                      .then(async () => {
                        await load({ kind: draft.kind, id: draft.id });
                        setMessage("Homepage content saved.");
                      })
                      .catch((reason) => setError(reason.message))
                      .finally(() => setSaving(false));
                  }}
                >
                  <Save size={15} /> {saving ? "Saving…" : "Save content"}
                </Button>
              </div>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className={labelClass}>
                {draft.kind === "category" ? "Label" : "Title"}
                <input
                  className={inputClass}
                  onChange={(event) => update("title", event.target.value)}
                  value={draft.title}
                />
              </label>
              <label className={labelClass}>
                Destination URL
                <input
                  className={inputClass}
                  onChange={(event) => update("linkUrl", event.target.value)}
                  value={draft.linkUrl}
                />
              </label>
              {draft.kind !== "category" && (
                <label className={`${labelClass} md:col-span-2`}>
                  Description
                  <textarea
                    className={`${inputClass} min-h-28 resize-y`}
                    onChange={(event) => update("description", event.target.value)}
                    value={draft.description}
                  />
                </label>
              )}
              {draft.kind === "banner" && (
                <label className={labelClass}>
                  Call to action
                  <input
                    className={inputClass}
                    onChange={(event) => update("ctaLabel", event.target.value)}
                    value={draft.ctaLabel}
                  />
                </label>
              )}
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
              <label className={labelClass}>
                Status
                <select
                  className={inputClass}
                  onChange={(event) =>
                    update("status", event.target.value as HomepageContentEntry["status"])
                  }
                  value={draft.status}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
            </div>
            <fieldset className="mt-8 border border-[#d8d1c7] bg-white p-4">
              <div className="flex items-center justify-between">
                <legend className="px-2 font-editorial text-2xl">Image</legend>
                <a
                  className="inline-flex items-center gap-1.5 text-xs text-wine underline hover:text-ink"
                  href="/admin/media"
                  rel="noreferrer"
                  target="_blank"
                >
                  Browse media library <ExternalLink size={12} />
                </a>
              </div>
              <div className="mt-3 aspect-[16/7] bg-soft">
                {draft.imageUrl ? (
                  <img
                    alt={draft.imageAlt}
                    className="size-full object-cover"
                    src={draft.imageUrl}
                    style={draft.imagePosition ? { objectPosition: draft.imagePosition } : undefined}
                  />
                ) : (
                  <div className="grid size-full place-items-center text-xs text-muted">
                    No image URL configured
                  </div>
                )}
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className={`${labelClass} md:col-span-2`}>
                  Image URL
                  <input
                    className={inputClass}
                    onChange={(event) => update("imageUrl", event.target.value)}
                    placeholder="https://... or /images/..."
                    value={draft.imageUrl}
                  />
                </label>
                <label className={labelClass}>
                  Object position (e.g. 50% 30%)
                  <input
                    className={inputClass}
                    onChange={(event) => update("imagePosition", event.target.value)}
                    placeholder="50% 50%"
                    value={draft.imagePosition}
                  />
                </label>
                <label className={`${labelClass} md:col-span-3`}>
                  Alt text
                  <input
                    className={inputClass}
                    onChange={(event) => update("imageAlt", event.target.value)}
                    placeholder="Brief description of image for accessibility"
                    value={draft.imageAlt}
                  />
                </label>
              </div>
            </fieldset>
          </section>
        ) : (
          <section className="grid min-h-80 place-items-center border border-dashed border-[#c9c0b7] p-8 text-center text-sm text-muted">
            <div>
              <p className="font-editorial text-2xl text-ink">
                No {kind === "banner" ? "banners" : "items"} found
              </p>
              <p className="mt-2 text-xs text-muted">
                Enter a title in the input on the left to create a new {kindLabel}.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
