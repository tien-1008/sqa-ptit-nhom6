import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { api } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";
import type { Order, OrderStatus } from "../types";

const nextStatuses: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPING", "CANCELLED"],
  SHIPPING: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: []
};

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    void loadOrders();
  }, []);

  async function loadOrders() {
    setError("");
    try {
      setOrders(await api<Order[]>("/admin/orders"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong tai duoc don admin.");
    }
  }

  async function updateStatus(orderId: number, status: OrderStatus) {
    setError("");
    setMessage("");
    try {
      await api(`/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      setMessage("Da cap nhat trang thai don.");
      await loadOrders();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong cap nhat duoc trang thai.");
    }
  }

  return (
    <section className="stacked-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Admin Order</p>
          <h1>Quan ly don hang</h1>
        </div>
        <button className="secondary-button" type="button" onClick={() => void loadOrders()}>
          <RefreshCcw size={18} />
          Tai lai
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}
      {message && <p className="form-success">{message}</p>}

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Don</th>
              <th>Khach hang</th>
              <th>Ngay tao</th>
              <th>Gia tri</th>
              <th>Trang thai</th>
              <th>Cap nhat</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>
                  <strong>{order.customerName}</strong>
                  <span className="table-subtext">{order.customerEmail}</span>
                </td>
                <td>{formatDate(order.createdAt)}</td>
                <td>{formatCurrency(order.finalAmount)}</td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
                <td>
                  {nextStatuses[order.status].length === 0 ? (
                    <span className="table-subtext">Da ket thuc</span>
                  ) : (
                    <select
                      defaultValue=""
                      onChange={(event) => {
                        const value = event.target.value as OrderStatus;
                        if (value) void updateStatus(order.id, value);
                      }}
                    >
                      <option value="">Chon</option>
                      {nextStatuses[order.status].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
