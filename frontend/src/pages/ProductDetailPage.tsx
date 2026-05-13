import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";
import type { Product, Review } from "../types";

export function ProductDetailPage() {
  const { productId } = useParams();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!productId) return;
    void loadPage(Number(productId));
  }, [productId]);

  async function loadPage(id: number) {
    setError("");
    try {
      const [nextProduct, nextReviews] = await Promise.all([
        api<Product>(`/products/${id}`),
        api<Review[]>(`/products/${id}/reviews`)
      ]);
      setProduct(nextProduct);
      setReviews(nextReviews);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong tai duoc chi tiet.");
    }
  }

  async function addToCart() {
    if (!product) return;
    setError("");
    setMessage("");
    try {
      await api("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });
      setMessage("Da them vao gio hang.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong them duoc vao gio.");
    }
  }

  if (error && !product) {
    return <p className="form-error">{error}</p>;
  }

  if (!product) {
    return <p className="empty-state">Dang tai san pham...</p>;
  }

  return (
    <section className="detail-layout">
      <div className="detail-media">
        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <span>Khong co anh</span>}
      </div>

      <div className="detail-copy">
        <Link className="back-link" to="/">
          Quay lai danh sach
        </Link>
        <p className="eyebrow">{product.categoryName}</p>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <div className="detail-metrics">
          <strong>{formatCurrency(product.price)}</strong>
          <span>{product.stock > 0 ? `${product.stock} san pham san sang` : "Het hang"}</span>
        </div>
        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}
        <button
          className="primary-button wide-button"
          disabled={!isAuthenticated || product.stock === 0}
          onClick={() => void addToCart()}
          type="button"
        >
          <ShoppingCart size={18} />
          {isAuthenticated ? "Them vao gio" : "Dang nhap de mua"}
        </button>

        <div className="review-panel">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow">Product Review</p>
              <h2>Danh gia gan day</h2>
            </div>
          </div>
          {reviews.length === 0 ? (
            <p className="empty-state">Chua co danh gia.</p>
          ) : (
            <div className="review-list">
              {reviews.map((review) => (
                <article className="review-row" key={review.id}>
                  <div>
                    <strong>{review.reviewerName}</strong>
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                  <p>
                    <Star size={16} />
                    {review.rating}/5 - {review.comment}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
