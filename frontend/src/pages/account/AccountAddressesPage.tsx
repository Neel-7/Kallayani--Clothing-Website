import { Check, MapPin, Plus, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { AccountError } from "@/components/account/AccountLayout";
import { Button } from "@/components/ui/button";
import { apiErrorMessage } from "@/store/api-error";
import { useGetAddressesQuery, useSaveAddressesMutation } from "@/store/customer-api";
import type { SavedAddress } from "@/types/customer";

const emptyAddress: SavedAddress = {
  id: "",
  label: "Home",
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  region: "",
  postalCode: "",
  country: "US",
  phone: "",
  isDefault: false,
};

export function AccountAddressesPage() {
  const addresses = useGetAddressesQuery();
  const [saveAddresses, saveState] = useSaveAddressesMutation();
  const [editing, setEditing] = useState<SavedAddress | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    document.title = "Saved addresses | Kallayani";
  }, []);

  if (addresses.error) return <AccountError message="Your saved addresses could not be loaded." onRetry={addresses.refetch} />;
  if (addresses.isLoading) return <div className="min-h-[440px] animate-pulse bg-soft" aria-label="Loading addresses" />;

  const items = addresses.data ?? [];

  const persist = async (next: SavedAddress[], successMessage: string) => {
    setFeedback("");
    try {
      await saveAddresses(next).unwrap();
      setFeedback(successMessage);
      setEditing(null);
    } catch (error) {
      setFeedback(apiErrorMessage(error, "Your addresses could not be updated."));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const nextAddress: SavedAddress = {
      id: editing.id || crypto.randomUUID(),
      label: String(form.get("label") ?? "Home"),
      fullName: String(form.get("fullName") ?? ""),
      line1: String(form.get("line1") ?? ""),
      line2: String(form.get("line2") ?? ""),
      city: String(form.get("city") ?? ""),
      region: String(form.get("region") ?? ""),
      postalCode: String(form.get("postalCode") ?? ""),
      country: String(form.get("country") ?? "US").toUpperCase(),
      phone: String(form.get("phone") ?? ""),
      isDefault: form.get("isDefault") === "on" || items.length === 0,
    };
    let next = editing.id
      ? items.map((item) => (item.id === editing.id ? nextAddress : item))
      : [...items, nextAddress];
    if (nextAddress.isDefault) next = next.map((item) => ({ ...item, isDefault: item.id === nextAddress.id }));
    await persist(next, editing.id ? "Address updated." : "Address saved.");
  };

  return (
    <div>
      <header className="flex items-end justify-between gap-6 phone:items-start phone:flex-col">
        <div>
          <h1 className="font-editorial text-[clamp(42px,5vw,62px)] font-medium leading-none tracking-[-.03em]">Saved addresses.</h1>
          <p className="mt-4 text-sm leading-6 text-muted">Keep delivery details ready for checkout.</p>
        </div>
        {!editing && <Button type="button" onClick={() => setEditing(emptyAddress)}><Plus size={15} /> Add address</Button>}
      </header>

      {editing ? (
        <AddressForm address={editing} isSaving={saveState.isLoading} onCancel={() => setEditing(null)} onSubmit={handleSubmit} />
      ) : items.length ? (
        <div className="mt-10 grid grid-cols-2 gap-5 phone:grid-cols-1">
          {items.map((address) => (
            <article className="border border-line p-5" key={address.id}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-sm font-medium"><MapPin className="text-wine" size={17} /> {address.label}</h2>
                {address.isDefault && <span className="text-[11px] font-medium text-wine">Default</span>}
              </div>
              <address className="mt-4 text-sm not-italic leading-6 text-muted">
                <span className="block text-ink">{address.fullName}</span>
                <span className="block">{address.line1}</span>
                {address.line2 && <span className="block">{address.line2}</span>}
                <span className="block">{address.city}, {address.region} {address.postalCode}</span>
                <span className="block">{address.country}</span>
                <span className="mt-2 block">{address.phone}</span>
              </address>
              <div className="mt-5 flex flex-wrap gap-4 border-t border-line pt-4 text-xs">
                <button className="min-h-10 underline underline-offset-4 hover:text-wine" type="button" onClick={() => setEditing(address)}>Edit</button>
                {!address.isDefault && <button className="min-h-10 underline underline-offset-4 hover:text-wine" type="button" onClick={() => void persist(items.map((item) => ({ ...item, isDefault: item.id === address.id })), "Default address updated.")}>Make default</button>}
                <button className="ml-auto inline-flex min-h-10 items-center gap-2 text-muted hover:text-wine" type="button" onClick={() => void persist(items.filter((item) => item.id !== address.id), "Address removed.")}><Trash2 size={14} /> Remove</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-10 flex min-h-[330px] flex-col items-center justify-center bg-soft px-6 text-center">
          <MapPin className="text-wine" size={28} />
          <h2 className="mt-5 font-editorial text-4xl font-medium">No saved addresses.</h2>
          <p className="mt-3 max-w-[38ch] text-sm leading-6 text-muted">Add an address to make future checkout faster.</p>
          <Button className="mt-7" type="button" onClick={() => setEditing(emptyAddress)}><Plus size={15} /> Add address</Button>
        </div>
      )}
      {feedback && <p className="mt-5 text-xs text-muted" role="status">{feedback}</p>}
    </div>
  );
}

function AddressForm({ address, isSaving, onCancel, onSubmit }: { address: SavedAddress; isSaving: boolean; onCancel: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <form className="mt-10 max-w-3xl border-t border-line pt-7" onSubmit={onSubmit}>
      <h2 className="font-editorial text-3xl font-medium">{address.id ? "Edit address" : "New address"}</h2>
      <div className="mt-6 grid grid-cols-2 gap-5 phone:grid-cols-1">
        <AddressField label="Label" name="label" defaultValue={address.label} />
        <AddressField label="Full name" name="fullName" autoComplete="name" defaultValue={address.fullName} />
        <div className="col-span-2 phone:col-span-1"><AddressField label="Address line 1" name="line1" autoComplete="address-line1" defaultValue={address.line1} /></div>
        <div className="col-span-2 phone:col-span-1"><AddressField label="Address line 2 (optional)" name="line2" autoComplete="address-line2" defaultValue={address.line2} required={false} /></div>
        <AddressField label="City" name="city" autoComplete="address-level2" defaultValue={address.city} />
        <AddressField label="State or region" name="region" autoComplete="address-level1" defaultValue={address.region} />
        <AddressField label="Postal code" name="postalCode" autoComplete="postal-code" defaultValue={address.postalCode} />
        <AddressField label="Country code" name="country" autoComplete="country" defaultValue={address.country} maxLength={2} />
        <div className="col-span-2 phone:col-span-1"><AddressField label="Phone" name="phone" autoComplete="tel" defaultValue={address.phone} type="tel" /></div>
      </div>
      <label className="mt-6 flex items-center gap-3 text-sm">
        <input className="peer sr-only" name="isDefault" type="checkbox" defaultChecked={address.isDefault} />
        <span className="grid size-5 place-items-center border border-line text-transparent peer-checked:border-wine peer-checked:bg-wine peer-checked:text-white"><Check size={13} /></span>
        Use as my default delivery address
      </label>
      <div className="mt-8 flex gap-3">
        <Button type="submit" disabled={isSaving}>{isSaving ? "Saving" : "Save address"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function AddressField({ label, name, defaultValue, autoComplete, required = true, maxLength, type = "text" }: { label: string; name: string; defaultValue: string; autoComplete?: string; required?: boolean; maxLength?: number; type?: string }) {
  return (
    <label className="grid gap-2 text-xs font-medium text-muted">
      {label}
      <input className="min-h-12 border border-line bg-white px-4 text-sm text-ink outline-none focus:border-wine" name={name} defaultValue={defaultValue} autoComplete={autoComplete} required={required} maxLength={maxLength} type={type} />
    </label>
  );
}
