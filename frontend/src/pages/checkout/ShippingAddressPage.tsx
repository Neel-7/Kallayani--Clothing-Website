import { MapPin, PackageOpen } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useCheckout } from "@/components/checkout/CheckoutContext";
import { Button } from "@/components/ui/button";
import { useGetAddressesQuery } from "@/store/customer-api";
import type { RootState } from "@/store/store";
import type { CheckoutAddress, SavedAddress } from "@/types/customer";

const blankAddress: CheckoutAddress = {
  name: "",
  line1: "",
  line2: "",
  city: "",
  region: "",
  postalCode: "",
  country: "US",
  phone: "",
};

function savedToCheckout(address: SavedAddress): CheckoutAddress {
  return {
    name: address.fullName,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    region: address.region,
    postalCode: address.postalCode,
    country: address.country,
    phone: address.phone,
  };
}

export function ShippingAddressPage() {
  const navigate = useNavigate();
  const cartLines = useSelector((state: RootState) => state.shop.cartLines);
  const addresses = useGetAddressesQuery();
  const { shippingAddress, setShippingAddress } = useCheckout();
  const [draft, setDraft] = useState<CheckoutAddress>(shippingAddress ?? blankAddress);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    document.title = "Delivery address | Kallayani";
  }, []);

  useEffect(() => {
    if (shippingAddress || !addresses.data?.length || selectedId) return;
    const preferred = addresses.data.find((address) => address.isDefault) ?? addresses.data[0];
    setSelectedId(preferred.id);
    setDraft(savedToCheckout(preferred));
  }, [addresses.data, selectedId, shippingAddress]);

  if (cartLines.length === 0) {
    return (
      <div className="mt-12 flex min-h-[360px] flex-col items-center justify-center bg-soft px-6 text-center">
        <PackageOpen className="text-wine" size={28} />
        <h2 className="mt-5 font-editorial text-4xl font-medium">Your bag is empty.</h2>
        <p className="mt-3 text-sm text-muted">Add a piece before starting checkout.</p>
        <Button className="mt-7" asChild><Link to="/shop">Browse the collection</Link></Button>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setShippingAddress({
      name: String(form.get("name") ?? "").trim(),
      line1: String(form.get("line1") ?? "").trim(),
      line2: String(form.get("line2") ?? "").trim(),
      city: String(form.get("city") ?? "").trim(),
      region: String(form.get("region") ?? "").trim(),
      postalCode: String(form.get("postalCode") ?? "").trim(),
      country: String(form.get("country") ?? "US").trim().toUpperCase(),
      phone: String(form.get("phone") ?? "").trim(),
    });
    navigate("/checkout/delivery");
  };

  return (
    <div className="mt-10 grid grid-cols-[minmax(0,1fr)_300px] gap-14 tablet:grid-cols-1">
      <div>
        <h2 className="font-editorial text-4xl font-medium">Where should we send it?</h2>

        {addresses.isLoading && <div className="mt-7 h-24 animate-pulse bg-soft" aria-label="Loading saved addresses" />}
        {addresses.data && addresses.data.length > 0 && (
          <div className="mt-7 grid grid-cols-2 gap-3 phone:grid-cols-1">
            {addresses.data.map((address) => (
              <button
                className={`min-h-24 border p-4 text-left text-sm transition-colors ${
                  selectedId === address.id ? "border-wine bg-[#faf4f1]" : "border-line hover:border-ink"
                }`}
                key={address.id}
                type="button"
                onClick={() => {
                  setSelectedId(address.id);
                  setDraft(savedToCheckout(address));
                }}
              >
                <span className="flex items-center gap-2 font-medium"><MapPin size={15} /> {address.label}</span>
                <span className="mt-2 block text-xs leading-5 text-muted">{address.fullName}, {address.city}</span>
              </button>
            ))}
          </div>
        )}

        <form className="mt-8 border-t border-line pt-7" key={`${selectedId}-${draft.line1}`} onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-5 phone:grid-cols-1">
            <div className="col-span-2 phone:col-span-1"><CheckoutField label="Full name" name="name" autoComplete="name" value={draft.name} /></div>
            <div className="col-span-2 phone:col-span-1"><CheckoutField label="Address line 1" name="line1" autoComplete="address-line1" value={draft.line1} /></div>
            <div className="col-span-2 phone:col-span-1"><CheckoutField label="Address line 2 (optional)" name="line2" autoComplete="address-line2" value={draft.line2} required={false} /></div>
            <CheckoutField label="City" name="city" autoComplete="address-level2" value={draft.city} />
            <CheckoutField label="State or region" name="region" autoComplete="address-level1" value={draft.region} />
            <CheckoutField label="Postal code" name="postalCode" autoComplete="postal-code" value={draft.postalCode} />
            <CheckoutField label="Country code" name="country" autoComplete="country" value={draft.country} maxLength={2} />
            <div className="col-span-2 phone:col-span-1"><CheckoutField label="Phone" name="phone" autoComplete="tel" type="tel" value={draft.phone} /></div>
          </div>
          <Button className="mt-8 min-w-48" type="submit">Continue to delivery</Button>
        </form>
      </div>

      <aside className="self-start bg-soft p-6">
        <MapPin className="text-wine" size={20} />
        <h3 className="mt-4 font-editorial text-2xl font-medium">Delivery details</h3>
        <p className="mt-2 text-xs leading-5 text-muted">
          Your address is sent to Kallayani only to calculate delivery and create your order. Payment fields appear later in Stripe's secure form.
        </p>
        {addresses.error && (
          <p className="mt-4 text-xs leading-5 text-red" role="status">
            Saved addresses are unavailable, but you can enter one manually.
          </p>
        )}
      </aside>
    </div>
  );
}

function CheckoutField({
  label,
  name,
  value,
  autoComplete,
  required = true,
  maxLength,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-xs font-medium text-muted">
      {label}
      <input
        className="min-h-12 border border-line bg-white px-4 text-sm text-ink outline-none focus:border-wine"
        name={name}
        defaultValue={value}
        autoComplete={autoComplete}
        required={required}
        maxLength={maxLength}
        type={type}
      />
    </label>
  );
}
