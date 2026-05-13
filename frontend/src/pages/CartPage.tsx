import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { formatCurrency } from "../lib/format";
import type { CartSummary } from "../types";

export function CartPage() {
  const [cart, setCart] = useState<CartSummary>({ items: [], totalAmount: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    void loadCart();
  }, []);

  async function loadCart() {
    setError("");
    try {
      setCart(await api<CartSummary>("/cart"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong tai duoc gio hang.");
    }
  }

  async function updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) return;
    try {
      setCart(
        await api<CartSummary>(`/cart/items/${productId}`, {
          method: "PATCH",
          body: JSON.stringify({ quantity })
        })
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong cap nhat duoc so luong.");
    }
  }

  async function removeItem(productId: number) {
    try {
      setCart(
        await api<CartSummary>(`/cart/items/${productId}`, {
          method: "DELETE"
        })
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong xoa duoc san pham.");
    }
  }

  return (
    <section className="stacked-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Cart & Checkout</p>
          <h1>Gio hang</h1>
        </div>
        <Link className="primary-link-button" to="/checkout">
          Tiep tuc checkout
        </Link>
      </div>

      {error && <p className="form-error">{error}</p>}

      {cart.items.length === 0 ? (
        <p className="empty-state">Gio hang dang trong.</p>
      ) : (
        <div className="cart-layout">
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>San pham</th>
                  <th>Don gia</th>
                  <th>So luong</th>
                  <th>Tam tinh</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.name}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>
                      <div className="quantity-control">
                        <button
                          className="icon-button"
                          type="button"
                          onClick={() => void updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus size={16} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="icon-button"
                          type="button"
                          onClick={() => void updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </td>
                    <td>{formatCurrency(item.subtotal)}</td>
                    <td>
                      <button
                        className="icon-button danger-button"
                        type="button"
                        onClick={() => void removeItem(item.productId)}
                        title="Xoa khoi gio"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <aside className="summary-panel">
            <span>Tong tien</span>
            <strong>{formatCurrency(cart.totalAmount)}</strong>
            <Link className="primary-link-button full-width" to="/checkout">
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
