import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Search, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { formatCurrency } from "../lib/format";
import type { Category, Product } from "../types";

export function ProductsPage() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState("true");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    void loadCategories();
    void loadProducts();
  }, []);

  async function loadCategories() {
    try {
      setCategories(await api<Category[]>("/products/categories"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong tai duoc danh muc.");
    }
  }

  async function loadProducts(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setError("");
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (inStock) params.set("inStock", inStock);

    try {
      setProducts(await api<Product[]>(`/products?${params.toString()}`));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong tai duoc san pham.");
    }
  }

  async function addToCart(productId: number) {
    setMessage("");
    setError("");
    try {
      await api("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: 1 })
      });
      setMessage("Da them san pham vao gio.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong them duoc vao gio.");
    }
  }

  return (
    <section className="stacked-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Product Management</p>
          <h1>Danh sach san pham</h1>
        </div>
        <p>Tim kiem, loc gia, danh muc va tinh trang ton kho de phuc vu test UI.</p>
      </div>

      <form className="filter-bar" onSubmit={loadProducts}>
        <label>
          <Search size={16} />
          <input
            placeholder="Tim theo ten hoac mo ta"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="">Tat ca danh muc</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          min="0"
          placeholder="Gia tu"
          type="number"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
        />
        <input
          min="0"
          placeholder="Gia den"
          type="number"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
        />
        <select value={inStock} onChange={(event) => setInStock(event.target.value)}>
          <option value="true">Con hang</option>
          <option value="">Tat ca ton kho</option>
          <option value="false">Het hang</option>
        </select>
        <button className="secondary-button" type="submit">
          <Filter size={18} />
          Loc
        </button>
      </form>

      {error && <p className="form-error">{error}</p>}
      {message && <p className="form-success">{message}</p>}

      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <Link className="product-media" to={`/products/${product.id}`}>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <span>Khong co anh</span>
              )}
            </Link>
            <div className="product-body">
              <span className="category-pill">{product.categoryName}</span>
              <h2>
                <Link to={`/products/${product.id}`}>{product.name}</Link>
              </h2>
              <p>{product.description}</p>
              <div className="product-meta">
                <strong>{formatCurrency(product.price)}</strong>
                <span>{product.stock > 0 ? `${product.stock} san pham` : "Het hang"}</span>
              </div>
              <button
                className="primary-button"
                disabled={!isAuthenticated || product.stock === 0}
                onClick={() => void addToCart(product.id)}
                type="button"
              >
                <ShoppingCart size={18} />
                {isAuthenticated ? "Them gio" : "Dang nhap de mua"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
