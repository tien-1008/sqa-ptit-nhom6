import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgePercent, PackageCheck } from "lucide-react";
import { api } from "../lib/api";
import { formatCurrency } from "../lib/format";
import type { CartSummary, Order, VoucherPreview } from "../types";

export function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartSummary>({ items: [], totalAmount: 0 });
  const [shippingName, setShippingName] = useState("Demo Customer");
  const [shippingPhone, setShippingPhone] = useState("0900000001");
  const [shippingAddress, setShippingAddress] = useState(
    "99 Quality Avenue, Ho Chi Minh City"
  );
  const [voucherCode, setVoucherCode] = useState("");
  const [preview, setPreview] = useState<VoucherPreview | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void loadCart();
  }, []);

  async function loadCart() {
    try {
      setCart(await api<CartSummary>("/cart"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong tai duoc gio hang.");
    }
  }

  async function applyVoucher() {
    setError("");
    try {
      setPreview(
        await api<VoucherPreview>("/vouchers/apply", {
          method: "POST",
          body: JSON.stringify({ code: voucherCode })
        })
      );
    } catch (caught) {
      setPreview(null);
      setError(caught instanceof Error ? caught.message : "Voucher khong hop le.");
    }
  }

  async function handleCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api<Order>("/orders/checkout", {
        method: "POST",
        body: JSON.stringify({
          shippingName,
          shippingPhone,
          shippingAddress,
          voucherCode: voucherCode || undefined
        })
      });
      navigate("/orders");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout that bai.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="checkout-layout">
      <form className="form-panel" onSubmit={handleCheckout}>
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow">Checkout</p>
            <h1>Thong tin giao hang</h1>
          </div>
        </div>
        <label>
          Ten nguoi nhan
          <input value={shippingName} onChange={(event) => setShippingName(event.target.value)} />
        </label>
        <label>
          So dien thoai
          <input value={shippingPhone} onChange={(event) => setShippingPhone(event.target.value)} />
        </label>
        <label>
          Dia chi
          <textarea
            value={shippingAddress}
            onChange={(event) => setShippingAddress(event.target.value)}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button" disabled={submitting || cart.items.length === 0} type="submit">
          <PackageCheck size={18} />
          {submitting ? "Dang tao don..." : "Dat hang gia lap"}
        </button>
      </form>

      <aside className="summary-panel checkout-summary">
        <div>
          <span>Tam tinh</span>
          <strong>{formatCurrency(cart.totalAmount)}</strong>
        </div>
        <label>
          Ma voucher
          <div className="inline-action">
            <input value={voucherCode} onChange={(event) => setVoucherCode(event.target.value)} />
            <button className="secondary-button" type="button" onClick={() => void applyVoucher()}>
              <BadgePercent size={18} />
              Ap dung
            </button>
          </div>
        </label>
        {preview && (
          <div className="voucher-preview">
            <span>Giam gia {preview.code}</span>
            <strong>- {formatCurrency(preview.discountAmount)}</strong>
            <strong>Thanh toan {formatCurrency(preview.finalAmount)}</strong>
          </div>
        )}
      </aside>
    </section>
  );
}
