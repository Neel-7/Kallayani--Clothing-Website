import { FormEvent, useEffect, useState } from "react";
import { LockKeyhole, Save } from "lucide-react";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { AdminError, AdminLoading, AdminPageHeader } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { apiErrorMessage } from "@/store/api-error";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/store/admin-api";

export function AdminSettingsPage() {
  const { role } = useAdminAuth();
  const settings = useGetSettingsQuery();
  const [updateSettings, updateState] = useUpdateSettingsMutation();
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");

  useEffect(() => {
    document.title = "Store settings | Kallayani administration";
  }, []);

  useEffect(() => {
    if (!settings.data) return;
    setSupportEmail(settings.data.supportEmail);
    setSupportPhone(settings.data.supportPhone);
  }, [settings.data]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (role !== "admin") return;
    const form = new FormData(event.currentTarget);
    setFeedback(""); setError("");
    try {
      await updateSettings({
        storeName: String(form.get("storeName") ?? ""),
        supportEmail,
        supportPhone,
        currency: "USD",
        lowStockThreshold: Number(form.get("lowStockThreshold")),
        standardShippingThreshold: Number(form.get("standardShippingThreshold")),
        standardShippingFee: Number(form.get("standardShippingFee")),
        expressShippingFee: Number(form.get("expressShippingFee")),
        reservationMinutes: Number(form.get("reservationMinutes")),
        orderPrefix: String(form.get("orderPrefix") ?? "").toUpperCase(),
      }).unwrap();
      setFeedback("Store settings saved. New checkout quotes now use these values.");
    } catch (reason) {
      setError(apiErrorMessage(reason, "Store settings could not be saved."));
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader title="Store settings" description="Operational values used by checkout, inventory alerts, order numbers, and customer support." />
      {settings.isLoading && <AdminLoading label="Loading store settings" />}
      {settings.error && <AdminError message="Store settings could not be loaded." onRetry={settings.refetch} />}
      {settings.data && (
        <form className="mt-9 space-y-8" onSubmit={submit}>
          {feedback && <p className="border border-[#adc5b1] bg-[#e5eee5] p-4 text-sm text-[#285536]" role="status">{feedback}</p>}
          {error && <p className="border border-red/30 bg-red/5 p-4 text-sm text-red" role="alert">{error}</p>}
          {role !== "admin" && <p className="flex items-start gap-3 border border-[#d8d1c7] bg-white p-4 text-sm text-muted"><LockKeyhole className="mt-0.5 shrink-0" size={17} /> Settings are read-only for managers. An administrator can change checkout and support values.</p>}

          <SettingsSection title="Store identity" description={`Support requests currently route to ${settings.data.supportEmail}.`}>
            <Field label="Store name"><input className="admin-input" name="storeName" defaultValue={settings.data.storeName} required disabled={role !== "admin"} /></Field>
            <Field label="Support email"><input className="admin-input" name="supportEmail" type="text" inputMode="email" autoComplete="off" value={supportEmail} onChange={(event) => setSupportEmail(event.target.value)} required disabled={role !== "admin"} /></Field>
            <Field label="Support phone"><input className="admin-input" name="supportPhone" type="tel" autoComplete="off" value={supportPhone} onChange={(event) => setSupportPhone(event.target.value)} disabled={role !== "admin"} /></Field>
            <Field label="Order prefix"><input className="admin-input uppercase" name="orderPrefix" defaultValue={settings.data.orderPrefix} minLength={2} maxLength={12} pattern="[A-Z0-9]+" required disabled={role !== "admin"} /></Field>
          </SettingsSection>

          <SettingsSection title="Delivery pricing" description="Express uses these values for every checkout quote and final order total.">
            <MoneyField label="Complimentary delivery threshold" name="standardShippingThreshold" value={settings.data.standardShippingThreshold} disabled={role !== "admin"} />
            <MoneyField label="Standard delivery fee" name="standardShippingFee" value={settings.data.standardShippingFee} disabled={role !== "admin"} />
            <MoneyField label="Express delivery fee" name="expressShippingFee" value={settings.data.expressShippingFee} disabled={role !== "admin"} />
            <Field label="Currency"><input className="admin-input" value="USD" disabled /></Field>
          </SettingsSection>

          <SettingsSection title="Inventory protection" description="Set when an alert appears and how long checkout stock stays reserved.">
            <Field label="Low-stock threshold"><input className="admin-input" name="lowStockThreshold" type="number" min="0" max="10000" step="1" defaultValue={settings.data.lowStockThreshold} required disabled={role !== "admin"} /></Field>
            <Field label="Reservation time (minutes)"><input className="admin-input" name="reservationMinutes" type="number" min="5" max="240" step="1" defaultValue={settings.data.reservationMinutes} required disabled={role !== "admin"} /></Field>
          </SettingsSection>

          {role === "admin" && <Button type="submit" disabled={updateState.isLoading}><Save size={15} /> {updateState.isLoading ? "Saving" : "Save settings"}</Button>}
        </form>
      )}
    </div>
  );
}

function SettingsSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <section className="border border-[#d8d1c7] bg-white p-6 sm:p-8"><h2 className="font-editorial text-3xl">{title}</h2><p className="mt-2 max-w-[62ch] text-sm leading-6 text-muted">{description}</p><div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div></section>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-xs font-medium text-muted">{label}{children}</label>; }
function MoneyField({ label, name, value, disabled }: { label: string; name: string; value: number; disabled: boolean }) { return <Field label={label}><span className="flex min-h-11 items-center border border-[#cfc7bd] bg-white focus-within:border-wine"><span className="px-3 text-sm text-muted">$</span><input className="min-h-10 min-w-0 flex-1 bg-transparent pr-3 text-sm outline-none disabled:bg-[#eeeae4]" name={name} type="number" min="0" step="0.01" defaultValue={value} required disabled={disabled} /></span></Field>; }
