import { FormEvent, useEffect, useState } from "react";
import { TicketPercent } from "lucide-react";
import { api } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";
import type { Voucher } from "../types";

export function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "PERCENT",
    discountValue: "10",
    maxDiscount: "500000",
    minOrderValue: "500000",
    usageLimit: "100",
    expiresAt: "2030-12-31T23:59",
    isActive: true
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    void loadVouchers();
  }, []);

  async function loadVouchers() {
    try {
      setVouchers(await api<Voucher[]>("/admin/vouchers"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong tai duoc voucher.");
    }
  }

  async function submitVoucher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await api("/admin/vouchers", {
        method: "POST",
        body: JSON.stringify({
          code: form.code,
          description: form.description,
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
          minOrderValue: Number(form.minOrderValue),
          usageLimit: Number(form.usageLimit),
          expiresAt: new Date(form.expiresAt).toISOString(),
          isActive: form.isActive
        })
      });
      setMessage("Da tao voucher.");
      setForm((current) => ({ ...current, code: "", description: "" }));
      await loadVouchers();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong tao duoc voucher.");
    }
  }

  return (
    <section className="admin-grid">
      <form className="form-panel" onSubmit={submitVoucher}>
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow">Voucher</p>
            <h1>Tao voucher</h1>
          </div>
        </div>
        <label>
          Ma
          <input value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))} />
        </label>
        <label>
          Mo ta
          <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
        </label>
        <div className="two-column-fields">
          <label>
            Kieu
            <select
              value={form.discountType}
              onChange={(event) => setForm((current) => ({ ...current, discountType: event.target.value }))}
            >
              <option value="PERCENT">PERCENT</option>
              <option value="FIXED">FIXED</option>
            </select>
          </label>
          <label>
            Gia tri
            <input
              min="1"
              type="number"
              value={form.discountValue}
              onChange={(event) => setForm((current) => ({ ...current, discountValue: event.target.value }))}
            />
          </label>
        </div>
        <div className="two-column-fields">
          <label>
            Giam toi da
            <input
              min="0"
              type="number"
              value={form.maxDiscount}
              onChange={(event) => setForm((current) => ({ ...current, maxDiscount: event.target.value }))}
            />
          </label>
          <label>
            Don toi thieu
            <input
              min="0"
              type="number"
              value={form.minOrderValue}
              onChange={(event) => setForm((current) => ({ ...current, minOrderValue: event.target.value }))}
            />
          </label>
        </div>
        <div className="two-column-fields">
          <label>
            Gioi han dung
            <input
              min="1"
              type="number"
              value={form.usageLimit}
              onChange={(event) => setForm((current) => ({ ...current, usageLimit: event.target.value }))}
            />
          </label>
          <label>
            Het han
            <input
              type="datetime-local"
              value={form.expiresAt}
              onChange={(event) => setForm((current) => ({ ...current, expiresAt: event.target.value }))}
            />
          </label>
        </div>
        <label className="checkbox-row">
          <input
            checked={form.isActive}
            onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
            type="checkbox"
          />
          Dang kich hoat
        </label>
        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}
        <button className="primary-button" type="submit">
          <TicketPercent size={18} />
          Tao voucher
        </button>
      </form>

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Ma</th>
              <th>Mo ta</th>
              <th>Gia tri</th>
              <th>Toi thieu</th>
              <th>Su dung</th>
              <th>Het han</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher.id}>
                <td>{voucher.code}</td>
                <td>{voucher.description}</td>
                <td>
                  {voucher.discountType === "PERCENT"
                    ? `${voucher.discountValue}%`
                    : formatCurrency(voucher.discountValue)}
                </td>
                <td>{formatCurrency(voucher.minOrderValue)}</td>
                <td>
                  {voucher.usedCount}/{voucher.usageLimit}
                </td>
                <td>{formatDate(voucher.expiresAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
