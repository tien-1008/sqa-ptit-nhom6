import { FormEvent, useEffect, useState } from "react";
import { MessageSquarePlus, Star } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { api } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";
import type { Order } from "../types";

interface ReviewDraft {
  rating: number;
  comment: string;
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drafts, setDrafts] = useState<Record<string, ReviewDraft>>({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    void loadOrders();
  }, []);

  async function loadOrders() {
    setError("");
    try {
      setOrders(await api<Order[]>("/orders/mine"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong tai duoc don hang.");
    }
  }

  function updateDraft(orderId: number, productId: number, patch: Partial<ReviewDraft>) {
    const key = `${orderId}-${productId}`;
    setDrafts((current) => ({
      ...current,
      [key]: {
        rating: current[key]?.rating ?? 5,
        comment: current[key]?.comment ?? "",
        ...patch
      }
    }));
  }

  async function submitReview(
    event: FormEvent<HTMLFormElement>,
    orderId: number,
    productId: number
  ) {
    event.preventDefault();
    const draft = drafts[`${orderId}-${productId}`] ?? {
      rating: 5,
      comment: ""
    };
    setError("");
    setMessage("");

    try {
      await api("/reviews", {
        method: "POST",
        body: JSON.stringify({
          orderId,
          productId,
          rating: draft.rating,
          comment: draft.comment
        })
      });
      setMessage("Da gui danh gia san pham.");
      setDrafts((current) => ({
        ...current,
        [`${orderId}-${productId}`]: { rating: 5, comment: "" }
      }));
      await loadOrders();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong gui duoc danh gia.");
    }
  }

  return (
    <section className="stacked-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Order Management</p>
          <h1>Don hang cua toi</h1>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}
      {message && <p className="form-success">{message}</p>}

      {orders.length === 0 ? (
        <p className="empty-state">Chua co don hang.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <article className="order-panel" key={order.id}>
              <div className="order-header">
                <div>
                  <strong>Don #{order.id}</strong>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="order-metrics">
                <span>Tam tinh {formatCurrency(order.totalAmount)}</span>
                <span>Giam {formatCurrency(order.discountAmount)}</span>
                <strong>Thanh toan {formatCurrency(order.finalAmount)}</strong>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div className="order-item-row" key={`${order.id}-${item.productId}`}>
                    <div>
                      <strong>{item.productName}</strong>
                      <span>
                        {item.quantity} x {formatCurrency(item.unitPrice)}
                      </span>
                    </div>
                    <strong>{formatCurrency(item.subtotal)}</strong>
                  </div>
                ))}
              </div>

              {order.status === "COMPLETED" && (
                <div className="review-form-list">
                  {order.items.filter((item) => !item.reviewed).map((item) => {
                    const key = `${order.id}-${item.productId}`;
                    const draft = drafts[key] ?? { rating: 5, comment: "" };
                    return (
                      <form
                        className="review-form"
                        key={`review-${key}`}
                        onSubmit={(event) => void submitReview(event, order.id, item.productId)}
                      >
                        <div>
                          <strong>{item.productName}</strong>
                          <label>
                            Rating
                            <select
                              value={draft.rating}
                              onChange={(event) =>
                                updateDraft(order.id, item.productId, {
                                  rating: Number(event.target.value)
                                })
                              }
                            >
                              {[5, 4, 3, 2, 1].map((value) => (
                                <option key={value} value={value}>
                                  {value}/5
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <label>
                          Nhan xet
                          <textarea
                            value={draft.comment}
                            onChange={(event) =>
                              updateDraft(order.id, item.productId, {
                                comment: event.target.value
                              })
                            }
                            required
                          />
                        </label>
                        <button className="secondary-button" type="submit">
                          <MessageSquarePlus size={18} />
                          Gui review
                        </button>
                      </form>
                    );
                  })}
                  {order.items.every((item) => item.reviewed) && (
                    <p className="empty-state">Tat ca san pham trong don nay da duoc danh gia.</p>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
