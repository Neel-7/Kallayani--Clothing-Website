import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, MapPin, PackageCheck, RotateCcw, XCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import {
  AdminError,
  AdminLoading,
  AdminStatus,
} from "@/components/admin/AdminUi";
import { adminDate, adminMoney } from "@/components/admin/admin-format";
import { Button } from "@/components/ui/button";
import { apiErrorMessage } from "@/store/api-error";
import {
  useCancelOrderMutation,
  useGetOrderQuery,
  useRefundOrderMutation,
  useUpdateFulfillmentMutation,
} from "@/store/admin-api";

export function AdminOrderDetailsPage() {
  const { orderId = "" } = useParams();
  const { role } = useAdminAuth();
  const order = useGetOrderQuery(orderId, { skip: !orderId });
  const [updateFulfillment, fulfillmentState] = useUpdateFulfillmentMutation();
  const [refundOrder, refundState] = useRefundOrderMutation();
  const [cancelOrder, cancelState] = useCancelOrderMutation();
  const [fulfillmentStatus, setFulfillmentStatus] = useState("unfulfilled");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [restock, setRestock] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Order details | Kallayani administration";
  }, []);

  useEffect(() => {
    if (!order.data) return;
    setFulfillmentStatus(order.data.fulfillmentStatus);
    setCarrier(order.data.tracking?.carrier ?? "");
    setTrackingNumber(order.data.tracking?.trackingNumber ?? "");
    setRefundAmount(Math.max(0, order.data.total - (order.data.refundedAmount ?? 0)).toFixed(2));
  }, [order.data]);

  if (order.isLoading) return <AdminLoading label="Loading order details" />;
  if (order.error || !order.data) return <AdminError message="This order could not be loaded." onRetry={order.refetch} />;

  const data = order.data;
  const refundable = Math.max(0, data.total - (data.refundedAmount ?? 0));
  const canFulfill = ["paid", "partially_refunded"].includes(data.paymentStatus) && data.status !== "canceled";
  const canCancel = !["shipped", "delivered", "canceled"].includes(data.fulfillmentStatus);

  const saveFulfillment = async (event: FormEvent) => {
    event.preventDefault();
    setError(""); setFeedback("");
    try {
      await updateFulfillment({ id: data.id, status: fulfillmentStatus, carrier, trackingNumber }).unwrap();
      setFeedback("Fulfillment status updated.");
    } catch (reason) {
      setError(apiErrorMessage(reason, "Fulfillment could not be updated."));
    }
  };

  const submitRefund = async (event: FormEvent) => {
    event.preventDefault();
    setError(""); setFeedback("");
    try {
      await refundOrder({
        id: data.id,
        amount: Number(refundAmount),
        reason: refundReason,
        restock,
        operationId: crypto.randomUUID(),
      }).unwrap();
      setRefundReason("");
      setRestock(false);
      setFeedback("Refund completed and the order record was updated.");
    } catch (reason) {
      setError(apiErrorMessage(reason, "The refund could not be completed."));
    }
  };

  const submitCancellation = async (event: FormEvent) => {
    event.preventDefault();
    setError(""); setFeedback("");
    try {
      await cancelOrder({ id: data.id, reason: cancelReason, operationId: crypto.randomUUID() }).unwrap();
      setConfirmation("");
      setCancelReason("");
      setFeedback("The order was canceled. Any remaining payment was refunded.");
    } catch (reason) {
      setError(apiErrorMessage(reason, "The order could not be canceled."));
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <Link className="inline-flex min-h-10 items-center gap-2 text-xs text-muted hover:text-wine" to="/admin/orders"><ArrowLeft size={14} /> Back to orders</Link>
      <header className="mt-4 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs text-muted">{data.displayNumber ?? data.id.toUpperCase()}</p>
          <h1 className="mt-2 font-editorial text-5xl leading-none tracking-[-.035em] sm:text-6xl">Order details</h1>
          <p className="mt-3 text-sm text-muted">Placed {data.createdAt ? adminDate.format(new Date(data.createdAt)) : "recently"}</p>
        </div>
        <div className="flex flex-wrap gap-2"><AdminStatus value={data.paymentStatus} /><AdminStatus value={data.fulfillmentStatus} /></div>
      </header>

      {feedback && <p className="mt-7 border border-[#adc5b1] bg-[#e5eee5] p-4 text-sm text-[#285536]" role="status">{feedback}</p>}
      {error && <p className="mt-7 border border-red/30 bg-red/5 p-4 text-sm text-red" role="alert">{error}</p>}

      <div className="mt-9 grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)]">
        <div className="space-y-8">
          <section className="border border-[#d8d1c7] bg-white p-6">
            <h2 className="font-editorial text-3xl">Items</h2>
            <div className="mt-5">
              {data.lines.map((line) => (
                <article className="grid grid-cols-[64px_1fr_auto] gap-4 border-t border-[#e4ddd4] py-4 first:border-t-0 first:pt-0" key={line.variantId}>
                  {line.imageUrl ? <img className="aspect-[3/4] w-16 bg-[#f3f0ea] object-cover" src={line.imageUrl} alt="" /> : <div className="aspect-[3/4] w-16 bg-[#f3f0ea]" />}
                  <div><p className="font-medium">{line.title}</p><p className="mt-1 text-xs text-muted">{line.optionSummary || line.sku}</p><p className="mt-2 text-xs text-muted">Quantity {line.quantity}</p></div>
                  <p className="font-medium tabular-nums">{adminMoney.format(line.lineTotal)}</p>
                </article>
              ))}
            </div>
          </section>

          <form className="border border-[#d8d1c7] bg-white p-6" onSubmit={saveFulfillment}>
            <h2 className="flex items-center gap-3 font-editorial text-3xl"><PackageCheck size={21} className="text-wine" /> Fulfillment</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Status"><select className="admin-input" value={fulfillmentStatus} onChange={(event) => setFulfillmentStatus(event.target.value)} disabled={!canFulfill}><option value="unfulfilled">Unfulfilled</option><option value="picking">Picking</option><option value="packed">Packed</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option></select></Field>
              <Field label="Carrier"><input className="admin-input" value={carrier} onChange={(event) => setCarrier(event.target.value)} placeholder="UPS, USPS, FedEx" disabled={!canFulfill} /></Field>
              <div className="sm:col-span-2"><Field label="Tracking number"><input className="admin-input" value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} disabled={!canFulfill} /></Field></div>
            </div>
            <Button className="mt-6" type="submit" disabled={!canFulfill || fulfillmentState.isLoading}>{fulfillmentState.isLoading ? "Saving" : "Save fulfillment"}</Button>
            {!canFulfill && <p className="mt-3 text-xs text-muted">Fulfillment controls become available after payment is confirmed.</p>}
          </form>
        </div>

        <aside className="space-y-8">
          <section className="border border-[#d8d1c7] bg-white p-6">
            <h2 className="font-editorial text-3xl">Summary</h2>
            <dl className="mt-5 space-y-3 text-sm"><Summary label="Subtotal" value={adminMoney.format(data.subtotal)} /><Summary label="Delivery" value={adminMoney.format(data.shippingTotal)} /><Summary label="Tax" value={adminMoney.format(data.taxTotal)} /><div className="flex justify-between gap-4 border-t border-[#d8d1c7] pt-4 text-base font-medium"><dt>Total</dt><dd>{adminMoney.format(data.total)}</dd></div>{(data.refundedAmount ?? 0) > 0 && <Summary label="Refunded" value={adminMoney.format(data.refundedAmount ?? 0)} />}</dl>
          </section>

          <section className="border border-[#d8d1c7] bg-white p-6">
            <h2 className="flex items-center gap-3 font-editorial text-3xl"><MapPin size={20} className="text-wine" /> Delivery</h2>
            <address className="mt-5 text-sm not-italic leading-6 text-muted"><span className="block text-ink">{data.shippingAddress?.name}</span><span className="block">{data.shippingAddress?.line1}</span>{data.shippingAddress?.line2 && <span className="block">{data.shippingAddress.line2}</span>}<span className="block">{data.shippingAddress?.city}, {data.shippingAddress?.region} {data.shippingAddress?.postalCode}</span><span className="block">{data.shippingAddress?.country}</span><span className="mt-2 block">{data.shippingAddress?.phone}</span></address>
          </section>

          {role === "admin" ? (
            <>
              <form className="border border-[#d8d1c7] bg-white p-6" onSubmit={submitRefund}>
                <h2 className="flex items-center gap-3 font-editorial text-3xl"><RotateCcw size={20} className="text-wine" /> Refund</h2>
                <p className="mt-3 text-xs leading-5 text-muted">Refundable balance: {adminMoney.format(refundable)}. Stripe receives the request directly from Express.</p>
                <div className="mt-5 space-y-4"><Field label="Amount"><input className="admin-input" type="number" min="0.01" max={refundable} step="0.01" value={refundAmount} onChange={(event) => setRefundAmount(event.target.value)} required /></Field><Field label="Reason"><textarea className="admin-input min-h-24 py-3" value={refundReason} onChange={(event) => setRefundReason(event.target.value)} required minLength={3} /></Field><label className="flex items-start gap-3 text-xs leading-5 text-muted"><input className="mt-1 size-4" type="checkbox" checked={restock} onChange={(event) => setRestock(event.target.checked)} /> Restore all inventory when this completes the full refund</label></div>
                <Button className="mt-6" variant="outline" type="submit" disabled={refundState.isLoading || refundable <= 0}>{refundState.isLoading ? "Refunding" : "Issue refund"}</Button>
              </form>

              <form className="border border-red/30 bg-red/5 p-6" onSubmit={submitCancellation}>
                <h2 className="flex items-center gap-3 font-editorial text-3xl"><XCircle size={20} className="text-red" /> Cancel order</h2>
                <p className="mt-3 text-xs leading-5 text-muted">Cancellation refunds the remaining paid balance and restores inventory. Shipped orders cannot be canceled here.</p>
                <div className="mt-5 space-y-4"><Field label="Reason"><textarea className="admin-input min-h-24 py-3" value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} required minLength={3} /></Field><Field label="Type CANCEL to confirm"><input className="admin-input" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></Field></div>
                <Button className="mt-6 bg-red text-white hover:bg-red/90" type="submit" disabled={!canCancel || confirmation !== "CANCEL" || cancelState.isLoading}>{cancelState.isLoading ? "Canceling" : "Cancel order"}</Button>
              </form>
            </>
          ) : (
            <p className="border border-[#d8d1c7] bg-white p-5 text-xs leading-5 text-muted">Refund and cancellation controls require the administrator role.</p>
          )}
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-xs font-medium text-muted">{label}{children}</label>; }
function Summary({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4"><dt className="text-muted">{label}</dt><dd className="font-medium tabular-nums">{value}</dd></div>; }
